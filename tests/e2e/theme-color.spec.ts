import { expect, test, type Page } from "@playwright/test";

/**
 * Browser chrome tint — exactly one theme-color tag, equal to the background the page
 * paints: in the dark default, with a stored light choice, and after a press of the switch.
 * Source of the color: --color-bg in globals.css; components/ThemeColorSync.tsx follows the
 * switch. The body has a 0.2s background transition, so the comparison polls. Each page must
 * answer 200, and the tag as shipped in the server HTML must already be the ground.
 */
const PAGES = ["/", "/en"];

function toHex(color: string): string {
  if (/^#[0-9a-f]{3}$/i.test(color)) return ("#" + [...color.slice(1)].map((c) => c + c).join("")).toLowerCase();
  if (color.startsWith("#")) return color.toLowerCase();
  const m = color.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) throw new Error(`not a color: ${color}`);
  return "#" + m.slice(0, 3).map((n) => Math.round(Number(n)).toString(16).padStart(2, "0")).join("");
}

/** The tag as the server ships it, before ThemeColorSync rewrites it after hydration. */
async function shippedTint(page: Page, path: string): Promise<string> {
  const html = await (await page.request.get(path)).text();
  const content = html.match(/<meta[^>]*name="theme-color"[^>]*>/)?.[0].match(/content="([^"]+)"/)?.[1];
  if (!content) throw new Error(`${path}: no shipped theme-color tag`);
  return toHex(content);
}

async function expectTintMatchesGround(page: Page, expectedGround: string, label: string) {
  const tags = page.locator('meta[name="theme-color"]');
  expect(await tags.count(), `${label}: theme-color tags`).toBe(1);
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor).then(toHex), {
      message: `${label}: ground settled`,
    })
    .toBe(expectedGround);
  await expect
    .poll(async () => toHex((await tags.getAttribute("content")) ?? ""), { message: `${label}: tag vs ground` })
    .toBe(expectedGround);
}

const ground = (page: Page) =>
  page
    .evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim())
    .then(toHex);

test("theme-color equals the dark default ground", async ({ page }) => {
  for (const path of PAGES) {
    expect((await page.goto(path))?.status(), `${path}: status`).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expectTintMatchesGround(page, await ground(page), `${path} dark`);
    // What Safari shows before hydration: the shipped value must already be the dark ground.
    expect(await shippedTint(page, path), `${path}: shipped tag vs ground`).toBe(await ground(page));
  }
});

test("theme-color follows a stored light choice", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  for (const path of PAGES) {
    expect((await page.goto(path))?.status(), `${path}: status`).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expectTintMatchesGround(page, await ground(page), `${path} light`);
  }
});

test("theme-color follows a press of the switch", async ({ page }) => {
  expect((await page.goto("/"))?.status(), "/: status").toBe(200);
  await page.getByRole("button", { name: "Theme wechseln (Dark / Light)" }).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expectTintMatchesGround(page, await ground(page), "after switch");
});
