import type { Metadata } from "next";
import DesignsGallery from "@/components/designs/DesignsGallery";
import { DESIGNS } from "./data";

export const metadata: Metadata = {
  title: "Design Gallery — rauhut.com",
  description:
    "28 eigenständige UI-Design-Explorations von German Rauhut: Art Déco, Vaporwave, SpaceX, Egypt, Brutalist, Gothic und mehr.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://rauhut.com/designs" },
};

export default function DesignsPage() {
  return <DesignsGallery designs={DESIGNS} />;
}
