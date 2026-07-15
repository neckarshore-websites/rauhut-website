/**
 * Unit tests for the contact Server Action's single-line field cleaning
 * introduced in this PR: `cleanLine()` collapses embedded CR/LF in
 * single-line fields (name, email, honeypot) to a space before they can
 * reach the mail Subject header or be smuggled through as multiple mail
 * headers ("header injection"). The multi-line `message` body is
 * deliberately left untouched (still plain `clean()`).
 *
 * `clean()` / `cleanLine()` are private module helpers — a "use server"
 * file may only export async functions (see the file-level comment in
 * inquiry.ts) — so behaviour is verified end-to-end through the exported
 * `sendContact()` action, either via the echoed `values` on
 * validation-error responses or by inspecting the dev dry-run log that
 * `sendContact()` prints in place of actually sending mail.
 *
 * No network I/O: with no SMTP_* env vars set and NODE_ENV !== "production",
 * `sendContact()` takes its dev/preview dry-run fallback. With
 * CAPTCHA_ENABLED unset, `verifyCaptchaToken()` short-circuits to
 * `{ ok: true, skipped: true }` without calling out to Cloudflare.
 *
 * Run: npm run test:unit  (gated in CI by .github/workflows/unit.yml)
 * Requires Node >=22.6 for native TypeScript type-stripping of the erasable
 * syntax in inquiry.ts (type annotations, `import type`, interfaces — no
 * enums/namespaces); the unit CI job runs on Node 22 for this reason.
 *
 * A tiny loader (./test-support/ts-path-alias-loader.mjs) is registered
 * below so the tsconfig `@/*` alias used inside inquiry.ts resolves under
 * plain `node --test` (Next's bundler does this resolution at build time).
 */

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
register(
  pathToFileURL(`${__dirname}/test-support/ts-path-alias-loader.mjs`).href,
  import.meta.url,
);

const { sendContact } = await import("./inquiry.ts");

function formData(fields: Record<string, string | undefined>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) fd.set(key, value);
  }
  return fd;
}

const VALID = {
  name: "Ann Smith",
  email: "ann@example.com",
  message: "Hello there",
};

const ENV_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "CONTACT_EMAIL_TO",
  "CAPTCHA_ENABLED",
  "TURNSTILE_SECRET_KEY",
  "NODE_ENV",
] as const;

const savedEnv: Record<string, string | undefined> = {};

// Next's ambient types mark process.env.NODE_ENV readonly; the test needs to
// mutate it, so write through an untyped view of the same object.
const mutableEnv = process.env as Record<string, string | undefined>;

before(() => {
  for (const k of ENV_KEYS) savedEnv[k] = process.env[k];
  for (const k of ENV_KEYS) delete process.env[k];
  // Force the dev/preview dry-run branch (never the production error path).
  mutableEnv.NODE_ENV = "test";
});

after(() => {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else mutableEnv[k] = savedEnv[k];
  }
});

test("collapses an embedded newline in the name field to a space", async () => {
  const state = await sendContact(
    { status: "idle" },
    formData({ ...VALID, name: "Ann\nSmith", email: "not-an-email" }),
  );
  assert.equal(state.status, "error");
  assert.equal(state.values?.name, "Ann Smith");
});

test("collapses CRLF in the email field, which then fails email validation", async () => {
  const state = await sendContact(
    { status: "idle" },
    formData({ ...VALID, email: "foo\r\nbar@example.com" }),
  );
  assert.equal(state.status, "error");
  assert.equal(state.fieldErrors?.email, "Bitte gültige E-Mail-Adresse angeben.");
  // The CRLF must be gone entirely — collapsed to a literal space, not
  // smuggled through as a raw control character.
  assert.equal(state.values?.email, "foo bar@example.com");
  assert.ok(!state.values?.email?.includes("\r"));
  assert.ok(!state.values?.email?.includes("\n"));
});

test("collapses multiple consecutive newlines into a single space", async () => {
  const state = await sendContact(
    { status: "idle" },
    formData({ ...VALID, name: "Ann\n\n\nSmith", email: "not-an-email" }),
  );
  assert.equal(state.status, "error");
  assert.equal(state.values?.name, "Ann Smith");
});

test("multi-line message body is preserved (only single-line fields collapse newlines)", async () => {
  const state = await sendContact(
    { status: "idle" },
    formData({ ...VALID, email: "not-an-email", message: "Line one\nLine two" }),
  );
  assert.equal(state.status, "error");
  assert.equal(state.values?.message, "Line one\nLine two");
});

test("honeypot still triggers on real spam content after the clean()->cleanLine() swap", async () => {
  const state = await sendContact(
    { status: "idle" },
    formData({ ...VALID, website: "http://spam.example" }),
  );
  assert.deepEqual(state, { status: "success" });
});

test("max field length is still enforced after collapsing newlines", async () => {
  // clean() slices to MAX_FIELD_LEN (200) BEFORE cleanLine() collapses
  // newlines, so this 252-char input is sliced to "a"×199 + one leading
  // "\n" (chars 0..199), which then collapses to a trailing space and gets
  // trimmed away — leaving exactly "a"×199.
  const longName = "a".repeat(199) + "\n\n\n" + "b".repeat(50);
  const state = await sendContact(
    { status: "idle" },
    formData({ ...VALID, name: longName, email: "not-an-email" }),
  );
  assert.equal(state.values?.name, "a".repeat(199));
  assert.ok((state.values?.name?.length ?? 0) <= 200);
});

test("prevents a crafted name from splitting the mail Subject header via embedded newline", async () => {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.join(" "));
  };
  let state;
  try {
    state = await sendContact(
      { status: "idle" },
      formData({ ...VALID, name: "Ann\nBcc: attacker@evil.com", email: "ann@example.com" }),
    );
  } finally {
    console.log = originalLog;
  }

  assert.equal(state.status, "success");

  const dryRunLog = logs.find((l) => l.includes("Subject:"));
  assert.ok(dryRunLog, "expected the dev dry-run log to contain a Subject line");
  const subjectLine = dryRunLog!.split("\n").find((l) => l.startsWith("Subject:"));
  assert.equal(
    subjectLine,
    "Subject: Kontaktanfrage von Ann Bcc: attacker@evil.com",
    "the injected newline must not split the Subject header into multiple lines",
  );
});

test("a fully valid submission still succeeds (dev dry-run fallback, no SMTP configured)", async () => {
  const state = await sendContact({ status: "idle" }, formData(VALID));
  assert.deepEqual(state, { status: "success" });
});
