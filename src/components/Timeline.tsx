type Lang = "de" | "en";

type Phase = {
  year: string;
  period: string;
  title: string;
  body?: string;
};

// Reverse-chronological order — newest at top.
const PHASES: Record<Lang, Phase[]> = {
  de: [
    {
      year: "2025",
      period: "10/2025",
      title: "Exit — Wechsel in die Selbstständigkeit",
    },
    {
      year: "2021",
      period: "10/2021 – 10/2025",
      title: "Technical Product Owner",
      body: "PLUS.Classic & PLUS.NextGen. Product Owner für ein Stammdaten-Produkt (ACL) im PLUS NextGen Programm. Agile Entwicklung mit Team in Südafrika, KI-Prototyping, ITSM-Beratung, Plant Relationship Manager Sindelfingen.",
    },
    {
      year: "2017",
      period: "09/2017 – 09/2021",
      title: "Senior Business IT Consultant",
      body: "SFMd, konzernweite Digitalisierung des Shopfloormanagements. Anforderungsanalyse, Automatisierung der Konfiguration (> 50.000 KPI), Aufbau Testautomation (Katalon/Selenium), Release-Steuerung im 2-Wochen-Rhythmus.",
    },
    {
      year: "2015",
      period: "07/2015 – 08/2017",
      title: "Senior Business Analyst & Tester",
      body: "TestGilde GmbH, Endkunde Daimler AG. Internationale Webseite für ein Automobilprodukt. Anforderungsanalyse, Regressions-/Progressionstests, Release Management.",
    },
  ],
  en: [
    {
      year: "2025",
      period: "10/2025",
      title: "Exit — transition to independent work",
    },
    {
      year: "2021",
      period: "10/2021 – 10/2025",
      title: "Technical Product Owner",
      body: "PLUS.Classic & PLUS.NextGen. Product Owner for a master-data product (ACL) within the PLUS NextGen program. Agile development with a team in South Africa, AI prototyping, ITSM consulting, Plant Relationship Manager Sindelfingen.",
    },
    {
      year: "2017",
      period: "09/2017 – 09/2021",
      title: "Senior Business IT Consultant",
      body: "SFMd, group-wide digitalization of shop-floor management. Requirements analysis, automation of configuration (> 50,000 KPI), test automation setup (Katalon/Selenium), release management on a 2-week cadence.",
    },
    {
      year: "2015",
      period: "07/2015 – 08/2017",
      title: "Senior Business Analyst & Tester",
      body: "TestGilde GmbH, end-customer Daimler AG. International website for an automotive product. Requirements analysis, regression/progression testing, release management.",
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
      {phases.map((phase) => {
        // Marker = no body (e.g. "Exit" — a moment, not a role).
        // Renders with a dimmer border to read as endpoint, not active phase.
        const isMarker = !phase.body;
        return (
          <li key={phase.year} className="relative">
            {/* Circle node — 1.5px border, bg-matched to punch through the hairline */}
            <span
              aria-hidden="true"
              className={`absolute top-[0.45rem] -left-[1.7rem] h-2.5 w-2.5 rounded-full border-[1.5px] bg-bg ${
                isMarker ? "border-text-subtle" : "border-text-muted"
              }`}
            />
            <p className="text-[0.6875rem] font-medium uppercase tracking-widest text-text-subtle">
              {phase.period}
            </p>
            <p className="mt-0.5 text-[0.9375rem] font-semibold">
              {phase.title}
            </p>
            {phase.body && (
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-muted">
                {phase.body}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
