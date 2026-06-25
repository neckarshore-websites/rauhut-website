import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Impressum — rauhut.com",
  description: "Angaben gemäß § 5 TMG",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://rauhut.com/impressum" },
};

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      {/* Top bar — back link + theme toggle */}
      <div className="mb-10 flex items-center justify-between">
        <p className="text-sm">
          <Link href="/">← Zur Startseite</Link>
        </p>
        <ThemeToggle />
      </div>

      <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
        Rechtliches
      </p>
      <h1 className="mt-3 text-[1.6rem] font-semibold tracking-tight text-text sm:text-[2rem]">
        Impressum
      </h1>
      <p className="mt-4 text-sm text-text-subtle">
        Angaben gemäß § 5 TMG
      </p>

      <hr className="my-12" />

      <section className="space-y-10 text-[0.9375rem] leading-relaxed">
        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-text-muted">
            Betreiber
          </h2>
          <p>
            German Rauhut
            <br />
            Stuttgart
            <br />
            Deutschland
          </p>
          <p className="mt-3 text-sm text-text-subtle">
            Die vollständige Postanschrift stelle ich auf Anfrage zur Verfügung.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-text-muted">
            Kontakt
          </h2>
          <p>
            E-Mail:{" "}
            <a href="mailto:german@rauhut.com">german@rauhut.com</a>
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-text-muted">
            Verantwortlich für den Inhalt
          </h2>
          <p>German Rauhut, Anschrift wie oben.</p>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-text-muted">
            Haftung für Inhalte
          </h2>
          <p className="text-text-muted">
            Die Inhalte dieser Seite wurden mit größter Sorgfalt erstellt. Für
            die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann
            jedoch keine Gewähr übernommen werden. Als Diensteanbieter bin ich
            gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
            allgemeinen Gesetzen verantwortlich.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-text-muted">
            Haftung für Links
          </h2>
          <p className="text-text-muted">
            Externe Links auf dieser Seite (z. B. LinkedIn, GitHub) führen zu
            Inhalten fremder Anbieter. Für deren Inhalte ist stets der jeweilige
            Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten
            Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
            Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt
            der Verlinkung nicht erkennbar.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-text-muted">
            Datenschutz
          </h2>
          <p className="text-text-muted">
            Diese Website setzt keine Cookies. Beim Aufruf werden technisch
            notwendige Server-Logs (IP-Adresse, Zeitpunkt, User-Agent) temporär
            durch den Hosting-Anbieter erfasst. Einzelheiten zur
            Datenverarbeitung — einschließlich der cookiefreien Webanalyse —
            finden Sie in der{" "}
            <Link href="/datenschutz">Datenschutzerklärung</Link>.
          </p>
        </div>
      </section>

      <hr className="mt-16 mb-10" />

      {/* Back-link bottom — Name-as-linktext */}
      <p className="mb-4 text-sm">
        <Link href="/">← German Rauhut</Link>
      </p>
    </main>
  );
}
