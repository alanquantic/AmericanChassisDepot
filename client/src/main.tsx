import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    {
      path: "/api/contact",
      method: "POST",
      advancedOptions: { checkLevel: "basic" },
    },
    {
      path: "/api/download-brochure",
      method: "POST",
      advancedOptions: { checkLevel: "basic" },
    },
  ],
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered:', registration.scope);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Every hour
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
