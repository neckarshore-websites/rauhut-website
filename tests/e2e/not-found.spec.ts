import { expect, test } from "@playwright/test";

/**
 * THE 404 "404 MILES" (src/app/not-found.tsx): status, tab title, the line, the way back, the
 * trail hidden from screen readers, the footprints visible under reduced motion, no sideways
 * scroll.
 */
test("a dead address answers 404 with the 404-miles page and a way back", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const antwort = await page.goto("/gibt-es-nicht");
  expect(antwort?.status()).toBe(404);
  await expect(page).toHaveTitle("Seite nicht gefunden — rauhut.com");

  const seite = page.locator("[data-rauhut-404]");
  await expect(seite.getByRole("heading", { level: 1 })).toHaveText("And I would walk 404 miles …");
  await expect(seite.getByRole("link", { name: "← Zur Startseite" })).toHaveAttribute("href", "/");
  await expect(seite.locator("[data-spur]")).toHaveAttribute("aria-hidden", "true");

  /* Under reduced motion every footprint is there at once, none waits invisible. */
  const unsichtbar = await seite
    .locator(".spur-schritt")
    .evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== "1").length);
  expect(unsichtbar).toBe(0);

  const breiter = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(breiter).toBe(false);
});
