import type { Metadata } from "next";
import FounderPhoto from "@/components/FounderPhoto";
import ProjectTiles from "@/components/ProjectTiles";
import ThemeToggle from "@/components/ThemeToggle";
import LangToggle from "@/components/LangToggle";
import StatsRow from "@/components/StatsRow";
import Reveal from "@/components/Reveal";
import ContactCards from "@/components/ContactCards";
import Timeline from "@/components/Timeline";
import PersonJsonLd from "@/components/PersonJsonLd";
import Offers from "@/components/Offers";
import { AVAILABILITY } from "@/lib/availability";

export const metadata: Metadata = {
  title: "German Rauhut — Freelance Technical Product Owner",
  description:
    "Freelance Technical Product Owner based in Stuttgart. 10 years in the Mercedes-Benz ecosystem. Available for mandates in requirements, test and release.",
  openGraph: {
    title: "German Rauhut — Freelance Technical Product Owner",
    description:
      "Freelance Technical Product Owner based in Stuttgart. 10 years in the Mercedes-Benz ecosystem. Available for mandates in requirements, test and release.",
    url: "https://rauhut.com/en",
    siteName: "rauhut.com",
    locale: "en_US",
    type: "website",
    // Next.js Metadata API REPLACES (not merges) openGraph when a child
    // segment redefines it, which bypasses the opengraph-image.tsx
    // file-convention auto-fill cascade. We re-emit images here so /en
    // gets the same OG card as /. twitter.images inherits via the
    // twitter.images→openGraph.images cascade. Same pattern as oakwood
    // pageOpenGraph (D-LIN-20-3, 2026-05-20).
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "German Rauhut — Freelance Technical Product Owner",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "German Rauhut — Freelance Technical Product Owner",
    description:
      "Freelance Technical Product Owner based in Stuttgart. 10 years in the Mercedes-Benz ecosystem. Available for mandates in requirements, test and release.",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://rauhut.com/en",
    languages: {
      "de-DE": "https://rauhut.com/",
      "en-US": "https://rauhut.com/en",
      "x-default": "https://rauhut.com/",
    },
  },
};

