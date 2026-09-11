"use client";

import { useState } from "react";
import LangToggle from "@/components/LangToggle";
import { NAV_ITEMS, NAV_CTA_LABEL, NAV_CTA_HREF, type Lang } from "@/lib/pageNav";

const LABELS = {
  de: { name: "German Rauhut", menu: "Menü", close: "Menü schließen" },
  en: { name: "German Rauhut", menu: "Menu", close: "Close menu" },
} as const;

/**
 * Mobile-only sticky top bar (P8, Founder brief 2026-09-12): Name + CTA,
 * jumps behind a burger. lg:hidden — NavRail.tsx is the desktop answer.
 *
 * Name is deliberately NOT brand-teal here (plain semibold text) — teal is
 * reserved for role titles (Founder rule, P1b/P5a-fix brief, same session),
 * and "German Rauhut" the name is not a role title.
 */
export default function MobileNav({ lang = "de" }: { lang?: Lang }) {
  const [open, setOpen] = useState(false);
  const items = NAV_ITEMS[lang];
  const t = LABELS[lang];

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-bg lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="text-sm font-semibold text-text">{t.name}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label={open ? t.close : t.menu}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-border-strong text-text"
          >
            <span className="sr-only">{open ? t.close : t.menu}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="h-[18px] w-[18px]"
            >
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 5h14M3 10h14M3 15h14" />
              )}
            </svg>
          </button>
          <a
            href={NAV_CTA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-text px-3 py-2 text-xs font-medium text-bg no-underline"
          >
            {NAV_CTA_LABEL[lang]}
          </a>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav-drawer"
          className="border-t border-border bg-bg-muted px-4 py-4"
        >
          <div className="mb-4 border-b border-border pb-4">
            <LangToggle current={lang} />
          </div>
          <nav
            aria-label={lang === "de" ? "Sprungnavigation" : "Jump navigation"}
            className="flex flex-col gap-1"
          >
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="py-2.5 text-base text-text no-underline"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
