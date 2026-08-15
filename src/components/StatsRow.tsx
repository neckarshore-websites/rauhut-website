type Lang = "de" | "en";

type Stat = { value: string; label: string };

/**
 * PUBLIC FIGURES — every one of these carries a Messweg, 2026-08-15.
 *
 * These numbers sat unmeasured since Oct 2025 and every single one was WRONG in
 * the modest direction — the site undersold itself by roughly half on two of
 * four. Re-measured at source before this edit:
 *
 *   Tests   905  = omnopsis-backend 588 (unit 302 + integration 27 + e2e 259)
 *                + omnopsis-contracts 85 + omnopsis-frontend 232.
 *                Source: neckarshore-planning docs/reference/test-coverage-matrix.yaml
 *                (Lenin estate recount, MASCHIN read-the-code PIR PASS, SHA-pinned).
 *                Cross-check: the public audited estate figure at
 *                neckarshore.ai/estate-test-scope.json lists the same three
 *                Omnopsis rows summing to 905.
 *   Agents   23  = count of agent definitions in the estate (`~/.claude/agents/*.md`).
 *   Endpoints 96 = `@Get|@Post|@Put|@Patch|@Delete` decorators across the 23
 *                controllers in omnopsis-backend at origin/main.
 *   Years    10+ = Founder biography, not machine-measurable. Left untouched.
 *
 * WHEN YOU CHANGE A NUMBER HERE, RE-MEASURE IT AND UPDATE THIS BLOCK. The
 * regression guard in scripts/public-figures.test.mjs only stops the OLD
 * values from creeping back; it cannot tell you whether a NEW one is true.
 */
const STATS: Record<Lang, Stat[]> = {
  de: [
    { value: "10+", label: "Jahre Konzern" },
    { value: "905", label: "Tests shipped" },
    { value: "23", label: "AI-Agenten" },
    { value: "96", label: "API-Endpunkte" },
  ],
  en: [
    { value: "10+", label: "years corporate" },
    { value: "905", label: "tests shipped" },
    { value: "23", label: "AI agents" },
    { value: "96", label: "API endpoints" },
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
