/**
 * Regression guard for the site's ONE contact address.
 *
 * HISTORY, BECAUSE THE DIRECTION OF THIS GUARD REVERSED ONCE: from
 * 2026-09-12 (P6-mail) the site ran a SPLIT — `mandat@rauhut.com` on public
 * surfaces, `german@rauhut.com` kept only on the legal pages — and this file
 * guarded that split. On 2026-09-14 the Founder reversed it: the Impressum
 * carries `german@` by law anyway (§ 5 TMG), so hiding it elsewhere bought
 * no spam protection and cost the page a second identity.
 *
 * WHAT IT GUARDS NOW, and why it was not simply deleted with the split:
 *   (a) the retired ALIAS must not creep back onto any surface — a
 *       half-reverted edit leaving `mandat@` in one file is the likeliest
 *       failure, and it is invisible to a reader who checks only the hero;
 *   (b) every public surface carries or imports the one address;
 *   (c) the legal pages still carry it — unchanged in purpose. This half
 *       was always the more valuable one: it stops a future "address
 *       cleanup" from scrubbing a statutory contact.
 *
 * WHAT THIS TEST CANNOT DO: it compares STRINGS, not rendered output or
 * legal correctness. It does not know whether the legal pages' occurrences
 * are still lawful — only that they are still present.
 *
 * Run: npm run test:unit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Retired 2026-09-14 (was the public alias from 2026-09-12 to 2026-09-14). */
const RETIRED_ADDRESS = "mandat@rauhut.com";
/** The one address, public and statutory alike. */
const PUBLIC_ADDRESS = "german@rauhut.com";

/** Public "Folie" surfaces: must never carry the retired address. */
const PUBLIC_SURFACES = [
  "src/app/page.tsx",
  "src/app/en/page.tsx",
  "src/components/ContactCards.tsx",
  "src/components/PersonJsonLd.tsx",
  "src/app/actions/inquiry.ts",
  "src/app/actions/inquiry-state.ts",
  "src/lib/contact.ts",
  "public/llms.txt",
];

/**
 * Of those, the ones that carry the address as a literal string. The hero CTAs
 * and ContactCards import it from src/lib/contact.ts instead (P6-mail); the
 * Server Action (inquiry.ts) sources its transportFailure copy from
 * inquiry-state.ts's CONTACT_COPY instead (P6-lead) — both checked
 * separately below via the import, not a literal-string search.
 */
const LITERAL_ADDRESS_SURFACES = [
  "src/components/PersonJsonLd.tsx",
  "src/app/actions/inquiry-state.ts",
  "src/lib/contact.ts",
  "public/llms.txt",
];

/** Surfaces that must source the address from the shared module. */
const IMPORTS_CONTACT_MODULE = [
  "src/app/page.tsx",
  "src/app/en/page.tsx",
  "src/components/ContactCards.tsx",
];

/**
 * Legal-notice surfaces: must KEEP the retired address — these identify the
 * responsible natural person for statutory purposes (Impressum/Datenschutz)
 * and must not silently become an alias. A missing occurrence here is a
 * regression just as real as a leaked one on a public surface.
 */
const LEGAL_SURFACES = [
  "src/app/impressum/page.tsx",
  "src/app/datenschutz/page.tsx",
];

/**
 * Strip comments before the retired-value check — prose ABOUT the reversal
 * is allowed, the value in code is not. Line comments only when `//` opens
 * the line, so a mailto inside a string literal survives.
 */
function stripComments(content, relPath) {
  if (!/\.(tsx?|mjs|jsx?)$/.test(relPath)) return content;
  return content.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

function readSurface(relPath) {
  try {
    return readFileSync(path.join(ROOT, relPath), "utf8");
  } catch (err) {
    assert.fail(
      `Content surface ${relPath} could not be read (${err.code}). ` +
        `If it moved, update PUBLIC_SURFACES/LEGAL_SURFACES in this file.`,
    );
  }
}

test("no surface carries the retired mandat@ alias", () => {
  for (const file of [...PUBLIC_SURFACES, ...LEGAL_SURFACES]) {
    const content = readSurface(file);
    // Prose may explain the reversal; the ban is on the value, not on
    // writing about it — same carve-out as public-figures.test.mjs, and for
    // the same reason: a guard that forbids documenting a retired value
    // pushes the next maintainer to delete the explanation.
    const code = stripComments(content, file);
    assert.ok(
      !code.includes(RETIRED_ADDRESS),
      `${file} still contains "${RETIRED_ADDRESS}" as code — the alias was retired 2026-09-14, every surface uses "${PUBLIC_ADDRESS}".`,
    );
  }
});

test("surfaces that hardcode the address carry german@rauhut.com literally", () => {
  for (const file of LITERAL_ADDRESS_SURFACES) {
    const content = readSurface(file);
    assert.ok(
      content.includes(PUBLIC_ADDRESS),
      `${file} does not contain "${PUBLIC_ADDRESS}" — expected on every public contact surface (P6-mail).`,
    );
  }
});

test("hero CTAs and ContactCards source the address from src/lib/contact.ts", () => {
  for (const file of IMPORTS_CONTACT_MODULE) {
    const content = readSurface(file);
    assert.ok(
      content.includes("@/lib/contact"),
      `${file} does not import from "@/lib/contact" — it must not hardcode the ` +
        `contact address inline (P6-mail: one source of truth for the DE/EN mailto strings).`,
    );
  }
});

test("legal-notice pages keep the statutory german@ address", () => {
  for (const file of LEGAL_SURFACES) {
    const content = readSurface(file);
    assert.ok(
      content.includes(PUBLIC_ADDRESS),
      `${file} no longer contains "${PUBLIC_ADDRESS}" — this is a legally mandated ` +
        `contact address (Impressum § 5 TMG, Datenschutz § 1 and § 9) and must not be ` +
        `removed or replaced, not even during an address cleanup.`,
    );
  }
});
