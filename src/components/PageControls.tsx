import LangToggle from "@/components/LangToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { HeroNetworkToggle } from "@/components/HeroNetwork";
import type { Lang } from "@/lib/pageNav";

const PAUSE_LABEL: Record<Lang, string> = {
  de: "Hintergrundanimation anhalten",
  en: "Pause background animation",
};

/**
 * PageControls: one cluster for the page's four controls (#114, Founder
 * 2026-11-08). DE, EN, light/dark and play/pause sit side by side, in that order.
 *
 * Rendered twice per page and exactly one is visible per viewport: at the top
 * of the sticky NavRail on desktop (lg+), and in the row above the hero on a
 * phone. The play/pause slot is always laid out and only shows while the
 * network moves (globals.css, .hero-network-toggle), so it never moves the
 * other three controls.
 */
export default function PageControls({
  lang,
  className = "",
}: {
  lang: Lang;
  className?: string;
}) {
  return (
    <div data-page-controls="" className={`flex items-center gap-3 ${className}`.trim()}>
      <LangToggle current={lang} />
      <ThemeToggle />
      <HeroNetworkToggle labels={{ pause: PAUSE_LABEL[lang] }} />
    </div>
  );
}
