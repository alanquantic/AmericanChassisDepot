import crypto from "node:crypto";
import type { Request } from "express";
import { checkBotId } from "botid/server";

const FORM_SECRET = process.env.FORM_SECRET || "";
const MIN_TOKEN_AGE_MS = 3_000;
const MAX_TOKEN_AGE_MS = 2 * 60 * 60 * 1_000;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1_000;

const VOWEL = /[aeiouáéíóúü]/i;
const CONSONANT_RUN = /[bcdfghjklmnpqrstvwxyzñ]{4,}/i;
const URL_OR_HTML = /https?:\/\/|\[url=|<a\s+href|<[a-z][^>]*>/i;
const LETTER = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DISPOSABLE_EMAIL_MARKERS = [
  "mailinator.com",
  "tempmail",
  "guerrillamail",
  "10minutemail",
  "yopmail",
  "throwaway",
];

const rateLimitHits = new Map<string, number[]>();

export type SpamCheck = { valid: true } | { valid: false; reason: string };

function sign(value: string): string {
  return crypto.createHmac("sha256", FORM_SECRET).update(value).digest("hex");
}

export function issueFormToken(): string {
  const timestamp = Date.now();
  if (!FORM_SECRET) return `${timestamp}.unsigned`;
  return `${timestamp}.${sign(String(timestamp))}`;
}

export function verifyFormToken(token: unknown): SpamCheck {
  // Fail open until FORM_SECRET is configured so local/dev environments still work.
  if (!FORM_SECRET) return { valid: true };
  if (typeof token !== "string" || !token.includes(".")) {
    return { valid: false, reason: "token ausente o malformado" };
  }

  const [timestampString, signature] = token.split(".");
  const timestamp = Number(timestampString);
  if (!Number.isFinite(timestamp) || !signature) {
    return { valid: false, reason: "token malformado" };
  }

  const expected = Buffer.from(sign(timestampString));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
    return { valid: false, reason: "firma de token inválida" };
  }

  const age = Date.now() - timestamp;
  if (age < MIN_TOKEN_AGE_MS) {
    return { valid: false, reason: `envío demasiado rápido (${age}ms)` };
  }
  if (age > MAX_TOKEN_AGE_MS) {
    return { valid: false, reason: "token vencido" };
  }
  return { valid: true };
}

function hasAnomalousUppercase(value: string): boolean {
  const letters = value.split("").filter((character) => LETTER.test(character));
  if (!letters.length) return false;

  const hasLowercase = letters.some(
    (character) => character === character.toLowerCase() && character !== character.toUpperCase(),
  );
  if (!hasLowercase) return false;

  let interiorUppercase = 0;
  for (const word of value.split(/\s+/).filter(Boolean)) {
    let foundFirstLetter = false;
    for (const character of word) {
      if (!LETTER.test(character)) continue;
      const isUppercase =
        character === character.toUpperCase() && character !== character.toLowerCase();
      if (!foundFirstLetter) foundFirstLetter = true;
      else if (isUppercase) interiorUppercase += 1;
    }
  }

  return interiorUppercase / letters.length > 0.3;
}

function checkText(field: string, raw: string): string | null {
  const value = raw.trim();
  if (value.length < 2 || value.length > 100) return `${field}: longitud inválida`;
  if (!VOWEL.test(value)) return `${field}: sin vocales`;
  if (CONSONANT_RUN.test(value)) return `${field}: 4+ consonantes consecutivas`;
  if (hasAnomalousUppercase(value)) return `${field}: mayúsculas anómalas`;
  if (URL_OR_HTML.test(value)) return `${field}: URL/HTML no permitido`;
  return null;
}

function checkEmail(raw: string): string | null {
  const value = raw.trim().toLowerCase();
  if (!EMAIL_RE.test(value) || value.length > 254) return "email: formato inválido";
  const domain = value.split("@")[1] || "";
  if (DISPOSABLE_EMAIL_MARKERS.some((marker) => domain.includes(marker))) {
    return "email: dominio desechable";
  }
  return null;
}

function checkPhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-().+]/g, "");
  if (!/^\d{10,15}$/.test(digits)) return "teléfono: longitud o formato";
  if (/^(\d)\1+$/.test(digits)) return "teléfono: dígitos iguales";
  if (digits === "1234567890" || digits === "0987654321") {
    return "teléfono: secuencia obvia";
  }
  return null;
}

