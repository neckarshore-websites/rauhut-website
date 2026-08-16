/**
 * Regression guard for the public figures on rauhut.com.
 *
 * WHY THIS EXISTS: on 2026-08-15 all four numbers on this site were held
 * against their sources for the first time since Oct 2025. Every one was
 * wrong, and every one was wrong LOW — the site undersold the work by roughly
 * half on two of four counts. One claim was not merely stale but false
 * (Obsidian Vault Autopilot described as "nearing public launch" for a
 * repository that is already public).
 *
 * A correction on a rarely-touched page decays silently. This locks the four
 * corrected surfaces so the old values cannot creep back unnoticed — the same
 * shape as the Lighthouse "Edge-5G" mislabel guard next door.
 *
 * WHAT THIS TEST CANNOT DO, STATED PLAINLY: it compares STRINGS, not truth.
 * It will not notice when 905 becomes stale, and it will not catch a figure
 * written in a different format (905 vs 9.05 vs "over 900"). The Messweg for
 * re-measuring each number lives in src/components/StatsRow.tsx. A guard that
 * implies more coverage than it has is worse than no guard.
 *
 * Run: npm run test:unit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** The old values, retired 2026-08-15. None of these may return. */
const RETIRED = [
  "466",
  "12+ spezialisierte",
  "12+ specialized",
  "Kurz vor Public Launch",
  "Nearing public",
];

/**
 * Every content surface that carried the figures, with the values it must
 * carry now. Adding a surface here is cheaper than rediscovering the drift.
 */
const SURFACES = [
  {
    file: "src/components/StatsRow.tsx",
    required: ["905", "96", "23"],
    note: "the stats row — single source for both languages",
  },
  {
    file: "src/app/page.tsx",
    required: ["905 Tests", "96 API-Endpoints", "23 spezialisierte"],
    note: "German project block",
  },
  {
    file: "src/app/en/page.tsx",
    required: ["905 tests", "96 API endpoints", "23 specialized"],
    note: "English project block",
  },
  {
    file: "public/llms.txt",
    required: ["905 tests", "96 API endpoints", "23 specialized"],
    note: "machine-reader surface — no human sees this one drift",
  },
];

/**
 * Read a surface, failing loudly if it is missing.
 *
 * A renamed or deleted file must NOT produce a silent pass: an empty read
 * would satisfy every "must not contain" assertion below and the suite would
 * go green while covering nothing.
 */
function readSurface(relPath) {
  try {
    return readFileSync(path.join(ROOT, relPath), "utf8");
  } catch (err) {
    assert.fail(
      `Content surface ${relPath} could not be read (${err.code}). ` +
        `If it moved, update SURFACES in this file — do not delete the entry, ` +
        `or the figures on that surface go unguarded.`,
    );
  }
}

/**
 * Strip comments from source files before checking for retired values.
 *
 * WHY THIS EXISTS, AND WHY IT IS NOT A LOOPHOLE: this guard fired on its first
 * day — against the provenance block in StatsRow.tsx, which explains WHY 466
 * was wrong and therefore contains the string "466". A guard that forbids
 * writing ABOUT a retired value pushes the next maintainer to delete the
 * explanation rather than re-check the number, destroying exactly the
 * documentation that prevents the next drift.
 *
 * So: a retired value is banned as CODE, permitted as PROSE. The comments are
 * where the reasoning lives; the ban belongs on the value fields.
 *
 * Line comments are stripped only when `//` opens the line (after whitespace),
 * so a URL inside a string literal survives intact.
 */
function stripComments(content, relPath) {
  if (!/\.(tsx?|mjs|jsx?)$/.test(relPath)) return content;
  return content.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

test("no surface is left unguarded", () => {
  assert.ok(
    SURFACES.length >= 4,
    `Expected at least the four known content surfaces, found ${SURFACES.length}. ` +
      `Removing one silently drops its figures out of this guard.`,
  );
});

for (const { file, required, note } of SURFACES) {
  test(`${file} — retired figures do not return (${note})`, () => {
    const content = stripComments(readSurface(file), file);
    for (const stale of RETIRED) {
      assert.ok(
        !content.includes(stale),
        `${file} carries the retired value "${stale}" again, OUTSIDE a comment. ` +
          `It was corrected on 2026-08-15 because it was measurably wrong. ` +
          `If the number genuinely changed back, re-measure it and update the ` +
          `provenance block in src/components/StatsRow.tsx first. ` +
          `(Writing about the old value in a comment is fine and deliberate — ` +
          `only the value fields are guarded.)`,
      );
    }
  });

  test(`${file} — carries the measured figures`, () => {
    // Also comment-stripped, and that direction matters more: a figure that
    // survives only inside the provenance comment while dropping out of the
    // rendered code would otherwise read as "present" — a vacuous pass.
    const content = stripComments(readSurface(file), file);
    for (const value of required) {
      assert.ok(
        content.includes(value),
        `${file} no longer carries "${value}". Either the figure was ` +
          `re-measured (then update this guard and the provenance block) or a ` +
          `refactor dropped it (then put it back).`,
      );
    }
  });
}
