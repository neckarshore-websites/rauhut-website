import type { Lang } from "@/app/actions/inquiry-state";

/**
 * Eingangsbestaetigung an den Absender des Kontaktformulars — zweisprachig.
 *
 * Eigenes Modul, nicht in der Server-Action: eine "use server"-Datei darf in
 * Next.js ausschliesslich async-Funktionen exportieren; ein const-Export
 * bringt die Modulauswertung zum Absturz. Hier liegt der Text ausserdem
 * dort, wo ein Test ihn erreicht.
 *
 * Die Bestaetigung folgt der Sprache des Formulars (lang-Feld), nicht der
 * Browsersprache: wer auf der englischen Seite geschrieben hat, bekommt
 * Englisch zurueck.
 */

export const CONFIRMATION_SUBJECT: Record<Lang, string> = {
  de: "Ihre Nachricht an German Rauhut",
  en: "Your message to German Rauhut",
};

export function buildConfirmationText(
  lang: Lang,
  name: string,
  message: string,
): string {
  if (lang === "en") {
    return [
      `Hello ${name},`,
      "",
      "thank you for your message — it has arrived.",
      "",
      "I usually reply within one working day. If you would rather pick a",
      "slot straight away:",
      "https://calendly.com/rauhut/20min",
      "",
      "Your message:",
      "",
      message,
      "",
      "Best regards",
      "German Rauhut",
      "https://rauhut.com",
      "",
      "--",
      "This email was sent automatically because the contact form on",
      "rauhut.com was submitted with this address. If that was not you,",
      "please ignore this message — nothing is processed without your reply.",
    ].join("\n");
  }

  return [
    `Hallo ${name},`,
    "",
    "danke fuer Ihre Nachricht — sie ist angekommen.",
    "",
    "Ich melde mich in der Regel innerhalb eines Werktags. Wenn Sie lieber",
    "direkt einen Termin waehlen:",
    "https://calendly.com/rauhut/20min",
    "",
    "Ihre Nachricht:",
    "",
    message,
    "",
    "Viele Gruesse",
    "German Rauhut",
    "https://rauhut.com",
    "",
    "--",
    "Diese E-Mail wurde automatisch versendet, weil das Kontaktformular auf",
    "rauhut.com mit dieser Adresse abgeschickt wurde. Haben Sie das nicht",
    "getan, ignorieren Sie diese Nachricht bitte — ohne Ihre Antwort wird",
    "nichts weiter verarbeitet.",
  ].join("\n");
}
