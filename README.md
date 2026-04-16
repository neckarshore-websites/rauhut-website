# rauhut-website

Persoenliche Web-Praesenz fuer [rauhut.com](https://rauhut.com) — German Rauhut, Technical Product Owner & AI Product Builder.

One-Pager mit Impressum. Minimal Material Design. Dark Mode default, Light Mode toggelbar. Keine Analytics, keine Cookies.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4 (PostCSS-only, `@theme` tokens)
- TypeScript (strict)
- Deploy: Vercel (geplant)
- Domain: IONOS → Vercel (DNS-Cutover steht noch aus)

## Dev

```bash
npm install
npm run dev    # http://localhost:3001
npm run build  # production build
npm run start  # serve production build
npm run lint
```

Port **3001** (statt Standard 3000), um Kollision mit `neckarshore-website` zu vermeiden.

## Struktur

| Pfad | Zweck |
|------|-------|
| `src/app/page.tsx` | Startseite: Header, Zusammenfassung, Kernkompetenzen, Projekte, Kontakt |
| `src/app/impressum/page.tsx` | Impressum (§5 TMG), `noindex` |
| `src/app/icon.svg` + `favicon.ico` + `apple-icon.png` | Favicon (SVG primary, ICO legacy, 180x180 fuer iOS) |
| `src/app/sitemap.ts` | Sitemap fuer `/` + `/impressum` |
| `src/components/FounderPhoto.tsx` | Portrait-Wechsel (Client Component) |
| `src/components/ProjectTiles.tsx` | Neckarshore + Obsidian Vault Autopilot Tiles |
| `src/components/ThemeToggle.tsx` | Dark/Light Toggle (CSS-driven, DOM-only) |
| `src/fonts/Inter-Variable.woff2` | self-hosted Inter Variable (DSGVO) |
| `public/theme-init.js` | Anti-Flash Script, laeuft vor Paint |

## Design-Tokens

Dark Mode ist Default (`<html data-theme="dark">`). Light Mode via `:root[data-theme="light"]`.

- Primary text / bg: `#F5F5F5` / `#0A0A0A` (dark) · `#0A0A0A` / `#FFFFFF` (light)
- Signal-Akzent (Pastell "Stuttgart morning sky"): `#A5B9D1` (dark) / `#8DA5C4` (light)
- Brand Teal (Neckarshore, H1): `#22D3EE` (dark) / `#0E7490` (light)
- Brand Amber (Second Accent, H2): `#F59E0B` (dark) / `#B45309` (light)

Inter Variable als einzige Schriftart, self-hosted.

## Performance (Prod Build, localhost:3001)

Lighthouse Baseline:

| | Desktop | Mobile |
|-|--------:|-------:|
| Performance | 100 | 97 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

## Scope

- Keine Analytics, kein Tracking, kein Cookie-Banner
- Self-hosted Font (DSGVO)
- `robots: index` auf `/`, `robots: noindex` auf `/impressum`
- English Version: geplant (`/en` Route)

## Ownership

Linus (Frontend) bei Neckarshore AI. Repo-Home: `GmanFooFoo/rauhut-website` (persoenlich, **nicht** `neckarshore-ai` Org).
