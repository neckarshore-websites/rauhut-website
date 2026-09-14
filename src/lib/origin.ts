type Lang = "de" | "en";

/**
 * ORIGIN — the one personal sentence on the page.
 *
 * Lived inside StatsRow.tsx until the concentration pass of 2026-09-14, where
 * it sat between the figures and the offers: the exact spot where a buyer is
 * deciding whether to book. It is not a figure and never was one — moving it
 * to the closing block puts the page's order at offer -> evidence -> person,
 * with the person next to the contact channels.
 *
 * NOT duplicated into the hero or the summary paragraph (standing brief
 * instruction, carried over from StatsRow.tsx unchanged).
 */
export const ORIGIN: Record<Lang, string> = {
  de: "Erstes System mit 16: dBase III — Adressdatenbanken für die IHK. Seit 1993 Beruf, davon 10 Jahre Mercedes-Benz, 10+ Jahre agil, 15+ Mandate in Entwicklung, Einführung, Modernisierung und Auswahl.",
  en: "First system at 16: dBase III — address databases for the local chamber of commerce. Professional work since 1993, including 10 years at Mercedes-Benz, 10+ years agile, 15+ mandates across development, rollout, modernization and selection.",
};
