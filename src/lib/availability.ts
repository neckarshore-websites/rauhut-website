type Lang = "de" | "en";

/**
 * AVAILABILITY — single source of truth for the hero's booking-status line.
 *
 * Not machine-measured (there is no booking system behind it) — a
 * Founder-stated fact, same category as the StatsRow "Years" figure.
 * Update here only; do not hardcode the string in page.tsx.
 * Set 2026-09-11 (M5 hero rewrite, "ab sofort buchbar" / "available
 * immediately").
 */
export const AVAILABILITY: Record<Lang, string> = {
  de: "ab sofort buchbar",
  en: "available immediately",
};
