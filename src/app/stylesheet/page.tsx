import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * /stylesheet — living style reference for rauhut.com (P11, 2026-09-12,
 * Founder brief). Renders every token, type role and component pattern the
 * homepage uses, in the site's own CSS, so a change to globals.css shows
 * up here immediately. Footer-linked only (rel="nofollow"), noindex via
 * meta + X-Robots-Tag (next.config.ts), absent from the sitemap — same
 * treatment as /designs. Temporary by intent; delete when no longer useful.
 */
export const metadata: Metadata = {
  title: "Stylesheet — rauhut.com",
  description: "Interne Style-Referenz für rauhut.com.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://rauhut.com/stylesheet" },
};

const OVERLINE = "text-xs font-medium uppercase tracking-widest";
const PRIMARY_CTA =
  "inline-flex items-center justify-center rounded-lg bg-text px-5 py-2.5 text-sm font-medium text-bg no-underline transition-colors duration-150 hover:bg-accent-hover hover:text-bg hover:no-underline";
const OUTLINE_CTA =
  "inline-flex items-center justify-center rounded-lg border border-border-strong px-5 py-2.5 text-sm font-medium text-text no-underline transition-colors duration-150 hover:border-accent hover:text-accent-hover hover:no-underline";
const CARD = "rounded-xl border border-border bg-bg-muted";

const COLORS: { token: string; role: string; cls: string }[] = [
  { token: "bg", role: "Seite", cls: "bg-bg" },
  { token: "bg-muted", role: "Karten, Formularfelder", cls: "bg-bg-muted" },
  { token: "text", role: "Fließtext, Titel, Ziffern", cls: "bg-text" },
  { token: "text-muted", role: "Meta, Zeiträume, Labels (= text-subtle)", cls: "bg-text-muted" },
  { token: "border", role: "Hairlines, Karten-Rand", cls: "bg-border" },
  { token: "border-strong", role: "Outline-Button, Inputs", cls: "bg-border-strong" },
  { token: "brand-amber", role: "Kapitel-Overline — sonst nichts", cls: "bg-brand-amber" },
  { token: "brand-teal", role: "Textlinks — sonst nichts", cls: "bg-brand-teal" },
  { token: "accent", role: "Focus-Ring, Selection, Button-Hover", cls: "bg-accent" },
];

