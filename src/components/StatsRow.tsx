type Lang = "de" | "en";

type Stat = { value: string; label: string };
type Group = { heading: string; stats: [Stat, Stat, Stat] };

/**
 * PUBLIC FIGURES — two groups, restructured 2026-09-11 P4a (Founder brief).
 *
 * Retired the flat four-tile "builder-dashboard" row (10+ Jahre Konzern /
 * 905 Tests / 23 AI-Agenten / 96 API-Endpunkte) in favour of two labelled
 * groups that read as a career, not an audited build status: "Mandat" —
 * what procurement reads first — and "Heute" — pace since the 10/2025 exit.
 * 905/23/96 are retired FROM THIS ROW specifically, not as false claims:
 * 905 survives as the Omnopsis flagship-suite figure in the Projekte prose
 * (src/app/page.tsx, src/app/en/page.tsx), unchanged and out of scope for
 * this pass; 23 and 96 no longer appear as tiles anywhere on the page.
 *
 * Sources, one per figure:
 *
 *   Mandat / Mandates
 *   10 Jahre Mercedes-Benz     = Projekte prose / Timeline.tsx: the
 *                                Mercedes-Benz AG & Umfeld block runs
 *                                07/2015 – 10/2025. Cross-checked against
 *                                the page's own dates, not a fresh claim.
 *   50.000+ KPI automatisiert  = Timeline.tsx SFMd role ("Automatisierung
 *                                der Konfiguration (> 50.000 KPI)"),
 *                                already-documented prose on this page —
 *                                cross-checked, not a fresh claim.
 *   3.000+ Jira-Tickets        = Founder-stated career figure. Not
 *                                machine-measurable from this repo (no
 *                                Jira access here) — same category as the
 *                                old "10+ Jahre" biography figure.
 *
 *   Heute / Now
 *   13.000+ GitHub-Contributions (12 Monate) = Founder-stated, snapshot
 *                                2026-09-11. A rolling 12-month figure —
 *                                it WILL drift; re-ask before re-quoting
 *                                it long after this date, don't assume it
 *                                still holds.
 *   4.000+ Tests eigene Produkte = Founder-stated aggregate across ALL own
 *                                products (Omnopsis + Vault Autopilot +
 *                                TrustScope + Kaze + …) — deliberately a
 *                                DIFFERENT metric from the 905
 *                                Omnopsis-flagship figure in Projekte, per
 *                                the brief. Those other products' suites
 *                                live outside this repo and were not
 *                                independently re-counted here.
 *   100+ API-Endpunkte         = Founder-stated, rounded "plus-band"
 *                                figure — the brief's rule is Plus-Bänder,
 *                                keine Dashboard-Nachkommastellen (no
 *                                precise counts in this row). This
 *                                supersedes the old exact 96 as a STYLE
 *                                change for this row, not a correction of
 *                                it; 96 stays exact in the Projekte prose.
 *
 * WHEN YOU CHANGE A NUMBER HERE, RE-MEASURE IT WHERE MEASURABLE AND UPDATE
 * THIS BLOCK. The regression guard in scripts/public-figures.test.mjs only
 * stops OLD values from creeping back; it cannot tell you whether a NEW one
 * is true.
 */
const DATA: Record<Lang, { groups: [Group, Group]; origin: string }> = {
  de: {
    groups: [
      {
        heading: "Mandat",
        stats: [
          { value: "10", label: "Jahre Mercedes-Benz" },
          { value: "50.000+", label: "KPI automatisiert" },
          { value: "3.000+", label: "Jira-Tickets" },
        ],
      },
      {
        heading: "Heute",
        stats: [
          { value: "13.000+", label: "GitHub-Contributions (12 Monate)" },
          { value: "4.000+", label: "Tests eigene Produkte" },
          { value: "100+", label: "API-Endpunkte" },
        ],
      },
    ],
    origin:
      "Erstes System mit 16: dBase III — Adressdatenbanken für die IHK. Seit 1993 Beruf, davon 10 Jahre Mercedes-Benz, 10+ Jahre agil, 15+ Mandate in Entwicklung, Einführung, Modernisierung und Auswahl.",
  },
  en: {
    groups: [
      {
        heading: "Mandates",
        stats: [
          { value: "10", label: "years Mercedes-Benz" },
          { value: "50,000+", label: "KPIs automated" },
          { value: "3,000+", label: "Jira tickets" },
        ],
      },
      {
        heading: "Now",
        stats: [
          { value: "13,000+", label: "GitHub contributions (12 months)" },
          { value: "4,000+", label: "tests, own products" },
          { value: "100+", label: "API endpoints" },
        ],
      },
    ],
    origin:
      "First system at 16: dBase III — address databases for the local chamber of commerce. Professional work since 1993, including 10 years at Mercedes-Benz, 10+ years agile, 15+ mandates across development, rollout, modernization and selection.",
  },
};

export default function StatsRow({ lang = "de" }: { lang?: Lang }) {
  const { groups, origin } = DATA[lang];

  return (
    <div className="mt-12 sm:mt-14">
      {groups.map((group, i) => (
        <div
          key={group.heading}
          // More space between the two groups than inside one — the gap
          // above the second group (mt-10/12) is deliberately larger than
          // the gap between a group's own heading and its figures (mt-4).
          className={i === 0 ? undefined : "mt-10 sm:mt-12"}
        >
          <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
            {group.heading}
          </p>
          <dl
            className="mt-4 grid grid-cols-3 gap-x-4 gap-y-6"
            aria-label={group.heading}
          >
            {group.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="order-2 mt-1 text-xs font-medium uppercase tracking-widest text-text-subtle">
                  {stat.label}
                </dt>
                <dd className="order-1 text-[2.2rem] font-semibold leading-none tracking-[-0.03em] text-text sm:text-[2.4rem]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
      {/* Origin sentence — running prose, smaller than the figures, not a
          seventh tile. Not duplicated into the hero or the bio paragraph
          above this component (brief instruction). */}
      <p className="mt-8 text-sm leading-relaxed text-text-muted sm:mt-10">
        {origin}
      </p>
    </div>
  );
}
