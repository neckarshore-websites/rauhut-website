# Design Spec: Designs Gallery — rauhut.com

**Date:** 2026-05-16
**Author:** Linus (Frontend Agent)
**Status:** Approved

---

## Summary

Add a `/designs` gallery page to rauhut.com showcasing 28 standalone HTML design
explorations. Add a "Designs" nav link in the footer (far right). The page is a
full-width React Client Component built with Tailwind CSS, respecting rauhut.com's
dark/light theme tokens. Interactive features (card flip, filter, shuffle tour)
are ported from the existing `index.html` reference into React/TypeScript.

---

## Architecture

### New files

| File | Purpose |
|------|---------|
| `src/app/designs/page.tsx` | Next.js route — Client Component, full gallery |
| `src/app/designs/data.ts` | TypeScript array of 28 card definitions |
| `src/components/designs/DesignCard.tsx` | Single flip-card (front + back with iframe) |
| `src/components/designs/FilterBar.tsx` | Tag filter + shuffle button |
| `src/components/designs/ShuffleTour.tsx` | Fullscreen overlay — iframe slideshow |
| `public/designs/*.html` | 28 unmodified design HTML files (static asset) |
| `public/designs/spacex-hero-*.png` | 4 SpaceX hero images (relative path, same dir) |
| `tests/designs.spec.ts` | 5 Playwright end-to-end tests |

### Modified files

| File | Change |
|------|--------|
| `src/app/page.tsx` | Footer: add `· Designs` link (far right) |
| `src/app/en/page.tsx` | Footer: same change for English route |
| `CLAUDE.md` | Decision D6: Playwright added to rauhut-website |
| `public/designs/rauhut-spacex.html` | Hero image interval: 150ms → 2000ms |

### Known gap

`rauhut-luxury.html` referenced in the source `index.html` is intentionally absent.
28 cards are implemented (the luxury entry is excluded from `data.ts`).

---

## Data Model

```typescript
// src/app/designs/data.ts

export interface Design {
  index: number;       // Display number (1-based, may not be sequential due to luxury gap)
  slug: string;        // File stem: "egypt" → /designs/rauhut-egypt.html
  name: string;        // Display name: "Egypt"
  style: string;       // One-line style description
  tags: string[];      // Filter categories: "art" | "editorial" | "retro" | "minimal" | ...
  accentColor: string; // Top strip color (hex): "#B89040"
  swatches: string[];  // 2-4 CSS background values (split-gradient strings)
}

export const DESIGNS: Design[] = [ /* 28 entries, extracted from Desktop/index.html */ ];
```

All 28 entries are extracted verbatim from `/Desktop/rauhut-designs/index.html`
(name, style, accentColor, swatches, tags, index number).

---

## Gallery Page (`/designs`)

### Layout

Full-width page (not constrained to `max-w-2xl`). Uses `max-w-7xl` for card grid.

```
┌─────────────────────────────────────────────────────┐
│  sticky nav: ← rauhut.com          [Theme toggle]   │
├─────────────────────────────────────────────────────┤
│  hero: "Design Gallery"                             │
│        28 Explorations · 150+ Themes · 2025–26      │
│  stats: 28 · 150+ · (design count)                 │
├─────────────────────────────────────────────────────┤
│  filter: [All] [Art] [Editorial] [Retro] …  [🔀]   │
├─────────────────────────────────────────────────────┤
│  card grid: 4 cols desktop / 2 cols mobile          │
│  (each card: flip on hover, front + iframe back)    │
├─────────────────────────────────────────────────────┤
│  footer: © 2026 German Rauhut · Impressum · Designs │
└─────────────────────────────────────────────────────┘
```

### Theme Awareness

- Background, text, nav, filter bar: follow `--color-bg`, `--color-text`,
  `--color-border` tokens (dark/light toggle works)
- Card accent colors and swatches: design-specific, not theme-aware (correct,
  they are intentional art pieces)
- Individual design HTML files: self-contained dark-only pages (by design)

---

## Card Component (`DesignCard.tsx`)

### Front face

- Top strip: 4px height, `background: accentColor`
- Card index (monospace, top-left)
- Name (semi-bold)
- Style description (small, muted)
- 2-4 color swatches (`border-radius: 0`, split-diagonal gradient squares)

### Back face (revealed on hover)

- Scaled `<iframe src="/designs/rauhut-{slug}.html" loading="lazy" tabIndex={-1}>`
- Scale factor via `--pscale` CSS custom property (computed by ResizeObserver)
- Bottom label: "Name ↗ öffnen"

