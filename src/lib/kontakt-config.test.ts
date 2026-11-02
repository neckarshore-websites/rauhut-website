/**
 * Guards for src/lib/kontakt-config.ts, the readable contact settings (planning #2879).
 *
 * WHAT THIS CANNOT DO: prove the production values are right. Only a live submit
 * through the form, arriving in the mailbox, does that.
 *
 * Run: npm run test:unit
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { register } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const hier = dirname(fileURLToPath(import.meta.url));
register(
  pathToFileURL(join(hier, "../app/actions/test-support/ts-path-alias-loader.mjs")).href,
  import.meta.url,
);

const { CAPTCHA_AKTIV, KONTAKT, TURNSTILE_SITEKEY } = await import("./kontakt-config.ts");
const { captchaSitekey, verifyCaptchaToken } = await import("./captcha/verify.ts");

const QUELLE = readFileSync(join(hier, "kontakt-config.ts"), "utf8");

function quellen(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const pfad = join(dir, name);
    if (statSync(pfad).isDirectory()) return quellen(pfad);
    return /\.(tsx?|mjs|js)$/.test(name) && !name.endsWith(".test.ts") ? [pfad] : [];
  });
}

async function mitUmgebung<T>(
  werte: Record<string, string | undefined>,
  fn: () => Promise<T>,
): Promise<T> {
  const umgebung = process.env as Record<string, string | undefined>;
  const vorher = Object.fromEntries(Object.keys(werte).map((k) => [k, umgebung[k]]));
  const setze = (paare: Record<string, string | undefined>) => {
    for (const [k, v] of Object.entries(paare)) {
      if (v === undefined) delete umgebung[k];
      else umgebung[k] = v;
    }
  };
  setze(werte);
  try {
    return await fn();
  } finally {
    setze(vorher);
  }
}

test("kontakt-config.ts names no secret variable or field", () => {
  const variable = QUELLE.match(/\b[A-Z0-9_]*(PASS|SECRET|TOKEN|PASSWORD|PASSWORT)[A-Z0-9_]*\b/g);
  assert.equal(variable, null, `secret variable name in kontakt-config.ts: ${variable}`);
  const feld = QUELLE.match(/\b\w*(pass|passwort|password|secret|geheim|token)\w*\s*:/gi);
  assert.equal(feld, null, `secret field in kontakt-config.ts: ${feld}`);
});

test("sender is the signed-in mailbox, values are complete", () => {
  assert.equal(KONTAKT.absender, KONTAKT.smtpUser, "IONOS refuses a foreign sender");
  assert.match(KONTAKT.empfaenger, /^[a-z0-9._-]+@rauhut\.com$/);
  assert.ok(KONTAKT.smtpPort > 0 && KONTAKT.smtpPort < 65536);
  assert.match(TURNSTILE_SITEKEY, /^0x4[A-Za-z0-9_-]+$/, "not a production site key");
});

test("no source file reads the old non-secret variables", () => {
  const ALT = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_FROM",
    "CONTACT_EMAIL_TO",
    "NEXT_PUBLIC_TURNSTILE_SITEKEY",
    "CAPTCHA_ENABLED",
    "NEXT_PUBLIC_CAPTCHA_ENABLED",
  ];
  for (const datei of quellen(join(hier, ".."))) {
    const text = readFileSync(datei, "utf8");
    for (const name of ALT) {
      assert.ok(!text.includes(`process.env.${name}`), `${datei} still reads ${name}`);
    }
  }
});

test("the mail transport refuses to log in without TLS", () => {
  const text = readFileSync(join(hier, "../app/actions/inquiry.ts"), "utf8");
  assert.match(text, /requireTLS: true/, "inquiry.ts sends without requireTLS");
});

test("captcha widget appears only where its secret exists", () => {
  assert.equal(CAPTCHA_AKTIV, true);
  assert.equal(captchaSitekey({}), null);
  assert.equal(captchaSitekey({ TURNSTILE_SECRET_KEY: "" }), null);
  assert.equal(captchaSitekey({ TURNSTILE_SECRET_KEY: "x" }), TURNSTILE_SITEKEY);
});

test("production fails closed without the captcha secret, a preview does not", async () => {
  const prod = await mitUmgebung(
    { NODE_ENV: "production", VERCEL_ENV: "production", TURNSTILE_SECRET_KEY: undefined },
    () => verifyCaptchaToken("x"),
  );
  assert.equal(prod.ok, false);
  const ausserhalb = await mitUmgebung(
    { NODE_ENV: "production", VERCEL_ENV: undefined, TURNSTILE_SECRET_KEY: undefined },
    () => verifyCaptchaToken("x"),
  );
  assert.equal(ausserhalb.ok, false, "a production build outside Vercel must fail closed");
  const vorschau = await mitUmgebung(
    { NODE_ENV: "production", VERCEL_ENV: "preview", TURNSTILE_SECRET_KEY: undefined },
    () => verifyCaptchaToken("x"),
  );
  assert.equal(vorschau.ok, true);
});
