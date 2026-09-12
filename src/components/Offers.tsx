type Lang = "de" | "en";

type CtaKind = "primary" | "outline" | "text";

type Offer = {
  title: string;
  body: string;
  cta: { label: string; href: string; kind: CtaKind };
};

/**
 * Three offers, one lead. P3 (2026-09-11 d, Founder brief): purchasing
 * should see in 10 seconds what it can book. Card 1 carries the page's
 * only OTHER filled-Primary CTA besides the hero — same Calendly address,
 * same `utm_source=rauhut-com` — deliberately, per the brief (the hero's
 * CTA is not "the only one on the page", it's "the only PRIMARY-styled
 * one"; the lead offer repeats it because a visitor who scrolled past the
 * hero without booking should not have to scroll back up). Cards 2 and 3
 * are visually weaker on purpose and use their own UTM values so Calendly
 * reporting can tell the three entry points apart.
 *
 * Card 3 (KI-Potenzialanalyse / AI potential analysis) is a teaser for the
 * fuller section further down the page — that section is NOT duplicated
 * or removed, this card just repeats its own link with different, shorter
 * copy, the same relationship the hero already has with it.
 */
const COPY: Record<Lang, { offers: [Offer, Offer, Offer] }> = {
  de: {
    offers: [
      {
        title: "Technical Product Ownership",
        body: "Mandate in Konzernprogrammen — Anforderung, Backlog, verteilte Teams, Delivery. Automotive, Stammdaten, Programme, die live gehen müssen.",
        cta: {
          label: "Mandat besprechen (20 Min)",
          href: "https://calendly.com/rauhut/20min?utm_source=rauhut-com",
          kind: "primary",
        },
      },
      {
        title: "Test, Release, Abnahme",
        body: "Teststrategie, Automatisierung, Release-Takt. Damit die letzte Meile nicht das Programm hält — einschließlich Konfigurationsautomatisierung in Konzernprozessen.",
        cta: {
          label: "Gespräch zu Test & Release",
          href: "https://calendly.com/rauhut/20min?utm_source=rauhut-com-test",
          kind: "outline",
        },
      },
      {
        title: "KI-Potenzialanalyse",
        body: "Ein Workshop-Tag: wo KI-Agenten in konkreten Prozessen tragen — und wo nicht. Ablauf, Umfang und Preise bei Neckarshore AI.",
        cta: {
          label: "Zur KI-Potenzialanalyse",
          href: "https://neckarshore.ai/ki-beratung?ref=rauhut",
          kind: "text",
        },
      },
    ],
  },
  en: {
    offers: [
      {
        title: "Technical Product Ownership",
        body: "Mandates in enterprise programmes — requirements, backlog, distributed teams, delivery. Automotive, master data, programmes that have to go live.",
        cta: {
          label: "Discuss a mandate (20 min)",
          href: "https://calendly.com/rauhut/20min?utm_source=rauhut-com",
          kind: "primary",
        },
      },
      {
        title: "Test, release, acceptance",
        body: "Test strategy, automation, release cadence. So the last mile does not stall the programme — including configuration automation in enterprise processes.",
        cta: {
          label: "Talk about test & release",
          href: "https://calendly.com/rauhut/20min?utm_source=rauhut-com-test",
          kind: "outline",
        },
      },
      {
        title: "AI potential analysis",
        body: "A workshop day: where AI agents carry in real processes — and where they do not. Scope, format and pricing at Neckarshore AI.",
        cta: {
          label: "AI potential analysis",
          href: "https://neckarshore.ai/ki-beratung?ref=rauhut",
          kind: "text",
        },
      },
    ],
  },
};

// Reused verbatim from the hero's own two buttons (src/app/page.tsx /
// src/app/en/page.tsx) — same visual language, not a new color world.
const PRIMARY_CTA =
  "inline-flex items-center justify-center rounded-lg bg-text px-5 py-2.5 text-sm font-medium text-bg no-underline transition-colors duration-150 hover:bg-accent-hover hover:text-bg hover:no-underline";
const OUTLINE_CTA =
  "inline-flex items-center justify-center rounded-lg border border-border-strong px-5 py-2.5 text-sm font-medium text-text no-underline transition-colors duration-150 hover:border-accent hover:text-accent-hover hover:no-underline";

// Card chrome reused from ContactCards.tsx (rounded-xl border + bg-muted) —
// the site's one established "card" pattern.
const CARD = "rounded-xl border border-border bg-bg-muted";

export default function Offers({ lang = "de" }: { lang?: Lang }) {
  const [lead, ...rest] = COPY[lang].offers;

  return (
    <div className="mt-6 flex flex-col gap-4">
      {/* Lead offer — full width, the only other filled-Primary CTA on the
          page besides the hero. */}
      <div className={`${CARD} p-6`}>
        <h3 className="text-lg font-semibold">{lead.title}</h3>
        <p className="mt-2 text-base leading-relaxed text-text-muted">
          {lead.body}
        </p>
        <a
          href={lead.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-5 ${PRIMARY_CTA}`}
        >
          {lead.cta.label}
        </a>
      </div>

      {/* Two weaker offers — smaller heading, outline or plain-text CTA,
          never filled. Card 3 (kind: "text") must never look like a
          button — that is the rule the brief is protecting. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {rest.map((offer) => (
          <div key={offer.title} className={`${CARD} p-5`}>
            <h3 className="text-base font-semibold">
              {offer.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {offer.body}
            </p>
            {offer.cta.kind === "outline" ? (
              <a
                href={offer.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 ${OUTLINE_CTA}`}
              >
                {offer.cta.label}
              </a>
            ) : (
              <p className="mt-4">
                <span aria-hidden="true">→ </span>
                <a href={offer.cta.href} target="_blank" rel="noopener noreferrer">
                  {offer.cta.label}
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
