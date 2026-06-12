import { test, expect } from "@playwright/test";

test("German homepage renders the primary profile content", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "German Rauhut" })
  ).toBeVisible();
  await expect(page.locator("main")).not.toHaveAttribute("lang", "en");
  await expect(
    page.getByText("Technical Product Owner & AI Product Builder").first()
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Zusammenfassung" })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Impressum" })
  ).toBeVisible();
});

test("English homepage renders localized content and language metadata", async ({
  page,
}) => {
  await page.goto("/en");

  await expect(page.locator("main")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", { level: 2, name: "About" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Core Competencies" })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Imprint (German)" })
  ).toHaveAttribute("href", "/impressum");
});

test("language toggle links German and English pages without self-links", async ({
  page,
}) => {
  await page.goto("/");

  const langNav = page.locator('nav[aria-label="Language"]');
  await expect(langNav.locator('span[aria-current="page"]')).toHaveText("DE");
  await langNav.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL("/en");
  await expect(langNav.locator('span[aria-current="page"]')).toHaveText("EN");

  await langNav.getByRole("link", { name: "DE", exact: true }).click();
  await expect(page).toHaveURL("/");
});

test("theme toggle switches theme and persists it across reloads", async ({
  page,
}) => {
  await page.goto("/");

  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "Theme wechseln" }).click();
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(page.evaluate(() => localStorage.getItem("theme"))).resolves.toBe(
    "light"
  );

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "Theme wechseln" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");
});

test("imprint page is reachable and marked noindex", async ({ page }) => {
  await page.goto("/impressum");

  await expect(
    page.getByRole("heading", { level: 1, name: "Impressum" })
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/
  );
  await expect(page.getByRole("link", { name: "German Rauhut" })).toHaveAttribute(
    "href",
    "/"
  );
});
