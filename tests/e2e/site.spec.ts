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

/**
 * Block 4 — the KI-Beratung bridge.
 *
 * The copy is Founder-worded and it leads to a paid offer. Without an
 * assertion it can fall out silently on the next rework — which is very
 * nearly what happened to the Einfuehrungspreis label on neckarshore.ai.
 * Asserted: the section exists, the load-bearing sentence survives, and
 * the link keeps the `?ref=rauhut` marker the campaign measures against.
 * Drop the marker and the reach of this page becomes unmeasurable without
 * anything appearing broken.
 */
test("German homepage bridges to the KI-Potenzialanalyse", async ({ page }) => {
  await page.goto("/");

  const section = page.getByRole("region", { name: "KI-Beratung" });
  await expect(section).toBeVisible();
  await expect(section).toContainText(
    "empfohlen wird nur, was vorher im eigenen Betrieb gelaufen ist"
  );
  await expect(
    section.getByRole("link", { name: "Zur KI-Potenzialanalyse" })
  ).toHaveAttribute("href", "https://neckarshore.ai/ki-beratung?ref=rauhut");
});

/**
 * C4 guard — rauhut.com is a person page and deliberately NOT an
 * availability page (Founder decision via Engels, batch 4). Until now that
 * decision existed only as prose in a report, which is exactly the shape
 * this estate keeps finding drifted.
 *
 * Allowed is offer language: "this exists, here is the way."
 * Forbidden is availability language: "I am free, book me." The second kind
 * re-opens the settled question through the back door, one innocuous word
 * at a time.
 *
 * Scoped to the section on purpose — "Auftrag" and friends are legitimate
 * words elsewhere on a CV page.
 *
 * KNOWN LIMITATION, written down before it bites: this matches strings, not
 * meaning. `beauftrag` would also fire on a harmless past-tense sentence
 * ("vom Kunden beauftragt") if the section ever grows one. That is the same
 * shape as the public-figures guard, which on its first day reported the
 * comment explaining a retired number as a defect — a tool enforcing a rule
 * cannot tell a claim from talk about a claim. If this ever false-alarms,
 * narrow the pattern; do NOT reword the copy to appease it. Rewording to
 * satisfy a naive guard is how the guarded thing quietly disappears.
 */
const AVAILABILITY_VOCAB =
  /buchbar|verf[üu]gbar|Verf[üu]gbarkeit|Kapazit[äa]t|freie? Slots?|Mandat|beauftrag/i;

test("the KI-Beratung section stays offer language, not availability language", async ({
  page,
}) => {
  await page.goto("/");

  const copy = await page
    .getByRole("region", { name: "KI-Beratung" })
    .innerText();

  expect(copy.length).toBeGreaterThan(0);
  expect(
    copy,
    "availability vocabulary re-opens the person-page-not-acquisition-page decision (C4)"
  ).not.toMatch(AVAILABILITY_VOCAB);
});

/**
 * The offer page is German-only (`/en/ki-beratung` is a 404, verified
 * 2026-08-16). Sending an English reader there unannounced is a dead end,
 * so the link carries the same "(German)" marker this page already uses
 * for the imprint — an existing convention, not a new invention.
 */
test("English homepage bridges to the offer page and marks it as German", async ({
  page,
}) => {
  await page.goto("/en");

  const section = page.getByRole("region", { name: "AI Consulting" });
  await expect(section).toBeVisible();
  await expect(
    section.getByRole("link", { name: "(German)" })
  ).toHaveAttribute("href", "https://neckarshore.ai/ki-beratung?ref=rauhut");
});

/**
 * Projektblock — Variante A (Founder-decided 2026-08-16): one lead tile for
 * neckarshore.ai, and under it a compact list of the products that live
 * inside it. The hierarchy is the point — the five rows are not siblings of
 * the tile, they are its contents.
 *
 * Two things are asserted rather than trusted:
 *
 * 1. THE TARGETS. Every row points at a product page on neckarshore.ai. All
 *    routes were measured 200 on 2026-08-16, but nothing in this repo keeps
 *    a slug honest afterwards — a typo ships a 404 into the most prominent
 *    block on the page and nothing here would notice. Asserted against a
 *    literal list and NOT by fetching the live site: a network call would
 *    make this suite depend on a foreign deployment's uptime, which is how
 *    a green suite starts lying for reasons that have nothing to do with
 *    this repo.
 *
 * 2. THE ABSENCE OF REPOSITORY LINKS. Sending a visitor of a person page
 *    into a code repository is exactly what this rebuild removed. Without an
 *    assertion it creeps back on the next content pass, one helpful link at
 *    a time — the same shape as the C4 guard below.
 */
const PRODUCT_ROWS = [
  ["Omnopsis Documentor", "https://neckarshore.ai/products/omnopsis"],
  [
    "Obsidian Vault Autopilot",
    "https://neckarshore.ai/products/obsidian-vault-autopilot",
  ],
  ["TrustScope", "https://neckarshore.ai/products/trustscope"],
  ["Kaze", "https://neckarshore.ai/products/kaze"],
  ["Skills", "https://neckarshore.ai/products/skills"],
] as const;

const PROJECT_BLOCK = [
  ["German", "/", "Projektbereich"],
  ["English", "/en", "Project overview"],
] as const;

for (const [language, path, regionLabel] of PROJECT_BLOCK) {
  test(`${language} homepage leads with neckarshore.ai and lists its products`, async ({
    page,
  }) => {
    await page.goto(path);

    const block = page.getByRole("region", { name: regionLabel });
    await expect(block).toBeVisible();

    await expect(
      block.getByRole("link", { name: /neckarshore/i })
    ).toHaveAttribute("href", "https://neckarshore.ai");

    for (const [name, href] of PRODUCT_ROWS) {
      await expect(
        block.getByRole("link", { name: new RegExp(`^${name}`) }),
        `row "${name}" must point at its product page`
      ).toHaveAttribute("href", href);
    }
  });

  test(`${language} project block sends nobody into a code repository`, async ({
    page,
  }) => {
    await page.goto(path);

    const block = page.getByRole("region", { name: regionLabel });

    // The absence check below is worthless on its own: if the block ever
    // disappears, "zero repository links" becomes trivially true and this
    // test goes green while the page loses its most prominent element.
    // So prove there is something to search FIRST. Caught by running this
    // test red-first, where it passed against a page that still carried the
    // GitHub link — the same empty-assertion shape logged for the OGC search
    // suite one day earlier.
    await expect(block).toBeVisible();
    expect(await block.getByRole("link").count()).toBeGreaterThan(1);

    await expect(
      block.locator('a[href*="github.com"]'),
      "a person page links to products, not to repositories"
    ).toHaveCount(0);
  });
}

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
