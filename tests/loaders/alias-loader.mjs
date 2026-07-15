/**
 * Node ESM loader hook that resolves the `@/*` TypeScript path alias
 * (defined in tsconfig.json → compilerOptions.paths) to `src/*`.
 *
 * Why this exists: `node --test` runs source files directly (Node 22.6+ /
 * 23.6+ strip TypeScript types natively — no bundler in the loop), but
 * Node's own module resolver has no concept of the `@/*` alias used
 * throughout `src/` (e.g. `src/app/actions/inquiry.ts` imports
 * `@/lib/captcha/verify`). Without this hook, importing any module that
 * transitively uses the alias throws ERR_MODULE_NOT_FOUND.
 *
 * Usage: `node --experimental-strip-types --import ./tests/loaders/alias-loader.mjs --test <file>`
 * (see `test:unit` in package.json).
 */

import { register } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

register(import.meta.url, import.meta.url);

const SRC_DIR = new URL("../../src/", import.meta.url);
const CANDIDATE_EXTENSIONS = [".ts", ".tsx", ".mts", ""];

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const rel = specifier.slice(2);
    for (const ext of CANDIDATE_EXTENSIONS) {
      const candidate = new URL(rel + ext, SRC_DIR);
      if (ext === "" || existsSync(fileURLToPath(candidate))) {
        return nextResolve(candidate.href, context);
      }
    }
  }
  return nextResolve(specifier, context);
}