### Interaction

- CSS-only flip: `transform: rotateY(180deg)` on `.card:hover .inner`
  and `.card:focus-within .inner`
- Click on card navigates to `/designs/rauhut-{slug}.html`
- `aria-label="Open {name} design"` on the anchor

---

## Filter Bar (`FilterBar.tsx`)

- Tags: `all`, `art`, `editorial`, `retro`, `minimal`, plus any others present in data
- Active tag highlights in `--color-brand-amber`
- Shuffle button: right-aligned, pulses with CSS animation (matches reference)
- On filter change: cards with non-matching tags get `display: none`
  (matches existing reference behavior)

---

## Shuffle Tour (`ShuffleTour.tsx`)

Client Component. State: `queue: Design[]`, `currentIdx: number`,
`paused: boolean`, `speed: 3000 | 5000 | 8000` ms.

### Features

- Fullscreen overlay (fixed, z-50, dark backdrop)
- Centered `<iframe>` at ~90vw × ~85vh
- Controls: Prev / Pause / Next / ↗ open / Close
- Speed pills: 3s / 5s / 8s
- Dot navigation (up to 28 dots, click to jump)
- Progress bar: CSS width animation (`transition: width Nms linear`)
- Keyboard: `Esc` → close, `←/→`/`Space` → prev/next

### Implementation

Uses `useRef` for overlay/iframe/buttons, `useEffect` for keyboard handlers
and timer management (with cleanup on unmount/overlay close).

---

## Asset Copy Strategy

All HTML and PNG files are copied from Desktop into `public/designs/`. They are
served by Next.js as static assets at `/designs/rauhut-egypt.html` etc.

SpaceX hero images use bare relative paths (`spacex-hero-1.png`) — must be in the
same directory as `rauhut-spacex.html`. Both go into `public/designs/`.

### SpaceX timing fix

`rauhut-spacex.html` line containing `setInterval(..., 150)` → change `150` to `2000`.
This is the only modification to any design HTML file.

---

## Navigation

### Footer change (both `page.tsx` + `en/page.tsx`)

Before:
```jsx
<p>© {new Date().getFullYear()} German Rauhut · <a href="/impressum">Impressum</a></p>
```

After:
```jsx
<p>
  © {new Date().getFullYear()} German Rauhut ·{" "}
  <a href="/impressum">Impressum</a> ·{" "}
  <a href="/designs">Designs</a>
</p>
```

---

## SEO / Metadata

```typescript
export const metadata: Metadata = {
  title: "Design Gallery — rauhut.com",
  description:
    "28 eigenständige UI-Design-Explorations von German Rauhut: Art Deco, Vaporwave, SpaceX, Egypt, Brutalist und mehr.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://rauhut.com/designs" },
};
```

No hreflang needed (designs page is German only — no `/en/designs` route).

---

## Playwright Tests (`tests/designs.spec.ts`)

| # | Test | What it checks |
|---|------|----------------|
| 1 | Nav link | Footer "Designs" link exists and href is `/designs` |
| 2 | Page loads clean | No console errors, no failed network requests on `/designs` |
| 3 | Card count | At least 28 `.card-wrapper` elements visible |
| 4 | No 404 links | Each card `<a>` href returns HTTP 200 |
| 5 | Theme swatches | At least one `.theme-btn` on `/designs/rauhut-egypt.html` |

Installation: `@playwright/test` added as devDependency. Browsers already present
from other ecosystem projects (`ms-playwright` shared cache).

---

## Lighthouse Targets

| Page | Performance | Accessibility | SEO | Best Practices |
|------|-------------|---------------|-----|----------------|
| `/` (homepage) | ≥85 | ≥90 | ≥90 | ≥90 |
| `/designs` | ≥85 | ≥90 | ≥90 | ≥90 |

Iframes are lazy-loaded — LCP is the hero text, not iframe content.

---

## Decisions

| # | Decision |
|---|----------|
| D6 | Playwright added to rauhut-website (task override of CLAUDE.md Out-of-Scope; closes retro gap) |
| D7 | SpaceX hero interval increased from 150ms to 2000ms per user request |
| D8 | `rauhut-luxury.html` excluded — file intentionally deleted, 28 cards shown |
| D9 | Gallery page uses max-w-7xl (full-width), not max-w-2xl (single-page pattern) |
