/**
 * Shared types and constants for the contact server action.
 *
 * Imported by both the client component (ContactForm) and the server action
 * (`inquiry.ts`). It must NOT carry a `"use server"` directive — Next.js
 * rejects "use server" files that export anything other than async functions,
 * and we need to export the initial-state object + the types from one place
 * to keep the form/action contract in sync.
 */

/**
 * The user-facing form fields whose values we echo back into the form when
 * the action returns with status "error". Without this, a missing required
 * field would clear the whole form on submit.
 */
export type ContactFieldValues = {
  name?: string;
  email?: string;
  message?: string;
};

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /**
   * Echoed-back form values. Only populated on "error" responses; "success"
   * wipes the form (panel replaces it) and "idle" has no values yet. The form
   * reads these via `defaultValue=...` so users don't lose input on validation.
   */
  values?: ContactFieldValues;
};

export const CONTACT_INITIAL_STATE: ContactState = { status: "idle" };

export type Lang = "de" | "en";

/**
 * Server-returned validation/error copy (P6-lead, 2026-09-12): the contact
 * form now renders on both `/` and `/en` (it was DE-only before this pass —
 * EN's Kontakt/Contact section had no form at all). The Server Action needs
 * to answer in whichever language the visitor is looking at, so ContactForm
 * submits a hidden `lang` field alongside the real fields; `inquiry.ts`
 * defaults to "de" whenever that field is missing or anything other than
 * "en" — identical behavior to every DE submission before this change.
 *
 * The outgoing mail to the site owner (subject/body labels) is deliberately
 * NOT localized here — that mail is read by German Rauhut himself regardless
 * of which language the visitor used, so its "Name:"/"E-Mail:" labels stay
 * German. Only the copy shown back to the visitor needs both languages.
 */
export type ContactCopy = {
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  messageRequired: string;
  checkEntries: string;
  captchaFailed: string;
  transportFailure: string;
};

export const CONTACT_COPY: Record<Lang, ContactCopy> = {
  de: {
    nameRequired: "Bitte Namen angeben.",
    emailRequired: "Bitte E-Mail angeben.",
    emailInvalid: "Bitte gültige E-Mail-Adresse angeben.",
    messageRequired: "Bitte Nachricht angeben.",
    checkEntries: "Bitte Eingaben prüfen.",
    captchaFailed:
      "Spam-Schutz konnte nicht bestätigt werden. Bitte warten Sie einen Moment, bis die Prüfung abgeschlossen ist, und senden Sie dann erneut.",
    transportFailure:
      "Die Nachricht konnte gerade nicht übermittelt werden. Bitte schreiben Sie mir direkt an mandat@rauhut.com.",
  },
  en: {
    nameRequired: "Please enter your name.",
    emailRequired: "Please enter your email address.",
    emailInvalid: "Please enter a valid email address.",
    messageRequired: "Please enter a message.",
    checkEntries: "Please check your entries.",
    captchaFailed:
      "Spam protection could not be confirmed. Please wait a moment for the check to complete, then send again.",
    transportFailure:
      "The message could not be sent right now. Please write to me directly at mandat@rauhut.com.",
  },
};
