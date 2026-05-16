# Designs Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/designs` gallery page to rauhut.com showcasing 28 standalone HTML design explorations, with card flip, tag filter, shuffle tour, and a footer nav link.

**Architecture:** Server Component route (`page.tsx`) exports metadata and renders `DesignsGallery` (Client Component). Interactive sub-components (FilterBar, ShuffleTour, DesignCard) live under `src/components/designs/`. Static HTML assets are served from `public/designs/` with no Next.js involvement.

**Tech Stack:** Next.js 16.2.6 App Router, Tailwind CSS v4, TypeScript, @playwright/test (new devDep)

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/app/designs/data.ts` | 28 card definitions (interface + array) |
| Create | `src/app/designs/page.tsx` | Server Component: metadata + renders DesignsGallery |
| Create | `src/components/designs/DesignsGallery.tsx` | `"use client"` — interactive gallery container |
| Create | `src/components/designs/DesignCard.tsx` | Single flip card (no hooks needed) |
| Create | `src/components/designs/FilterBar.tsx` | `"use client"` — tag filters + shuffle button |
| Create | `src/components/designs/ShuffleTour.tsx` | `"use client"` — fullscreen slideshow overlay |
| Create | `playwright.config.ts` | Playwright config pointing at localhost:3001 |
| Create | `tests/designs.spec.ts` | 5 E2E tests |
| Copy | `public/designs/rauhut-*.html` | 28 static design files (served as-is) |
| Copy | `public/designs/spacex-hero-*.png` | 4 SpaceX hero images (relative paths) |
| Modify | `public/designs/rauhut-spacex.html` | Hero interval: 150ms → 2000ms |
| Modify | `src/app/page.tsx` | Footer: add Designs link |
| Modify | `src/app/en/page.tsx` | Footer: add Designs link |
| Modify | `CLAUDE.md` | Decision D6: Playwright, D7/D8/D9 |

---

## Task 1: Install Playwright

**Files:**
- Modify: `package.json`
- Create: `playwright.config.ts`

- [ ] **Step 1a: Install @playwright/test**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npm install --save-exact --save-dev @playwright/test
```

Expected: `@playwright/test` appears in `devDependencies` in `package.json`.

- [ ] **Step 1b: Download Chromium browser binary**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npx playwright install chromium
```

Expected: Chromium binary downloaded (may be fast if already cached from another project).

- [ ] **Step 1c: Create playwright.config.ts**

Create `playwright.config.ts` in the project root:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3001",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
```

- [ ] **Step 1d: Add test:e2e script to package.json**

Open `package.json`. In the `"scripts"` block, add after the `"lint"` entry:

```json
"test:e2e": "playwright test"
```

Result (full scripts block):

```json
"scripts": {
  "dev": "next dev -p 3001",
  "build": "next build",
  "start": "next start -p 3001",
  "lint": "eslint",
  "test:e2e": "playwright test"
}
```

- [ ] **Step 1e: Commit**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && git add package.json package-lock.json playwright.config.ts && git commit -m "chore(test): install Playwright + config — D6 closes retro gap"
```

---

## Task 2: Write Playwright Tests (TDD — all will fail until Task 8)

**Files:**
- Create: `tests/designs.spec.ts`

- [ ] **Step 2a: Create tests directory and spec file**

Create `tests/designs.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

// ── Test 1: Footer nav link exists ──────────────────────────────────────────
test("footer 'Designs' link exists on homepage and navigates to /designs", async ({
  page,
}) => {
  await page.goto("/");
  const designsLink = page.locator('footer a[href="/designs"]');
  await expect(designsLink).toBeVisible();
  await expect(designsLink).toHaveText("Designs");
  await designsLink.click();
  await expect(page).toHaveURL("/designs");
});

// ── Test 2: /designs loads without errors ────────────────────────────────────
test("/designs loads without console errors and no failed network requests", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  page.on("requestfailed", (req) => {
    failedRequests.push(req.url());
  });

  await page.goto("/designs");
  await page.waitForLoadState("networkidle");

  expect(consoleErrors, `Console errors: ${consoleErrors.join(", ")}`).toHaveLength(0);
  expect(
    failedRequests,
    `Failed requests: ${failedRequests.join(", ")}`
  ).toHaveLength(0);
});

// ── Test 3: At least 28 cards visible ───────────────────────────────────────
test("designs page renders at least 28 design cards", async ({ page }) => {
  await page.goto("/designs");
  // Cards are <a> elements with href matching /designs/rauhut-*.html
  const cards = page.locator('a[href^="/designs/rauhut-"]');
  await expect(cards).toHaveCount(28, { timeout: 10_000 });
});

// ── Test 4: Each card link resolves with HTTP 200 ────────────────────────────
test("every card link returns HTTP 200 (no 404)", async ({ page, request }) => {
  await page.goto("/designs");
  const hrefs = await page
    .locator('a[href^="/designs/rauhut-"]')
    .evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).href));

  expect(hrefs.length).toBeGreaterThanOrEqual(28);

  for (const href of hrefs) {
    const response = await request.get(href);
    expect(
      response.status(),
      `Expected 200 for ${href}, got ${response.status()}`
    ).toBe(200);
  }
});

// ── Test 5: Theme swatch buttons on individual design page ───────────────────
test("rauhut-egypt.html has theme swatch buttons", async ({ page }) => {
  await page.goto("/designs/rauhut-egypt.html");
  const swatchButtons = page.locator(".theme-btn");
  await expect(swatchButtons.first()).toBeVisible();
  const count = await swatchButtons.count();
  expect(count).toBeGreaterThanOrEqual(2);
});
```

- [ ] **Step 2b: Run tests to confirm they all fail**

Start the dev server in a separate terminal tab (leave it running):
```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npm run dev
```

Then run tests:
```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npx playwright test
```

Expected: All 5 tests fail. Test 1 fails: "Designs" link missing. Tests 2–5 fail: `/designs` returns 404. This confirms the tests are real.

- [ ] **Step 2c: Commit failing tests**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && git add tests/ && git commit -m "test(designs): add 5 Playwright specs — TDD red phase"
```

---

## Task 3: Copy Assets + Fix SpaceX Timing

