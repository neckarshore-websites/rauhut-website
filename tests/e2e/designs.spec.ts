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
