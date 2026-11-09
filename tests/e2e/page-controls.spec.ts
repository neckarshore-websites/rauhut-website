import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Page controls cluster (rauhut-website #114, Founder 2026-11-08): DE, EN, light/dark and
 * play/pause side by side, in that order. Desktop: top of the sticky rail (top right).
 * Phone: right of the row above the hero (proposal option 1 in the ticket).
 */
const PAGES = [
  { path: "/", pause: "Hintergrundanimation anhalten" },
  { path: "/en", pause: "Pause background animation" },
] as const;

const cluster = (page: Page) => page.locator("[data-page-controls]:visible");

async function boxesInOrder(c: Locator, pause: string) {
  const lang = c.locator('nav[aria-label="Language"]');
  const parts = [
    lang.getByText("DE", { exact: true }),
    lang.getByText("EN", { exact: true }),
    c.getByRole("button", { name: /Theme/ }),
    c.getByRole("button", { name: pause }),
  ];
  const boxes = [];
  for (const p of parts) boxes.push((await p.boundingBox())!);
  return boxes;
}

function expectOneRowInOrder(boxes: { x: number; y: number; width: number; height: number }[]) {
  const centers = boxes.map((b) => b.y + b.height / 2);
  for (const y of centers) expect(Math.abs(y - centers[0])).toBeLessThan(4);
  for (let i = 1; i < boxes.length; i++) expect(boxes[i].x).toBeGreaterThan(boxes[i - 1].x);
}

for (const { path, pause } of PAGES) {
  test(`desktop ${path}: the four controls sit in one row at the top of the rail, top right`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path);
    await expect(page.locator("[data-hero-network]")).toHaveAttribute("data-state", "running");
    const c = cluster(page);
    await expect(c).toHaveCount(1);
    await expect(page.locator("aside").locator("[data-page-controls]")).toBeVisible();

    const boxes = await boxesInOrder(c, pause);
    expectOneRowInOrder(boxes);

    const main = (await page.locator("main").boundingBox())!;
    const box = (await c.boundingBox())!;
    expect(box.x).toBeGreaterThan(main.x + main.width);
    expect(box.y).toBeLessThan(150);

    // Sticky: still reachable after scrolling down.
    await page.locator("footer").last().scrollIntoViewIfNeeded();
    await expect(c).toBeInViewport();
  });

  test(`phone ${path}: the four controls sit in one row, right of the row above the hero`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(path);
    await expect(page.locator("[data-hero-network]")).not.toHaveAttribute("data-state", "idle");
    const c = cluster(page);
    await expect(c).toHaveCount(1);
    await expect(page.locator("main").locator("[data-page-controls]:visible")).toHaveCount(1);

    const boxes = await boxesInOrder(c, pause);
    expectOneRowInOrder(boxes);

    const pauseBox = boxes[3];
    expect(390 - (pauseBox.x + pauseBox.width)).toBeLessThanOrEqual(32);
    const hero = (await page.locator("header.hero-glow").boundingBox())!;
    expect(pauseBox.y + pauseBox.height).toBeLessThan(hero.y);
    await ctx.close();
  });
}

test("the pause slot is reserved: without the animation, DE, EN and theme stay in place", async ({ browser }) => {
  const positions: number[][] = [];
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.locator("[data-hero-network]")).toHaveAttribute(
      "data-state",
      reducedMotion === "reduce" ? "static" : /running|offscreen|hidden/,
    );
    const c = cluster(page);
    const theme = (await c.getByRole("button", { name: /Theme/ }).boundingBox())!;
    const de = (await c.getByText("DE", { exact: true }).boundingBox())!;
    positions.push([Math.round(de.x), Math.round(theme.x)]);
    if (reducedMotion === "reduce") {
      await expect(page.getByRole("button", { name: "Hintergrundanimation anhalten" })).toBeHidden();
    }
    await ctx.close();
  }
  expect(positions[1]).toEqual(positions[0]);
});
