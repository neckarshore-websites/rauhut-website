import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — rauhut.com",
  description: "Informationen zur Datenverarbeitung gemäß Art. 13 DSGVO.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://rauhut.com/datenschutz" },
};

const labelClass =
  "mb-3 text-xs font-medium uppercase tracking-widest text-text-muted";
const linkClass = "underline underline-offset-2";

export default function DatenschutzPage() {
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
        Datenschutzerklärung
      </h1>
      <p className="mt-4 text-sm text-text-subtle">Stand: Juni 2026</p>

      <hr className="my-12" />

      <section className="space-y-10 text-[0.9375rem] leading-relaxed">
        <div>
          <h2 className={labelClass}>§ 1 · Verantwortlicher</h2>
          <p>
            German Rauhut
            <br />
            Stuttgart
            <br />
            Deutschland
          </p>
          <p className="mt-3">
            E-Mail: <a href="mailto:german@rauhut.com">german@rauhut.com</a>
          </p>
          <p className="mt-3 text-sm text-text-subtle">
            Die vollständige Postanschrift stelle ich auf Anfrage zur Verfügung.
          </p>
        </div>

        <div>
          <h2 className={labelClass}>§ 2 · Hosting</h2>
          <p>
            Diese Website wird gehostet bei Vercel Inc., 440 N Barranca Ave
            #4133, Covina, CA 91723, USA. Bei jedem Aufruf verarbeitet Vercel
            technische Zugriffsdaten (IP-Adresse, Datum/Uhrzeit, aufgerufene URL,
            Browsertyp, Referrer) in Server-Logs.
          </p>
          <p className="mt-3">
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.{" "}
            <strong>Drittlandtransfer:</strong> EU-Standardvertragsklauseln
            (Art. 46 Abs. 2 lit. c DSGVO). Datenschutz Vercel:{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              vercel.com/legal/privacy-policy
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className={labelClass}>§ 3 · Webanalyse (Vercel Web Analytics)</h2>
          <p>
            Diese Website nutzt Vercel Web Analytics — einen cookiefreien
            Analysedienst. Es werden ausschließlich aggregierte, nicht
            personenbezogene Kennzahlen erhoben (Seitenaufrufe, Land, Gerätetyp).
            Eine Identifikation einzelner Besucher ist nicht möglich. Die
            Analytics-Daten werden ausschließlich bei Vercel verarbeitet (kein
            Drittanbieter außer Vercel).
          </p>
          <p className="mt-3">
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.
            Anbieter: Vercel Inc. (siehe § 2).
          </p>
        </div>

        <div>
          <h2 className={labelClass}>§ 4 · Schriftarten — Hauptsite</h2>
          <p>
            Die Hauptsite (rauhut.com, alle Seiten außer /designs) verwendet
            ausschließlich lokal gehostete Schriften (Inter, via{" "}
            <code>next/font/local</code>). Es wird keine Verbindung zu Google
            Fonts oder anderen Drittanbieter-CDNs aufgebaut.
          </p>
        </div>

        <div>
          <h2 className={labelClass}>§ 5 · Design-Galerie (/designs) — Google Fonts</h2>
          <p>
            Die Design-Galerie unter /designs enthält 28 eigenständige
            HTML-Designvorlagen (rauhut-*.html). Diese Vorlagen laden
            Schriftarten zur Laufzeit von Google Fonts (fonts.googleapis.com,
            fonts.gstatic.com). Dabei wird Ihre IP-Adresse an Google LLC, 1600
            Amphitheatre Parkway, Mountain View, CA 94043, USA übertragen.
          </p>
          <p className="mt-3">
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse an der authentischen Darstellung der
            Designvorlagen; ohne Laufzeit-Fonts würden die Vorlagen nicht wie
            designt angezeigt).
          </p>
          <p className="mt-3">
            <strong>Drittlandtransfer:</strong> Die Übermittlung in die USA
            erfolgt auf Basis von EU-Standardvertragsklauseln (Art. 46 Abs. 2
            lit. c DSGVO). Datenschutz Google:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              policies.google.com/privacy
            </a>
            .
          </p>
          <p className="mt-3 text-text-muted">
            <strong>Alternative:</strong> Besucher, die keine Übertragung ihrer
            IP-Adresse an Google wünschen, können die Galerie nicht nutzen — der
            Einsatz von Google Fonts ist technisch integraler Bestandteil der
            Designvorlagen.
          </p>
        </div>

        <div>
          <h2 className={labelClass}>§ 6 · Spam-Schutz (Cloudflare Turnstile) — dormant</h2>
          <p>
            Das Kontaktformular ist mit Cloudflare Turnstile (Spam-Schutz)
            ausgestattet. Dieser Dienst ist aktuell deaktiviert (Feature-Flag{" "}
            <code>NEXT_PUBLIC_CAPTCHA_ENABLED</code>). Sobald aktiviert:
            Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, USA
            verarbeitet technische Browser-Daten (IP-Adresse,
            Browser-Eigenschaften) sowie das Challenge-Ergebnis (Token).
            Turnstile arbeitet ohne Cookies.
          </p>
          <p className="mt-3">
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.{" "}
            <strong>Drittlandtransfer:</strong> EU-Standardvertragsklauseln.
            Datenschutz:{" "}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              cloudflare.com/privacypolicy
            </a>
            . Dieser Abschnitt ist bei Aktivierung des Feature-Flags
            entsprechend anzupassen.
          </p>
        </div>

        <div>
          <h2 className={labelClass}>§ 7 · Speicherung im Browser</h2>
          <p>
            Für die von Ihnen gewählte Designvariante (hell/dunkel) speichert die
            Website Ihre Auswahl im lokalen Speicher Ihres Browsers
            (»localStorage«). Diese Information verbleibt auf Ihrem Gerät und
            wird nicht übertragen.
          </p>
          <p className="mt-3">
            <strong>Rechtsgrundlage:</strong> § 25 Abs. 2 Nr. 2 TDDDG.
          </p>
        </div>

        <div>
          <h2 className={labelClass}>§ 8 · Ihre Rechte</h2>
          <p>
            Sie haben folgende Rechte: Auskunft (Art. 15), Berichtigung (Art.
            16), Löschung (Art. 17), Einschränkung (Art. 18),
            Datenübertragbarkeit (Art. 20), Widerspruch (Art. 21), Widerruf (Art.
            7 Abs. 3) DSGVO.
          </p>
          <p className="mt-3">
            Kontakt:{" "}
            <a href="mailto:german@rauhut.com">german@rauhut.com</a>
          </p>
        </div>

        <div>
          <h2 className={labelClass}>§ 9 · Beschwerderecht</h2>
          <p>
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
            beschweren. Zuständig: Der Landesbeauftragte für den Datenschutz und
            die Informationsfreiheit Baden-Württemberg, Lautenschlagerstraße 20,
            70173 Stuttgart,{" "}
            <a
              href="https://www.baden-wuerttemberg.datenschutz.de"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              baden-wuerttemberg.datenschutz.de
            </a>
            .
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