const TYPE: { role: string; cls: string; sample: string; spec: string }[] = [
  { role: "H1 (Hero)", cls: "text-[1.8rem] font-semibold tracking-[-0.03em] text-text sm:text-[2.4rem]", sample: "Freelance Technical Product Owner", spec: "28.8 / 38.4 px · 600 · −0.03em" },
  { role: "Kennzahl", cls: "text-[2.2rem] font-semibold leading-none tracking-[-0.03em] text-text sm:text-[2.4rem]", sample: "50.000+", spec: "35.2 / 38.4 px · 600 · −0.03em" },
  { role: "H2 (Kapitel)", cls: "text-2xl font-semibold text-text", sample: "Was ich mitbringe", spec: "24 px · 600" },
  { role: "Name / Lead groß", cls: "text-lg font-medium text-text sm:text-xl", sample: "German Rauhut", spec: "18 / 20 px · 500" },
  { role: "H3 (Rolle, Karte)", cls: "text-lg font-semibold text-text", sample: "Technical Product Owner", spec: "18 px · 600" },
  { role: "Fließtext", cls: "text-base leading-relaxed text-text", sample: "Brückenbauer zwischen Business und Technologie — Anforderung, Test, Release, verteilte Teams.", spec: "16 px · 400 · 1.625" },
  { role: "Fließtext gedimmt", cls: "text-base leading-relaxed text-text-muted", sample: "Claim unter dem Rollen-Titel, Hero-Tagline.", spec: "16 px · 400 · muted" },
  { role: "Label", cls: "text-sm font-semibold text-text", sample: "Mandat", spec: "14 px · 600" },
  { role: "Meta", cls: "text-sm text-text-muted", sample: "Stuttgart · remote DACH · seit 10/2025", spec: "14 px · 400 · muted" },
  { role: "Overline Kapitel", cls: `${OVERLINE} text-brand-amber`, sample: "Kernkompetenzen", spec: "12 px · 500 · caps · 0.1em · amber" },
  { role: "Overline Zeitraum / Tabellenkopf", cls: `${OVERLINE} text-text-muted`, sample: "10/2021 – 10/2025", spec: "12 px · 500 · caps · 0.1em · muted" },
];

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-16">
      <p className={`${OVERLINE} text-brand-amber`}>{label}</p>
      <h2 className="mt-2 mb-8 text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function StylesheetPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="mb-10 flex items-center justify-between">
        <Link href="/" className="text-sm">
          ← rauhut.com
        </Link>
        <ThemeToggle />
      </div>

      <header className="mb-8">
        <p className={`${OVERLINE} text-text-muted`}>Intern · noindex</p>
        <h1 className="mt-2 text-[1.8rem] font-semibold tracking-[-0.03em] sm:text-[2.4rem]">
          Stylesheet
        </h1>
        <p className="mt-3 text-base leading-relaxed text-text-muted">
          Eine Schrift (Inter), drei Gewichte (400 / 500 / 600), sieben
          Größen, drei Trackings, vier Textfarben mit je einer Rolle. Alles
          hier rendert mit dem Live-CSS der Seite — Theme oben rechts
          umschalten, um Dark und Light zu prüfen.
        </p>
      </header>

      <hr />

      <Section label="Farben" title="Tokens und ihre eine Rolle">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {COLORS.map((c) => (
            <li key={c.token} className={`${CARD} flex items-center gap-4 p-4`}>
              <span
                aria-hidden="true"
                className={`h-10 w-10 shrink-0 rounded-lg border border-border ${c.cls}`}
              />
              <span className="flex flex-col">
                <code className="text-sm font-medium text-text">{c.token}</code>
                <span className="text-sm text-text-muted">{c.role}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <hr />

      <Section label="Typografie" title="Die Skala">
        <dl className="space-y-6">
          {TYPE.map((t) => (
            <div key={t.role} className="grid grid-cols-1 gap-2 sm:grid-cols-[11rem_1fr]">
              <dt className="flex flex-col text-sm text-text-muted">
                <span className="font-semibold text-text">{t.role}</span>
                <span>{t.spec}</span>
              </dt>
              <dd className={t.cls}>{t.sample}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <hr />

      <Section label="Kapitel" title="Overline + Headline">
        <div className={`${CARD} p-6`}>
          <p className={`${OVERLINE} text-brand-amber`}>Projekte</p>
          <h2 className="mt-2 text-2xl font-semibold">
            Freelance, Mercedes-Benz, frühere Stationen
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text">
            Amber markiert das Kapitel, die weiße Headline trägt es. Abstand
            zwischen Kapiteln: 80 / 96 px, Hairline dazwischen. Unter der
            Headline folgt Fließtext in <code>text</code>, nie in{" "}
            <code>text-muted</code>.
          </p>
        </div>
      </Section>

      <hr />

      <Section label="Aktionen" title="Buttons und Links">
        <div className="flex flex-wrap items-center gap-3">
          <a href="#" className={PRIMARY_CTA}>
            Primary — Mandat besprechen
          </a>
          <a href="#" className={OUTLINE_CTA}>
            Outline — E-Mail
          </a>
          <p>
            <span aria-hidden="true">→ </span>
            <a href="#">Textlink — teal, unterstrichen</a>
          </p>
        </div>
        <p className="mt-4 text-sm text-text-muted">
          Pro Seite genau ein Primary im Hero, einer in der Lead-Angebotskarte,
          einer in der Navigation. Karte 3 bleibt Textlink.
        </p>
      </Section>

      <hr />

      <Section label="Bausteine" title="Karte, Liste, Definitionsliste">
        <div className={`${CARD} p-6`}>
          <h3 className="text-lg font-semibold">Technical Product Ownership</h3>
          <p className="mt-2 text-base leading-relaxed text-text">
            Mandate in Konzernprogrammen — Anforderung, Backlog, verteilte
            Teams, Delivery.
          </p>
          <a href="#" className={`mt-5 ${PRIMARY_CTA}`}>
            Mandat besprechen (20 Min)
          </a>
        </div>

        <ul className="mt-8 list-disc space-y-3 pl-5 text-base leading-relaxed marker:text-text-muted">
          <li>
            <strong className="font-semibold">Anforderung &amp; Backlog</strong>{" "}
            — fetter Lead, dann Fließtext. Marker in <code>text-muted</code>.
          </li>
          <li>
            <strong className="font-semibold">Test, Release, Abnahme</strong> —
            drei Zeilen Abstand zwischen Punkten (<code>space-y-3</code>).
          </li>
        </ul>

        <dl className="mt-8 grid grid-cols-[7rem_1fr] gap-x-4 gap-y-1.5 text-sm text-text-muted">
          <dt className="font-medium text-text">Runtime</dt>
          <dd>TypeScript, NestJS, Next.js, React, PostgreSQL</dd>
          <dt className="font-medium text-text">Delivery</dt>
          <dd>Vercel, GitHub Actions, Docker</dd>
        </dl>
      </Section>

      <hr />

      <Section label="Tabelle" title="Nur Zeilenlinien">
        <table>
          <thead>
            <tr>
              <th scope="col" className="w-1/2">
                Heute
              </th>
              <th scope="col" className="w-1/2">
                Fundament
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Technical Product Ownership — Vision, Backlog, Delivery</td>
              <td>Anforderungsmanagement — Grobkonzept bis technische Story</td>
            </tr>
            <tr>
              <td>DevOps &amp; CI/CD — GitHub Actions, Vercel, Monitoring</td>
              <td>Testmanagement — E2E, API, Automatisierung</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <hr />

      <Section label="Timeline" title="Knoten, Zeitraum, Rolle, Claim">
        <ol className="relative ml-1 space-y-7 border-l border-border pl-6">
          <li className="relative">
            <span
              aria-hidden="true"
              className="absolute top-[0.45rem] -left-[1.7rem] h-2.5 w-2.5 rounded-full border-[1.5px] border-text-muted bg-bg"
            />
            <p className={`${OVERLINE} text-text-muted`}>10/2021 – 10/2025</p>
            <p className="mt-0.5 text-base font-semibold text-text">
              Technical Product Owner
            </p>
            <p className="mt-0.5 text-base text-text-muted">
              Stammdaten-Produkt MData im PLUS-Programm
            </p>
            <p className="mt-2 text-base leading-relaxed text-text">
              Lead-Absatz in <code>text</code>, Claim darüber in{" "}
              <code>text-muted</code>.
            </p>
          </li>
        </ol>
      </Section>

      <hr />

      <Section label="Formular" title="Feld und Label">
        <div className="max-w-md">
          <label htmlFor="ss-name" className="mb-1.5 block text-sm font-medium text-text">
            Name
          </label>
          <input
            id="ss-name"
            type="text"
            placeholder="Vor- und Nachname"
            className="w-full rounded-lg border border-border-strong bg-bg-muted px-4 py-3 text-base text-text placeholder:text-text-subtle"
          />
        </div>
      </Section>

      <hr />

      <footer className="pt-10 pb-4 text-sm text-text-muted">
        <p>
          Kapitel-Rhythmus: <code>py-20 sm:py-24</code> · Hairline{" "}
          <code>border</code> · Inhaltsbreite <code>max-w-2xl</code> (42 rem)
        </p>
      </footer>
    </main>
  );
}
