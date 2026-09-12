/**
 * Regression guard for the P10 typography-tightening pass (2026-09-12).
 *
 * WHY THIS EXISTS: P10 collapsed "1 font, 9 sizes, 9 trackings, 7 text
 * colors" down to a small, deliberate set — one mute gray, teal-only text
 * links (no third accent), three trackings (overlines 0.1em, H1/Kennzahlen
 * -0.03em, everything else normal), two sizes merged away (15px → 16px,
 * 11px → 12px). Every one of those constraints is easy to violate by
 * habit: reaching for `text-[0.9375rem]` because that's what was there a
 * moment ago in a nearby element, or `tracking-tight` because it "looks
 * right" on a new heading. This guard catches the habit, not the intent —
 * see the WHAT THIS TEST CANNOT DO note below.
 *
 * WHAT THIS TEST CANNOT DO: it checks SOURCE STRINGS, not rendered,
 * computed style. It cannot see a hardcoded hex color, an inline `style=`
 * attribute, or a value reached via `color-mix()`. The actual computed-
 * style verification for this pass (getComputedStyle across `/` and `/en`,
 * both themes) was done once by hand during implementation and is not
 * re-run automatically — this guard is the cheap, permanent tripwire for
 * the common regression (a future edit reaching for the old class names),
 * not a substitute for that one-time check.
 *
 * Run: npm run test:unit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The homepage (DE + EN) and every component they render. /designs and the
 * legal pages (Impressum/Datenschutz/not-found) are deliberately excluded —
 * P10's Fertig-wenn scopes to `/` and `/en` only; those other routes were
 * never measured for this pass and may still carry the retired values.
 */
const HOMEPAGE_SURFACES = [
  "src/app/page.tsx",
  "src/app/en/page.tsx",
  "src/components/StatsRow.tsx",
  "src/components/Timeline.tsx",
  "src/components/Offers.tsx",
  "src/components/ContactCards.tsx",
  "src/components/ContactForm.tsx",
  "src/components/NavRail.tsx",
];

const RETIRED_SIZE_PATTERNS = [
  { pattern: /text-\[0\.9375rem\]/, label: "15px (text-[0.9375rem]) — merged into 16px (text-base)" },
  { pattern: /text-\[0\.6875rem\]/, label: "11px (text-[0.6875rem]) — merged into 12px (text-xs)" },
];

function readSurface(relPath) {
  try {
    return readFileSync(path.join(ROOT, relPath), "utf8");
  } catch (err) {
    assert.fail(
      `Content surface ${relPath} could not be read (${err.code}). ` +
        `If it moved, update HOMEPAGE_SURFACES in this file.`,
    );
  }
}

test("the homepage and its components never reach for the two retired font sizes", () => {
  for (const file of HOMEPAGE_SURFACES) {
    const content = readSurface(file);
    for (const { pattern, label } of RETIRED_SIZE_PATTERNS) {
      assert.ok(
        !pattern.test(content),
        `${file} still contains ${label} (P10).`,
      );
    }
  }
});

test("the homepage and its components carry no bare tracking-tight (only H1/Kennzahlen keep tight tracking, via tracking-[-0.03em])", () => {
  for (const file of HOMEPAGE_SURFACES) {
    const content = readSurface(file);
    assert.ok(
      !/\btracking-tight\b/.test(content),
      `${file} still contains "tracking-tight" (Tailwind's stock -0.025em) — P10 moved H1/Kennzahlen-Ziffern to the explicit "tracking-[-0.03em]" and stripped tracking from every other heading.`,
    );
  }
});

test("globals.css: text-subtle equals text-muted in both themes (one mute gray)", () => {
  const css = readSurface("src/app/globals.css");

  const darkMuted = css.match(/--color-text-muted:\s*(#[0-9A-Fa-f]{6})/);
  const darkSubtle = css.match(/--color-text-subtle:\s*(#[0-9A-Fa-f]{6})/);
  assert.ok(darkMuted && darkSubtle, "expected both --color-text-muted and --color-text-subtle in the dark @theme block");
  assert.equal(
    darkSubtle[1].toLowerCase(),
    darkMuted[1].toLowerCase(),
    "dark-mode --color-text-subtle must equal --color-text-muted (P10: one mute gray, not two)",
  );

  // Light-mode override block: same two variables, second occurrence of each.
  const lightMuted = [...css.matchAll(/--color-text-muted:\s*(#[0-9A-Fa-f]{6})/g)];
  const lightSubtle = [...css.matchAll(/--color-text-subtle:\s*(#[0-9A-Fa-f]{6})/g)];
  assert.equal(lightMuted.length, 2, "expected --color-text-muted exactly twice (dark @theme + light override)");
  assert.equal(lightSubtle.length, 2, "expected --color-text-subtle exactly twice (dark @theme + light override)");
  assert.equal(
    lightSubtle[1][1].toLowerCase(),
    lightMuted[1][1].toLowerCase(),
    "light-mode --color-text-subtle must equal --color-text-muted (P10: one mute gray, not two)",
  );
});

test("globals.css: the base <a> rule uses brand-teal, not accent-hover, for plain text links", () => {
  const css = readSurface("src/app/globals.css");
  const baseLinkRule = css.match(/@layer base \{\s*a \{([^}]*)\}/);
  assert.ok(baseLinkRule, "expected the base `a { ... }` rule inside @layer base");
  assert.match(
    baseLinkRule[1],
    /color:\s*var\(--color-brand-teal\)/,
    "the base <a> color must be --color-brand-teal (P10 Variante 2a: teal-only text links, no third accent) — found: " +
      baseLinkRule[1].trim(),
  );
  assert.doesNotMatch(
    baseLinkRule[1],
    /color:\s*var\(--color-accent/,
    "the base <a> color must NOT reference --color-accent or --color-accent-hover any more",
  );
});

test("globals.css: no stray global h1/h2/h3 letter-spacing rule survives (the -0.015em / -0.24px offender)", () => {
  const css = readSurface("src/app/globals.css");
  assert.doesNotMatch(
    css,
    /h1,\s*\n?\s*h2,\s*\n?\s*h3\s*\{\s*letter-spacing:/,
    "a global h1,h2,h3 { letter-spacing: ... } rule reappeared — P10 removed this rule entirely; H1 now carries its own explicit tracking-[-0.03em] utility, and h2/h3 fall through to normal.",
  );
});
