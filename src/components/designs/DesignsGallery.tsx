"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import DesignCard from "./DesignCard";
import FilterBar from "./FilterBar";
import { Design, ALL_TAGS } from "@/app/designs/data";

interface DesignsGalleryProps {
  designs: Design[];
}

export default function DesignsGallery({ designs }: DesignsGalleryProps) {
  const [activeTag, setActiveTag] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeTag === "all"
      ? designs
      : designs.filter((d) => d.tags.includes(activeTag));

  // Update --pscale on each card-wrapper whenever the filtered set or
  // viewport size changes. Mirrors the original vanilla JS setScales().
  useEffect(() => {
    const setScales = () => {
      if (!gridRef.current) return;
      gridRef.current
        .querySelectorAll<HTMLElement>(".card-wrapper")
        .forEach((card) => {
          const w = card.offsetWidth;
          const h = card.offsetHeight;
          const scale = Math.min(w / 1200, h / 900);
          card.style.setProperty("--pscale", String(scale));
        });
    };
    setScales();
    window.addEventListener("resize", setScales);
    return () => window.removeEventListener("resize", setScales);
  }, [filtered]);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ── Sticky nav ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-bg/90 px-6 py-3 backdrop-blur">
        <Link
          href="/"
          className="font-mono text-xs text-text-muted no-underline transition-colors hover:text-text"
        >
          ← rauhut.com
        </Link>
        <ThemeToggle />
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-6 pb-8 pt-12">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-text-subtle">
          Design Gallery
        </p>
        <h1 className="mb-2 text-3xl font-light tracking-tight">
          28 Explorations in{" "}
          <strong className="font-semibold">UI Design</strong>
        </h1>
        <p className="text-sm text-text-muted">Stuttgart · 2025–26</p>

        {/* Stats row */}
        <div className="mt-8 flex flex-wrap gap-8 border-t border-border pt-8">
          <div>
            <span className="block font-mono text-xl font-medium leading-none">
              28
            </span>
            <span className="mt-1 block text-xs text-text-subtle">
              Designs
            </span>
          </div>
          <div>
            <span className="block font-mono text-xl font-medium leading-none">
              150+
            </span>
            <span className="mt-1 block text-xs text-text-subtle">Themes</span>
          </div>
          <div>
            <span className="block font-mono text-xl font-medium leading-none">
              {ALL_TAGS.length - 1}
            </span>
            <span className="mt-1 block text-xs text-text-subtle">
              Kategorien
            </span>
          </div>
        </div>
      </div>

      {/* ── Filter + Grid ──────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <FilterBar
          tags={ALL_TAGS}
          activeTag={activeTag}
          onTagChange={setActiveTag}
          designs={designs}
        />

        <div
          ref={gridRef}
          className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {filtered.map((design) => (
            <DesignCard key={design.slug} design={design} />
          ))}
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="mx-auto max-w-7xl border-t border-border px-6 pb-6 pt-10 text-sm text-text-subtle">
        <p>
          © {new Date().getFullYear()} German Rauhut ·{" "}
          <a href="/impressum">Impressum</a> ·{" "}
          <a href="/designs">Designs</a>
        </p>
      </footer>
    </div>
  );
}
