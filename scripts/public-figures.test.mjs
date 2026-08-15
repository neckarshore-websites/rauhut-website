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

test("no surface is left unguarded", () => {
  assert.ok(
    SURFACES.length >= 4,
    `Expected at least the four known content surfaces, found ${SURFACES.length}. ` +
      `Removing one silently drops its figures out of this guard.`,
  );
});

for (const { file, required, note } of SURFACES) {
  test(`${file} — retired figures do not return (${note})`, () => {
    const content = readSurface(file);
    for (const stale of RETIRED) {
      assert.ok(
        !content.includes(stale),
        `${file} carries the retired value "${stale}" again. ` +
          `It was corrected on 2026-08-15 because it was measurably wrong. ` +
          `If the number genuinely changed back, re-measure it and update the ` +
          `provenance block in src/components/StatsRow.tsx first.`,
      );
    }
  });

  test(`${file} — carries the measured figures`, () => {
    const content = readSurface(file);
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
