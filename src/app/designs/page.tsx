import type { Metadata } from "next";
import DesignsGallery from "@/components/designs/DesignsGallery";
import { DESIGNS } from "./data";

export const metadata: Metadata = {
  title: "Design Gallery — rauhut.com",
  description:
    "28 eigenständige UI-Design-Explorations von German Rauhut: Art Déco, Vaporwave, SpaceX, Egypt, Brutalist, Gothic und mehr.",
  // P7 (2026-09-12): was `{ index: true, follow: true }`, contradicting
  // the X-Robots-Tag: noindex, nofollow header next.config.ts already
  // sends for this route (see designsNoIndexHeaders there). Aligned so
  // header and meta agree.
  robots: { index: false, follow: false },
  alternates: { canonical: "https://rauhut.com/designs" },
};

export default function DesignsPage() {
  return <DesignsGallery designs={DESIGNS} />;
}
