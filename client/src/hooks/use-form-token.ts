import { useCallback, useEffect, useState } from "react";

const TOKEN_REFRESH_MS = 45 * 60 * 1_000;

export function useFormToken() {
  const [formToken, setFormToken] = useState("");

  const refreshFormToken = useCallback(async () => {
    try {
      const response = await fetch("/api/form-token", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) return;
      const data: unknown = await response.json();
      if (
        typeof data === "object" &&
        data !== null &&
        "token" in data &&
        typeof data.token === "string"
      ) {
        setFormToken(data.token);
      }
    } catch {
      // Server validation degrades safely when FORM_SECRET is not configured.
    }
  }, []);

  useEffect(() => {
    void refreshFormToken();
    const interval = window.setInterval(() => void refreshFormToken(), TOKEN_REFRESH_MS);
    return () => window.clearInterval(interval);
  }, [refreshFormToken]);

  return { formToken, refreshFormToken };
}
