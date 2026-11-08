/**
 * Guards for the hero network settings and geometry (rauhut-website #111).
 * Values come from the study rauhut-111-study.html; "medium" is the Founder's level.
 * Run: npm run test:unit
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  LEVEL,
  SETTINGS,
  accentOf,
  buildNodes,
  linkColors,
  linkDistance,
  maxPulses,
  nodeCount,
  seeded,
  variantFor,
} from "./hero-network.ts";

test("the live level is the study's medium, and medium sits between calm and bold", () => {
  assert.equal(LEVEL, "medium");
  const { calm, medium, bold } = SETTINGS;
  for (const key of Object.keys(calm) as (keyof typeof calm)[]) {
    assert.ok(medium[key] >= calm[key] && medium[key] <= bold[key], `${key}: ${medium[key]} outside ${calm[key]}..${bold[key]}`);
  }
});

test("the medium values are the study's values, unchanged", () => {
  assert.deepEqual(SETTINGS.medium, { nodes: 90, link: 162, speed: 0.2, alpha: 0.52, pulses: 9, parallax: 22 });
});

test("the seeded generator repeats itself, so screenshots are stable", () => {
  const a = seeded(42);
  const b = seeded(42);
  const seqA = Array.from({ length: 5 }, () => a());
  assert.deepEqual(seqA, Array.from({ length: 5 }, () => b()));
  for (const n of seqA) assert.ok(n >= 0 && n < 1, `${n} is outside [0, 1)`);
});

test("node count and link distance scale with width as in the study", () => {
  const cfg = SETTINGS.medium;
  assert.equal(nodeCount(cfg, 1100), 90);
  assert.equal(nodeCount(cfg, 2000), 90);
  assert.equal(nodeCount(cfg, 390), Math.round(90 * 0.45));
  assert.equal(linkDistance(cfg, 1000), 162);
  assert.equal(linkDistance(cfg, 300), 162 * 0.7);
});

test("the mobile variant is reduced: half the pulses, no pointer, lower pixel density", () => {
  const full = variantFor({ narrow: false, coarsePointer: false });
  const reduced = variantFor({ narrow: true, coarsePointer: false });
  assert.equal(full.name, "full");
  assert.equal(reduced.name, "reduced");
  assert.equal(variantFor({ narrow: false, coarsePointer: true }).name, "reduced");
  assert.equal(reduced.pointer, false);
  assert.ok(reduced.maxDpr < full.maxDpr);
  assert.equal(maxPulses(SETTINGS.medium, full), 9);
  assert.equal(maxPulses(SETTINGS.medium, reduced), 5);
});

test("accents stay sparse: about 7% amber and 7% teal nodes, the rest gray", () => {
  const rnd = seeded(7);
  const counts = { amber: 0, teal: 0, gray: 0 };
  for (let i = 0; i < 10_000; i++) counts[accentOf(rnd())]++;
  assert.ok(counts.amber > 500 && counts.amber < 900, `amber ${counts.amber}`);
  assert.ok(counts.teal > 500 && counts.teal < 900, `teal ${counts.teal}`);
  assert.ok(counts.gray > 8200, `gray ${counts.gray}`);
});

test("a link never blends amber into teal: such a link is drawn gray", () => {
  assert.deepEqual(linkColors("amber", "teal"), ["gray", "gray"]);
  assert.deepEqual(linkColors("teal", "amber"), ["gray", "gray"]);
  assert.deepEqual(linkColors("gray", "teal"), ["gray", "teal"]);
  assert.deepEqual(linkColors("amber", "amber"), ["amber", "amber"]);
});

test("nodes start inside the box; on desktop they lean right, away from the headline", () => {
  const cfg = SETTINGS.medium;
  const desktop = buildNodes(720, 480, cfg, seeded(42));
  assert.equal(desktop.length, nodeCount(cfg, 720));
  for (const n of desktop) {
    assert.ok(n.x >= 0.25 * 720 - 1e-9 && n.x <= 720 && n.y >= 0 && n.y <= 480, "node outside the box");
    assert.ok(n.z >= 0.3 && n.z <= 1, "depth outside [0.3, 1]");
  }
  const mobile = buildNodes(390, 600, cfg, seeded(42));
  assert.ok(mobile.some((n) => n.x < 0.25 * 390), "on mobile nodes cover the full width");
});
