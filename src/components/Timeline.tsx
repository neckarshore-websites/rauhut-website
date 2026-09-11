type Lang = "de" | "en";

type Phase = {
  year: string;
  period: string;
  title: string;
  /** One-line subtitle under the role heading (P5a, 2026-09-12). Rendered
   * with the same className the role heading already used — "visuell wie
   * jetzt die Rolle" — deliberately a <p>, not a heading element. */
  claim: string;
  /** Intro paragraph. Always present; some phases add `bullets` below it,
   * others (Senior Business Analyst) stand alone as a single paragraph. */
  lead: string;
  bullets?: string[];
};

// Reverse-chronological order — newest at top. P5a (2026-09-12, Founder
// brief): the standalone "Exit — Wechsel in die Selbstständigkeit" marker
// phase is retired (the freelance transition is already the P4b chapter's
// own opening line, "Seit Oktober 2025 selbstständig" — no need to say it
// twice). Each remaining phase gets a one-line claim plus a lead
// paragraph; the two roles with enough substance (TPO, SFMd) add a bullet
// list, the earliest role (Senior Business Analyst, renamed from "&
// Tester" — TestGilde/Daimler tester framing retired) stays one paragraph.
const PHASES: Record<Lang, Phase[]> = {
  de: [
    {
      year: "2021",
      period: "10/2021 – 10/2025",
      title: "Technical Product Owner",
      claim: "Stammdaten-Produkt MData im PLUS-Programm",
      lead: "Parallel Senior Business Analyst für die Karosseriesortierer in Sindelfingen — Software werksübergreifend — und Technical Product Owner für MData in PLUS.NextGen. PLUS läuft 24/7: fällt es aus, steht die Produktion.",
      bullets: [
        "MData zieht Stammdaten aus Systemen, die das nicht leisten, und stellt sie hochverfügbar bereit (Anti-Corruption Layer).",
        "Ab Ende 2023 Classic auf Maintain, Energie in NextGen: 30 Jahre Software modernisieren, in die Cloud, Standards statt Sonderlocken.",
        "Entwicklungsorganisation in Deutschland und Südafrika auf agil umgestellt.",
        "Change-Management im Vorhaben mitgestaltet.",
      ],
    },
    {
      year: "2017",
      period: "09/2017 – 09/2021",
      title: "Senior Business IT Consultant",
      claim: "Stammdaten-Systeme über API angebunden; 50.000+ KPI automatisiert konfiguriert",
      lead: "SFMd — Digitalisierung der Shopfloor-Management-Prozesse (SFM). Erstes agiles Vorhaben in einem Bereich, der bis dahin klassisch entwickelt hat. Speerspitze, weltweiter Rollout, Entwickler-Teams in Deutschland und Südafrika.",
      bullets: [
        "Agile Coaching der fachlichen Product Owner und der Entwicklungsteams.",
        "20 stammdatengebende Systeme, teilweise zu jedem Schichtwechsel aktualisiert.",
        "Liefernde Systeme über API auf schichtaktuelle Lieferung gebracht.",
        "System-Konfiguration automatisiert, Testautomation aufgebaut, Release im 2-Wochen-Takt.",
        "Planwände mit 40–50 Reports ersetzt durch eine moderne Weboberfläche auf 85-Zoll-Touchscreens.",
        "REST zwischen Backend und Frontend, webbasiert, schon in der Cloud.",
      ],
    },
    {
      year: "2015",
      period: "07/2015 – 08/2017",
      title: "Senior Business Analyst",
      claim: "Internationaler Markenauftritt smart.com",
      lead: "Betreuung & fortlaufende Entwicklung des internationalen Markenauftritts smart.com — bereits agil. Anforderungsanalyse, Progressions- und Regressionstests, Release Management. Dazu Testmanagement und Testautomation, noch gegen den Strich der damaligen Linie.",
    },
  ],
  en: [
    {
      year: "2021",
      period: "10/2021 – 10/2025",
      title: "Technical Product Owner",
      claim: "Master-data product MData in the PLUS programme",
      lead: "In parallel Senior Business Analyst for body-shop sorting in Sindelfingen — software used across plants — and Technical Product Owner for MData in PLUS.NextGen. PLUS runs 24/7: if it fails, production stops.",
      bullets: [
        "MData pulls master data from systems that cannot provide it and serves it highly available (anti-corruption layer).",
        "From late 2023 Classic on maintain, energy into NextGen: modernize 30 years of software, to the cloud, standards instead of one-offs.",
        "Development organization in Germany and South Africa moved to agile.",
        "Helped shape change management in the programme.",
      ],
    },
    {
      year: "2017",
      period: "09/2017 – 09/2021",
      title: "Senior Business IT Consultant",
      claim: "Master-data systems connected via API; 50,000+ KPIs configured automatically",
      lead: "SFMd — digitalization of shop-floor management processes (SFM). First agile initiative in an area that had been developing classically. Spearhead, worldwide rollout, development teams in Germany and South Africa.",
      bullets: [
        "Agile coaching of the business product owners and the development teams.",
        "20 master-data source systems, some updated at every shift change.",
        "Supplying systems brought to shift-current delivery via API.",
        "System configuration automated, test automation in place, 2-week release cadence.",
        "Planning boards with 40–50 reports replaced by a modern web UI on 85-inch touchscreens.",
        "REST between backend and frontend, web-based, already in the cloud.",
      ],
    },
    {
      year: "2015",
      period: "07/2015 – 08/2017",
      title: "Senior Business Analyst",
      claim: "International brand presence smart.com",
      lead: "Care and ongoing development of the international brand presence smart.com — already agile. Requirements analysis, progression and regression tests, release management. Plus test management and test automation, still against the grain of the line at the time.",
    },
  ],
};

export default function Timeline({ lang = "de" }: { lang?: Lang }) {
  const phases = PHASES[lang];
  const label =
    lang === "de" ? "Karriere-Meilensteine" : "Career milestones";

  return (
    <ol
      aria-label={label}
      className="relative ml-1 space-y-7 border-l border-border pl-6"
    >
      {phases.map((phase) => (
        <li key={phase.year} className="relative">
          {/* Circle node — 1.5px border, bg-matched to punch through the
              hairline. All phases carry content now (the marker-only
              "Exit" phase is retired), so the border is always the
              active-phase tone. */}
          <span
            aria-hidden="true"
            className="absolute top-[0.45rem] -left-[1.7rem] h-2.5 w-2.5 rounded-full border-[1.5px] border-text-muted bg-bg"
          />
          <p className="text-[0.6875rem] font-medium uppercase tracking-widest text-text-subtle">
            {phase.period}
          </p>
          <p className="mt-0.5 text-[0.9375rem] font-semibold">
            {phase.title}
          </p>
          <p className="mt-0.5 text-[0.9375rem] font-semibold">
            {phase.claim}
          </p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-muted">
            {phase.lead}
          </p>
          {phase.bullets && (
            <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-text-muted">
              {phase.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
