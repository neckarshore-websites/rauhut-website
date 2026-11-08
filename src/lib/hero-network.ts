/**
 * Settings and geometry for the homepage hero network background (rauhut-website #111).
 *
 * Pure functions only: no DOM, no canvas. components/HeroNetwork.tsx draws what this
 * module computes.
 *
 * Source: the Founder's study rauhut-111-study.html (corrected palette), values ported
 * 1:1. The live level is "medium", between "Ruhig" (calm) and "Auffällig" (bold), by the
 * Founder's decision on #111 (2026-11-08). It is a first tuning value: change LEVEL or
 * the medium row here, nothing else.
 */

export type Settings = {
  /** Node count at 1100 px width and above. */
  nodes: number;
  /** Longest link in CSS px at 1000 px width and above. */
  link: number;
  /** Node drift in CSS px per 60 Hz frame. */
  speed: number;
  /** Base alpha of links and nodes. */
  alpha: number;
  /** Light pulses alive at the same time. */
  pulses: number;
  /** Largest pointer-driven shift of the nearest layer in CSS px. */
  parallax: number;
};

export const SETTINGS = {
  calm: { nodes: 70, link: 150, speed: 0.12, alpha: 0.45, pulses: 4, parallax: 14 },
  medium: { nodes: 90, link: 162, speed: 0.2, alpha: 0.52, pulses: 9, parallax: 22 },
  bold: { nodes: 110, link: 175, speed: 0.28, alpha: 0.6, pulses: 14, parallax: 30 },
} as const satisfies Record<string, Settings>;

export const LEVEL: keyof typeof SETTINGS = "medium";

/** Seed of the study, so the live layout matches it. */
export const SEED = 42;

/** Duration of the entry build in ms (study value). */
export const BUILD_MS = 1600;

export type Variant = {
  name: "full" | "reduced";
  /** Whether the pointer moves the layers and highlights links. */
  pointer: boolean;
  /** Device-pixel-ratio cap for the backing store. */
  maxDpr: number;
};

const FULL: Variant = { name: "full", pointer: true, maxDpr: 2 };
const REDUCED: Variant = { name: "reduced", pointer: false, maxDpr: 1.5 };

/** Phones and touch devices get the reduced variant. */
export function variantFor(env: { narrow: boolean; coarsePointer: boolean }): Variant {
  return env.narrow || env.coarsePointer ? REDUCED : FULL;
}

/** Park-Miller generator, as in the study. */
export function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** The study's hero box; its node count is cfg.nodes. */
const STUDY_AREA = 1100 * 520;

/** Upper bound on the area factor: keeps the pair loop bounded on very large screens. */
export const MAX_AREA_FACTOR = 1.6;

/**
 * The layer spans the top of the page (Founder 2026-11-08: "großflächig ... zumindest die
 * obere Hälfte"), so the count follows the area, keeping the study's density, bounded both ways.
 */
export function nodeCount(cfg: Settings, width: number, height: number): number {
  const factor = Math.min(MAX_AREA_FACTOR, Math.max(0.45, (width * height) / STUDY_AREA));
  return Math.round(cfg.nodes * factor);
}

export function linkDistance(cfg: Settings, width: number): number {
  return cfg.link * Math.min(1, Math.max(0.7, width / 1000));
}

/** The reduced variant keeps half the pulses (study: mobile halves them). */
export function maxPulses(cfg: Settings, variant: Variant): number {
  return variant.name === "reduced" ? Math.ceil(cfg.pulses / 2) : cfg.pulses;
}

export type Accent = "amber" | "teal" | "gray";

/** Mostly neutral gray, a few nodes in brand amber or teal (study: 7% each). */
export function accentOf(hue: number): Accent {
  if (hue < 0.07) return "amber";
  if (hue > 0.93) return "teal";
  return "gray";
}

/**
 * End colors of a link. The study blends its two node colors; an amber-to-teal blend
 * is the mixed color #111 rules out, so such a link is drawn gray.
 */
export function linkColors(a: Accent, b: Accent): [Accent, Accent] {
  if (a !== "gray" && b !== "gray" && a !== b) return ["gray", "gray"];
  return [a, b];
}

export type NetworkNode = { x: number; y: number; vx: number; vy: number; z: number; hue: number };

/**
 * Nodes cover the whole layer. The study leaned them right to keep the headline clear; here
 * the component dims the text block instead, so the network can fill the top of the page.
 */
export function buildNodes(width: number, height: number, cfg: Settings, rnd: () => number): NetworkNode[] {
  const count = nodeCount(cfg, width, height);
  const nodes: NetworkNode[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: rnd() * width,
      y: rnd() * height,
      vx: rnd() - 0.5,
      vy: rnd() - 0.5,
      z: 0.3 + rnd() * 0.7,
      hue: rnd(),
    });
  }
  return nodes;
}
