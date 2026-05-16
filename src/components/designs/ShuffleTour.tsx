"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Design } from "@/app/designs/data";

interface ShuffleTourProps {
  designs: Design[];
  onClose: () => void;
}

type Speed = 3000 | 5000 | 8000;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ShuffleTour({ designs, onClose }: ShuffleTourProps) {
  const [queue] = useState<Design[]>(() => shuffleArray(designs));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState<Speed>(3000);
  // progressKey increments to reset the CSS progress-bar animation
  const [progressKey, setProgressKey] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = queue[currentIdx];

  // ── Advance to next design ────────────────────────────────────────
  const advance = useCallback(
    (delta: number) => {
      setCurrentIdx((i) => (i + delta + queue.length) % queue.length);
      setProgressKey((k) => k + 1);
    },
    [queue.length]
  );

  // ── Auto-advance timer ────────────────────────────────────────────
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => advance(1), speed);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [paused, speed, currentIdx, advance]);

  // ── Keyboard navigation ───────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        advance(1);
      } else if (e.key === "ArrowLeft") {
        advance(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [advance, onClose]);

  // ── Prevent body scroll while open ───────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Design shuffle tour"
      className="fixed inset-0 z-50 flex flex-col bg-black/96"
    >
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <span className="font-mono text-xs text-white/60">
          {current.name}
          <span className="ml-3 text-white/30">
            {currentIdx + 1} / {queue.length}
          </span>
        </span>
        <div className="flex items-center gap-2">
          {/* Speed pills */}
          {([3000, 5000, 8000] as Speed[]).map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`font-mono text-[0.65rem] px-2 py-0.5 rounded border transition-colors ${
                speed === s
                  ? "border-white/40 text-white bg-white/10"
                  : "border-white/10 text-white/40 hover:border-white/30"
              }`}
            >
              {s / 1000}s
            </button>
          ))}

          {/* Open link */}
          <a
            href={`/designs/rauhut-${current.slug}.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.65rem] text-white/50 hover:text-white no-underline px-2 py-0.5"
          >
            ↗
          </a>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close tour"
            className="font-mono text-[0.65rem] text-white/40 hover:text-white px-2 py-0.5 border border-white/10 hover:border-white/30 rounded transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────── */}
      <div className="h-[2px] bg-white/10 flex-shrink-0">
        {!paused && (
          <div
            key={progressKey}
            className="h-full bg-white/50"
            style={{
              animation: `progress-fill ${speed}ms linear forwards`,
            }}
          />
        )}
      </div>

      {/* ── Iframe ───────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          src={`/designs/rauhut-${current.slug}.html`}
          title={`${current.name} preview`}
          className="h-full w-full border-none"
        />
      </div>

      {/* ── Bottom controls ──────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-white/10">
        <button
          onClick={() => advance(-1)}
          aria-label="Previous design"
          className="font-mono text-sm text-white/60 hover:text-white transition-colors"
        >
          ←
        </button>

        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Resume tour" : "Pause tour"}
          className="font-mono text-xs text-white/60 hover:text-white transition-colors w-20 text-center"
        >
          {paused ? "▶ Weiter" : "⏸ Pause"}
        </button>

        <button
          onClick={() => advance(1)}
          aria-label="Next design"
          className="font-mono text-sm text-white/60 hover:text-white transition-colors"
        >
          →
        </button>
      </div>

      {/* ── Dot navigation ───────────────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-1 px-4 pb-3">
        {queue.map((d, i) => (
          <button
            key={d.slug}
            onClick={() => {
              setCurrentIdx(i);
              setProgressKey((k) => k + 1);
            }}
            aria-label={`Jump to ${d.name}`}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i === currentIdx ? "bg-white" : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
