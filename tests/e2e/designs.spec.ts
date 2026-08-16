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
  // ONE known, explained, dev-only console error is filtered — and the
  // filter is narrow enough to name exactly what it drops.
  //
  // In dev, @vercel/analytics loads `script.debug.js` from
  // va.vercel-scripts.com. Our CSP allows only 'self' + Turnstile, so the
  // browser blocks it and logs a violation. Whether that log lands before or
  // after the assertion is a race, which made this test fail roughly half
  // the time — five false reds on 2026-08-16 alone, plus a twenty-minute
  // hunt through an unrelated diff on the same day, twice diagnosed wrongly
  // (orphan dev server, then cold start) before the message was read.
  //
  // PRODUCTION IS NOT AFFECTED, verified rather than assumed: live,
  // @vercel/analytics is edge-proxied SAME-ORIGIN from
  // /_vercel/insights/script.js (HTTP 200 on rauhut.com), covered by
  // `script-src 'self'`. next.config.ts documents the same arrangement.
  //
  // WHAT THIS WOULD HIDE, stated so nobody has to reconstruct it: a CSP
  // violation for THIS EXACT dev-only URL. Any other blocked script — a real
  // production CSP gap included — still fails, because the match is the full
  // debug-script URL and not the word "CSP".
  const DEV_ONLY_ANALYTICS_CSP =
    "https://va.vercel-scripts.com/v1/script.debug.js";

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    if (msg.text().includes(DEV_ONLY_ANALYTICS_CSP)) return;
    consoleErrors.push(msg.text());
  });

  page.on("requestfailed", (req) => {
    if (req.url().includes(DEV_ONLY_ANALYTICS_CSP)) return;
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
