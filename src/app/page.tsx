import FounderPhoto from "@/components/FounderPhoto";
import ThemeToggle from "@/components/ThemeToggle";
import LangToggle from "@/components/LangToggle";
import StatsRow from "@/components/StatsRow";
import Reveal from "@/components/Reveal";
import ContactCards from "@/components/ContactCards";
import ContactForm from "@/components/ContactForm";
import Timeline from "@/components/Timeline";
import PersonJsonLd from "@/components/PersonJsonLd";
import Offers from "@/components/Offers";
import NavRail from "@/components/NavRail";
import MobileNav from "@/components/MobileNav";
import { AVAILABILITY } from "@/lib/availability";
import { CONTACT_MAILTO } from "@/lib/contact";

export default function HomePage() {
  return (
    <>
      {/* P8 (2026-09-12, Founder brief, artifact-approved): hybrid chrome.
          Mobile gets a sticky top bar (Name + CTA, jumps behind a burger).
          Desktop (lg+) gets no sticky topbar at all — instead a sticky rail
          to the right of the (unchanged, still narrow) content column. */}
      <MobileNav lang="de" />

      <div className="lg:mx-auto lg:grid lg:max-w-[70rem] lg:grid-cols-[42rem_1fr] lg:items-start lg:gap-16 lg:px-6">
        <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24 lg:px-0">
          {/* Schema.org Person — emitted as raw JSON-LD in the HTML source
              (native <script> tag, not next/script — see AD-19). */}
          <PersonJsonLd lang="de" />

          {/* Top bar — language toggle + theme toggle. LangToggle hides at
              lg+ (P8): the sticky rail carries DE/EN there instead, since
              this row is not sticky and would otherwise scroll out of
              reach — see NavRail.tsx. justify-end keeps ThemeToggle at the
              right edge once LangToggle's wrapper leaves the flex row. */}
          <div className="mb-10 flex items-center justify-between lg:justify-end">
            <div className="lg:hidden">
              <LangToggle current="de" />
            </div>
            <ThemeToggle />
          </div>

          {/* Header — Hero. P1 (2026-09-11), live, UNANTASTBAR for this P2 IA
          pass: copy, buttons, meta and schema jobTitle stay exactly as
          shipped. Only the sections below this point were reordered. */}
      <header className="hero-glow mb-12 sm:mb-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.03em] text-text sm:text-[2.4rem]">
              Freelance Technical Product Owner
            </h1>
            <p className="mt-3 text-lg font-medium text-text sm:text-xl">
              German Rauhut
            </p>
            <p className="mt-3 text-base text-text-muted sm:text-lg">
              Enterprise-Programme live bringen — Anforderung, Test, Release,
              verteilte Teams. KI-Delivery aus eigener Produktsicht, nicht
              als Folien-Beratung.
            </p>
            <p className="mt-4 text-sm text-text-muted">
              Stuttgart · remote DACH · 10 Jahre Mercedes-Benz-Ökosystem ·
              selbstständig seit 10/2025 ·{" "}
              <span className="font-medium text-text">{AVAILABILITY.de}</span>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://calendly.com/rauhut/20min?utm_source=rauhut-com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-text px-5 py-2.5 text-sm font-medium text-bg no-underline transition-colors duration-150 hover:bg-accent-hover hover:text-bg hover:no-underline"
              >
                Mandat besprechen (20 Min)
              </a>
              <a
                href={CONTACT_MAILTO.de}
                className="inline-flex items-center justify-center rounded-lg border border-border-strong px-5 py-2.5 text-sm font-medium text-text no-underline transition-colors duration-150 hover:border-accent hover:text-accent-hover hover:no-underline"
              >
                E-Mail
              </a>
            </div>
          </div>
          <FounderPhoto />
        </div>
      </header>

      {/* Zusammenfassung — first content block after the hero (P0/IA
          2026-09-11 b: rauhut.com sells the PERSON for a freelance mandate,
          so this is neither Neckarshore nor a product list). No leading
          <hr/> here — matches the original header→first-block rhythm,
          where the header's own bottom margin provides the gap. */}
      <Reveal className="pb-20 sm:pb-24" aria-labelledby="zusammenfassung-label">
        <p id="zusammenfassung-label" className="text-xs font-medium uppercase tracking-widest text-brand-amber">
          Zusammenfassung
        </p>
        <h2 id="zusammenfassung" className="mt-2 mb-6 text-2xl font-semibold">
          Konzern-Erfahrung, hands-on KI
        </h2>
        <p className="text-lg leading-relaxed">
          Brückenbauer zwischen Business und Technologie — mit 10+ Jahren
          Erfahrung in internationalen Automotive-Projekten (Mercedes-Benz) und
          einer zweiten Karriere als AI-Produktentwickler. Heute verbinde ich
          Anforderungs- und Testmanagement aus der Konzernwelt mit hands-on AI
          Engineering: eigene Produkte, Multi-Agent-Entwicklungsprozesse,
          Full-Stack-Umsetzung.
        </p>
        <StatsRow lang="de" />
        <div className="mt-10 sm:mt-12">
          <p className="text-sm font-semibold text-text">
            Tätig bei / für
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-text-muted">
            Mercedes-Benz · IBM · Deutsche Bank · Allianz · Gothaer · Contargo · Rhenus AG · Regional Container Lines · plenum · Targens · TestGilde
          </p>
        </div>
      </Reveal>

      <hr />

      {/* Angebote — P3 (2026-09-11 d, Founder brief): purchasing sees in 10
          seconds what it can book, directly after Zusammenfassung/
          Kennzahlen/Herkunftssatz/Kundenzeile and before Kernkompetenzen.
          One lead offer with the page's second filled-Primary CTA (same
          Calendly as the hero, same utm_source=rauhut-com, on purpose);
          the other two are visually weaker (outline / plain text link).
          The fuller KI-Potenzialanalyse section further down is untouched
          — Card 3 here is a teaser for it, not a replacement. */}
      <Reveal className="py-20 sm:py-24" aria-labelledby="angebote">
        <p className="text-xs font-medium uppercase tracking-widest text-brand-amber">
          Angebote
        </p>
        <h2
          id="angebote"
          className="mt-2 text-2xl font-semibold"
        >
          Was Sie buchen können
        </h2>
        <Offers lang="de" />
      </Reveal>

      <hr />

      {/* Kernkompetenzen */}
      <Reveal className="py-20 sm:py-24" aria-labelledby="kernkompetenzen-label">
        <p id="kernkompetenzen-label" className="text-xs font-medium uppercase tracking-widest text-brand-amber">
          Kernkompetenzen
        </p>
        <h2 id="kernkompetenzen" className="mt-2 mb-8 text-2xl font-semibold">
          Was ich mitbringe
        </h2>
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
              <td>
                Anforderungsmanagement — Grobkonzept bis technische Story
              </td>
            </tr>
            <tr>
              <td>
                AI Product Development — Multi-Agent-Architekturen,
                LLM-Integration, Prompt Engineering
              </td>
              <td>
                Projektmanagement — klassisch &amp; agil, internationale Teams
              </td>
            </tr>
            <tr>
              <td>
                Full-Stack Engineering — NestJS, TypeScript, PostgreSQL, Redis,
                Docker
              </td>
              <td>
                Testmanagement — E2E, API, Automatisierung, Teststrategie
              </td>
            </tr>
            <tr>
              <td>DevOps &amp; CI/CD — GitHub Actions, Vercel, Monitoring</td>
              <td>Enterprise-Beratung — ITSM, Release Mgmt, Change Mgmt</td>
            </tr>
          </tbody>
        </table>
      </Reveal>

      <hr />

      {/* Projekte */}
      <Reveal className="py-20 sm:py-24" aria-labelledby="projekte-label">
        <p id="projekte-label" className="text-xs font-medium uppercase tracking-widest text-brand-amber">
          Projekte
        </p>
        <h2 id="projekte" className="mt-2 mb-10 text-2xl font-semibold">
          Freelance, Mercedes-Benz, frühere Stationen
        </h2>

        {/* Freelance-Kapitel — zweigeteilt seit P4b (2026-09-11 e): der
            eine Artikel "Neckarshore AI — Aufbau eigener AI-Produkte" ist
            jetzt zwei Kapitel unter derselben Overline. Kapitel 1 ist das
            Mandat (Technical Product Owner), Kapitel 2 ist die Produkt-
            Taxonomie ("Was ich baue") — Vorbild neckarshore.ai/products.
            Die spätere "Eigene Produkte"-Section mit den klickbaren
            Produkt-Kacheln bleibt unangetastet; dieses Kapitel ist Prosa,
            keine Duplikat-Navigation. */}
        <article className="mb-14">
          <header className="mb-4">
            <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
              Seit 10/2025 · Freelance
            </p>
          </header>

          {/* Kapitel 1 — Technical Product Owner (Mandat) */}
          <div>
            <h3 className="text-lg font-semibold">
              Technical Product Owner
            </h3>
            <p className="mt-3 leading-relaxed text-text">
              Seit Oktober 2025 selbstständig. Mandate in Anforderung, Test
              und Release — remote DACH, Konzernmaßstab. Programme, die live
              gehen müssen: Backlog, verteilte Teams, Delivery bis Abnahme.
            </p>
            <p className="mt-4 leading-relaxed text-text">
              Fundament: 10 Jahre Mercedes-Benz-Ökosystem — PLUS NextGen
              (Stammdatenprodukt MData, Team Südafrika), SFMd (50.000+ KPI,
              2-Wochen-Release), Test und Abnahme. Dieselbe Arbeit, ohne
              Folienberatung; die Praxis hängt an den eigenen Produkten
              darunter.
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-relaxed marker:text-text-muted">
              <li>
                <strong className="font-semibold">
                  Anforderung &amp; Backlog
                </strong>{" "}
                — Grobkonzept bis technische Story, Priorisierung, Abstimmung
                Business/IT.
              </li>
              <li>
                <strong className="font-semibold">
                  Test, Release, Abnahme
                </strong>{" "}
                — Strategie, Automatisierung, Release-Takt. Die letzte Meile,
                an der Programme hängen.
              </li>
              <li>
                <strong className="font-semibold">Verteilte Teams</strong> —
                Delivery mit Teams on- und offshore, klarer Handoff,
                Verantwortung bis live.
              </li>
            </ul>
            {/* Plain text on purpose — kein zweiter Primary-Button, Calendly
                bleibt Hero + Angebotskarte (Founder-Regel P4b). */}
            <p className="mt-4 text-sm text-text-subtle">
              Buchbar über „Mandat besprechen“.
            </p>
          </div>

          {/* Kapitel 2 — Was ich baue (Produkt-Taxonomie) */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold">
              Was ich baue
            </h3>
            <p className="mt-3 leading-relaxed text-text">
              Dieselbe Arbeitsweise wie unter Neckarshore AI: KI-beschleunigt,
              DSGVO-by-Design. Ein Flagship, MMPs, native iOS, Skills —
              Websites entstehen nebenbei.
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-relaxed marker:text-text-muted">
              <li>
                <strong className="font-semibold">
                  Multi-Agent-Entwicklungsprozess
                </strong>{" "}
                — 23 spezialisierte Agenten (Architektur, Implementation,
                Security, Refactoring, Marketing), strukturierter Handoff,
                parallele Ausführung, automatisierte Qualitätssicherung. Die
                Bauweise hinter allem darunter.
              </li>
              <li>
                <strong className="font-semibold">
                  Flagship — Omnopsis Documentor+X
                </strong>{" "}
                — Dokumentations-Engine für Engineering-Teams. Compliance-,
                Technik- und Release-Dokumentation aus Git, Jira und
                Confluence. 905 Tests, 96 API-Endpoints.
              </li>
              <li>
                <strong className="font-semibold">MMPs</strong> — Minimum
                Marketable Products: scharf geschnittene, marktreife
                Werkzeuge. Schlägt eines durch, wird es zum Hauptprodukt.
                Live unter anderem md-viewer, TrustScope, ClearPath.
              </li>
              <li>
                <strong className="font-semibold">Native iOS</strong> — Kaze
                und MuscleCat. Nativ mit Swift, Xcode und Claude, inklusive
                Testautomation. In Entwicklung, demnächst im App Store. Nicht
                Web-Wrapper.
              </li>
              <li>
                <strong className="font-semibold">Skills</strong> — eine
                Flotte Claude-Skills für Entwicklung, Businessprozesse und
                private Anwendungsfälle. Aktive Linien: Obsidian Vault
                Autopilot, IMAP Autopilot, Paperless Autopilot, Photo
                Autopilot und Social Scrapers. Trockenlauf zuerst — nichts
                fliegt ungeprüft.
              </li>
              <li>
                <strong className="font-semibold">Websites</strong> —
                nebenbei, dieselbe Bauweise: diese Seite, neckarshore.ai,
                Kundenauftritte.
              </li>
            </ul>
            <p className="mt-4 text-sm text-text-subtle">
              Überblick:{" "}
              <a
                href="https://neckarshore.ai/products"
                target="_blank"
                rel="noopener noreferrer"
              >
                neckarshore.ai/products
              </a>
            </p>

            {/* Stack — acht gruppierte Zeilen, keine Komma-Wurst. */}
            <dl className="mt-6 grid grid-cols-[7rem_1fr] gap-x-4 gap-y-1.5 text-sm text-text-muted">
              <dt className="font-medium text-text">Runtime</dt>
              <dd>TypeScript, NestJS, Next.js, React, PostgreSQL, Neon, Redis/BullMQ, Python</dd>
              <dt className="font-medium text-text">UI</dt>
              <dd>Tailwind CSS, shadcn/ui</dd>
              <dt className="font-medium text-text">Auth</dt>
              <dd>Zitadel, NextAuth</dd>
              <dt className="font-medium text-text">Delivery</dt>
              <dd>Vercel, GitHub Actions, Docker</dd>
              <dt className="font-medium text-text">Qualität</dt>
              <dd>Vitest, Playwright, XCTest, Swift Testing</dd>
              <dt className="font-medium text-text">iOS</dt>
              <dd>Swift, Xcode, App Store</dd>
              <dt className="font-medium text-text">Agenten</dt>
              <dd>Anthropic / Claude Code (Haiku, Sonnet, Opus, Fable) · xAI / Grok · OpenAI / Codex</dd>
              <dt className="font-medium text-text">Integrationen</dt>
              <dd>Jira, Confluence, Git, Apify, Slack, ElevenLabs, Groq, Stripe, Resend</dd>
            </dl>
          </div>
        </article>

        <article className="mb-14">
          <header className="mb-4">
            <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
              07/2015 – 10/2025 · Angestellt &amp; extern
            </p>
            <h3 className="mt-1 text-lg font-semibold">
              Mercedes-Benz AG &amp; Umfeld
            </h3>
          </header>
          <p className="mb-6 leading-relaxed text-text">
            10 Jahre im Mercedes-Benz-Ökosystem — Einstieg als Senior
            Business Analyst, dann Agile Coach, Plant Relationship Manager,
            Change Management Team &amp; Technical Product Owner; agil,
            international, Verantwortung bis live.
          </p>
          <Timeline lang="de" />
          <p className="mt-6 text-sm text-text-subtle">
            Übergreifend: SCRUM, JIRA, Confluence, REST-APIs, Postman, JSON,
            ServiceNow, Katalon (Selenium), MS SQL Server, Adobe AEM
          </p>
        </article>

        <details>
          <summary>Frühere Stationen (1993 – 2015)</summary>

          <div className="space-y-6 text-base leading-relaxed text-text">
            <p>
              Vor Mercedes-Benz: 23 Jahre Laufbahn — Wehrdienst bei der Luftwaffe 1992,
              dann Consulting, Softwareentwicklung und operative Führungsrollen in
              Deutschland, Schweiz und Thailand. Zum Start des Berufslebens 1993
              gleich nach Bangkok.
            </p>

            <table>
              <thead>
                <tr>
                  <th scope="col">Zeitraum</th>
                  <th scope="col">Rolle</th>
                  <th scope="col">Kontext</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>07/2014 – 06/2015</td>
                  <td>Senior PM Compliance</td>
                  <td>
                    Targens (ehemals Cellent Finance Solutions), Stuttgart —
                    spezialisierte AML-Anwendung
                  </td>
                </tr>
                <tr>
                  <td>10/2011 – 06/2014</td>
                  <td>Business IT Consultant</td>
                  <td>Contargo AG, Basel — Speditionssoftware 4ward</td>
                </tr>
                <tr>
                  <td>10/2013 – 12/2013</td>
                  <td>Business IT Consultant</td>
                  <td>
                    Deutsche Bank, Frankfurt — Embargo-Filtering-Prozesse
                  </td>
                </tr>
                <tr>
                  <td>06/2010 – 07/2013</td>
                  <td>Teilprojektleiter</td>
                  <td>Allianz AMOS — AML Softwareimplementierung</td>
                </tr>
                <tr>
                  <td>04/2007 – 03/2010</td>
                  <td>Business IT Consultant</td>
                  <td>
                    Regional Container Lines (RCL), Bangkok — ERP
                    Implementierung
                  </td>
                </tr>
                <tr>
                  <td>03/2007</td>
                  <td>Business IT Consultant</td>
                  <td>Contargo, Ludwigshafen — CRM-Auswahl</td>
                </tr>
                <tr>
                  <td>08/2006 – 01/2007</td>
                  <td>Business IT Consultant</td>
                  <td>BMT AG, Basel — Standardsoftware M+R</td>
                </tr>
                <tr>
                  <td>03/2004 – 06/2006</td>
                  <td>Senior eBusiness Consultant</td>
                  <td>Rhenus AG — ERP &amp; Terminal Management System</td>
                </tr>
                <tr>
                  <td>02/2001 – 02/2004</td>
                  <td>Senior Consultant</td>
                  <td>plenum Systems — CRM Banken &amp; Versicherung</td>
                </tr>
                <tr>
                  <td>10/2000 – 01/2001</td>
                  <td>Softwareentwickler</td>
                  <td>EDM Müller + Partner — Reporting-System</td>
                </tr>
                <tr>
                  <td>07/1996 – 06/2000</td>
                  <td>Manager Software Development</td>
                  <td>
                    SoftControl Co., Ltd, Bangkok — Business Software &amp;
                    Internetprogrammierung, Aufbau und Leitung der Entwicklung
                  </td>
                </tr>
                <tr>
                  <td>08/1994 – 12/1994</td>
                  <td>IT Consultant</td>
                  <td>
                    SoftControl Co., Ltd, Bangkok — Business
                    Softwareentwicklung
                  </td>
                </tr>
                <tr>
                  <td>03/1993 – 06/1996</td>
                  <td>Factory / Procurement / Production Manager</td>
                  <td>Operative Führungsrollen in Thailand</td>
                </tr>
                <tr>
                  <td>1992</td>
                  <td>Wehrdienst, Luftwaffe</td>
                  <td>
                    Programmierzentrum der Luftwaffe für fliegende Waffensysteme
                    (ProgrZLwflgWS) —{" "}
                    <a
                      href="https://de.wikipedia.org/wiki/Welfen-Kaserne_(Landsberg_am_Lech)"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Welfen-Kaserne, Landsberg am Lech
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </Reveal>

      {/* P5b (2026-09-12, Founder brief): the "Eigene Produkte" tile block
          (ProjectTiles) and the "KI-Potenzialanalyse" bridge section both
          removed from here — both were evidence/upsell blocks now fully
          redundant with content that already exists elsewhere: the product
          list in the Freelance-Kapitel's "Was ich baue" above (incl. the
          neckarshore.ai/products link), and the KI-Potenzialanalyse OFFER
          CARD in Angebote (unchanged, stays as Card 3 there). Frühere
          Stationen now goes directly into Kontakt — single <hr/>, no empty
          shell, no new subheading. See ProjectTiles.tsx (component deleted,
          it had no other caller) and tests/e2e/site.spec.ts for the removed
          coverage. */}
      <hr />

      {/* Kontakt */}
      <Reveal className="py-20 sm:py-24" aria-labelledby="kontakt-label">
        <p id="kontakt-label" className="text-xs font-medium uppercase tracking-widest text-brand-amber">
          Kontakt
        </p>
        <h2 id="kontakt" className="mt-2 mb-6 text-2xl font-semibold">
          Sprechen wir
        </h2>
        {/* P6-lead (2026-09-12): closing lead before the channels — no
            second "Mandat besprechen" button here, that CTA already lives
            in the hybrid nav rail/bar (P8); this is text only. */}
        <p className="mb-8 max-w-xl text-base leading-relaxed text-text">
          Ab sofort buchbar — Mandate in Anforderung, Test und Release,
          remote DACH. 20 Minuten über „Mandat besprechen“, sonst kurz per
          Mail oder Formular.
        </p>
        <ContactCards lang="de" />

        <div className="mt-10 max-w-xl">
          <p className="mb-5 text-base text-text-subtle">
            Ohne Kalender — schreiben Sie mir direkt:
          </p>
          <ContactForm lang="de" />
        </div>
      </Reveal>

      <hr />

      {/* Footer */}
      <footer className="pt-10 pb-4 text-sm text-text-subtle">
        <p>
          © {new Date().getFullYear()} German Rauhut ·{" "}
          <a href="/impressum">Impressum</a> ·{" "}
          <a href="/datenschutz">Datenschutz</a> ·{" "}
          <a href="/designs" rel="nofollow">
            Designs
          </a>{" "}
          ·{" "}
          <a href="/stylesheet" rel="nofollow">
            Stylesheet
          </a>
        </p>
      </footer>
        </main>

        <NavRail lang="de" />
      </div>
    </>
  );
}