**Files:**
- Create: `public/designs/` (directory with 28 HTML + 4 PNG files)
- Modify: `public/designs/rauhut-spacex.html`

- [ ] **Step 3a: Create public/designs/ and copy all assets**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && mkdir -p public/designs && cp /Users/germanrauhut.com/Desktop/rauhut-designs/rauhut-*.html public/designs/ && cp /Users/germanrauhut.com/Desktop/rauhut-designs/spacex-hero-*.png public/designs/
```

- [ ] **Step 3b: Verify the copy**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && ls public/designs/*.html | wc -l && ls public/designs/*.png | wc -l
```

Expected output:
```
28
4
```

- [ ] **Step 3c: Fix SpaceX hero image interval**

Open `public/designs/rauhut-spacex.html`. Find the line:
```javascript
setInterval(function(){ i = (i+1) % imgs.length; frame.src = imgs[i]; }, 150);
```

Change `150` to `2000`:
```javascript
setInterval(function(){ i = (i+1) % imgs.length; frame.src = imgs[i]; }, 2000);
```

- [ ] **Step 3d: Verify the fix**

```bash
grep "setInterval" /Users/germanrauhut.com/Developer/projects/neckarshore-ai/rauhut-website/public/designs/rauhut-spacex.html
```

Expected: `setInterval(function(){ i = (i+1) % imgs.length; frame.src = imgs[i]; }, 2000);`

- [ ] **Step 3e: Confirm Test 5 now passes (partial progress check)**

With dev server running, run only Test 5:
```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npx playwright test --grep "theme swatch buttons"
```

Expected: PASS (rauhut-egypt.html is now accessible at /designs/rauhut-egypt.html).

- [ ] **Step 3f: Commit**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && git add public/designs/ && git commit -m "feat(designs): copy 28 HTML assets + 4 SpaceX PNGs to public/designs

SpaceX hero interval: 150ms → 2000ms (D7)"
```

---

## Task 4: Card Data (`data.ts`)

**Files:**
- Create: `src/app/designs/data.ts`

- [ ] **Step 4a: Create the designs data directory and file**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && mkdir -p src/app/designs
```

Create `src/app/designs/data.ts` with the following content (28 entries, luxury excluded):

