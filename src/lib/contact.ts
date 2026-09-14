export type Lang = "de" | "en";

/**
 * Public contact mailbox.
 *
 * REVERSED 2026-09-14 on Founder decision, back to `german@rauhut.com`.
 * The alias `mandat@` was introduced on 2026-09-12 (P6-mail) to keep the
 * personal address off public surfaces as spam protection. The Founder
 * retired that reasoning himself: the Impressum carries `german@` anyway
 * by law (§ 5 TMG), so hiding it elsewhere bought nothing and cost the
 * page a second identity. One address on every surface again.
 *
 * The Impressum and Datenschutz carve-outs from the 09-12 brief are now
 * moot — they name the same address the rest of the page does.
 */
export const CONTACT_EMAIL = "german@rauhut.com";

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
