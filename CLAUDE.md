@AGENTS.md

## Repo Context

- **Owner:** Linus (Frontend Artist)
- **GitHub home:** `GmanFooFoo/rauhut-website` (User's personal GitHub — NOT the `neckarshore-ai` Org)
- **Domain:** `rauhut.com` — registered at IONOS, planned Vercel deployment. DNS cutover not done yet.
- **Brand:** The person, not the firm. `neckarshore.ai` is the company (warm, Bordeaux); `rauhut.com` is the person (clean, minimal Material, Schwarz/Weiss/Grau + Pastell-Akzent `#8DA5C4`).

## Working Directory Rule

This repo lives at `~/Developer/projects/rauhut-website/`. Every Bash command must start with:

```bash
cd ~/Developer/projects/rauhut-website && ...
```

The Claude Code harness resets `cwd` after every Bash call. Unscoped commands risk writing to the wrong repo. Same discipline as `neckarshore-website`.

## Rules

Same quality bar as `neckarshore-website`:

- Mobile-first responsive design
- Lighthouse 95+ target on all metrics
- No JS frameworks beyond React/Next.js
- No CMS. Analytics: Vercel Web Analytics only (cookieless, DSGVO-friendly, no banner)
- Self-hosted fonts (DSGVO)
- Commit after each section / logical block
- Do NOT push to production (`rauhut.com` live) until user approves

## Definition of Done

- Lighthouse 95+ desktop + mobile
- Mobile + Desktop visual check
- No browser console errors
- Build green (`npm run build`)
- Lint green (`npm run lint`)
- Committed

## Visuelle Abnahme — HARTE REGEL

Du entscheidest NIE, wann ein visuelles Ergebnis "fertig" ist. Nur der User. Linus baut, zeigt, beschreibt. Lighthouse-Scores sind objektiv und reportbar. Subjektive "passt" oder "sieht gut aus" Entscheidungen sind User-Territorium.

## Content Source

Projektprofil (Content fuer die Seite): `~/vaults/nexus/001_Inbox - Temporary holding area for new, unprocessed notes/_Work/2026-04-16 - Projektprofil - German Rauhut.md`

Aktualisierungen am Projektprofil → erst Vault-Datei aktualisieren, dann Seite nachziehen.

## Out of Scope (v1)

- GitHub-Repo auf `GmanFooFoo/rauhut-website` (User macht via `gh repo create`)
- Vercel-Projekt + Deploy
- DNS-Umzug IONOS → Vercel
- E-Mail MX (bleibt bei IONOS, nicht anfassen)
- Dark Mode
- Third-party Analytics (GA, Plausible, etc.) — nur Vercel Web Analytics
- Cookie-Banner
- Playwright E2E, Lighthouse CI