export default function HomePageEN() {
  return (
    // lang="en" on <main> signals English subtree to screen readers
    // without needing to refactor into [locale]/layout.tsx. Root <html>
    // keeps lang="de" as site default.
    <main lang="en" className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      {/* Schema.org Person — emitted as raw JSON-LD in the HTML source
          (native <script> tag, not next/script — see AD-19). */}
      <PersonJsonLd lang="en" />

      {/* Top bar — language toggle + theme toggle */}
      <div className="mb-10 flex items-center justify-between">
        <LangToggle current="en" />
        <ThemeToggle />
      </div>

      {/* Header — Hero. P1 (2026-09-11), live, UNTOUCHABLE for this P2 IA
          pass: copy, buttons, meta and schema jobTitle stay exactly as
          shipped. Only the sections below this point were reordered. */}
      <header className="hero-glow mb-12 sm:mb-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight text-brand-teal sm:text-[2.4rem]">
              German Rauhut
            </h1>
            <p className="mt-3 text-lg font-medium text-text sm:text-xl">
              Freelance Technical Product Owner
            </p>
            <p className="mt-2 text-base text-text-muted sm:text-lg">
              Getting enterprise programmes live — requirements, test,
              release, distributed teams.
            </p>
            <p className="mt-2 text-sm text-text-subtle">
              AI delivery from shipping my own products — not slide-deck
              consulting.
            </p>
            <p className="mt-4 text-sm text-text-subtle">
              Stuttgart · remote DACH · 10 years Mercedes-Benz ecosystem ·
              independent since Oct 2025
            </p>
            <p className="mt-1 text-sm font-medium text-brand-teal">
              {AVAILABILITY.en}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://calendly.com/rauhut/20min?utm_source=rauhut-com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-text px-5 py-2.5 text-sm font-medium text-bg no-underline transition-colors duration-150 hover:bg-accent-hover hover:text-bg hover:no-underline"
              >
                Discuss a mandate (20 min)
              </a>
              <a
                href="mailto:german@rauhut.com"
                className="inline-flex items-center justify-center rounded-lg border border-border-strong px-5 py-2.5 text-sm font-medium text-text no-underline transition-colors duration-150 hover:border-accent hover:text-accent-hover hover:no-underline"
              >
                Email
              </a>
            </div>
          </div>
          <FounderPhoto />
        </div>
      </header>

      {/* About — first content block after the hero (P0/IA 2026-09-11 b:
          rauhut.com sells the PERSON for a freelance mandate, so this is
          neither Neckarshore nor a product list). No leading <hr/> here —
          matches the original header→first-block rhythm, where the header's
          own bottom margin provides the gap. */}
      <Reveal className="pb-16 sm:pb-20" aria-labelledby="about">
        <h2
          id="about"
          className="mb-6 text-xs font-medium uppercase tracking-widest text-brand-amber"
        >
          About
        </h2>
        <p className="text-lg leading-relaxed">
          Bridge-builder between business and technology — with 10+ years
          of experience in international automotive projects
          (Mercedes-Benz) and a second career as an AI product builder.
          Today I combine requirements and test management from the
          corporate world with hands-on AI engineering: own products,
          multi-agent development processes, full-stack delivery.
        </p>
        <StatsRow lang="en" />
        <div className="mt-10 sm:mt-12">
          <p className="text-[0.6875rem] font-medium uppercase tracking-widest text-text-subtle">
            Worked for
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-text-muted">
            Mercedes-Benz · IBM · Deutsche Bank · Allianz · Gothaer · Contargo · Rhenus AG · Regional Container Lines · plenum · Targens · TestGilde
          </p>
        </div>
      </Reveal>

      <hr />

      {/* Offers — P3 (2026-09-11 d, Founder brief): purchasing sees in 10
          seconds what it can book, directly after About/StatsRow/origin
          sentence/"Worked for" and before Core Competencies. One lead
          offer with the page's second filled-Primary CTA (same Calendly
          as the hero, same utm_source=rauhut-com, on purpose); the other
          two are visually weaker (outline / plain text link). The fuller
          AI potential analysis section further down is untouched — Card 3
          here is a teaser for it, not a replacement. */}
      <Reveal className="py-16 sm:py-20" aria-labelledby="offers">
        <p className="text-xs font-medium uppercase tracking-widest text-brand-amber">
          Offers
        </p>
        <h2
          id="offers"
          className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          What you can book
        </h2>
        <Offers lang="en" />
      </Reveal>

      <hr />

      {/* Core Competencies */}
      <Reveal className="py-16 sm:py-20" aria-labelledby="competencies">
        <h2
          id="competencies"
          className="mb-8 text-xs font-medium uppercase tracking-widest text-brand-amber"
        >
          Core Competencies
        </h2>
        <table>
          <thead>
            <tr>
              <th scope="col" className="w-1/2">
                Today
              </th>
              <th scope="col" className="w-1/2">
                Foundation
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Technical Product Ownership — vision, backlog, delivery
              </td>
              <td>
                Requirements Management — from rough concept to technical
                story
              </td>
            </tr>
            <tr>
              <td>
                AI Product Development — multi-agent architectures, LLM
                integration, prompt engineering
              </td>
              <td>
                Project Management — classic &amp; agile, international
                teams
              </td>
            </tr>
            <tr>
              <td>
                Full-Stack Engineering — NestJS, TypeScript, PostgreSQL,
                Redis, Docker
              </td>
              <td>
                Test Management — E2E, API, automation, test strategy
              </td>
            </tr>
            <tr>
              <td>DevOps &amp; CI/CD — GitHub Actions, Vercel, monitoring</td>
              <td>
                Enterprise Consulting — ITSM, Release Mgmt, Change Mgmt
              </td>
            </tr>
          </tbody>
        </table>
      </Reveal>

      <hr />

      {/* Projects */}
      <Reveal className="py-16 sm:py-20" aria-labelledby="projects">
        <h2
          id="projects"
          className="mb-10 text-xs font-medium uppercase tracking-widest text-brand-amber"
        >
          Projects
        </h2>

        {/* Freelance chapter — split into two since P4b (2026-09-11 e): the
            one "Neckarshore AI — building my own AI products" article is
            now two chapters under the same overline. Chapter 1 is the
            mandate (Technical Product Owner), Chapter 2 is the product
            taxonomy ("What I build") — modelled on
            neckarshore.ai/products. The later "Own Products" section with
            the clickable product tiles stays untouched; this chapter is
            prose, not duplicate navigation. */}
        <article className="mb-14">
          <header className="mb-4">
            <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
              Since 10/2025 · Freelance
            </p>
          </header>

          {/* Chapter 1 — Technical Product Owner (the mandate) */}
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              Technical Product Owner
            </h3>
            <p className="mt-3 leading-relaxed text-text-muted">
              Independent since October 2025. Mandates in requirements, test
              and release — remote DACH, enterprise scale. Programmes that
              have to go live: backlog, distributed teams, delivery through
              acceptance.
            </p>
            <p className="mt-4 leading-relaxed text-text-muted">
              Foundation: ten years in the Mercedes-Benz ecosystem — PLUS
              NextGen (master data/ACL, team in South Africa), SFMd (50,000+
              KPIs, 2-week release), test and acceptance. The same work, not
              slide-deck consulting; the practice sits in the products
              below.
            </p>
            <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed">
              <li>
                <strong className="font-semibold">
                  Requirements &amp; backlog
                </strong>{" "}
                — from rough concept to technical story, prioritization,
                business/IT alignment.
              </li>
              <li>
                <strong className="font-semibold">
                  Test, release, acceptance
                </strong>{" "}
                — strategy, automation, release cadence. The last mile where
                programmes stall.
              </li>
              <li>
                <strong className="font-semibold">Distributed teams</strong>{" "}
                — delivery with on- and offshore teams, clear handoff,
                ownership through go-live.
              </li>
            </ul>
            {/* Plain text on purpose — no second filled-Primary button,
                Calendly stays hero + offer card (Founder rule, P4b). */}
            <p className="mt-4 text-sm text-text-subtle">
              Book via “Discuss a mandate”.
            </p>
          </div>

          {/* Chapter 2 — What I build (product taxonomy) */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold tracking-tight">
              What I build
            </h3>
            <p className="mt-3 leading-relaxed text-text-muted">
              The same way of working as under Neckarshore AI:
              AI-accelerated, GDPR-by-design. One flagship, MMPs, native
              iOS, skills — websites on the side.
            </p>
            <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed">
              <li>
                <strong className="font-semibold">
                  Multi-agent development process
                </strong>{" "}
                — 23 specialized agents (architecture, implementation,
                security, refactoring, marketing), structured handoff,
                parallel execution, automated quality assurance. The way of
                working behind everything below.
              </li>
              <li>
                <strong className="font-semibold">
                  Flagship — Omnopsis Documentor+X
                </strong>{" "}
                — documentation engine for engineering teams. Compliance,
                technical and release documentation from Git, Jira and
                Confluence. 905 tests, 96 API endpoints.
              </li>
              <li>
                <strong className="font-semibold">MMPs</strong> — Minimum
                Marketable Products: sharply scoped, market-ready tools. If
                one breaks through, it becomes a flagship. Live include
                md-viewer, TrustScope, ClearPath.
              </li>
              <li>
                <strong className="font-semibold">Native iOS</strong> — Kaze
                and MuscleCat. Native Swift, Xcode and Claude, including
                test automation. In development, coming to the App Store.
                Not web wrappers.
              </li>
              <li>
                <strong className="font-semibold">Skills</strong> — a fleet
                of Claude skills for development, business processes and
                private use cases. Active lines: Obsidian Vault Autopilot,
                IMAP Autopilot, Paperless Autopilot, Photo Autopilot and
                Social Scrapers. Dry-run first — nothing ships unreviewed.
              </li>
              <li>
                <strong className="font-semibold">Websites</strong> — on
                the side, same build: this site, neckarshore.ai, client
                sites.
              </li>
            </ul>
            <p className="mt-4 text-sm text-text-subtle">
              Overview:{" "}
              <a
                href="https://neckarshore.ai/products"
                target="_blank"
                rel="noopener noreferrer"
              >
                neckarshore.ai/products
              </a>
            </p>

            {/* Stack — eight grouped lines, not a comma string. */}
            <div className="mt-6 space-y-1.5 text-sm text-text-subtle">
              <p>
                <span className="font-medium text-text">Runtime</span> ·
                TypeScript, NestJS, Next.js, React, PostgreSQL, Neon,
                Redis/BullMQ, Python
              </p>
              <p>
                <span className="font-medium text-text">UI</span> · Tailwind
                CSS, shadcn/ui
              </p>
              <p>
                <span className="font-medium text-text">Auth</span> ·
                Zitadel, NextAuth
              </p>
              <p>
                <span className="font-medium text-text">Delivery</span> ·
                Vercel, GitHub Actions, Docker
              </p>
              <p>
                <span className="font-medium text-text">Quality</span> ·
                Vitest, Playwright, XCTest, Swift Testing
              </p>
              <p>
                <span className="font-medium text-text">iOS</span> · Swift,
                Xcode, App Store
              </p>
              <p>
                <span className="font-medium text-text">Agents</span> ·
                Anthropic / Claude Code (Haiku, Sonnet, Opus, Fable) · xAI /
                Grok · OpenAI / Codex
              </p>
              <p>
                <span className="font-medium text-text">Integrations</span>{" "}
                · Jira, Confluence, Git, Apify, Slack, ElevenLabs, Groq,
                Stripe, Resend
              </p>
            </div>
          </div>
        </article>

        <article className="mb-14">
          <header className="mb-4">
            <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
              07/2015 – 10/2025 · Employed &amp; external
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">
              Mercedes-Benz AG &amp; ecosystem
            </h3>
          </header>
          <p className="mb-6 leading-relaxed text-text-muted">
            10 years in the Mercedes-Benz ecosystem — from tester to
            Business IT Consultant to Technical Product Owner.
            Throughout: agile, international projects with growing
            responsibility for product, architecture, and process.
          </p>
          <Timeline lang="en" />
          <p className="mt-6 text-sm text-text-subtle">
            Overall: SCRUM, JIRA, Confluence, REST APIs, Postman, JSON,
            ServiceNow, Katalon (Selenium), MS SQL Server, Adobe AEM
          </p>
        </article>

        <details>
          <summary>Earlier roles (1992 – 2015)</summary>

          <div className="space-y-6 text-[0.9375rem] leading-relaxed text-text-muted">
            <p>
              Before Mercedes-Benz: 23 years of career — mandatory
              military service with the German Air Force in 1992, then
              consulting, software development, and operational
              leadership roles in Germany, Switzerland, and Thailand.
              Professional life started in 1993 — straight to Bangkok.
            </p>

            <table>
              <thead>
                <tr>
                  <th scope="col">Period</th>
                  <th scope="col">Role</th>
                  <th scope="col">Context</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>07/2014 – 06/2015</td>
                  <td>Senior PM Compliance</td>
                  <td>
                    Targens (formerly Cellent Finance Solutions), Stuttgart —
                    specialized AML application
                  </td>
                </tr>
                <tr>
                  <td>10/2011 – 06/2014</td>
                  <td>Business IT Consultant</td>
                  <td>
                    Contargo AG, Basel — freight forwarding software
                    4ward
                  </td>
                </tr>
                <tr>
                  <td>10/2013 – 12/2013</td>
                  <td>Business IT Consultant</td>
                  <td>
                    Deutsche Bank, Frankfurt — embargo filtering
                    processes
                  </td>
                </tr>
                <tr>
                  <td>06/2010 – 07/2013</td>
                  <td>Subproject Lead</td>
                  <td>Allianz AMOS — AML software implementation</td>
                </tr>
                <tr>
                  <td>04/2007 – 03/2010</td>
                  <td>Business IT Consultant</td>
                  <td>
                    Regional Container Lines (RCL), Bangkok — ERP
                    implementation
                  </td>
                </tr>
                <tr>
                  <td>03/2007</td>
                  <td>Business IT Consultant</td>
                  <td>Contargo, Ludwigshafen — CRM selection</td>
                </tr>
                <tr>
                  <td>08/2006 – 01/2007</td>
                  <td>Business IT Consultant</td>
                  <td>BMT AG, Basel — M+R standard software</td>
                </tr>
                <tr>
                  <td>03/2004 – 06/2006</td>
                  <td>Senior eBusiness Consultant</td>
                  <td>
                    Rhenus AG — ERP &amp; Terminal Management System
                  </td>
                </tr>
                <tr>
                  <td>02/2001 – 02/2004</td>
                  <td>Senior Consultant</td>
                  <td>
                    plenum Systems — CRM for banking &amp; insurance
                  </td>
                </tr>
                <tr>
                  <td>10/2000 – 01/2001</td>
                  <td>Software Developer</td>
                  <td>EDM Müller + Partner — reporting system</td>
                </tr>
                <tr>
                  <td>07/1996 – 06/2000</td>
                  <td>Manager Software Development</td>
                  <td>
                    SoftControl Co., Ltd, Bangkok — business software
                    &amp; internet programming, founded and led the
                    development unit
                  </td>
                </tr>
                <tr>
                  <td>08/1994 – 12/1994</td>
                  <td>IT Consultant</td>
                  <td>
                    SoftControl Co., Ltd, Bangkok — business software
                    development
                  </td>
                </tr>
                <tr>
                  <td>03/1993 – 06/1996</td>
                  <td>
                    Factory / Procurement / Production Manager
                  </td>
                  <td>
                    Operational leadership roles in Thailand
                  </td>
                </tr>
                <tr>
                  <td>1992</td>
                  <td>
                    Mandatory Military Service, German Air Force
                  </td>
                  <td>
                    Programmierzentrum der Luftwaffe für fliegende
                    Waffensysteme (ProgrZLwflgWS) —{" "}
                    <a
                      href="https://de.wikipedia.org/wiki/Welfen-Kaserne_(Landsberg_am_Lech)"
                      target="_blank"
                      rel="noopener noreferrer"
                      lang="de"
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

      <hr />

      {/* Own Products — Project Tiles. Moved here from directly under the
          hero (P2/IA 2026-09-11 b): the products are evidence for the
          mandate pitch, not the opening pitch itself. */}
      <div className="py-16 sm:py-20">
        <ProjectTiles lang="en" />
      </div>

      <hr />

      {/*
        AI potential analysis — compact bridge to the Neckarshore offer.
        Moved below Projects/Own Products and shortened (P2/IA 2026-09-11 b):
        this block used to sit directly under the hero and competed with
        "Discuss a mandate" for the visitor's first decision. Now it is
        visually subordinate — no filled button, smaller/muted second link —
        and the hero's CTA remains the page's only Primary.

        The offer page itself is German-only (`/en/ki-beratung` returns 404,
        verified 2026-08-16), so the link carries the "(German)" marker this
        page already uses for the imprint.

        This copy is a translation by Linus, not Founder-worded — unlike the
        German original it may be reworded without asking. Same `?ref=rauhut`
        marker on purpose: one value keeps the campaign measurement simple.
        The `id` stays "ai-consulting" across the rename (anchors may move
        position on the page without changing their address).
      */}
      <Reveal className="py-16 sm:py-20" aria-labelledby="ai-consulting">
        <h2
          id="ai-consulting"
          className="mb-6 text-xs font-medium uppercase tracking-widest text-brand-amber"
        >
          AI potential analysis
        </h2>
        <p className="text-lg leading-relaxed">
          What works in my own products, I pass on as an analysis — a
          workshop day that shows where AI agents carry in real processes,
          and where they do not. Scope, format and pricing are on the
          Neckarshore AI offer page.
        </p>
        <p className="mt-6">
          <span aria-hidden="true">→ </span>
          <a
            href="https://neckarshore.ai/ki-beratung?ref=rauhut"
            target="_blank"
            rel="noopener noreferrer"
          >
            AI potential analysis (German)
          </a>
        </p>
        {/*
          Calendly — weaker second link, own UTM (Founder brief 2026-09-11 b).
          `utm_source=rauhut-com-ki` keeps this entry point distinguishable
          from the hero's own Calendly CTA (`utm_source=rauhut-com`, which
          this block never touches). A LINK, never an embed — same § 7
          Datenschutzerklaerung constraint as the hero CTA. No "(German)"
          marker here, unlike the offer link above — Calendly's booking page
          follows the visitor's own locale and that has not been verified.
        */}
        <p className="mt-3 text-sm text-text-subtle">
          <span aria-hidden="true">→ </span>
          <a
            href="https://calendly.com/rauhut/20min?utm_source=rauhut-com-ki"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-subtle hover:text-text-muted"
          >
            20 min to see if the analysis is worth it
          </a>
        </p>
      </Reveal>

      <hr />

      {/* Contact */}
      <Reveal className="py-16 sm:py-20" aria-labelledby="contact">
        <h2
          id="contact"
          className="mb-6 text-xs font-medium uppercase tracking-widest text-brand-amber"
        >
          Contact
        </h2>
        <ContactCards lang="en" />
      </Reveal>

      <hr />

      {/* Footer */}
      <footer className="pt-10 pb-4 text-sm text-text-subtle">
        <p>
          © {new Date().getFullYear()} German Rauhut ·{" "}
          <a href="/impressum" lang="de">
            Imprint (German)
          </a>{" "}
          ·{" "}
          <a href="/datenschutz" lang="de">
            Privacy (German)
          </a>{" "}
          ·{" "}
          <a href="/designs" rel="nofollow">
            Designs
          </a>
        </p>
      </footer>
    </main>
  );
}