function checkQuantity(raw: string, maximum = 200): string | null {
  if (!/^\d+$/.test(raw)) return "cantidad: no es un entero";
  const quantity = Number(raw);
  if (quantity < 1 || quantity > maximum) return `cantidad: fuera de 1-${maximum}`;
  return null;
}

function checkDate(raw: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!match) return "fecha: formato inválido";
  if (Number(match[1]) < 2000) return "fecha: anterior a 2000 (epoch)";

  const target = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const oneDay = 86_400_000;
  const threeYearsFromToday = Date.UTC(
    now.getUTCFullYear() + 3,
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  if (target < today - oneDay) return "fecha: en el pasado";
  if (target >= threeYearsFromToday) return "fecha: demasiado lejana";
  return null;
}

function checkFreeText(raw: string): string | null {
  if (raw.length > 2_000) return "mensaje: demasiado largo";
  const urls = (raw.match(/https?:\/\/|www\./gi) || []).length;
  const tags = (raw.match(/<[^>]+>|\[[^\]]+\]/g) || []).length;
  return urls + tags > 2 ? "mensaje: demasiados enlaces o etiquetas" : null;
}

function checkRateLimit(key?: string): SpamCheck {
  if (!key) return { valid: true };
  const normalizedKey = key.trim().toLowerCase();
  const now = Date.now();
  const recent = (rateLimitHits.get(normalizedKey) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitHits.set(normalizedKey, recent);
    return { valid: false, reason: "límite de envíos excedido" };
  }
  recent.push(now);
  rateLimitHits.set(normalizedKey, recent);
  return { valid: true };
}

export function validateFormSubmission(
  input: unknown,
  requiredFields: string[] = [],
): SpamCheck {
  const data: Record<string, unknown> =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const honeypot = String(data.company_website ?? data.honeypot ?? "").trim();
  if (honeypot) return { valid: false, reason: "honeypot lleno" };

  const tokenResult = verifyFormToken(data.formToken);
  if (!tokenResult.valid) return tokenResult;

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || !String(data[field]).trim()) {
      return { valid: false, reason: `${field}: campo requerido ausente` };
    }
  }

  for (const field of ["name", "company", "city"] as const) {
    if (data[field] !== undefined && data[field] !== null && String(data[field]).trim()) {
      const reason = checkText(field, String(data[field]));
      if (reason) return { valid: false, reason };
    }
  }

  if (data.email !== undefined && data.email !== null && String(data.email).trim()) {
    const reason = checkEmail(String(data.email));
    if (reason) return { valid: false, reason };
  }

  if (data.phone !== undefined && data.phone !== null && String(data.phone).trim()) {
    const reason = checkPhone(String(data.phone));
    if (reason) return { valid: false, reason };
  }

  const quantity = data.units ?? data.quantity;
  if (quantity !== undefined && quantity !== null && String(quantity).trim()) {
    const reason = checkQuantity(String(quantity));
    if (reason) return { valid: false, reason };
  }

  for (const field of ["date", "deliveryDate", "desiredDate"] as const) {
    if (data[field] !== undefined && data[field] !== null && String(data[field]).trim()) {
      const reason = checkDate(String(data[field]));
      if (reason) return { valid: false, reason };
    }
  }

  if (data.message !== undefined && data.message !== null) {
    const reason = checkFreeText(String(data.message));
    if (reason) return { valid: false, reason };
  }

  return checkRateLimit(data.email ? String(data.email) : undefined);
}

export async function isBotIdRequest(req: Request): Promise<boolean> {
  try {
    const verification = await checkBotId({
      advancedOptions: { checkLevel: "basic", headers: req.headers },
    });
    return verification.isBot;
  } catch (error) {
    // BotID is Vercel-specific. Fail open so an outage or local run never blocks real users.
    console.warn("[anti-spam] BotID no disponible; continuando con las demás capas:", error);
    return false;
  }
}

export function logSpamRejection(reason: string, input: unknown): void {
  const data: Record<string, unknown> =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const { formToken: _formToken, ...safePayload } = data;
  console.warn("[anti-spam] Envío descartado silenciosamente", { reason, payload: safePayload });
}
