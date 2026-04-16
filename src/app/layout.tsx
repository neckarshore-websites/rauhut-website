import type { Metadata } from "next";
import localFont from "next/font/local";
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
  alternates: {
    canonical: "https://rauhut.com/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
