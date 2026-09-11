/**
 * Regression guard for the P6-mail contact-mail split (2026-09-12).
 *
 * WHY THIS EXISTS: `german@rauhut.com` was retired from every PUBLIC contact
 * surface in favor of the `mandat@rauhut.com` alias — but three files keep
 * `german@rauhut.com` on purpose, because it is a legally mandated contact
 * address there (Impressum § 5 TMG, Datenschutz § 1 Verantwortlicher, § 9
 * Ihre Rechte), not a "Folie" address. A future edit could silently either
 * (a) let `german@rauhut.com` creep back into a public surface, or (b)
 * accidentally scrub it from a legal page while "cleaning up" the address —
 * both directions are worth catching, so this checks both.
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

const RETIRED_ADDRESS = "german@rauhut.com";
const PUBLIC_ADDRESS = "mandat@rauhut.com";

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
 * Of those, the ones that carry the alias as a literal string. The hero CTAs
 * and ContactCards import it from src/lib/contact.ts instead (P6-mail); the
 * Server Action (inquiry.ts) sources its transportFailure copy from
 * inquiry-state.ts's CONTACT_COPY instead (P6-lead) — both checked
 * separately below via the import, not a literal-string search.
 */
const LITERAL_ALIAS_SURFACES = [
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

test("public contact surfaces never carry the retired german@ address", () => {
  for (const file of PUBLIC_SURFACES) {
    const content = readSurface(file);
    assert.ok(
      !content.includes(RETIRED_ADDRESS),
      `${file} still contains "${RETIRED_ADDRESS}" — public surfaces must use "${PUBLIC_ADDRESS}" (P6-mail).`,
    );
  }
});

test("surfaces that hardcode the alias carry mandat@rauhut.com literally", () => {
  for (const file of LITERAL_ALIAS_SURFACES) {
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

test("legal-notice pages keep the statutory german@ address untouched", () => {
  for (const file of LEGAL_SURFACES) {
    const content = readSurface(file);
    assert.ok(
      content.includes(RETIRED_ADDRESS),
      `${file} no longer contains "${RETIRED_ADDRESS}" — this is a legally mandated ` +
        `contact address (Impressum/Datenschutz) and must not be replaced with the alias.`,
    );
  }
});
