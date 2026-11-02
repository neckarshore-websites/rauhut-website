/**
 * Cloudflare Turnstile — Server-side verification.
 *
 * Family-Captcha-Standard (D-LIN-OAK-TURNSTILE): von oakwood/goldoni nach
 * rauhut.com portiert (2026-06-12). Turnstile ist der Anti-Spam-Layer auf
 * dem Kontaktformular. Kostenlos + unbegrenzt (kein Free-Tier-Limit),
 * DSGVO-konform (kein Cookie, kein Cross-Site-Tracking), non-interactive im
 * Normalfall.
 *
 * Flow:
 *   1. Client-Widget (components/Turnstile.tsx) lädt das Cloudflare-Script
 *      und injiziert das Ergebnis als hidden input `cf-turnstile-response`
 *      in die Form.
 *   2. Die Server Action (src/app/actions/inquiry.ts → sendContact) liest
 *      das Feld aus und ruft `verifyCaptchaToken(token)` auf.
 *   3. Cloudflare prüft den Token serverseitig (Secret bleibt geheim) und
 *      antwortet mit `success: true/false`.
 *   4. `success=false` → Form-Response validation-error, kein Versand.
 *
 * Graceful degradation:
 *   - Wenn `TURNSTILE_SECRET_KEY` NICHT gesetzt ist (lokale Dev-Umgebung,
 *     noch-nicht-konfigurierte Preview), wird die Verifikation übersprungen
 *     (`ok: true`). Hält den Funnel lauffähig während der Account-Einrichtung.
 *     In Production MUSS das Secret gesetzt sein, sonst fail-closed.
 *   - Wenn `captchaSitekey()` null liefert, rendert das
 *     Widget clientseitig nichts und die Form hat kein Token-Feld. Der
 *     Server-Check sieht dann einen leeren String und — bei gesetztem Secret
 *     — schlägt fehl. Beide Vars müssen gemeinsam gesetzt werden.
 *
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

import { CAPTCHA_AKTIV, TURNSTILE_SITEKEY } from "@/lib/kontakt-config";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type CaptchaVerifyResult =
  | { ok: true; skipped?: boolean }
  | {
      ok: false;
      reason: "missing-solution" | "verification-failed" | "network-error";
      detail?: string;
    };

export async function verifyCaptchaToken(
  token: string | undefined | null,
): Promise<CaptchaVerifyResult> {
  // Schalter im Code (src/lib/kontakt-config.ts, #2879), nicht mehr in Vercel.
  // Aus: Schutz kommt allein aus dem Honeypot-Feld in der Server Action.
  if (!CAPTCHA_AKTIV) {
    return { ok: true, skipped: true };
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Flag aktiv, aber Secret fehlt → in Production fail-closed, sonst graceful
  // (Dev/Preview-Komfort, kein Launch-Blocker).
  //
  // UEBERSPRINGEN NUR AUSDRUECKLICH (#2879): in Entwicklung oder in einer
  // Vercel-Vorschau. NODE_ENV allein reicht nicht, es ist auch in jeder Vorschau
  // "production". Ein FEHLENDES VERCEL_ENV winkt nicht durch: ein Produktionsbau
  // ausserhalb von Vercel ist fail-closed.
  if (!secretKey) {
    const darfUeberspringen =
      process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";
    if (!darfUeberspringen) {
      console.error(
        "[captcha] captcha on but TURNSTILE_SECRET_KEY missing in production — rejecting submit.",
      );
      return {
        ok: false,
        reason: "verification-failed",
        detail: "captcha-not-configured",
      };
    }
    console.warn(
      "[captcha] captcha on but secret missing — dev/preview fallback (submit accepted).",
    );
    return { ok: true, skipped: true };
  }

  if (!token || token.trim().length === 0) {
    return { ok: false, reason: "missing-solution" };
  }

  try {
    // Turnstile siteverify expects application/x-www-form-urlencoded.
    const body = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      // Cap the network wait — siteverify is normally sub-100ms; don't let a
      // hanging upstream block the form submit indefinitely.
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.warn(`[captcha] siteverify non-2xx status=${res.status}`);
      return { ok: false, reason: "network-error", detail: `HTTP ${res.status}` };
    }

    const json = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (json.success === true) {
      return { ok: true };
    }

    const errors = json["error-codes"];
    return {
      ok: false,
      reason: "verification-failed",
      detail: Array.isArray(errors) ? errors.join(", ") : undefined,
    };
  } catch (err) {
    console.warn("[captcha] siteverify network error", err);
    return {
      ok: false,
      reason: "network-error",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * The form field name that the Turnstile client widget injects into the
 * surrounding `<form>` with the verification token. This is the Cloudflare
 * default — keep in sync with the widget in components/Turnstile.tsx.
 */
export const CAPTCHA_FORM_FIELD = "cf-turnstile-response";

/**
 * The site key the form renders with, or null for no widget (#2879).
 *
 * Null wherever the secret is missing (previews, `npm run dev`, E2E): a widget whose
 * token the server cannot verify would only produce a failing submit. Lives here,
 * not in kontakt-config.ts, because it has to name the secret. Server-side only.
 */
export function captchaSitekey(
  umgebung: Record<string, string | undefined> = process.env,
): string | null {
  return CAPTCHA_AKTIV && umgebung.TURNSTILE_SECRET_KEY ? TURNSTILE_SITEKEY : null;
}
