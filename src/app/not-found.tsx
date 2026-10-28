import type { Metadata } from "next";
import Link from "next/link";

/**
 * THE 404 — "And I would walk 404 miles" (Founder, 2026-10-28, in the terminal: "And I will
 * walk 404 miles, so was in der Art"; the Kaze 404 is the yardstick).
 *
 * A one-line play on the refrain of "I'm Gonna Be (500 Miles)" by The Proclaimers, credited on
 * the page. Only the one altered line is used, nothing of the song's lyrics beyond it.
 *
 * THE FOOTPRINTS appear one after another, once, and stay; the last one stops at the mile
 * marker. Under reduced motion they are all there from the start (globals.css, `spur-schritt`).
 * The trail is decoration and hidden from screen readers.
 */
export const metadata: Metadata = {
  title: "Seite nicht gefunden — rauhut.com",
  robots: { index: false, follow: false },
};

/* Six shoe prints, left and right foot alternating, walking left to right. */
const SCHRITTE = Array.from({ length: 6 }, (_, i) => ({
  x: 22 + i * 38,
  y: i % 2 === 0 ? 30 : 58,
  winkel: i % 2 === 0 ? -8 : 8,
  delay: `${0.25 + i * 0.28}s`,
}));

/* One print, pointing right, drawn around (0, 0): a sole that is wider at the toes, a heel. */
const SOHLE = "M-2 -5.2 C4 -6.6 11 -6.4 14 -2.6 C15.6 -0.6 15.6 1.4 14 3.2 C11 6.6 4 6.6 -2 5.2 C-4.4 4.4 -4.4 -4.4 -2 -5.2 Z";

function Spur() {
  return (
    <svg
      viewBox="0 0 360 92"
      className="h-auto w-full max-w-[360px] text-text-subtle"
      aria-hidden="true"
      focusable="false"
      data-spur
    >
      {SCHRITTE.map((s) => (
        <g key={s.x} className="spur-schritt" style={{ animationDelay: s.delay }}>
          <g transform={`translate(${s.x} ${s.y}) rotate(${s.winkel})`} fill="currentColor">
            <path d={SOHLE} />
            <ellipse cx="-10.5" cy="0" rx="4.6" ry="4.2" />
          </g>
        </g>
      ))}
      {/* the mile marker */}
      <g className="spur-schritt text-brand-amber" style={{ animationDelay: "2.1s" }}>
        <rect x="270" y="10" width="84" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text x="312" y="36.5" textAnchor="middle" fill="currentColor" style={{ font: "600 17px var(--font-inter), system-ui, sans-serif" }}>
          404 mi
        </text>
        <rect x="310" y="50" width="4" height="36" rx="1.5" fill="currentColor" />
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-24" data-rauhut-404>
      <p className="text-xs font-medium uppercase tracking-widest text-brand-amber">404</p>
      <div className="mt-8">
        <Spur />
      </div>
      <h1 className="mt-10 text-[2.1rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-5xl" lang="en">
        And I would walk 404&nbsp;miles&nbsp;…
      </h1>
      <p className="mt-5 max-w-[34ch] text-lg text-text-muted">
        … und diese Seite hätte ich trotzdem nicht gefunden. Es gibt sie nicht.
      </p>
      <p className="mt-10">
        <Link href="/">← Zur Startseite</Link>
      </p>
      <p className="mt-16 text-xs text-text-subtle">
        Frei nach The Proclaimers, „I’m Gonna Be (500 Miles)“.
      </p>
    </main>
  );
}
