import { expect, test, type Page } from "@playwright/test";

/**
 * Browser chrome tint — exactly one theme-color tag, equal to the background the page
 * paints: in the dark default, with a stored light choice, and after a press of the switch.
 * Source of the color: --color-bg in globals.css; components/ThemeColorSync.tsx follows the
 * switch. The body has a 0.2s background transition, so the comparison polls.
 */
const PAGES = ["/", "/en"];

function toHex(color: string): string {
  if (/^#[0-9a-f]{3}$/i.test(color)) return ("#" + [...color.slice(1)].map((c) => c + c).join("")).toLowerCase();
  if (color.startsWith("#")) return color.toLowerCase();
  const m = color.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) throw new Error(`not a color: ${color}`);
  return "#" + m.slice(0, 3).map((n) => Math.round(Number(n)).toString(16).padStart(2, "0")).join("");
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
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expectTintMatchesGround(page, await ground(page), `${path} dark`);
  }
});

test("theme-color follows a stored light choice", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  for (const path of PAGES) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expectTintMatchesGround(page, await ground(page), `${path} light`);
  }
});

test("theme-color follows a press of the switch", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Theme wechseln (Dark / Light)" }).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expectTintMatchesGround(page, await ground(page), "after switch");
});
