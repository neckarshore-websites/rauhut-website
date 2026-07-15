/**
 * Minimal Node ESM loader hook that resolves the tsconfig `@/*` path alias
 * (see ../../../../tsconfig.json → paths) to `<repo>/src/*`.
 *
 * Next.js resolves this alias via its bundler (SWC/webpack) at build time.
 * A bare `node --test` process has no such bundler, so importing a source
 * file that uses `@/...` imports (e.g. `../inquiry.ts` imports
 * `@/lib/captcha/verify`) fails to resolve without this hook.
 *
 * Registered from a test file via `node:module`'s `register()`, e.g.:
 *   register(pathToFileURL("./test-support/ts-path-alias-loader.mjs"), import.meta.url)
 *
 * Test-only: not used by the Next.js app itself.
 */

import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve as resolvePath, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// ../../../  ==  <repo>/src  (test-support -> actions -> app -> src)
const REPO_SRC = resolvePath(__dirname, "../../../");

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const target = resolvePath(REPO_SRC, specifier.slice(2));
    // Bare `node --test` resolution (unlike Next's bundler) requires an
    // explicit extension for relative-style paths.
    const candidate = [".ts", ".tsx", ".mts", ""].find(
      (ext) => ext === "" || existsSync(target + ext),
    );
    const mapped = pathToFileURL(target + candidate).href;
    return nextResolve(mapped, context);
  }
  return nextResolve(specifier, context);
}