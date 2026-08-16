type Lang = "de" | "en";

/**
 * Variante A, Founder-decided 2026-08-16: ONE lead tile for neckarshore.ai,
 * and under it a compact list of the products that live inside it.
 *
 * The shape carries an argument, so do not flatten it back into a grid of
 * equal tiles in a later pass. Every row below points at
 * `neckarshore.ai/products/…` — the five products are not siblings of the
 * tile above them, they are its contents. Six equally sized tiles would
 * claim six equally important things and level a hierarchy that genuinely
 * exists.
 *
 * The rows deliberately carry NO description. On a person page this block
 * answers "what is he building", not "what does each product do" — that
 * answer lives one click away, on the product page itself.
 *
 * Repository links were removed here on purpose (Founder instruction, same
 * decision): a visitor of a person page belongs on a product page, not in a
 * code repository. `tests/e2e/site.spec.ts` asserts their absence, because
 * a helpful link creeps back exactly one content pass later.
 *
 * Tags are stored in their FINAL casing and are NOT uppercased by CSS.
 * `text-transform: uppercase` renders "iOS" as "IOS" — a stylistic rule
 * silently rewriting a proper noun. Found by looking at the rendered page,
 * not at the code: in the source the value read "iOS" and looked right.
 */
const PRODUCTS: ReadonlyArray<{
  name: string;
  tag: Record<Lang, string>;
  href: string;
}> = [
  {
    name: "Omnopsis Documentor",
    tag: { de: "FLAGSHIP", en: "FLAGSHIP" },
    href: "https://neckarshore.ai/products/omnopsis",
  },
  {
    // The product page, NOT an anchor into the Skills category page: an
    // anchor breaks silently when that list is re-sorted, and it delivers
    // the reader into a list instead of onto the product.
    name: "Obsidian Vault Autopilot",
    tag: { de: "OPEN SOURCE", en: "OPEN SOURCE" },
    href: "https://neckarshore.ai/products/obsidian-vault-autopilot",
  },
  {
    // "MMP" until 2026-08-16, replaced on Founder decision: it is an
    // internal abbreviation and says nothing to a visitor of this page. The
    // label had no history worth protecting — it came from the design draft,
    // not from a Founder wording.
    name: "TrustScope",
    tag: { de: "EIGENES PRODUKT", en: "OWN PRODUCT" },
    href: "https://neckarshore.ai/products/trustscope",
  },
  {
    // FOUNDER-RULED 2026-08-16, asked twice on purpose: Kaze counts as an
    // own Neckarshore product. The first answer was challenged because this
    // estate's own agent definitions say the opposite — they name
    // `zappasequencer/kaze` as a third party's repo "we do NOT develop
    // ourselves". The Founder confirmed against that evidence and ruled the
    // definitions stale; correcting them is tracked separately.
    // The tag stays "iOS" regardless: it was chosen to be true under either
    // reading, and the ruling removes a constraint rather than requiring
    // new wording. Nothing here needs to change on the ruling alone.
    name: "Kaze",
    tag: { de: "iOS", en: "iOS" },
    href: "https://neckarshore.ai/products/kaze",
  },
  {
    name: "Skills",
    tag: { de: "CLAUDE CODE", en: "CLAUDE CODE" },
    href: "https://neckarshore.ai/products/skills",
  },
];

const COPY: Record<
  Lang,
  {
    regionLabel: string;
    passion: string;
    neckarshoreDesc: string;
    listHead: string;
    openCta: string;
  }
> = {
  de: {
    regionLabel: "Projektbereich",
    passion: "My passion",
    neckarshoreDesc: "KI-beschleunigte Softwareentwicklung",
    listHead: "Was dort entsteht",
    openCta: "Öffnen",
  },
  en: {
    regionLabel: "Project overview",
    passion: "My passion",
    neckarshoreDesc: "AI-accelerated software development",
    listHead: "What is built there",
    openCta: "Open",
  },
};

export default function ProjectTiles({ lang = "de" }: { lang?: Lang }) {
  const copy = COPY[lang];

  return (
    <section aria-label={copy.regionLabel}>
      {/* Lead tile — neckarshore.ai. Keeps the established tile language of
          this page (gradient, eyebrow, arrow); only the height relaxes,
          because it no longer has to match a neighbour in a two-column grid. */}
      <a
        href="https://neckarshore.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0F172A] p-6 text-[#F1F5F9] no-underline ring-1 ring-transparent transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:text-[#F1F5F9] hover:no-underline hover:ring-[#22D3EE]/30 hover:shadow-[0_10px_40px_-15px_rgba(34,211,238,0.25)]"
      >
        {/* CTA — always visible, absolute so hover causes no layout shift */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-5 text-[0.6875rem] font-medium uppercase tracking-widest text-[#22D3EE]"
        >
          {copy.openCta} ↗
        </span>
        <div>
          <p className="text-[0.6875rem] font-medium uppercase tracking-widest text-[#22D3EE]">
            {copy.passion}
          </p>
          <p className="mt-2 text-xl font-semibold tracking-tight">
            neckarshore<span className="text-[#22D3EE]">.ai</span>
          </p>
          <p className="mt-1.5 text-sm text-[#CBD5E1]">
            {copy.neckarshoreDesc}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="text-xl text-[#22D3EE] transition-transform duration-150 group-hover:translate-x-1"
        >
          →
        </span>
      </a>

      {/* Product list. Unlike the tile above, this chrome inherits the page
          tokens rather than fixed dark values — rauhut.com has a light theme
          too, and the design artifact this was approved from could only show
          the dark one. Hardcoding the artifact's hex values here would have
          produced invisible separators in light mode. */}
      <p className="mt-8 text-[0.6875rem] font-medium uppercase tracking-widest text-brand-amber">
        {copy.listHead}
      </p>
      <ul className="mt-3">
        {PRODUCTS.map((product) => (
          <li key={product.href} className="border-t border-border last:border-b">
            <a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-wrap items-baseline gap-x-3.5 gap-y-1 py-3.5 text-text no-underline hover:text-text hover:no-underline"
            >
              <span className="basis-full text-[0.9375rem] font-medium sm:flex-1 sm:basis-auto">
                {product.name}
              </span>
              <span className="text-[0.6875rem] font-semibold tracking-[0.1em] text-text-subtle">
                {product.tag[lang]}
              </span>
              <span
                aria-hidden="true"
                className="text-brand-teal transition-transform duration-150 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
