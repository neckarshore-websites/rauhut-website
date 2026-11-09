"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  BUILD_MS,
  LEVEL,
  SEED,
  SETTINGS,
  accentOf,
  buildNodes,
  linkColors,
  linkDistance,
  maxPulses,
  seeded,
  variantFor,
  type Accent,
  type NetworkNode,
} from "@/lib/hero-network";

/**
 * HeroNetwork — animated network across the top of the homepage (rauhut-website #111).
 *
 * Ported from the Founder's study rauhut-111-study.html at the "medium" level; the
 * study's controls and offer cards are not part of it. After go-live the Founder asked
 * for a large surface ("großflächig ... zumindest die obere Hälfte", 2026-11-08), so the
 * layer spans the full window width from the page top to below the hero. Design contract:
 * - Decorative: aria-hidden, pointer-events none, painted behind all page content.
 * - Readability: a soft ellipse over the hero text block dims the network there.
 * - Colors are read from the theme tokens (--color-text-muted, --color-brand-amber,
 *   --color-brand-teal) and re-read when the theme switch flips data-theme.
 * - The canvas is transparent: the page ground shows through, so no surface is painted.
 *   The study's readability fade under the headline is applied by erasing, which works
 *   on both themes.
 * - prefers-reduced-motion: one static frame, no loop, no pointer listeners.
 * - Phones and touch devices: the reduced variant (half the pulses, no pointer, DPR 1.5).
 * - Starts after load, when the browser is idle, so it neither is nor delays the LCP.
 * - Stops drawing when the hero is out of view, the tab is hidden, or the visitor pauses.
 * - Everything it attaches is detached on unmount.
 */

type Labels = { pause: string };
type State = "idle" | "running" | "paused" | "offscreen" | "hidden" | "static";

const PAUSE_STORAGE_KEY = "hero-network-paused";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const NARROW = "(max-width: 639px)";
const COARSE = "(pointer: coarse)";

type Palette = Record<Accent, string> & { name: "dark" | "light" };