```typescript
export interface Design {
  /** Display number from original index (1-based; 14 = luxury, skipped). */
  index: number;
  /** File stem: "egypt" → /designs/rauhut-egypt.html */
  slug: string;
  /** Human-readable name */
  name: string;
  /** One-line style description */
  style: string;
  /** Filter tags */
  tags: string[];
  /** CSS background value for the accent strip */
  accentColor: string;
  /** CSS background values for swatch squares */
  swatches: string[];
}

// 28 entries — luxury (#14) excluded (file intentionally deleted, D8)
export const DESIGNS: Design[] = [
  {
    index: 1,
    slug: "egypt",
    name: "Ancient Egypt",
    style: "Hieroglyphen, Sand, Papyrus, Nilgold",
    tags: ["art", "cultural"],
    accentColor: "#C8901C",
    swatches: [
      "linear-gradient(135deg,#F0E4C0 50%,#C89010 50%)",
      "linear-gradient(135deg,#EEF2F8 50%,#1A3A8B 50%)",
      "linear-gradient(135deg,#060408 50%,#C89010 50%)",
      "linear-gradient(135deg,#EEF8F6 50%,#1A7A6A 50%)",
    ],
  },
  {
    index: 2,
    slug: "art-deco",
    name: "Art Déco",
    style: "Gold auf Schwarz, geometrische Ornamente, Roaring 20s",
    tags: ["art", "retro"],
    accentColor: "#C8A840",
    swatches: [
      "linear-gradient(135deg,#F8F2E0 50%,#C89820 50%)",
      "linear-gradient(135deg,#F0F5F2 50%,#C87020 50%)",
      "linear-gradient(135deg,#08080E 50%,#D4A020 50%)",
    ],
  },
  {
    index: 3,
    slug: "nouveau",
    name: "Art Nouveau",
    style: "Florale Linien, Jugendstil-Ornamente, Klimt-Energie",
    tags: ["art"],
    accentColor: "#5A8A40",
    swatches: [
      "linear-gradient(135deg,#EEF4F0 50%,#2A6A40 50%)",
      "linear-gradient(135deg,#F4F0E4 50%,#C89010 50%)",
      "linear-gradient(135deg,#080A06 50%,#8B6A14 50%)",
    ],
  },
  {
    index: 4,
    slug: "bild",
    name: "Bild.de",
    style: "Boulevardblatt, Knallrot, maximale Schlagzeile",
    tags: ["editorial"],
    accentColor: "#E2001A",
    swatches: [
      "linear-gradient(135deg,#FFFFFF 50%,#E2001A 50%)",
      "linear-gradient(135deg,#0A0A0A 50%,#FF1A1A 50%)",
    ],
  },
  {
    index: 5,
    slug: "brutalist",
    name: "Brutalist",
    style: "Rohe Typografie, harte Kanten, kein Ornament",
    tags: ["minimal", "editorial"],
    accentColor: "#E8240A",
    swatches: [
      "linear-gradient(135deg,#0D0D0D 50%,#FF2D00 50%)",
      "linear-gradient(135deg,#F5F0E8 50%,#E8240A 50%)",
      "linear-gradient(135deg,#F0F4F8 50%,#0057FF 50%)",
    ],
  },
  {
    index: 6,
    slug: "emperor",
    name: "Chinese Emperor",
    style: "Kaiserliches Rot, Gold, Drachen-Ornamente",
    tags: ["art", "cultural"],
    accentColor: "#CC1A00",
    swatches: [
      "linear-gradient(135deg,#FDF5E8 50%,#CC1A00 50%)",
      "linear-gradient(135deg,#F0F5F0 50%,#1A6A30 50%)",
      "linear-gradient(135deg,#06040A 50%,#CC1A00 50%)",
      "linear-gradient(135deg,#2A1E10 50%,#C87820 50%)",
    ],
  },
  {
    index: 7,
    slug: "dada",
    name: "Dada",
    style: "Anti-Kunst, Chaos, Collage — Zürich 1916",
    tags: ["art"],
    accentColor: "linear-gradient(180deg,#FF2020,#2020FF)",
    swatches: [
      "linear-gradient(135deg,#F5F0E4 50%,#CC1A00 50%)",
      "linear-gradient(135deg,#0A0808 50%,#CC1A00 50%)",
      "linear-gradient(135deg,#F8F0D8 50%,#0030A8 50%)",
      "linear-gradient(135deg,#E8E4DC 50%,#E8A000 50%)",
    ],
  },
  {
    index: 8,
    slug: "damascus",
    name: "Damascus",
    style: "Islamische Arabeske, Kachelornament, 1500 n. Chr.",
    tags: ["art", "cultural"],
    accentColor: "#8B1A1A",
    swatches: [
      "linear-gradient(135deg,#F8F2E4 50%,#8B1A1A 50%)",
      "linear-gradient(135deg,#F4F0E8 50%,#1A3A8B 50%)",
      "linear-gradient(135deg,#06040A 50%,#8B1A1A 50%)",
      "linear-gradient(135deg,#EFF5EE 50%,#1A6A30 50%)",
    ],
  },
  {
    index: 9,
    slug: "editorial",
    name: "Editorial",
    style: "Magazin-Layout, starke Typografie, Weißraum",
    tags: ["editorial", "minimal"],
    accentColor: "#C8001E",
    swatches: [
      "linear-gradient(135deg,#FAF6EC 50%,#C41020 50%)",
      "linear-gradient(135deg,#F8F8F8 50%,#E8000A 50%)",
      "linear-gradient(135deg,#EEE8D8 50%,#8B2020 50%)",
      "linear-gradient(135deg,#0C0C08 50%,#E0C040 50%)",
    ],
  },
  {
    index: 10,
    slug: "fallout",
    name: "Fallout / Nuclear Retro",
    style: "Vault-Tec, Pip-Boy-Grün, S.P.E.C.I.A.L.-Stats",
    tags: ["retro", "dark"],
    accentColor: "#D4880A",
    swatches: [
      "linear-gradient(135deg,#F0E8C0 50%,#D4880A 50%)",
      "linear-gradient(135deg,#050A02 50%,#30CC30 50%)",
      "linear-gradient(135deg,#F8E8E0 50%,#CC1A00 50%)",
      "linear-gradient(135deg,#0A0806 50%,#D4880A 50%)",
    ],
  },
  {
    index: 11,
    slug: "game-ui",
    name: "Game UI",
    style: "HUD-Interface, Sci-Fi-Terminal, Spieler-Stats",
    tags: ["dark", "retro"],
    accentColor: "#00FF41",
    swatches: [
      "linear-gradient(135deg,#F0E8D0 50%,#8B4820 50%)",
      "linear-gradient(135deg,#E8F0F8 50%,#0080C0 50%)",
      "linear-gradient(135deg,#F0F8E8 50%,#40C020 50%)",
      "linear-gradient(135deg,#080810 50%,#8040C0 50%)",
    ],
  },
  {
    index: 12,
    slug: "gothic",
    name: "Gothic / Dark Academia",
    style: "Fraktur, Kerzen, Pergament, Bibliothek um Mitternacht",
    tags: ["dark", "art"],
    accentColor: "#C89030",
    swatches: [
      "linear-gradient(135deg,#0C0A08 50%,#C89030 50%)",
      "linear-gradient(135deg,#F4EDD8 50%,#8A5A10 50%)",
      "linear-gradient(135deg,#060810 50%,#4A5A9A 50%)",
      "linear-gradient(135deg,#1A1408 50%,#D4A020 50%)",
    ],
  },
  {
    index: 13,
    slug: "japanese-minimal",
    name: "Japanese Minimal",
    style: "Shiro, Ma, Hanko-Siegel, Washi-Textur",
    tags: ["minimal", "cultural"],
    accentColor: "#C8001E",
    swatches: [
      "linear-gradient(135deg,#F7F3EB 50%,#C8210A 50%)",
      "linear-gradient(135deg,#F0EBE0 50%,#141008 50%)",
      "linear-gradient(135deg,#F5EFD8 50%,#A87010 50%)",
      "linear-gradient(135deg,#090910 50%,#B89030 50%)",
    ],
  },
  // index 14 = luxury — file intentionally deleted (D8)
  {
    index: 15,
    slug: "maga",
    name: "MAGA",
    style: "Rot-Weiß-Blau, patriotischer Maximalismus",
    tags: ["editorial"],
    accentColor: "#B22234",
    swatches: [
      "linear-gradient(135deg,#FFFFFF 50%,#B22234 50%)",
      "linear-gradient(135deg,#04040F 50%,#CC1A2A 50%)",
      "linear-gradient(135deg,#FFF8E0 50%,#B22234 50%)",
      "linear-gradient(135deg,#03060F 50%,#4A6FD8 50%)",
    ],
  },
  {
    index: 16,
    slug: "manga",
    name: "Manga",
    style: "Speed-Lines, Screentone, Shōnen-Energie",
    tags: ["art", "cultural"],
    accentColor: "#FF3300",
    swatches: [
      "linear-gradient(135deg,#FFF9F0 50%,#FF3300 50%)",
      "linear-gradient(135deg,#0A0808 50%,#FF6B00 50%)",
      "linear-gradient(135deg,#FFF0F4 50%,#FF1477 50%)",
      "linear-gradient(135deg,#04080F 50%,#00CFFF 50%)",
    ],
  },
  {
    index: 17,
    slug: "maximalist",
    name: "Maximalist",
    style: "Überladene Pracht, viele Farben, Chaos als System",
    tags: ["art"],
    accentColor: "linear-gradient(180deg,#FF6B6B,#4ECDC4,#FFE66D)",
    swatches: [
      "linear-gradient(135deg,#F5F0E0 50%,#FF2D00 50%)",
      "linear-gradient(135deg,#07080F 50%,#FF1458 50%)",
      "linear-gradient(135deg,#EDE8D0 50%,#C81808 50%)",
    ],
  },
  {
    index: 18,
    slug: "newspaper",
    name: "Newspaper",
    style: "Zeitungsdruck, Spalten, Broadsheet-Energie",
    tags: ["editorial", "retro"],
    accentColor: "#CC2000",
    swatches: [
      "linear-gradient(135deg,#FBF8F0 50%,#CC2000 50%)",
      "linear-gradient(135deg,#FFFEF8 50%,#E84020 50%)",
      "linear-gradient(135deg,#FFF8DC 50%,#DD2000 50%)",
      "linear-gradient(135deg,#0A0A08 50%,#E8C040 50%)",
    ],
  },
  {
    index: 19,
    slug: "organic",
    name: "Organic",
    style: "Naturtöne, geschwungene Formen, Wabi-Sabi",
    tags: ["minimal", "art"],
    accentColor: "#3D6B2C",
    swatches: [
      "linear-gradient(135deg,#F6F2E9 50%,#3D6B2C 50%)",
      "linear-gradient(135deg,#F5EDE4 50%,#B85C38 50%)",
      "linear-gradient(135deg,#0D1A10 50%,#7ABF4A 50%)",
      "linear-gradient(135deg,#F3EFF9 50%,#7B4FAA 50%)",
    ],
  },
  {
    index: 20,
    slug: "retro-futuristic",
    name: "Retro-Futuristic",
    style: "Neon-Akzente, Scan-Lines, kosmische Ästhetik",
    tags: ["retro", "dark"],
    accentColor: "#00FF88",
    swatches: [
      "linear-gradient(135deg,#020C04 50%,#00FF88 50%)",
      "linear-gradient(135deg,#08000E 50%,#FF0090 50%)",
      "linear-gradient(135deg,#0A0018 50%,#FF00A8 50%)",
      "linear-gradient(135deg,#090900 50%,#FFE600 50%)",
    ],
  },
  {
    index: 21,
    slug: "constructivism",
    name: "Soviet Constructivism",
    style: "Rodchenko-Diagonalen, Oswald 900, Agitprop-Energie",
    tags: ["art", "retro"],
    accentColor: "#CC2020",
    swatches: [
      "linear-gradient(135deg,#F5F0E8 50%,#CC1A00 50%)",
      "linear-gradient(135deg,#080808 50%,#FF2000 50%)",
      "linear-gradient(135deg,#F0F4F8 50%,#0A2A8B 50%)",
      "linear-gradient(135deg,#F8F0D8 50%,#CC1A00 50%)",
    ],
  },
  {
    index: 22,
    slug: "spacex",
    name: "SpaceX",
    style: "Mission Control, Barlow Condensed, Starfield",
    tags: ["minimal", "dark"],
    accentColor: "#FFFFFF",
    swatches: [
      "linear-gradient(135deg,#060606 50%,#FFFFFF 50%)",
      "linear-gradient(135deg,#F7F7F7 50%,#0A0A0A 50%)",
    ],
  },
  {
    index: 23,
    slug: "swiss-grid",
    name: "Swiss Grid",
    style: "Helvetica-Tradition, Rasterstrenge, Internationalismus",
    tags: ["editorial", "minimal"],
    accentColor: "#CC0000",
    swatches: [
      "linear-gradient(135deg,#FFFFFF 50%,#CC0000 50%)",
      "linear-gradient(135deg,#F8F4EE 50%,#CC2800 50%)",
      "linear-gradient(135deg,#F0F4F8 50%,#0040C0 50%)",
      "linear-gradient(135deg,#080808 50%,#FF2800 50%)",
    ],
  },
  {
    index: 24,
    slug: "typewriter",
    name: "Typewriter",
    style: "Sepia, Courier, das Klappern einer Olivetti",
    tags: ["retro", "minimal"],
    accentColor: "#8B6B3A",
    swatches: [
      "linear-gradient(135deg,#F5F0E0 50%,#1C1408 50%)",
      "linear-gradient(135deg,#FFFAE8 50%,#CC8020 50%)",
      "linear-gradient(135deg,#E0ECF8 50%,#08183A 50%)",
      "linear-gradient(135deg,#080C08 50%,#C0A840 50%)",
    ],
  },
  {
    index: 25,
    slug: "ukiyoe",
    name: "Ukiyo-e",
    style: "Hokusai-Welle, Kirschblüten, Holzschnitt-Block",
    tags: ["art", "cultural"],
    accentColor: "#1A3A8B",
    swatches: [
      "linear-gradient(135deg,#F5EFE0 50%,#1A3A8B 50%)",
      "linear-gradient(135deg,#FFF0F4 50%,#CC4A6A 50%)",
      "linear-gradient(135deg,#080C06 50%,#2A6A30 50%)",
      "linear-gradient(135deg,#F8EEE0 50%,#CC2A10 50%)",
    ],
  },
  {
    index: 26,
    slug: "vaporwave",
    name: "Vaporwave",
    style: "Retro-Internet, Pastel-Neon, nostalgische Hyperrealität",
    tags: ["retro", "dark"],
    accentColor: "#FF2090",
    swatches: [
      "linear-gradient(135deg,#FFE0F0 50%,#FF2090 50%)",
      "linear-gradient(135deg,#E8E0F8 50%,#A020C0 50%)",
      "linear-gradient(135deg,#FFF0E0 50%,#FF4060 50%)",
      "linear-gradient(135deg,#0A0014 50%,#FF00C0 50%)",
    ],
  },
  {
    index: 27,
    slug: "wes",
    name: "Wes Anderson",
    style: "Venice Beach · Asteroid City · Bottega — symmetrisch",
    tags: ["art", "minimal"],
    accentColor: "#E57268",
    swatches: [
      "linear-gradient(135deg,#FAEAE4 50%,#E57268 50%)",
      "linear-gradient(135deg,#E8D4A4 50%,#3A9CA8 50%)",
      "linear-gradient(135deg,#DDB8B0 50%,#7A9E88 50%)",
    ],
  },
  {
    index: 28,
    slug: "win95",
    name: "Windows 95",
    style: "Raised Borders, Teal Desktop, Start-Button, VT323",
    tags: ["retro"],
    accentColor: "#000080",
    swatches: [
      "linear-gradient(135deg,#C0C0C0 50%,#000080 50%)",
      "linear-gradient(135deg,#1A1A2E 50%,#4A6FD8 50%)",
      "linear-gradient(135deg,#FF0000 50%,#000000 50%)",
      "linear-gradient(135deg,#D4C8B8 50%,#5A2878 50%)",
    ],
  },
  {
    index: 29,
    slug: "zine",
    name: "Zine",
    style: "DIY-Punk, Collagen-Ästhetik, Xerox-Textur",
    tags: ["art", "editorial"],
    accentColor: "#E84020",
    swatches: [
      "linear-gradient(135deg,#F0ECE0 50%,#141008 50%)",
      "linear-gradient(135deg,#FFF8E8 50%,#E84020 50%)",
      "linear-gradient(135deg,#F0E8E0 50%,#CC0000 50%)",
      "linear-gradient(135deg,#080808 50%,#00FF40 50%)",
    ],
  },
];

/** All unique tags across all designs, sorted alphabetically. */
export const ALL_TAGS: string[] = [
  "all",
  ...Array.from(new Set(DESIGNS.flatMap((d) => d.tags))).sort(),
];
```

