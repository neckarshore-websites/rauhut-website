"use client";

import { useEffect, useState } from "react";
import LangToggle from "@/components/LangToggle";
import { NAV_ITEMS, NAV_CTA_LABEL, NAV_CTA_HREF, type Lang } from "@/lib/pageNav";

/**
 * Desktop-only sticky rail (P8, Founder brief 2026-09-12): jump nav + CTA
 * to the right of the narrow content column, lg breakpoint and up. Below
 * lg this renders nothing visible — MobileNav.tsx is the mobile answer.
 *
 * The active-entry "Strich" (bold text + a left accent bar, nothing else
 * changes) is verified 1:1 against kaze.neckarshore.ai/de/handbuch's own
 * right-rail TOC (screenshot-checked, 2026-09-12) — generous vertical
 * rhythm, no card/box around the list, only the current entry bolds and
 * gets the bar. Color is rauhut's own brand-teal, not Kaze's coral.
 *
 * DE/EN switcher lives here too (reusing LangToggle as-is, no new i18n
 * logic) — the brief allows either the slim header or the rail for
 * desktop; the header's own LangToggle is now hidden at lg+ (see
 * page.tsx/en/page.tsx) so this is the one live control while scrolled,
 * matching what the approved mockup showed.
 */
export default function NavRail({ lang = "de" }: { lang?: Lang }) {
  const items = NAV_ITEMS[lang];
  const [activeId, setActiveId] = useState<string>(items[0].id);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    // Bias toward the upper third of the viewport so a heading is "active"
    // once it crosses roughly that line, not only once fully in view —
    // matches the live-tracking behavior observed on the Kaze reference.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // items is a module-level constant keyed by lang — stable per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <aside
      aria-label={lang === "de" ? "Seitennavigation" : "Page navigation"}
      className="hidden lg:sticky lg:top-16 lg:flex lg:w-56 lg:flex-col lg:gap-8 lg:self-start"
    >
      <LangToggle current={lang} />

      <nav
        aria-label={lang === "de" ? "Sprungnavigation" : "Jump navigation"}
        className="flex flex-col gap-5"
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? "true" : undefined}
              className={`border-l-2 pl-4 text-[0.9375rem] leading-snug no-underline transition-colors duration-150 ${
                isActive
                  ? "border-brand-teal font-semibold text-text"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <a
        href={NAV_CTA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-lg bg-text px-4 py-2.5 text-sm font-medium text-bg no-underline transition-colors duration-150 hover:bg-accent-hover hover:text-bg hover:no-underline"
      >
        {NAV_CTA_LABEL[lang]}
      </a>
    </aside>
  );
}
