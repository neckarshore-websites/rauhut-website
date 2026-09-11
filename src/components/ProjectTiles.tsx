type Lang = "de" | "en";

/**
 * Own-products block — text intro (overline + title + body + link) followed
 * by the compact product list. Rewritten 2026-09-11 b (P2/IA pass) from the
 * earlier dark-gradient "lead tile" design: this block moved from directly
 * under the hero to after Projekte/Projects, so it no longer needs to carry
 * its own visual weight as a card — the page's existing H2/paragraph
 * pattern (used by Zusammenfassung/Kernkompetenzen/Projekte) does the job
 * and keeps the "no new color world" constraint. "My passion" is retired
 * with the tile it lived on.
 *
 * The product list itself is unchanged in substance from the prior
 * Variante A (Founder-decided 2026-08-16): a compact list of the products
 * that live under Neckarshore AI, not siblings of a headline claim but
 * evidence for the paragraph above them.
 *
 * The rows deliberately carry NO description. On a person page this block
 * answers "what is he building", not "what does each product do" — that
 * answer lives one click away, on the product page itself.
 *
 * Repository links were removed here on purpose (Founder instruction,
 * 2026-08-16): a visitor of a person page belongs on a product page, not in
 * a code repository. `tests/e2e/site.spec.ts` asserts their absence, because
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
    overline: string;
    title: string;
    body: string;
    linkLabel: string;
    listHead: string;
  }
> = {
  de: {
    regionLabel: "Projektbereich",
    overline: "Eigene Produkte",
    title: "Was ich baue, wenn ich nicht im Mandat bin",
    body: "Unter Neckarshore AI entstehen Produkte, an denen ich Product-Ownership und Engineering eiche. Flagship ist Omnopsis: Compliance-, Technik- und Release-Dokumentation aus Git, Jira und Confluence. Deshalb empfehle ich nur, was im eigenen Betrieb gelaufen ist.",
    linkLabel: "neckarshore.ai",
    listHead: "Was dort entsteht",
  },
  en: {
    regionLabel: "Project overview",
    overline: "Own products",
    title: "What I build between mandates",
    body: "At Neckarshore AI I ship products that keep my product-ownership and engineering sharp. Flagship is Omnopsis: compliance, technical and release documentation from Git, Jira and Confluence. I only recommend what has already run in my own operation.",
    linkLabel: "neckarshore.ai",
    listHead: "What is built there",
  },
};

export default function ProjectTiles({ lang = "de" }: { lang?: Lang }) {
  const copy = COPY[lang];

  return (
    <section aria-label={copy.regionLabel}>
      <p className="text-xs font-medium uppercase tracking-widest text-brand-amber">
        {copy.overline}
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
        {copy.title}
      </h2>
      <p className="mt-4 text-lg leading-relaxed">{copy.body}</p>
      <p className="mt-4">
        <span aria-hidden="true">→ </span>
        <a href="https://neckarshore.ai" target="_blank" rel="noopener noreferrer">
          {copy.linkLabel}
        </a>
      </p>

      {/* Product list. This chrome inherits the page tokens rather than
          fixed dark values — rauhut.com has a light theme too. */}
      <p className="mt-10 text-[0.6875rem] font-medium uppercase tracking-widest text-brand-amber">
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
