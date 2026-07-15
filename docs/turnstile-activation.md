# Turnstile-Aktivierung — Runbook

Stand: 2026-07-15. Der komplette Turnstile-Stack ist gebaut und **dormant**:
Client-Widget (`src/components/Turnstile.tsx`), Server-Verifikation
(`src/lib/captcha/verify.ts`), CSP-Freigaben für `challenges.cloudflare.com`
(`next.config.ts` — script-src, frame-src, connect-src) und ein
§ 6-Passus in der Datenschutzerklärung. Bis zur Aktivierung schützt nur das
Honeypot-Feld der Server Action vor Spam.

Aktivierung = reine Konfiguration (Cloudflare + Vercel), **kein Code-Change**.
Dauer ca. 15 Minuten.

---

## 1. Cloudflare: Widget anlegen

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Turnstile** →
   **Add widget** (kostenloser Account reicht; Turnstile ist gratis und
   unlimitiert, die Domain muss NICHT bei Cloudflare gehostet sein).
2. Widget-Name: `rauhut.com Kontaktformular`.
3. Hostname: `rauhut.com` (deckt die Apex ab; `www` redirected serverseitig
   308 auf Apex und braucht keinen eigenen Eintrag).
4. Widget-Modus: **Managed** (empfohlen — non-interactive im Normalfall;
   das Client-Widget rendert mit `appearance: "interaction-only"`, d.h.
   unsichtbar solange Cloudflare keine echte Challenge verlangt).
5. Notieren: **Sitekey** (öffentlich) und **Secret Key** (geheim).

## 2. Vercel: Env-Vars setzen (Environment: Production)

Vercel Dashboard → Project `rauhut-website` → Settings → Environment Variables.
**Alle vier** müssen gesetzt sein — die Flags client- und serverseitig sind
getrennte Variablen und müssen gemeinsam kippen:

| Variable | Wert | Sichtbarkeit |
|---|---|---|
| `NEXT_PUBLIC_CAPTCHA_ENABLED` | `true` | Public (Build-time, ins Bundle gebacken) |
| `NEXT_PUBLIC_TURNSTILE_SITEKEY` | `<Sitekey aus Schritt 1>` | Public (Build-time) |
| `CAPTCHA_ENABLED` | `true` | Server-only (Runtime) |
| `TURNSTILE_SECRET_KEY` | `<Secret aus Schritt 1>` | Server-only, **Sensitive** ankreuzen |

Preview-Environment optional: ohne die Vars degradiert Preview graceful
(Widget rendert nicht, Server-Check skippt) — bewusstes Design, kein Fehler.

## 3. Redeploy auslösen

`NEXT_PUBLIC_*`-Werte werden beim **Build** eingebacken — Env-Var setzen
allein reicht nicht. Deployments → aktuelles Production-Deployment →
**Redeploy** (oder beliebigen Commit auf `main` pushen).

## 4. Datenschutzerklärung nachziehen (User-Signoff nötig)

`src/app/datenschutz/page.tsx` § 6 kündigt es selbst an: „Dieser Abschnitt
ist bei Aktivierung des Feature-Flags entsprechend anzupassen."

- Überschrift: `§ 6 · Spam-Schutz (Cloudflare Turnstile) — dormant` →
  Suffix „— dormant" entfernen.
- Ersten Absatz von „Dieser Dienst ist aktuell deaktiviert …" auf
  Aktiv-Formulierung umstellen; der Rest (Rechtsgrundlage Art. 6 Abs. 1
  lit. f, SCC-Drittlandtransfer, Cloudflare-Link) stimmt bereits.
- **Legal-Copy → Änderung nur mit explizitem Owner-Signoff committen.**

## 5. Verifikation

1. `https://rauhut.com/#kontakt` aufrufen: Formular normal, **kein**
   sichtbares Widget (interaction-only ist der Happy Path). Browser-Konsole:
   keine CSP-Violations (Requests gegen `challenges.cloudflare.com` müssen
   durchgehen — sind in der CSP freigegeben).
2. Testnachricht absenden → Erfolgsmeldung, Mail kommt an.
3. Fail-closed-Gegenprobe (optional): `TURNSTILE_SECRET_KEY` temporär
   entfernen + Redeploy → Submit muss mit der Spam-Schutz-Fehlermeldung
   abgelehnt werden (Production rejected bei Flag an + fehlendem Secret;
   `src/lib/captcha/verify.ts`). Danach Secret wieder setzen + Redeploy.
4. E2E/Lighthouse-CI bleiben unberührt (laufen ohne die Env-Vars, also im
   Dormant-Modus).

## Rollback

`NEXT_PUBLIC_CAPTCHA_ENABLED` und `CAPTCHA_ENABLED` auf `false` (oder
löschen) + Redeploy. Widget verschwindet, Server-Check skippt, Honeypot
bleibt aktiv. Sitekey/Secret können gesetzt bleiben.
