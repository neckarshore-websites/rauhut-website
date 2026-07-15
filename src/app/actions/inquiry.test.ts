/**
 * Unit tests for the contact Server Action's single-line field sanitization
 * (`cleanLine`, added to fix newline/mail-header injection via `name`,
 * `email`, and the `website` honeypot — see inquiry.ts for the full
 * rationale).
 *
 * `cleanLine` itself is module-private (not exported — `"use server"` files
 * may only export async functions), so it is exercised indirectly through
 * `sendContact`'s public behavior: the validation-error `values` echo and
 * the dry-run console log (no SMTP env configured / no NODE_ENV=production
 * in this environment → `sendContact` never touches the network).
 *
 * Run: npm run test:unit
 * (Node's built-in `--test` runner + the `@/*` alias loader in
 * tests/loaders/alias-loader.mjs — no bundler, no extra devDependency.)
 */

import test, { beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { sendContact } from "./inquiry.ts";
import { CONTACT_INITIAL_STATE } from "./inquiry-state.ts";

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

let envSnapshot: Record<string, string | undefined> = {};

beforeEach(() => {
  // Force the deterministic "no SMTP configured, captcha disabled, not
  // production" path so sendContact never attempts a real network call and
  // never fail-closes on a missing captcha secret — isolating the tests to
  // the field-cleaning behavior under test.
  envSnapshot = {};
  for (const key of ENV_KEYS) {
    envSnapshot[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    const value = envSnapshot[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function buildFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

/** Runs sendContact with the given fields, defaulting unset fields to "". */
function submit(fields: Partial<Record<"name" | "email" | "message" | "website", string>>) {
  const formData = buildFormData({
    website: "",
    name: "",
    email: "",
    message: "",
    ...fields,
  });
  return sendContact(CONTACT_INITIAL_STATE, formData);
}

// ── Honeypot ─────────────────────────────────────────────────────────────

test("honeypot: multi-line spam content in the website field triggers a silent success", async () => {
  const result = await submit({
    website: "http://spam.example\nX-Injected-Header: evil",
    name: "",
    email: "",
    message: "",
  });

  assert.equal(result.status, "success");
  assert.equal(result.fieldErrors, undefined);
  assert.equal(result.values, undefined);
});

test("honeypot: a whitespace/newline-only website value is not treated as filled", async () => {
  // If cleanLine's collapse+trim ever left a stray space, this would be
  // truthy and silently short-circuit to "success" instead of validating —
  // asserting the real validation errors below proves it did not.
  const result = await submit({ website: "   \n\n   ", name: "", email: "", message: "" });

  assert.equal(result.status, "error");
  assert.ok(result.fieldErrors?.name);
  assert.ok(result.fieldErrors?.email);
  assert.ok(result.fieldErrors?.message);
});

// ── name / email single-line collapsing ─────────────────────────────────

test("name with CRLF and blank lines collapses to single spaces in the echoed value", async () => {
  const result = await submit({
    name: "John\r\n\r\n\r\nDoe",
    email: "", // force a validation error so `values` is populated
    message: "hello world",
  });

  assert.equal(result.status, "error");
  assert.ok(result.fieldErrors?.email);
  assert.equal(result.values?.name, "John Doe");
});

test("consecutive newlines collapse to exactly one space, not one space per newline", async () => {
  const result = await submit({
    name: "John\n\n\nDoe",
    email: "",
    message: "hello world",
  });

  assert.equal(result.values?.name, "John Doe");
});

test("leading/trailing newlines around name are removed after collapsing", async () => {
  const result = await submit({
    name: "\nJane Doe\n",
    email: "",
    message: "hello world",
  });

  assert.equal(result.values?.name, "Jane Doe");
});

test("regular internal spaces (non-newline whitespace) are left untouched", async () => {
  const result = await submit({
    name: "John   Doe",
    email: "",
    message: "hello world",
  });

  // Only \r\n is collapsed — plain spaces are not touched by cleanLine.
  assert.equal(result.values?.name, "John   Doe");
});

test("boundary: a newline exposed exactly at the MAX_FIELD_LEN(200) slice point is still collapsed and trimmed", async () => {
  // clean() trims first, THEN slices to 200 chars — so a newline that isn't
  // at the raw string's edge can become the new trailing character only
  // *after* slicing. cleanLine must still catch it (this is exactly why it
  // re-trims after collapsing, not just once up front).
  const longName = "A".repeat(199) + "\n" + "overflow-tail";
  const result = await submit({
    name: longName,
    email: "",
    message: "hello world",
  });

  assert.equal(result.values?.name, "A".repeat(199));
  assert.ok(!result.values?.name?.includes("\n"));
});

test("email with an embedded newline is collapsed to one line and still rejected as invalid", async () => {
  const result = await submit({
    name: "Jane Doe",
    email: "attacker@evil.com\nBcc:victim@evil.com",
    message: "hello world",
  });

  assert.equal(result.status, "error");
  assert.ok(result.fieldErrors?.email);
  assert.equal(result.values?.email, "attacker@evil.com Bcc:victim@evil.com");
  assert.ok(!result.values?.email?.includes("\n"));
  assert.ok(!result.values?.email?.includes("\r"));
});

// ── message stays multi-line (cleanLine scope boundary) ─────────────────

test("message field is unaffected by cleanLine — internal newlines are preserved", async () => {
  const result = await submit({
    name: "", // force a validation error so `values` is populated
    email: "person@example.com",
    message: "Line one\nLine two",
  });

  assert.equal(result.status, "error");
  assert.ok(result.fieldErrors?.name);
  assert.equal(result.values?.message, "Line one\nLine two");
});

// ── End-to-end: the whole point of the fix — no header-line injection ───

test("a valid submission with a multi-line name produces a single-line mail Subject in the dry-run log", async (t) => {
  // node:test's built-in mocking auto-restores console.log after this test.
  const logMock = t.mock.method(console, "log", () => {});

  const result = await submit({
    name: "Ada\nLovelace",
    email: "ada@example.com",
    message: "Hello there",
  });

  assert.equal(result.status, "success");

  const logged = logMock.mock.calls
    .map((call) => call.arguments.join(" "))
    .join("\n");
  assert.ok(logged.includes("Subject: Kontaktanfrage von Ada Lovelace"));
  // The whole point of the fix: the Subject line must never contain a raw
  // newline splitting the name across two lines.
  assert.ok(!logged.includes("Kontaktanfrage von Ada\nLovelace"));
});