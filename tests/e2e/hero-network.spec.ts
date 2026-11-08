import { expect, test, type Page } from "@playwright/test";

/**
 * Hero network background (rauhut-website #111): decorative, behind the hero, never in
 * the way. The component exposes its state on [data-hero-network] for these checks:
 * data-state (idle | running | paused | offscreen | hidden | static), data-variant
 * (full | reduced), data-frames (advances while drawing), data-palette (dark | light).
 */
const PAGES = [
  { path: "/", pause: "Hintergrundanimation anhalten" },
  { path: "/en", pause: "Pause background animation" },
] as const;

const net = (page: Page) => page.locator("[data-hero-network]");
const frames = async (page: Page) => Number((await net(page).getAttribute("data-frames")) ?? "0");

async function expectFramesAdvance(page: Page) {
  const before = await frames(page);
  await expect.poll(() => frames(page), { message: "frames advance" }).toBeGreaterThan(before);
}

async function expectFramesHold(page: Page) {
  const before = await frames(page);
  await page.waitForTimeout(600);
  expect(await frames(page), "frames hold").toBe(before);
}

for (const { path, pause } of PAGES) {
  test.describe(`hero network ${path} @hero-network`, () => {
    test("is decorative: hidden from assistive technology and transparent to the pointer", async ({ page }) => {
      await page.goto(path);
      await expect(net(page)).toHaveAttribute("aria-hidden", "true");
      await expect(net(page).locator("canvas")).toHaveCount(1);
      expect(await net(page).evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
    });

    // A canvas left in normal flow grows the hero with every resize (seen once on a
    // stale stylesheet: the header reached 33,554,432 px). The layer must be out of flow.
    test("the layer is out of flow and leaves the hero's size alone", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(path);
      await expect(net(page)).toHaveAttribute("data-state", "running");
      expect(await net(page).evaluate((el) => getComputedStyle(el).position)).toBe("absolute");
      const hero = await page.locator("header.hero-glow").boundingBox();
      expect(hero!.height).toBeLessThan(900);
    });

    test("every hero link and button still receives the pointer", async ({ page }) => {
      await page.goto(path);
      await expect(net(page)).toHaveAttribute("data-state", "running");
      const targets = page.locator("header.hero-glow").locator("a, button:not([data-hero-network-toggle])");
      const count = await targets.count();
      expect(count).toBeGreaterThanOrEqual(3);
      for (let i = 0; i < count; i++) {
        const hit = await targets.nth(i).evaluate((el) => {
          const r = el.getBoundingClientRect();
          const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return !!top && (top === el || el.contains(top));
        });
        expect(hit, `target ${i} is covered`).toBe(true);
      }
    });

    test("desktop runs the full variant; pause holds the frames, resume continues", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(path);
      await expect(net(page)).toHaveAttribute("data-variant", "full");
      await expect(net(page)).toHaveAttribute("data-state", "running");
      await expectFramesAdvance(page);

      const toggle = page.getByRole("button", { name: pause });
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
      await expect(net(page)).toHaveAttribute("data-state", "paused");
      await expectFramesHold(page);

      await toggle.click();
      await expect(net(page)).toHaveAttribute("data-state", "running");
      await expectFramesAdvance(page);
    });

    test("stops drawing when the hero leaves the viewport", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(path);
      await expect(net(page)).toHaveAttribute("data-state", "running");
      await page.locator("footer").last().scrollIntoViewIfNeeded();
      await expect(net(page)).toHaveAttribute("data-state", "offscreen");
      await expectFramesHold(page);
    });

    test("the palette follows the theme switch", async ({ page }) => {
      await page.goto(path);
      await expect(net(page)).toHaveAttribute("data-palette", "dark");
      await page.getByRole("button", { name: /Theme/ }).first().click();
      await expect(net(page)).toHaveAttribute("data-palette", "light");
    });
  });
}

test.describe("hero network variants @hero-network", () => {
  test("reduced motion: one static frame, no loop, no pause control", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(net(page)).toHaveAttribute("data-state", "static");
    await expectFramesHold(page);
    await expect(page.getByRole("button", { name: "Hintergrundanimation anhalten" })).toBeHidden();
  });

  test("a phone gets the reduced variant", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(net(page)).toHaveAttribute("data-variant", "reduced");
    await expect(net(page)).toHaveAttribute("data-state", "running");
    await ctx.close();
  });

  // Scoped to the layer: at 320px a table further down the page already overflows
  // (measured on main, 2026-11-08), which is not this component's to fix.
  test("320px: the layer stays inside the viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/");
    await expect(net(page)).toHaveAttribute("data-state", /running|static/);
    const box = await net(page).evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, vw: document.documentElement.clientWidth };
    });
    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(box.vw);
  });

  // The one foreign origin allowed is the existing Vercel Web Analytics debug script,
  // which @vercel/analytics loads in development only; production serves it same-origin.
  test("no request leaves the site's own origin", async ({ page, baseURL }) => {
    const origins = new Set<string>();
    page.on("request", (req) => origins.add(new URL(req.url()).origin));
    await page.goto("/");
    await expect(net(page)).toHaveAttribute("data-state", "running");
    await page.waitForTimeout(500);
    origins.delete("https://va.vercel-scripts.com");
    expect([...origins]).toEqual([new URL(baseURL!).origin]);
  });

  test("the old teal glow behind the hero is gone", async ({ page }) => {
    await page.goto("/");
    const glow = await page
      .locator("header.hero-glow")
      .evaluate((el) => getComputedStyle(el, "::before").backgroundImage);
    expect(glow).toBe("none");
  });
});
