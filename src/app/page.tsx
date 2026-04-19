import FounderPhoto from "@/components/FounderPhoto";
import ProjectTiles from "@/components/ProjectTiles";
import ThemeToggle from "@/components/ThemeToggle";
import LangToggle from "@/components/LangToggle";
import StatsRow from "@/components/StatsRow";
import Reveal from "@/components/Reveal";
import ContactCards from "@/components/ContactCards";
import Timeline from "@/components/Timeline";
import PersonJsonLd from "@/components/PersonJsonLd";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      {/* Schema.org Person — emitted as raw JSON-LD in the HTML source
          (native <script> tag, not next/script — see AD-19). */}
      <PersonJsonLd lang="de" />

      {/* Top bar — language toggle + theme toggle */}
      <div className="mb-10 flex items-center justify-between">
        <LangToggle current="de" />
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
              Diplom-Betriebswirt (BA Stuttgart, Fachrichtung Datenverarbeitung)
            </p>
          </div>
          <FounderPhoto />
        </div>
      </header>

      {/* Project Tiles — Neckarshore + Obsidian Vault Autopilot */}
      <div className="mb-16 sm:mb-20">
        <ProjectTiles />
      </div>

      <hr />

      {/* Zusammenfassung */}
      <Reveal className="py-16 sm:py-20" aria-labelledby="zusammenfassung">
        <h2
          id="zusammenfassung"
          className="mb-6 text-xs font-medium uppercase tracking-widest text-brand-amber"
        >
          Zusammenfassung
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
          <p className="text-[0.6875rem] font-medium uppercase tracking-widest text-text-subtle">
            Tätig bei / für
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-text-muted">
            Mercedes-Benz · IBM · Deutsche Bank · Allianz · Gothaer · Contargo · Rhenus AG · Regional Container Lines · plenum · Targens · TestGilde
          </p>
        </div>
      </Reveal>

      <hr />

      {/* Kernkompetenzen */}
      <Reveal className="py-16 sm:py-20" aria-labelledby="kernkompetenzen">
        <h2
          id="kernkompetenzen"
          className="mb-8 text-xs font-medium uppercase tracking-widest text-brand-amber"
        >
          Kernkompetenzen
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
              <td>
                AI Product Development — Multi-Agent-Architekturen,
                LLM-Integration, Prompt Engineering
              </td>
              <td>
                Anforderungsmanagement — Grobkonzept bis technische Story
              </td>
            </tr>
            <tr>
              <td>Technical Product Ownership — Vision, Backlog, Delivery</td>
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
      <Reveal className="py-16 sm:py-20" aria-labelledby="projekte">
        <h2
          id="projekte"
          className="mb-10 text-xs font-medium uppercase tracking-widest text-brand-amber"
        >
          Projekte
        </h2>

        <article className="mb-14">
          <header className="mb-4">
            <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
              Seit 10/2025 · Freelance
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">
              Neckarshore AI — Technical Product Owner &amp; AI Product Builder
            </h3>
          </header>
          <p className="mb-5 leading-relaxed text-text-muted">
            Aufbau eigener AI-Produkte und Open-Source-Tools. Hands-on
            Engineering kombiniert mit Product Ownership.
          </p>
          <ul className="space-y-3 text-[0.9375rem] leading-relaxed">
            <li>
              <strong className="font-semibold">Omnopsis Documentor</strong> —
              AI-gestützte Dokumentations-Engine. Generierung von Compliance-,
              Technik- und Release-Dokumentation aus Git, Jira und Confluence.
              466 Tests, 95 API-Endpoints, RBAC, Monitoring-Stack.
            </li>
            <li>
              <strong className="font-semibold">
                Obsidian Vault Autopilot
              </strong>{" "}
              — Open-Source-Plugin für automatisiertes Wissensmanagement
              (Markdown, YAML Frontmatter, Obsidian API). Kurz vor Public Launch
              auf GitHub.
            </li>
            <li>
              <strong className="font-semibold">
                KI-gestützter Multi-Agent-Entwicklungsprozess
              </strong>{" "}
              — 12+ spezialisierte AI-Agenten (Architektur, Implementation,
              Security, Refactoring, Marketing) mit strukturiertem
              Handoff-Protokoll, paralleler Ausführung und automatisierter
              Qualitätssicherung.
            </li>
          </ul>
          <p className="mt-5 text-sm text-text-subtle">
            Stack: NestJS, TypeScript, PostgreSQL, Redis/BullMQ, Next.js, Claude
            Code (Opus), Docker, GitHub Actions, Vercel
          </p>
        </article>

        <article className="mb-14">
          <header className="mb-4">
            <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
              07/2015 – 10/2025 · Angestellt &amp; extern
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">
              Mercedes-Benz AG &amp; Umfeld
            </h3>
          </header>
          <p className="mb-6 leading-relaxed text-text-muted">
            10 Jahre im Mercedes-Benz-Ökosystem — vom Tester über den Business
            IT Consultant zum Technical Product Owner. Durchgehend in agilen,
            internationalen Projekten mit wachsender Verantwortung für Produkt,
            Architektur und Prozess.
          </p>
          <Timeline lang="de" />
          <p className="mt-6 text-sm text-text-subtle">
            Übergreifend: SCRUM, JIRA, Confluence, REST-APIs, Postman, JSON,
            ServiceNow, Katalon (Selenium), MS SQL Server, Adobe AEM
          </p>
        </article>

        <details>
          <summary>Frühere Stationen (1993 – 2015)</summary>

          <div className="space-y-6 text-[0.9375rem] leading-relaxed text-text-muted">
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

      <hr />

      {/* Kontakt */}
      <Reveal className="py-16 sm:py-20" aria-labelledby="kontakt">
        <h2
          id="kontakt"
          className="mb-6 text-xs font-medium uppercase tracking-widest text-brand-amber"
        >
          Kontakt
        </h2>
        <ContactCards lang="de" />
      </Reveal>

      <hr />

      {/* Footer */}
      <footer className="pt-10 pb-4 text-sm text-text-subtle">
        <p>
          © {new Date().getFullYear()} German Rauhut ·{" "}
          <a href="/impressum">Impressum</a>
        </p>
      </footer>
    </main>
  );
}
