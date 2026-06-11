@AGENTS.md

## Repo Context

- **Owner:** Linus (Frontend Artist)
- **GitHub home:** `GmanFooFoo/rauhut-website` (User's personal GitHub — NOT the `neckarshore-ai` Org)
- **Domain:** `rauhut.com` — registered at IONOS, live on Vercel. DNS-Cutover IONOS → Vercel done 2026-04-17. MX bleibt IONOS (Mail-Empfang separat geregelt).
- **Brand:** The person, not the firm. `neckarshore.ai` is the company (warm, Bordeaux); `rauhut.com` is the person (clean, minimal Material, Schwarz/Weiss/Grau + Pastell-Akzent `#8DA5C4`).

## Working Directory Rule

This repo lives at `~/Developer/projects/neckarshore-websites/rauhut-website/`. Every Bash command must start with:

```bash
cd ~/Developer/projects/neckarshore-websites/rauhut-website && ...
```

The Claude Code harness resets `cwd` after every Bash call. Unscoped commands risk writing to the wrong repo. Same discipline as `neckarshore-website`.

> **Path-note:** The repo's GitHub home is `GmanFooFoo/rauhut-website` (personal), but the local checkout lives inside the `neckarshore-ai` folder for ecosystem-grouping convenience. Local path ≠ GitHub org. Captured as Path-Drift Klasse B in `omnopsis-planning/docs/process/session-state.md` (2026-05-12 c).

## Rules

Same quality bar as `neckarshore-website`:

- Mobile-first responsive design
- Lighthouse 95+ target on all metrics
- No JS frameworks beyond React/Next.js
- No CMS. Analytics: Vercel Web Analytics only (cookieless, DSGVO-friendly, no banner)
- Self-hosted fonts (DSGVO)
- Commit after each section / logical block
- **Deploy-Flow:** Branch → PR → User-merge → Vercel Auto-Deploy via OAuth (verified end-to-end 2026-05-13 b PR #1). Preview-Deploys laufen auf jeder Branch-Push automatisch. Kein manueller `vercel --prod` nötig. Push direkt auf `main` is technisch erlaubt — wird aber per Konvention vermieden (PR-Flow).

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

## Decisions

| # | Date | Decision | Rationale |
|---|------|----------|-----------|
| 1 | 2026-04-17 | DNS-Cutover IONOS → Vercel | Vercel-Hosting für Compute, IONOS behält DNS-Zone + MX |
| 2 | 2026-04-17 | Theme-Default = Dark, mit Light-Toggle | Persoenliche Site, schwarzer Hintergrund als Default-Ton; User-Toggle persistiert in `localStorage` |
| 3 | 2026-05-13 b | **L-RH1 — IONOS Hosting-Vertrag behalten, nicht kündigen** | Sehr alter Vertrag (~18 EUR/Monat für 3 Domains + unbegrenzte Mails). Legacy-pricing-Win schlägt operative Sauberkeit. WordPress-Installation bleibt idle auf IONOS, kostet keine Extra-Gebühr |
| 4 | 2026-05-13 b | **L4 — WordPress-Decommission IONOS won't-do** (superseded by Decision 3) | Mit Vertrag-Keep gibt es nichts zu decommissionieren. DNS zeigt auf Vercel, WordPress ist nicht mehr erreichbar — die idle Installation darf bleiben |
| 5 | 2026-05-16 | L-RH3 GSC Domain-Property bleibt geparkt | IONOS Domain-Connect würde DNS-Zone überschreiben inkl. MX → Mail-Risiko. URL-Prefix-Property + Sitemap reicht für Google-Indexing |
| 6 | 2026-05-16 | **D6 — Playwright added to rauhut-website** | Task override of "Out of Scope" entry; closes retro Playwright-gap on websites |
| 7 | 2026-05-16 | **D7 — SpaceX hero interval 150ms → 2000ms** | Per user request: images were cycling too fast to read |
| 8 | 2026-05-16 | **D8 — rauhut-luxury.html excluded** | File intentionally deleted before integration; 28 cards shown |
| 9 | 2026-05-16 | **D9 — Gallery page uses max-w-7xl** | Full-width card grid; main site uses max-w-2xl (single CV column) |
| 10 | 2026-05-19 | **D10 — Security overrides for transitive CVE fixes** | When upstream pins a vulnerable transitive dep (e.g. `next@16.2.6` pinning `postcss@8.4.31`), patch via `package.json` `overrides` instead of `npm audit fix --force` (which proposes semver-major framework downgrades). First use: `postcss: 8.5.15` (PR #7) |

## Out of Scope (post-v1)

- Dark/Light-Mode-Erweiterungen über die zwei Default-Themes hinaus
- Third-party Analytics (GA, Plausible, Sentry) — nur Vercel Web Analytics
- Cookie-Banner (nicht nötig, da cookieless)
- ~~Playwright E2E (klein genug, manuelle Smoke-Tests reichen)~~ — superseded by D6 (2026-05-16); Playwright is in scope and covers `/designs` + bilingual homepages + toggles + impressum
- Lighthouse CI (Baseline manuell, nicht automatisiert)
- Blog / CMS / Content-Pipeline
- E-Mail MX-Aenderungen — Mail bleibt bei IONOS, nicht anfassen
