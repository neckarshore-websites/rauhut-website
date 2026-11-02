/**
 * Contact-form and captcha settings that are NOT secret, kept in code, not in Vercel.
 *
 * Ticket: neckarshore-ai/neckarshore-planning#2879 (Founder decision 2026-10-02),
 * same pattern as kaze-website#54, neckarshore-website#286 and goldoni-website#233.
 *
 * WHY THEY LIVE HERE: every one of these values sat in Vercel as type "sensitive",
 * which nobody can read back. A value you cannot read, you cannot check. Here it is
 * readable, versioned and guarded by src/lib/kontakt-config.test.ts.
 *
 * WHAT MUST NEVER LIVE HERE: passwords, secret keys, tokens. Those stay in Vercel and
 * are read where they are used. The test goes red when such a variable or field name
 * appears in this file, which is why this comment spells none of them.
 *
 * NO FALLBACK TO THE OLD VARIABLE NAMES, on purpose: production reads these values
 * only from here, so the old Vercel variables are inert from this deploy on.
 *
 * ENVIRONMENTS: what has an effect only where a secret exists is gated on that
 * secret, not on a second switch. The secrets are set for Production only, so
 * previews and `npm run dev` send no mail and show no captcha widget.
 */

export interface KontaktEinstellungen {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  absender: string;
  empfaenger: string;
}

/**
 * Sources: headers of the form mails of 2026-09-18 (From and To german@rauhut.com);
 * report 2026-06-12-linus-fe-e for host, port and user. IONOS requires the sender to
 * be the signed-in mailbox. Vercel shows no edit of these variables since that day,
 * and smtp.ionos.de:587 answers with STARTTLS, measured 2026-11-01.
 */
export const KONTAKT: KontaktEinstellungen = {
  smtpHost: "smtp.ionos.de",
  smtpPort: 587,
  smtpUser: "german@rauhut.com",
  absender: "german@rauhut.com",
  empfaenger: "german@rauhut.com",
};

/**
 * Public Turnstile site key, read from the shipped JS bundle of rauhut.com on
 * 2026-11-02. Public by design: every browser receives it.
 */
export const TURNSTILE_SITEKEY = "0x4AAAAAADjkzv9PNpf_mb9N";

/**
 * Captcha on the contact form. Where it takes effect is gated on the secret, see
 * `captchaSitekey` in src/lib/captcha/verify.ts.
 */
export const CAPTCHA_AKTIV = true;
