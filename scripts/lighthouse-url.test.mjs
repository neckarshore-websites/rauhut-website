/**
 * Regression guard for the Lighthouse quick-mode default URL.
 *
 * Why this exists: `npm run lighthouse:quick` (and the underlying script's
 * fallback `LIGHTHOUSE_URL`) must track whatever port `npm run dev` / `npm run
 * start` actually bind to (see package.json: both use `next ... -p 3001`). A
 * silent drift back to the old :3000 default would make `--quick` audits
 * fail to connect without any obvious error pointing at the mismatch.
 *
 * This test inspects the script's source text rather than importing/running
 * it: `lighthouse.mjs` executes its full build-or-audit pipeline as top-level
 * side-effecting code the moment it's loaded (no `if (import.meta.main)`
 * guard), so importing it in a test would spawn real child processes.
 *
 * Run: node --test scripts/lighthouse-url.test.mjs
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE = readFileSync(resolve(__dirname, "lighthouse.mjs"), "utf-8");

test("the LIGHTHOUSE_URL fallback defaults to port 3001", () => {
  assert.match(
    SOURCE,
    /const URL = process\.env\.LIGHTHOUSE_URL \|\| "http:\/\/localhost:3001";/,
    "default LIGHTHOUSE_URL must be http://localhost:3001",
  );
});

test("the fallback default does not regress back to port 3000", () => {
  assert.ok(
    !SOURCE.includes("http://localhost:3000"),
    "the old :3000 default must not reappear anywhere in the script",
  );
});

test("the quick-mode log message reports the same port as the URL default", () => {
  assert.match(
    SOURCE,
    /Quick mode — assuming server is running on :3001/,
    "quick-mode log message must reference :3001",
  );
});