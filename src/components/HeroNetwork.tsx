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
 * HeroNetwork — animated network behind the homepage hero (rauhut-website #111).
 *
 * Ported from the Founder's study rauhut-111-study.html at the "medium" level; the
 * study's controls and offer cards are not part of it. Design contract:
 * - Decorative: aria-hidden, pointer-events none, painted below the hero content.
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

export default function HeroNetwork({ labels }: { labels: Labels }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paused = useSyncExternalStore(subscribePaused, getPaused, () => false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const host = wrap?.parentElement;
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
      let fadeEnd = 0;
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

        // Study: fade the network under the headline for readability. Erasing instead of
        // painting the dark ground keeps the canvas transparent on both themes. The study's
        // copy spans 60% of its hero; here the text block reaches further right on desktop,
        // so the fade ends at the measured text edge there (fadeEnd). Phones keep 60%.
        ctx.globalCompositeOperation = "destination-out";
        const fade = ctx.createLinearGradient(0, 0, fadeEnd, 0);
        fade.addColorStop(0, "rgba(0,0,0,0.85)");
        fade.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = fade;
        ctx.fillRect(0, 0, w, h);
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

      const resize = () => {
        const r = wrap.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, variant.maxDpr);
        w = r.width;
        h = r.height;
        const text = host.querySelector("h1")?.parentElement?.getBoundingClientRect();
        fadeEnd = w < 640 || !text ? w * 0.6 : Math.min(w, Math.max(w * 0.6, text.right - r.left));
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        nodes = buildNodes(w, h, cfg, seeded(SEED));
        pulses = [];
        if (!animate || !raf) draw(0);
      };

      const onMove = (ev: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
        mouse.px = ev.clientX - r.left;
        mouse.py = ev.clientY - r.top;
        mouse.tx = (mouse.px / r.width - 0.5) * 2;
        mouse.ty = (mouse.py / r.height - 0.5) * 2;
        mouse.inside = true;
      };
      const onLeave = () => {
        mouse.tx = 0;
        mouse.ty = 0;
        mouse.inside = false;
      };

      const themeObserver = new MutationObserver(() => {
        palette = readPalette();
        wrap.dataset.palette = palette.name;
        if (!raf) draw(0);
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      const ro = new ResizeObserver(resize);
      ro.observe(wrap);
      resize();

      if (!animate) {
        setState("static");
        teardown = () => {
          unsubscribePause();
          ro.disconnect();
          themeObserver.disconnect();
        };
        return;
      }

      const io = new IntersectionObserver((entries) => {
        inView = entries.some((e) => e.isIntersecting);
        sync();
      });
      io.observe(host);
      document.addEventListener("visibilitychange", sync);
      if (variant.pointer) {
        host.addEventListener("pointermove", onMove, { passive: true });
        host.addEventListener("pointerleave", onLeave);
      }

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
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
        unsubscribePause();
        io.disconnect();
        ro.disconnect();
        themeObserver.disconnect();
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

  const togglePause = () => setPaused(!getPaused());

  return (
    <>
      <div ref={wrapRef} className="hero-network" aria-hidden="true" data-hero-network="" data-state="idle">
        <canvas ref={canvasRef} />
      </div>
      <button
        type="button"
        data-hero-network-toggle=""
        className="hero-network-toggle"
        aria-label={labels.pause}
        aria-pressed={paused}
        title={labels.pause}
        onClick={togglePause}
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
    </>
  );
}
