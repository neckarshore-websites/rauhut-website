import type { Metadata } from "next";
import FounderPhoto from "@/components/FounderPhoto";
import ProjectTiles from "@/components/ProjectTiles";
import ThemeToggle from "@/components/ThemeToggle";
import LangToggle from "@/components/LangToggle";
import StatsRow from "@/components/StatsRow";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "German Rauhut — Technical Product Owner & AI Product Builder",
  description:
    "Technical Product Owner and AI Product Builder based in Stuttgart, Germany. 10+ years at Mercedes-Benz, now freelance and building AI products (Neckarshore AI, OMNIXIS Documenter, Obsidian Vault Autopilot).",
  openGraph: {
    title: "German Rauhut — Technical Product Owner & AI Product Builder",
    description:
      "Bridge-builder between business and technology. Mercedes-Benz alum, now AI Product Builder at Neckarshore AI.",
    url: "https://rauhut.com/en",
    siteName: "rauhut.com",
    locale: "en_US",
    type: "website",
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
      {/* Top bar — language toggle + theme toggle */}
      <div className="mb-10 flex items-center justify-between">
        <LangToggle current="en" />
        <ThemeToggle />
      </div>

      {/* Header */}
      <header className="hero-glow mb-12 sm:mb-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight text-brand-teal sm:text-[2.4rem]">
              German Rauhut
            </h1>
            <p className="mt-3 text-lg text-text-muted sm:text-xl">
              Technical Product Owner &amp; AI Product Builder
            </p>
            <p className="mt-1 text-sm text-text-subtle">
              Diplom-Betriebswirt · Business Information Systems, DHBW
              Stuttgart
            </p>
          </div>
          <FounderPhoto />
        </div>
      </header>

      {/* Project Tiles — Neckarshore + Obsidian Vault Autopilot */}
      <div className="mb-16 sm:mb-20">
        <ProjectTiles lang="en" />
      </div>

      <hr />

      {/* About */}
      <Reveal className="py-16 sm:py-20" aria-labelledby="about">
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
                AI Product Development — multi-agent architectures, LLM
                integration, prompt engineering
              </td>
              <td>
                Requirements Management — from rough concept to technical
                story
              </td>
            </tr>
            <tr>
              <td>
                Technical Product Ownership — vision, backlog, delivery
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

        <article className="mb-14">
          <header className="mb-4">
            <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
              Since 10/2025 · Freelance
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">
              Neckarshore AI — Technical Product Owner &amp; AI Product
              Builder
            </h3>
          </header>
          <p className="mb-5 leading-relaxed text-text-muted">
            Building my own AI products and open-source tools. Hands-on
            engineering combined with product ownership.
          </p>
          <ul className="space-y-3 text-[0.9375rem] leading-relaxed">
            <li>
              <strong className="font-semibold">OMNIXIS Documenter</strong>{" "}
              — AI-powered documentation engine. Generates compliance,
              technical, and release documentation from Git, Jira, and
              Confluence. 466 tests, 95 API endpoints, RBAC, monitoring
              stack.
            </li>
            <li>
              <strong className="font-semibold">
                Obsidian Vault Autopilot
              </strong>{" "}
              — Open-source plugin for automated knowledge management
              (Markdown, YAML frontmatter, Obsidian API). Nearing public
              launch on GitHub.
            </li>
            <li>
              <strong className="font-semibold">
                AI-powered multi-agent development process
              </strong>{" "}
              — 12+ specialized AI agents (architecture, implementation,
              security, refactoring, marketing) with structured handoff
              protocol, parallel execution, and automated quality
              assurance.
            </li>
          </ul>
          <p className="mt-5 text-sm text-text-subtle">
            Stack: NestJS, TypeScript, PostgreSQL, Redis/BullMQ, Next.js,
            Claude Code (Opus), Docker, GitHub Actions, Vercel
          </p>
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
          <p className="mb-5 leading-relaxed text-text-muted">
            10 years in the Mercedes-Benz ecosystem — from tester to
            Business IT Consultant to Technical Product Owner.
            Throughout: agile, international projects with growing
            responsibility for product, architecture, and process.
          </p>
          <ul className="space-y-4 text-[0.9375rem] leading-relaxed">
            <li>
              <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
                10/2021 – 10/2025
              </p>
              <p className="mt-0.5">
                <strong className="font-semibold">
                  Technical Product Owner
                </strong>{" "}
                — PLUS.Classic &amp; PLUS.NextGen. Product Owner for a
                master-data product (ACL) within the PLUS NextGen
                program. Agile development with a team in South Africa,
                AI prototyping, ITSM consulting, Plant Relationship
                Manager Sindelfingen.
              </p>
            </li>
            <li>
              <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
                09/2017 – 09/2021
              </p>
              <p className="mt-0.5">
                <strong className="font-semibold">
                  Senior Business IT Consultant
                </strong>{" "}
                — SFMd, group-wide digitalization of shop-floor
                management. Requirements analysis, automation of
                configuration (&gt; 50,000 KPI), test automation setup
                (Katalon/Selenium), release management on a 2-week
                cadence.
              </p>
            </li>
            <li>
              <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
                07/2015 – 08/2017
              </p>
              <p className="mt-0.5">
                <strong className="font-semibold">
                  Senior Business Analyst &amp; Tester
                </strong>{" "}
                — TestGilde GmbH, end-customer Daimler AG. International
                website for an automotive product. Requirements analysis,
                regression/progression testing, release management.
              </p>
            </li>
          </ul>
          <p className="mt-5 text-sm text-text-subtle">
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
              Entry into civilian professional life in 1993 in Bangkok.
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
                    Cellent Finance Solutions, Stuttgart — specialized
                    AML application
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

      {/* Contact */}
      <Reveal className="py-16 sm:py-20" aria-labelledby="contact">
        <h2
          id="contact"
          className="mb-6 text-xs font-medium uppercase tracking-widest text-brand-amber"
        >
          Contact
        </h2>
        <ul className="space-y-3 text-lg">
          <li>
            <span className="text-text-subtle">Email</span>{" "}
            <a href="mailto:german@rauhut.com">german@rauhut.com</a>
          </li>
          <li>
            <span className="text-text-subtle">LinkedIn</span>{" "}
            <a
              href="https://www.linkedin.com/in/german-rauhut/"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/german-rauhut
            </a>
          </li>
          <li>
            <span className="text-text-subtle">GitHub</span>{" "}
            <a
              href="https://github.com/GmanFooFoo"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/GmanFooFoo
            </a>
          </li>
        </ul>
      </Reveal>

      <hr />

      {/* Footer */}
      <footer className="pt-10 pb-4 text-sm text-text-subtle">
        <p>
          © {new Date().getFullYear()} German Rauhut ·{" "}
          <a href="/impressum" lang="de">
            Imprint (German)
          </a>
        </p>
      </footer>
    </main>
  );
}
