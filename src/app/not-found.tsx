import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seite nicht gefunden — rauhut.com",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
        404
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Seite nicht gefunden
      </h1>
      <p className="mt-4 text-text-muted">
        Die angefragte Seite existiert nicht.
      </p>
      <p className="mt-8">
        <Link href="/">← Zur Startseite</Link>
      </p>
    </main>
  );
}
