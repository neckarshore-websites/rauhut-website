import { test, expect } from "./fixtures";

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

  // THIS FIXES ONE OF TWO CAUSES. Stated up front so the next reader does
  // not treat a still-flaky test as a new defect: after this filter the
  // suite goes green roughly four runs in five, not five in five. The
  // remaining failure is a bare "404" console error with no URL attached; it
  // does NOT reproduce when /designs is loaded six times in isolation
  // (measured), only inside a full suite run, which fits Next's on-demand
  // dev compilation serving a chunk request before it is built. Not chased
  // further on 2026-08-16 — three attempts, and the fix-loop rule says stop
  // and write it down. Production is statically built and cannot have this.
  //
  // Until 2026-11-18 two Vercel Web Analytics artefacts were filtered here (a
  // dev-only CSP block of va.vercel-scripts.com and a local-only 404 of
  // /_vercel/insights/script.js). Umami replaced Vercel Analytics (planning
  // #4006 row 6) and its host is answered by the stub in ./fixtures, so both
  // filters are gone: every console error and failed request now fails.

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    consoleErrors.push(msg.text());
  });

  page.on("requestfailed", (req) => {
    failedRequests.push(req.url());
  });

  await page.goto("/designs");
  // "load" instead of "networkidle": Next.js dev HMR keeps a WebSocket open,
  // which prevents networkidle from ever settling in dev mode.
  await page.waitForLoadState("load");

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

// ── Test 6: ShuffleTour respects active tag filter ──────────────────────────
// Regression guard for the 2026-05-20 fix: tour was previously seeded with
// the full 28-design list regardless of activeTag. Now it must mirror the
// filtered grid.
test("ShuffleTour queue size matches active filter", async ({ page }) => {
  await page.goto("/designs");

  // Apply a non-"all" filter — pick the second tag (first is "all").
  const filterButtons = page.locator('button[class*="font-mono"]').filter({
    hasText: /^[a-zäöü]/i,
  });
  await filterButtons.nth(1).click();

  // Count visible cards after filter (= expected tour size).
  const visibleCards = await page.locator('a[href^="/designs/rauhut-"]').count();
  expect(visibleCards).toBeGreaterThan(0);
  expect(visibleCards).toBeLessThan(28);

  // Open the tour.
  await page.getByRole("button", { name: /Tour/i }).click();

  // Tour top-bar shows "<idx> / <total>". Read total.
  const counter = page.locator('[role="dialog"] span.text-white\\/30').first();
  await expect(counter).toBeVisible();
  const counterText = await counter.textContent();
  const match = counterText?.match(/\/\s*(\d+)/);
  expect(match, `Counter text: ${counterText}`).not.toBeNull();
  const tourSize = Number(match![1]);

  expect(tourSize).toBe(visibleCards);
});

// ── Test 7: /designs stays crawlable but never indexable (P7, 2026-09-12) ──
// The gallery is a lab, not a statement (see next.config.ts). It must stay
// open to humans (no login, no removal from the homepage footer) while
// carrying an unambiguous noindex signal — header and meta must agree, and
// the footer link must not pass ranking signal. Regression guard for the
// index:true/follow:true meta that previously contradicted the
// X-Robots-Tag header.
test("/designs is reachable, marked noindex/nofollow, and its footer link carries rel=nofollow", async ({
  page,
  request,
}) => {
  await page.goto("/designs");
  await expect(page.locator("h1, h2").first()).toBeVisible();

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /nofollow/
  );

  const response = await request.get("/designs");
  expect(response.headers()["x-robots-tag"]).toMatch(/noindex/);
  expect(response.headers()["x-robots-tag"]).toMatch(/nofollow/);

  await page.goto("/");
  await expect(
    page.locator('footer a[href="/designs"]')
  ).toHaveAttribute("rel", "nofollow");
});

// ── Test 8: robots.txt disallows /designs but nothing else (P7, 2026-09-12) ──
test("robots.txt disallows /designs while the rest of the site stays allowed", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");
  const body = await response.text();

  expect(body).toMatch(/Disallow:\s*\/designs/);
  expect(body).toMatch(/Allow:\s*\//);
  expect(body).toMatch(/Sitemap:\s*https:\/\/rauhut\.com\/sitemap\.xml/);
});
