export type Lang = "de" | "en";

/**
 * Public contact mailbox (P6-mail, Founder brief 2026-09-12): the visible
 * "Folie" address is an alias, not the person's own inbox — `german@` stays
 * reachable but is retired from every public surface (Hero-CTA, Kontakt-
 * Zeile, mailto links, the visible contact block, the contact form's own
 * fallback error text).
 *
 * Deliberately NOT touched (legally-mandated contact, same treatment as the
 * Impressum carve-out the brief names): Impressum § Kontakt, Datenschutz
 * § 1 Verantwortlicher, Datenschutz § 9 Ihre Rechte. Those identify the
 * responsible natural person for statutory purposes and must not silently
 * become an alias.
 */
export const CONTACT_EMAIL = "mandat@rauhut.com";

// Subject lines verbatim from the Founder brief, percent-encoded exactly as
// given (including the literal ü, not %C3%BC) — the brief itself already
// hands over a URL-encoded string, and matching it byte-for-byte keeps the
// PR's grep/curl verification checking the same string he wrote. No body
// template (brief: "keine body-Vorlage"), so there is no further query
// param and no `&` to worry about.
export const CONTACT_MAILTO: Record<Lang, string> = {
  de: `mailto:${CONTACT_EMAIL}?subject=Mandat-Anfrage%20über%20rauhut.com`,
  en: `mailto:${CONTACT_EMAIL}?subject=Mandate%20enquiry%20via%20rauhut.com`,
};
