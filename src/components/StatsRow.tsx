type Lang = "de" | "en";

type Stat = { value: string; label: string };

const STATS: Record<Lang, Stat[]> = {
  de: [
    { value: "10+", label: "Jahre Konzern" },
    { value: "466", label: "Tests shipped" },
    { value: "12+", label: "AI-Agenten" },
    { value: "95", label: "API-Endpunkte" },
  ],
  en: [
    { value: "10+", label: "years corporate" },
    { value: "466", label: "tests shipped" },
    { value: "12+", label: "AI agents" },
    { value: "95", label: "API endpoints" },
  ],
};

export default function StatsRow({ lang = "de" }: { lang?: Lang }) {
  const stats = STATS[lang];

  return (
    <dl
      className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:mt-14 sm:grid-cols-4 sm:gap-x-4"
      aria-label={lang === "de" ? "Kennzahlen" : "Key numbers"}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col">
          <dt className="order-2 mt-1 text-[0.6875rem] font-medium uppercase tracking-widest text-text-subtle">
            {stat.label}
          </dt>
          <dd className="order-1 text-[2.2rem] font-semibold leading-none tracking-tight text-text sm:text-[2.4rem]">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