function hexToRgb(value: string): string {
  const hex = value.trim().replace("#", "");
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

function readPalette(): Palette {
  const root = document.documentElement;
  const css = getComputedStyle(root);
  return {
    name: root.getAttribute("data-theme") === "light" ? "light" : "dark",
    gray: hexToRgb(css.getPropertyValue("--color-text-muted") || "#a3a3a3"),
    amber: hexToRgb(css.getPropertyValue("--color-brand-amber") || "#f59e0b"),
    teal: hexToRgb(css.getPropertyValue("--color-brand-teal") || "#22d3ee"),
  };
}

// The visitor's pause choice: kept in localStorage, with an in-memory fallback when
// storage is unavailable. useSyncExternalStore reads it without a hydration mismatch.
let pauseMemory: boolean | null = null;
const pauseListeners = new Set<() => void>();

function getPaused(): boolean {
  if (pauseMemory !== null) return pauseMemory;
  try {
    return localStorage.getItem(PAUSE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function setPaused(next: boolean) {
  pauseMemory = next;
  try {
    if (next) localStorage.setItem(PAUSE_STORAGE_KEY, "1");
    else localStorage.removeItem(PAUSE_STORAGE_KEY);
  } catch {
    // storage unavailable: the choice lasts for this page view
  }
  pauseListeners.forEach((listener) => listener());
}

function subscribePaused(listener: () => void) {
  pauseListeners.add(listener);
  return () => {
    pauseListeners.delete(listener);
  };
}

/** How far the layer reaches below the hero, in CSS px, before its bottom fade ends. */
const BELOW_HERO = 96;
/** Erase alpha at the centre of the text ellipse: the network stays faintly visible there. */
const TEXT_DIM = 0.6;

export default function HeroNetwork() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const host = document.querySelector<HTMLElement>("header.hero-glow");
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !host || !ctx) return;

    const reducedMq = window.matchMedia(REDUCED_MOTION);
    const narrowMq = window.matchMedia(NARROW);
    const coarseMq = window.matchMedia(COARSE);
    const cfg = SETTINGS[LEVEL];

    let teardown: (() => void) | null = null;

    const setup = () => {
      teardown?.();
      const reduced = reducedMq.matches;
      const variant = variantFor({ narrow: narrowMq.matches, coarsePointer: coarseMq.matches });
      const animate = !reduced;
      wrap.dataset.variant = variant.name;

      let palette = readPalette();
      wrap.dataset.palette = palette.name;
      let w = 0;
      let h = 0;
      let dimBoxes: { cx: number; cy: number; rx: number; ry: number }[] = [];
      let nodes: NetworkNode[] = [];
      let pulses: { a: number; b: number; t: number; speed: number }[] = [];
      let raf = 0;
      let last = 0;
      let elapsed = 0; // active drawing time, so a pause during the build resumes the build
      let frameCount = 0;
      let started = false;
      let inView = true;
      const mouse = { x: 0, y: 0, tx: 0, ty: 0, px: 0, py: 0, inside: false };

      const setState = (state: State) => {
        wrap.dataset.state = state;
        document.documentElement.dataset.heroNetworkState = state; // shows the pause control
      };
      const countFrame = () => {
        frameCount++;
        wrap.dataset.frames = String(frameCount);
      };

      const rgba = (accent: Accent, alpha: number) => `rgba(${palette[accent]},${alpha})`;

      const draw = (dt: number) => {
        const reveal = animate ? Math.min(1, elapsed / BUILD_MS) : 1;
        const step = dt / 16.67;
        mouse.x += (mouse.tx - mouse.x) * 0.06;
        mouse.y += (mouse.ty - mouse.y) * 0.06;
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, w, h);

        if (animate) {
          for (const n of nodes) {
            n.x += n.vx * cfg.speed * step;
            n.y += n.vy * cfg.speed * step;
            if (n.x < -20) n.x = w + 20;
            if (n.x > w + 20) n.x = -20;
            if (n.y < -20) n.y = h + 20;
            if (n.y > h + 20) n.y = -20;
          }
        }

        const px = (n: NetworkNode) => n.x + mouse.x * cfg.parallax * n.z;
        const py = (n: NetworkNode) => n.y + mouse.y * cfg.parallax * n.z;
        const link = linkDistance(cfg, w);
        const edges: [number, number][] = [];
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const ax = px(a);
            const ay = py(a);
            const bx = px(b);
            const by = py(b);
            const d = Math.hypot(ax - bx, ay - by);
            if (d > link) continue;
            if (((i * 7 + j * 3) % 100) / 100 > reveal) continue;
            edges.push([i, j]);
            let o = (1 - d / link) * cfg.alpha * Math.min(a.z, b.z);
            if (mouse.inside) {
              const md = Math.hypot((ax + bx) / 2 - mouse.px, (ay + by) / 2 - mouse.py);
              if (md < 160) o += (1 - md / 160) * 0.5 * cfg.alpha;
            }
            const [ca, cb] = linkColors(accentOf(a.hue), accentOf(b.hue));
            if (ca === cb) {
              ctx.strokeStyle = rgba(ca, o);
            } else {
              const grad = ctx.createLinearGradient(ax, ay, bx, by);
              grad.addColorStop(0, rgba(ca, o));
              grad.addColorStop(1, rgba(cb, o));
              ctx.strokeStyle = grad;
            }
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }

        for (const n of nodes) {
          ctx.fillStyle = rgba(accentOf(n.hue), (0.35 + 0.6 * n.z) * Math.max(cfg.alpha, 0.5) * reveal);
          ctx.beginPath();
          ctx.arc(px(n), py(n), 1 + n.z * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }

        if (animate && edges.length) {
          const limit = maxPulses(cfg, variant);
          while (pulses.length < limit) {
            const e = edges[Math.floor(Math.random() * edges.length)];
            pulses.push({ a: e[0], b: e[1], t: 0, speed: 0.006 + Math.random() * 0.01 });
          }
          pulses = pulses.filter((p) => p.t <= 1 && nodes[p.a] && nodes[p.b]);
          for (const p of pulses) {
            p.t += p.speed * step;
            const pa = nodes[p.a];
            const pb = nodes[p.b];
            const x = px(pa) + (px(pb) - px(pa)) * p.t;
            const y = py(pa) + (py(pb) - py(pa)) * p.t;
            const c: Accent = (p.a + p.b) % 2 === 0 ? "amber" : "teal";
            const glow = ctx.createRadialGradient(x, y, 0, x, y, 14);
            glow.addColorStop(0, rgba(c, 0.9));
            glow.addColorStop(1, rgba(c, 0));
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, 14, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Readability: dim the network under the hero text and the side navigation with
        // soft ellipses. Erasing instead of painting the ground keeps the canvas transparent
        // on both themes.
        ctx.globalCompositeOperation = "destination-out";
        for (const box of dimBoxes) {
          ctx.save();
          ctx.translate(box.cx, box.cy);
          ctx.scale(box.rx, box.ry);
          const dim = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
          dim.addColorStop(0, `rgba(0,0,0,${TEXT_DIM})`);
          dim.addColorStop(0.7, `rgba(0,0,0,${TEXT_DIM * 0.85})`);
          dim.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = dim;
          ctx.beginPath();
          ctx.arc(0, 0, 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.globalCompositeOperation = "source-over";
        countFrame();
      };

      const shouldRun = () => animate && started && inView && !document.hidden && !getPaused();

      const loop = (now: number) => {
        const dt = Math.min(50, now - last);
        last = now;
        elapsed += dt;
        draw(dt);
        raf = requestAnimationFrame(loop);
      };

      const sync = () => {
        if (!animate) return;
        if (shouldRun()) {
          setState("running");
          if (!raf) {
            last = performance.now();
            raf = requestAnimationFrame(loop);
          }
          return;
        }
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        if (!started) setState("idle");
        else if (getPaused()) setState("paused");
        else if (document.hidden) setState("hidden");
        else setState("offscreen");
      };
      const unsubscribePause = subscribePaused(sync);

      // Text the network must not compete with: the hero's text block and, on desktop, the
      // sticky side navigation. Measured relative to the layer; the navigation moves with
      // scrolling, so this also runs on scroll.
      const dimTargets = [host.querySelector("h1")?.parentElement, document.querySelector("aside")].filter(
        (el): el is HTMLElement => !!el,
      );
      const measureDims = () => {
        const r = wrap.getBoundingClientRect();
        dimBoxes = dimTargets
          .map((el) => el.getBoundingClientRect())
          .filter((b) => b.width > 0 && b.height > 0)
          .map((b) => ({
            cx: b.left - r.left + b.width / 2,
            cy: b.top - r.top + b.height / 2,
            rx: b.width / 2 + 56,
            ry: b.height / 2 + 48,
          }));
      };
      // A running loop picks the new boxes up on its next frame; the static frame is redrawn.
      // A paused frame stays as it is, so pausing really holds the picture.
      const onScroll = () => {
        measureDims();
        if (!animate) draw(0);
      };

      const resize = () => {
        // The layer reaches from the page top to BELOW_HERO under the hero's bottom edge.
        const heroRect = host.getBoundingClientRect();
        wrap.style.height = `${Math.round(heroRect.bottom + window.scrollY + BELOW_HERO)}px`;
        const r = wrap.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, variant.maxDpr);
        w = r.width;
        h = r.height;
        measureDims();
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        nodes = buildNodes(w, h, cfg, seeded(SEED));
        pulses = [];
        if (!animate || !raf) draw(0);
      };

      // The layer itself takes no pointer events, so the pointer is read on the window and
      // counts only while it is over the layer.
      const onMove = (ev: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
        const px = ev.clientX - r.left;
        const py = ev.clientY - r.top;
        if (px < 0 || py < 0 || px > r.width || py > r.height) {
          mouse.tx = 0;
          mouse.ty = 0;
          mouse.inside = false;
          return;
        }
        mouse.px = px;
        mouse.py = py;
        mouse.tx = (px / r.width - 0.5) * 2;
        mouse.ty = (py / r.height - 0.5) * 2;
        mouse.inside = true;
      };

      const themeObserver = new MutationObserver(() => {
        palette = readPalette();
        wrap.dataset.palette = palette.name;
        if (!raf) draw(0);
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      // Observe the hero, not the layer: resize() sets the layer's height, and observing the
      // layer would feed that change back into the observer.
      const ro = new ResizeObserver(resize);
      ro.observe(host);
      window.addEventListener("resize", resize);
      window.addEventListener("scroll", onScroll, { passive: true });
      resize();

      if (!animate) {
        setState("static");
        teardown = () => {
          unsubscribePause();
          window.removeEventListener("resize", resize);
          window.removeEventListener("scroll", onScroll);
          ro.disconnect();
          themeObserver.disconnect();
          delete document.documentElement.dataset.heroNetworkState;
        };
        return;
      }

      const io = new IntersectionObserver((entries) => {
        inView = entries.some((e) => e.isIntersecting);
        sync();
      });
      io.observe(wrap);
      document.addEventListener("visibilitychange", sync);
      if (variant.pointer) window.addEventListener("pointermove", onMove, { passive: true });

      setState("idle");
      let idleHandle = 0;
      const begin = () => {
        started = true;
        sync();
      };
      const scheduleStart = () => {
        if (typeof window.requestIdleCallback === "function") {
          idleHandle = window.requestIdleCallback(begin, { timeout: 1200 });
        } else {
          idleHandle = window.setTimeout(begin, 200);
        }
      };
      if (document.readyState === "complete") scheduleStart();
      else window.addEventListener("load", scheduleStart, { once: true });

      teardown = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleHandle);
        window.clearTimeout(idleHandle);
        window.removeEventListener("load", scheduleStart);
        document.removeEventListener("visibilitychange", sync);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
        unsubscribePause();
        io.disconnect();
        ro.disconnect();
        themeObserver.disconnect();
        delete document.documentElement.dataset.heroNetworkState;
      };
    };

    setup();
    reducedMq.addEventListener("change", setup);
    narrowMq.addEventListener("change", setup);
    coarseMq.addEventListener("change", setup);
    return () => {
      reducedMq.removeEventListener("change", setup);
      narrowMq.removeEventListener("change", setup);
      coarseMq.removeEventListener("change", setup);
      teardown?.();
    };
  }, []);

  return (
    <div ref={wrapRef} className="hero-network" aria-hidden="true" data-hero-network="" data-state="idle">
      <canvas ref={canvasRef} />
    </div>
  );
}

/**
 * Pause control for the network, rendered in PageControls (#114). It shares the pause choice with
 * HeroNetwork through the store above and is shown by CSS only while the network moves
 * (:root[data-hero-network-state]), never in the static reduced-motion frame or without JavaScript.
 */
export function HeroNetworkToggle({ labels }: { labels: Labels }) {
  const paused = useSyncExternalStore(subscribePaused, getPaused, () => false);
  return (
    <button
      type="button"
      data-hero-network-toggle=""
      className="hero-network-toggle"
      aria-label={labels.pause}
      aria-pressed={paused}
      title={labels.pause}
      onClick={() => setPaused(!getPaused())}
    >
      {paused ? (
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          <path d="M4 2.5h2.75v11H4zM9.25 2.5H12v11H9.25z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
