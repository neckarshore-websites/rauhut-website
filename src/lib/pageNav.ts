export type Lang = "de" | "en";

export type NavItem = { id: string; label: string };

/**
 * Shared between NavRail (desktop) and MobileNav (mobile) — one source of
 * truth for the P8 jump targets (Founder brief, 2026-09-12) so the two
 * chrome surfaces can never drift from each other. Same three destinations,
 * same granularity, both sides: "Dieselben Ziele wie rechts am Desktop —
 * nicht weniger, nicht gröber."
 *
 * ids match the existing section anchors already shipped on the homepage
 * (src/app/page.tsx / src/app/en/page.tsx) — no new ids were introduced,
 * these were already load-bearing for the aria-labelledby/Reveal pattern.
 */
export const NAV_ITEMS: Record<Lang, NavItem[]> = {
  de: [
    { id: "angebote", label: "Angebote" },
    { id: "projekte", label: "Projekte" },
    { id: "kontakt", label: "Kontakt" },
  ],
  en: [
    { id: "offers", label: "Offers" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ],
};

export const NAV_CTA_LABEL: Record<Lang, string> = {
  de: "Mandat besprechen (20 Min)",
  en: "Discuss a mandate (20 min)",
};

// Same Calendly slot as the hero, own UTM so Calendly's own reporting can
// tell this entry point apart from the hero, the Angebote lead card, and
// the KI-Potenzialanalyse teaser. Not lang-suffixed — utm_source never
// varies by language elsewhere in this codebase (hero, Offers.tsx).
//
// Note for the C4 guard (tests/e2e/site.spec.ts, AVAILABILITY_VOCAB): this
// label legitimately carries "Mandat" a fourth time. The guard is scoped to
// the KI-Potenzialanalyse region only, so it never sees this string — no
// disclosure comment needed there, but noting it here since it's the same
// vocabulary the guard exists to police elsewhere.
export const NAV_CTA_HREF =
  "https://calendly.com/rauhut/20min?utm_source=rauhut-com-nav";
