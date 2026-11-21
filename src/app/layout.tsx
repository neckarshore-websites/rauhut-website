import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { ThemeColorSync } from "@/components/ThemeColorSync";
import UmamiTracker from "@/components/UmamiTracker";
import { UMAMI_HOST, UMAMI_WEBSITE_ID } from "@/lib/umami";
import "./globals.css";

const inter = localFont({
  src: "../fonts/Inter-Variable-subset.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "400 700",
});

export const metadata: Metadata = {
  title: "German Rauhut — Freelance Technical Product Owner",
  description:
    "Freelance Technical Product Owner aus Stuttgart. 10 Jahre Mercedes-Benz-Ökosystem, Mandate in Anforderung, Test und Release. Ab sofort buchbar.",
  metadataBase: new URL("https://rauhut.com"),
  openGraph: {
    title: "German Rauhut — Freelance Technical Product Owner",
    description:
      "Freelance Technical Product Owner aus Stuttgart. 10 Jahre Mercedes-Benz-Ökosystem, Mandate in Anforderung, Test und Release. Ab sofort buchbar.",
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
    title: "German Rauhut — Freelance Technical Product Owner",
    description:
      "Freelance Technical Product Owner aus Stuttgart. 10 Jahre Mercedes-Benz-Ökosystem, Mandate in Anforderung, Test und Release. Ab sofort buchbar.",
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

// Browser chrome tint: the server value is the default (dark) --color-bg in
// globals.css. theme-init.js follows the device setting unless a choice is
// stored; ThemeColorSync rewrites the tag to the painted ground after
// hydration, for the device setting and the switch alike.
// tests/e2e/theme-color.spec.ts holds the tag against the painted background.
export const viewport: Viewport = {
  themeColor: "#0A0A0A",
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
        {/* Umami's before-send hook must exist before the tracker's first
            request, so it loads beforeInteractive, ahead of the tracker. */}
        {UMAMI_WEBSITE_ID ? (
          <Script src="/umami-before-send.js" strategy="beforeInteractive" />
        ) : null}
      </head>
      <body>
        {children}
        {/* Umami visitor counting (planning #4006 row 6): cookieless, on our
            own box. Not rendered while the website id is empty. Query
            strings, screen size, GPC and DNT are handled by the hook loaded
            in <head>; DNT and the #fragment also natively. */}
        {UMAMI_WEBSITE_ID ? (
          <UmamiTracker host={UMAMI_HOST} websiteId={UMAMI_WEBSITE_ID} />
        ) : null}
        <ThemeColorSync />
      </body>
    </html>
  );
}