- [ ] **Step 4b: Check TypeScript compiles**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npx tsc --noEmit 2>&1 | head -20
```

Expected: No output (no errors).

- [ ] **Step 4c: Commit**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && git add src/app/designs/data.ts && git commit -m "feat(designs): add Design interface + 28-entry DESIGNS array"
```

---

## Task 5: DesignCard Component

**Files:**
- Create: `src/components/designs/DesignCard.tsx`

- [ ] **Step 5a: Create components/designs directory**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && mkdir -p src/components/designs
```

- [ ] **Step 5b: Create DesignCard.tsx**

Create `src/components/designs/DesignCard.tsx`:

```tsx
import { Design } from "@/app/designs/data";

interface DesignCardProps {
  design: Design;
}

/**
 * A flip card showing design metadata on the front and a scaled
 * iframe preview on the back. CSS-only flip (no JS needed here).
 * The parent DesignsGallery sets --pscale via ResizeObserver.
 */
export default function DesignCard({ design }: DesignCardProps) {
  return (
    <div
      className="card-wrapper group relative"
      style={{ perspective: "1000px", height: "260px" }}
    >
      <a
        href={`/designs/rauhut-${design.slug}.html`}
        aria-label={`Open ${design.name} design`}
        className="
          absolute inset-0 block
          [transform-style:preserve-3d]
          transition-transform duration-500 ease-out
          group-hover:[transform:rotateY(180deg)]
          focus-within:[transform:rotateY(180deg)]
          no-underline
        "
      >
        {/* ── FRONT ─────────────────────────────────────────────── */}
        <div
          className="
            absolute inset-0
            [backface-visibility:hidden]
            bg-bg-muted border border-border rounded-lg overflow-hidden
            flex flex-col
          "
        >
          {/* Accent strip */}
          <div
            className="h-[3px] flex-shrink-0"
            style={{ background: design.accentColor }}
          />

          <div className="flex flex-1 flex-col gap-2 p-4 overflow-hidden">
            {/* Index */}
            <span className="font-mono text-[0.65rem] text-text-subtle leading-none">
              {String(design.index).padStart(2, "0")}
            </span>

            {/* Name */}
            <span className="font-semibold text-[0.875rem] leading-snug text-text">
              {design.name}
            </span>

            {/* Style description */}
            <span className="text-[0.75rem] text-text-muted leading-snug line-clamp-2">
              {design.style}
            </span>

            {/* Swatches */}
            <div className="mt-auto flex flex-wrap gap-1.5">
              {design.swatches.map((s, i) => (
                <span
                  key={i}
                  className="h-5 w-5 flex-shrink-0"
                  style={{ background: s }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── BACK (iframe preview) ─────────────────────────────── */}
        <div
          className="
            preview-wrap
            absolute inset-0
            [backface-visibility:hidden]
            [transform:rotateY(180deg)]
            overflow-hidden rounded-lg bg-black
          "
        >
          <iframe
            src={`/designs/rauhut-${design.slug}.html`}
            loading="lazy"
            tabIndex={-1}
            title={`${design.name} preview`}
            aria-hidden="true"
            style={{
              width: "1200px",
              height: "900px",
              border: "none",
              pointerEvents: "none",
              transformOrigin: "0 0",
              transform: "scale(var(--pscale, 0.22))",
            }}
          />
          {/* Bottom label */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
            <span className="font-mono text-[0.65rem] text-white/80">
              {design.name}
            </span>
            <span className="font-mono text-[0.65rem] text-white/60">
              ↗ öffnen
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
```

- [ ] **Step 5c: Verify TypeScript**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npx tsc --noEmit 2>&1 | head -20
```

Expected: No output.

- [ ] **Step 5d: Commit**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && git add src/components/designs/DesignCard.tsx && git commit -m "feat(designs): add DesignCard flip component"
```

---

## Task 6: ShuffleTour Component

**Files:**
- Create: `src/components/designs/ShuffleTour.tsx`

- [ ] **Step 6a: Create ShuffleTour.tsx**

Create `src/components/designs/ShuffleTour.tsx`:

```tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Design } from "@/app/designs/data";

interface ShuffleTourProps {
  designs: Design[];
  onClose: () => void;
}

type Speed = 3000 | 5000 | 8000;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ShuffleTour({ designs, onClose }: ShuffleTourProps) {
  const [queue] = useState<Design[]>(() => shuffleArray(designs));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState<Speed>(3000);
  // progressKey increments to reset the CSS progress-bar animation
  const [progressKey, setProgressKey] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = queue[currentIdx];

  // ── Advance to next design ────────────────────────────────────────
  const advance = useCallback(
    (delta: number) => {
      setCurrentIdx((i) => (i + delta + queue.length) % queue.length);
      setProgressKey((k) => k + 1);
    },
    [queue.length]
  );

  // ── Auto-advance timer ────────────────────────────────────────────
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => advance(1), speed);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [paused, speed, currentIdx, advance]);

  // ── Keyboard navigation ───────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        advance(1);
      } else if (e.key === "ArrowLeft") {
        advance(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [advance, onClose]);

  // ── Prevent body scroll while open ───────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Design shuffle tour"
      className="fixed inset-0 z-50 flex flex-col bg-black/96"
    >
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <span className="font-mono text-xs text-white/60">
          {current.name}
          <span className="ml-3 text-white/30">
            {currentIdx + 1} / {queue.length}
          </span>
        </span>
        <div className="flex items-center gap-2">
          {/* Speed pills */}
          {([3000, 5000, 8000] as Speed[]).map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`font-mono text-[0.65rem] px-2 py-0.5 rounded border transition-colors ${
                speed === s
                  ? "border-white/40 text-white bg-white/10"
                  : "border-white/10 text-white/40 hover:border-white/30"
              }`}
            >
              {s / 1000}s
            </button>
          ))}

          {/* Open link */}
          <a
            href={`/designs/rauhut-${current.slug}.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.65rem] text-white/50 hover:text-white no-underline px-2 py-0.5"
          >
            ↗
          </a>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close tour"
            className="font-mono text-[0.65rem] text-white/40 hover:text-white px-2 py-0.5 border border-white/10 hover:border-white/30 rounded transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────── */}
      <div className="h-[2px] bg-white/10 flex-shrink-0">
        {!paused && (
          <div
            key={progressKey}
            className="h-full bg-white/50"
            style={{
              animation: `progress-fill ${speed}ms linear forwards`,
            }}
          />
        )}
      </div>

      {/* ── Iframe ───────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          src={`/designs/rauhut-${current.slug}.html`}
          title={`${current.name} preview`}
          className="h-full w-full border-none"
        />
      </div>

      {/* ── Bottom controls ──────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-white/10">
        <button
          onClick={() => advance(-1)}
          aria-label="Previous design"
          className="font-mono text-sm text-white/60 hover:text-white transition-colors"
        >
          ←
        </button>

        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Resume tour" : "Pause tour"}
          className="font-mono text-xs text-white/60 hover:text-white transition-colors w-20 text-center"
        >
          {paused ? "▶ Weiter" : "⏸ Pause"}
        </button>

        <button
          onClick={() => advance(1)}
          aria-label="Next design"
          className="font-mono text-sm text-white/60 hover:text-white transition-colors"
        >
          →
        </button>
      </div>

      {/* ── Dot navigation ───────────────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-1 px-4 pb-3">
        {queue.map((d, i) => (
          <button
            key={d.slug}
            onClick={() => {
              setCurrentIdx(i);
              setProgressKey((k) => k + 1);
            }}
            aria-label={`Jump to ${d.name}`}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i === currentIdx ? "bg-white" : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6b: Add progress-fill keyframe to globals.css**

Open `src/app/globals.css`. Append at the very end of the file:

```css
/* ── ShuffleTour progress bar animation ── */
@keyframes progress-fill {
  from { width: 0%; }
  to   { width: 100%; }
}
```

- [ ] **Step 6c: Verify TypeScript**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npx tsc --noEmit 2>&1 | head -20
```

Expected: No output.

- [ ] **Step 6d: Commit**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && git add src/components/designs/ShuffleTour.tsx src/app/globals.css && git commit -m "feat(designs): add ShuffleTour fullscreen overlay component"
```

---

## Task 7: FilterBar Component

**Files:**
- Create: `src/components/designs/FilterBar.tsx`

- [ ] **Step 7a: Create FilterBar.tsx**

Create `src/components/designs/FilterBar.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Design } from "@/app/designs/data";
import ShuffleTour from "./ShuffleTour";

interface FilterBarProps {
  tags: string[];
  activeTag: string;
  onTagChange: (tag: string) => void;
  designs: Design[];
}

export default function FilterBar({
  tags,
  activeTag,
  onTagChange,
  designs,
}: FilterBarProps) {
  const [tourOpen, setTourOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 py-4">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagChange(tag)}
            className={`
              font-mono text-[0.7rem] px-3 py-1.5 rounded border
              transition-colors capitalize tracking-wide
              ${
                activeTag === tag
                  ? "border-brand-amber text-brand-amber bg-brand-amber/10"
                  : "border-border text-text-muted hover:border-border-strong hover:text-text"
              }
            `}
          >
            {tag}
          </button>
        ))}

        {/* Shuffle tour button — right-aligned */}
        <button
          onClick={() => setTourOpen(true)}
          className="
            ml-auto font-mono text-[0.7rem] px-3 py-1.5 rounded border
            border-white/20 bg-[#CC1A00] text-white
            hover:bg-[#AA1400] transition-colors
            animate-[shuffle-pulse_2.8s_ease-in-out_infinite]
          "
        >
          🔀 Tour
        </button>
      </div>

      {tourOpen && (
        <ShuffleTour designs={designs} onClose={() => setTourOpen(false)} />
      )}
    </>
  );
}
```

- [ ] **Step 7b: Add shuffle-pulse keyframe to globals.css**

Open `src/app/globals.css`. Find the `@keyframes progress-fill` block you added in Task 6b. Append directly after it:

```css
@keyframes shuffle-pulse {
  0%, 100% { background: #CC1A00; color: #FFFFFF; }
  50%       { background: #FFFFFF; color: #CC1A00; }
}
```

- [ ] **Step 7c: Verify TypeScript**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npx tsc --noEmit 2>&1 | head -20
```

Expected: No output.

- [ ] **Step 7d: Commit**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && git add src/components/designs/FilterBar.tsx src/app/globals.css && git commit -m "feat(designs): add FilterBar with tag filters + shuffle-tour trigger"
```

---

## Task 8: DesignsGallery + Page Route

**Files:**
- Create: `src/components/designs/DesignsGallery.tsx`
- Create: `src/app/designs/page.tsx`

- [ ] **Step 8a: Create DesignsGallery.tsx**

Create `src/components/designs/DesignsGallery.tsx`:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import DesignCard from "./DesignCard";
import FilterBar from "./FilterBar";
import { Design, ALL_TAGS } from "@/app/designs/data";

interface DesignsGalleryProps {
  designs: Design[];
}

export default function DesignsGallery({ designs }: DesignsGalleryProps) {
  const [activeTag, setActiveTag] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeTag === "all"
      ? designs
      : designs.filter((d) => d.tags.includes(activeTag));

  // Update --pscale on each card-wrapper whenever the filtered set or
  // viewport size changes. Mirrors the original vanilla JS setScales().
  useEffect(() => {
    const setScales = () => {
      if (!gridRef.current) return;
      gridRef.current
        .querySelectorAll<HTMLElement>(".card-wrapper")
        .forEach((card) => {
          const w = card.offsetWidth;
          const h = card.offsetHeight;
          const scale = Math.min(w / 1200, h / 900);
          card.style.setProperty("--pscale", String(scale));
        });
    };
    setScales();
    window.addEventListener("resize", setScales);
    return () => window.removeEventListener("resize", setScales);
  }, [filtered]);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ── Sticky nav ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-bg/90 px-6 py-3 backdrop-blur">
        <Link
          href="/"
          className="font-mono text-xs text-text-muted no-underline transition-colors hover:text-text"
        >
          ← rauhut.com
        </Link>
        <ThemeToggle />
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-6 pb-8 pt-12">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-text-subtle">
          Design Gallery
        </p>
        <h1 className="mb-2 text-3xl font-light tracking-tight">
          28 Explorations in{" "}
          <strong className="font-semibold">UI Design</strong>
        </h1>
        <p className="text-sm text-text-muted">Stuttgart · 2025–26</p>

        {/* Stats row */}
        <div className="mt-8 flex flex-wrap gap-8 border-t border-border pt-8">
          <div>
            <span className="block font-mono text-xl font-medium leading-none">
              28
            </span>
            <span className="mt-1 block text-xs text-text-subtle">
              Designs
            </span>
          </div>
          <div>
            <span className="block font-mono text-xl font-medium leading-none">
              150+
            </span>
            <span className="mt-1 block text-xs text-text-subtle">Themes</span>
          </div>
          <div>
            <span className="block font-mono text-xl font-medium leading-none">
              {ALL_TAGS.length - 1}
            </span>
            <span className="mt-1 block text-xs text-text-subtle">
              Kategorien
            </span>
          </div>
        </div>
      </div>

      {/* ── Filter + Grid ──────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <FilterBar
          tags={ALL_TAGS}
          activeTag={activeTag}
          onTagChange={setActiveTag}
          designs={designs}
        />

        <div
          ref={gridRef}
          className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {filtered.map((design) => (
            <DesignCard key={design.slug} design={design} />
          ))}
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="mx-auto max-w-7xl border-t border-border px-6 pb-6 pt-10 text-sm text-text-subtle">
        <p>
          © {new Date().getFullYear()} German Rauhut ·{" "}
          <a href="/impressum">Impressum</a> ·{" "}
          <a href="/designs">Designs</a>
        </p>
      </footer>
    </div>
  );
}
```

- [ ] **Step 8b: Create designs/page.tsx (Server Component)**

Create `src/app/designs/page.tsx`:

```tsx
import type { Metadata } from "next";
import DesignsGallery from "@/components/designs/DesignsGallery";
import { DESIGNS } from "./data";

export const metadata: Metadata = {
  title: "Design Gallery — rauhut.com",
  description:
    "28 eigenständige UI-Design-Explorations von German Rauhut: Art Déco, Vaporwave, SpaceX, Egypt, Brutalist, Gothic und mehr.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://rauhut.com/designs" },
};

export default function DesignsPage() {
  return <DesignsGallery designs={DESIGNS} />;
}
```

- [ ] **Step 8c: Verify TypeScript + dev build**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npx tsc --noEmit 2>&1 | head -20
```

Expected: No output (clean).

Check the dev server (should already be running on :3001). Navigate to `http://localhost:3001/designs` in a browser. Expected: Gallery page loads with 28 cards.

- [ ] **Step 8d: Run Playwright tests (expect 4/5 to pass now)**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npx playwright test
```

Expected: Tests 1 (footer link) will still fail (not added yet). Tests 2–5 should pass. Confirm in test output.

- [ ] **Step 8e: Commit**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && git add src/components/designs/DesignsGallery.tsx src/app/designs/page.tsx && git commit -m "feat(designs): add DesignsGallery client component + /designs route"
```

---

## Task 9: Footer Nav Links (de + en)

**Files:**
- Modify: `src/app/page.tsx` (line ~216 — footer section)
- Modify: `src/app/en/page.tsx` (last ~10 lines — footer section)

- [ ] **Step 9a: Update German homepage footer**

Open `src/app/page.tsx`. Find the footer section (near end of file):

```jsx
      <footer className="pt-10 pb-4 text-sm text-text-subtle">
        <p>
          © {new Date().getFullYear()} German Rauhut ·{" "}
          <a href="/impressum">Impressum</a>
        </p>
      </footer>
```

Replace with:

```jsx
      <footer className="pt-10 pb-4 text-sm text-text-subtle">
        <p>
          © {new Date().getFullYear()} German Rauhut ·{" "}
          <a href="/impressum">Impressum</a> ·{" "}
          <a href="/designs">Designs</a>
        </p>
      </footer>
```

- [ ] **Step 9b: Update English homepage footer**

Open `src/app/en/page.tsx`. Find the footer section (near end of file):

```jsx
      <footer className="pt-10 pb-4 text-sm text-text-subtle">
        <p>
          © {new Date().getFullYear()} German Rauhut ·{" "}
          <a href="/impressum" lang="de">
            Imprint (German)
          </a>
        </p>
      </footer>
```

Replace with:

```jsx
      <footer className="pt-10 pb-4 text-sm text-text-subtle">
        <p>
          © {new Date().getFullYear()} German Rauhut ·{" "}
          <a href="/impressum" lang="de">
            Imprint (German)
          </a>{" "}
          ·{" "}
          <a href="/designs">Designs</a>
        </p>
      </footer>
```

- [ ] **Step 9c: Run all Playwright tests — expect 5/5 green**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npx playwright test
```

Expected: All 5 tests PASS.

If any test fails, see troubleshooting notes at end of plan.

- [ ] **Step 9d: Commit**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && git add src/app/page.tsx src/app/en/page.tsx && git commit -m "feat(designs): add Designs footer link on de + en homepage"
```

---

## Task 10: Update CLAUDE.md Decisions

**Files:**
- Modify: `CLAUDE.md` in `rauhut-website/`

- [ ] **Step 10a: Add D6–D9 to the Decisions table**

Open `CLAUDE.md`. Find the `## Decisions` table. Append four rows:

```markdown
| 6 | 2026-05-16 | **D6 — Playwright added to rauhut-website** | Task override of "Out of Scope" entry; closes retro Playwright-gap on websites |
| 7 | 2026-05-16 | **D7 — SpaceX hero interval 150ms → 2000ms** | Per user request: images were cycling too fast to read |
| 8 | 2026-05-16 | **D8 — rauhut-luxury.html excluded** | File intentionally deleted before integration; 28 cards shown |
| 9 | 2026-05-16 | **D9 — Gallery page uses max-w-7xl** | Full-width card grid; main site uses max-w-2xl (single CV column) |
```

- [ ] **Step 10b: Commit**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && git add CLAUDE.md && git commit -m "docs(decisions): add D6-D9 for Designs gallery feature"
```

---

## Task 11: Build Check + Lint

- [ ] **Step 11a: Run production build**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npm run build 2>&1 | tail -30
```

Expected: `✓ Compiled successfully`. No type errors, no missing modules.

If build fails with a type error: read the error, fix the specific file, re-run build.

- [ ] **Step 11b: Run lint**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npm run lint 2>&1
```

Expected: No errors. Warnings are OK.

- [ ] **Step 11c: Commit if any lint fixes were needed**

Only commit if you made changes. Skip otherwise.

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && git add -p && git commit -m "fix(designs): lint fixes"
```

---

## Task 12: Lighthouse

Run Lighthouse on both pages. Use the local production build:

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npm run build && npm run start &
```

Wait ~3 seconds for the server to start on port 3001.

- [ ] **Step 12a: Homepage baseline Lighthouse (desktop)**

```bash
npx lighthouse http://localhost:3001 --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=.lighthouse/designs-release-home-desktop.json --chrome-flags="--headless" --form-factor=desktop --preset=desktop 2>&1 | grep -E "score|error" | head -20
```

Then read scores:
```bash
node -e "const r=require('./.lighthouse/designs-release-home-desktop.json');const c=r.categories;console.log('Performance:',Math.round(c.performance.score*100),'Accessibility:',Math.round(c.accessibility.score*100),'Best-Practices:',Math.round(c['best-practices'].score*100),'SEO:',Math.round(c.seo.score*100))"
```

Required minimums: Performance ≥ 85, Accessibility ≥ 90, SEO ≥ 90, Best Practices ≥ 90.
If homepage scores drop below baseline from previous run, investigate before continuing.

- [ ] **Step 12b: Designs page Lighthouse (desktop)**

```bash
npx lighthouse http://localhost:3001/designs --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=.lighthouse/designs-release-designs-desktop.json --chrome-flags="--headless" --form-factor=desktop --preset=desktop 2>&1 | grep -E "score|error" | head -20
```

Read scores:
```bash
node -e "const r=require('./.lighthouse/designs-release-designs-desktop.json');const c=r.categories;console.log('Performance:',Math.round(c.performance.score*100),'Accessibility:',Math.round(c.accessibility.score*100),'Best-Practices:',Math.round(c['best-practices'].score*100),'SEO:',Math.round(c.seo.score*100))"
```

Required minimums: Performance ≥ 85, Accessibility ≥ 90, SEO ≥ 90, Best Practices ≥ 90.

If the Designs page Accessibility score is below 90, common fixes:
- Add `aria-label` to the filter bar `<div>` → wrap in `<nav aria-label="Filter designs">`
- Check color contrast on muted text against background
- Add `role="list"` to the card grid div (optional but helps score)

If Performance is below 85, check:
- Are iframes loading eagerly? They should have `loading="lazy"` (already in DesignCard)
- LCP should be the H1 text, not an image

- [ ] **Step 12c: Stop local server and commit Lighthouse reports**

```bash
kill %1 2>/dev/null || true
cd ~/Developer/projects/neckarshore-ai/rauhut-website && git add .lighthouse/designs-release-*.json && git commit -m "perf(lighthouse): add Designs release baseline — home + /designs desktop"
```

---

## Task 13: Final Test Run + Push

- [ ] **Step 13a: Final Playwright test run**

Start dev server if not running:
```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npm run dev &
```

Run all tests:
```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && npx playwright test --reporter=list
```

Expected: 5 passed, 0 failed.

- [ ] **Step 13b: Push to origin/main**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && git push origin main
```

- [ ] **Step 13c: Verify CI is green**

```bash
cd ~/Developer/projects/neckarshore-ai/rauhut-website && gh run list --limit 3
```

Expected: Latest run shows "completed / success".

---

## Troubleshooting Notes

### Test 1 fails: "Designs link not found"
- Confirm `src/app/page.tsx` footer has `<a href="/designs">Designs</a>`
- Dev server may need restart after the change: `Ctrl+C` then `npm run dev`

### Test 3 fails: "expected 28, got fewer"
- Check `activeTag` default is `"all"` in DesignsGallery (shows all 28)
- Check `DESIGNS` array in data.ts has exactly 28 entries (not 29 — luxury excluded)

### Test 4 fails: one link returns 404
- Run: `ls public/designs/ | grep "rauhut-" | wc -l` → should be 28
- Check slugs in data.ts match actual filenames: slug `"art-deco"` → `rauhut-art-deco.html`

### Lighthouse accessibility below 90
- Add `role="list"` to the grid div
- Add `<div role="listitem">` wrapper inside DesignCard
- Ensure all `<button>` elements in ShuffleTour and FilterBar have `aria-label` or visible text

### TypeScript errors on Tailwind v4 class strings
- Tailwind v4 uses `@theme` tokens. Utility names like `bg-bg-muted` and `text-text-subtle` come from `globals.css` `@theme` block — they should resolve correctly. If not, double check `globals.css` defines `--color-bg-muted` and `--color-text-subtle`.
