import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = localFont({
  src: "../fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "German Rauhut — Technical Product Owner & AI Product Builder",
  description:
    "Technical Product Owner & AI Product Builder aus Stuttgart. 10+ Jahre Mercedes-Benz, heute Freelance und Aufbau eigener AI-Produkte (Neckarshore AI, OMNIXIS Documenter, Obsidian Vault Autopilot).",
  metadataBase: new URL("https://rauhut.com"),
  openGraph: {
    title: "German Rauhut — Technical Product Owner & AI Product Builder",
    description:
      "Brueckenbauer zwischen Business und Technologie. Mercedes-Benz Alumni, heute AI Product Builder bei Neckarshore AI.",
    url: "https://rauhut.com",
    siteName: "rauhut.com",
    locale: "de_DE",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "German Rauhut — Technical Product Owner & AI Product Builder",
    description:
      "Brueckenbauer zwischen Business und Technologie. Mercedes-Benz Alumni, heute AI Product Builder bei Neckarshore AI.",
    // twitter:image is emitted automatically from twitter-image.tsx
  },
  alternates: {
    canonical: "https://rauhut.com/",
    languages: {
      "de-DE": "https://rauhut.com/",
      "en-US": "https://rauhut.com/en",
      "x-default": "https://rauhut.com/",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning because the theme-init script mutates
    // data-theme before React hydrates; this is expected.
    <html
      lang="de"
      className={inter.variable}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flash: runs before first paint. Trusted static asset
            from /public — no user input, no XSS vector. */}
        <Script
          src="/theme-init.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        {children}
        {/* Vercel Web Analytics — cookieless, DSGVO-compliant.
            Inject once, at the end of body. No tracking, no cookies,
            no cross-site IDs. Data stays inside Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
