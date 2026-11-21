import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/**
 * The theme follows the device setting (prefers-color-scheme) until the
 * visitor uses the switch; the switch's choice then wins. Privacy half:
 * without a choice nothing is written to localStorage.
 */
const html = (page: Page) => page.locator("html");
const storedTheme = (page: Page) => page.evaluate(() => localStorage.getItem("theme"));

for (const scheme of ["light", "dark"] as const) {
  test(`device ${scheme}, no choice -> ${scheme}, nothing stored`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await expect(html(page)).toHaveAttribute("data-theme", scheme);
    expect(await storedTheme(page)).toBeNull();
  });
}

test("stored choice beats the device setting", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.goto("/");
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
});

test("device switch while open is followed when there is no choice", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(html(page)).toHaveAttribute("data-theme", "light");
});

test("switch stores the choice and a device switch no longer overrides it", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(html(page)).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Theme wechseln (Dark / Light)" }).first().click();
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
  expect(await storedTheme(page)).toBe("dark");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
});

test("light device: light already before hydration (app chunks blocked)", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.route(/\/_next\/static\/chunks\//, (route) => route.abort());
  await page.goto("/");
  await expect(html(page)).toHaveAttribute("data-theme", "light");
});
