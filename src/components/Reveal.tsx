"use client";

import { useEffect, useRef } from "react";

/**
 * Reveal — fades + slides a section into view on first intersection.
 *
 * Design contract:
 * - SSR/no-JS: content renders in final (visible) state — progressive enhancement only.
 * - prefers-reduced-motion: reduce → animation skipped entirely, content visible immediately.
 * - Content already in view on mount is NOT re-hidden (no flash).
 * - Only below-fold content gets the hide → fade sequence.
 * - Layout footprint stays constant (opacity + translateY, no display toggling) → zero CLS.
 *
 * Implementation note: uses imperative DOM mutation via ref instead of React state.
 * This avoids cascading re-renders (React 19 lint rule `react-hooks/set-state-in-effect`)
 * and keeps the animation purely a paint-layer concern.
 */
type RevealProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "className" | "style">;

export default function Reveal({
  children,
  className,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect OS-level reduced motion — no animation, no hide.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // If element already intersects viewport on mount, don't animate —
    // SSR content is already onscreen, animating it would cause a flash.
    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyInView) {
      return;
    }

    // Below-fold: hide imperatively (no state, no cascading renders),
    // observe, then reveal on first intersection.
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.style.transition =
              "opacity 300ms ease-out, transform 300ms ease-out";
            target.style.willChange = "opacity, transform";
            target.style.opacity = "1";
            target.style.transform = "translateY(0)";
            // Drop the will-change hint once the animation settles.
            window.setTimeout(() => {
              target.style.willChange = "";
            }, 400);
            observer.unobserve(target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className={className}
      {...rest}
    >
      {children}
    </section>
  );
}
