import { test, expect } from "@playwright/test";

test("German homepage renders the primary profile content", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "German Rauhut" })
  ).toBeVisible();
  await expect(page.locator("main")).not.toHaveAttribute("lang", "en");
  await expect(
    page.getByText("Freelance Technical Product Owner").first()
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
 * Block 6 — the KI-Potenzialanalyse bridge (renamed + moved + shortened
 * 2026-09-11 b, P2/IA pass: it used to sit directly under the hero as
 * "KI-Beratung" and competed with "Mandat besprechen"; now it is a compact
 * block after Projekte/Eigene Produkte).
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

  const section = page.getByRole("region", { name: "KI-Potenzialanalyse" });
  await expect(section).toBeVisible();
  await expect(section).toContainText(
    "Ablauf, Umfang und Preise stehen auf der Angebotsseite bei Neckarshore AI"
  );
  await expect(
    section.getByRole("link", { name: "Zur KI-Potenzialanalyse" })
  ).toHaveAttribute("href", "https://neckarshore.ai/ki-beratung?ref=rauhut");
});

/**
 * Calendly CTAs — Founder instruction 2026-08-16, three entry points as of
 * 2026-09-11 d (P3 offers pass):
 *
 * 1. The hero's own CTA ("Mandat besprechen" / "Discuss a mandate"),
 *    `utm_source=rauhut-com`, scoped to the <header> — untouched by this
 *    pass on purpose (P1, UNANTASTBAR).
 * 2. The Angebote/Offers lead card's own CTA — the SAME href/UTM as the
 *    hero, deliberately (Founder brief, P3): a visitor who scrolled past
 *    the hero without booking gets the identical offer again, as the
 *    section's only filled-Primary button. This is why the total
 *    page-wide count for this href is 2 from this pass onward, not 1 —
 *    asserted per-region below rather than as one page-wide count so a
 *    failure names WHICH occurrence went missing.
 * 3. The Angebote/Offers second card's own CTA,
 *    `utm_source=rauhut-com-test` — a distinct UTM so Test/Release
 *    enquiries stay distinguishable from the general mandate CTA in
 *    Calendly's own reporting.
 * 4. The KI-Potenzialanalyse block's weaker link, `utm_source=rauhut-com-ki`
 *    (P2/IA pass, 2026-09-11 b) — unchanged by this pass.
 *
 * Two things are asserted, and the second is the one that matters most:
 *
 * 1. Every CTA exists and points at the verified address
 *    (`calendly.com/rauhut/20min` — found in neckarshore-website's source
 *    AND on the live offer page, not assumed).
 *
 * 2. IT IS A LINK, NOT AN EMBED. § 7 of the Datenschutzerklaerung states
 *    that no data reaches Calendly until the visitor clicks. That sentence
 *    is only true while this stays an outbound link. A script tag or iframe
 *    from calendly.com would make a published legal document false — which
 *    is a defect of a different order than a layout regression, and exactly
 *    the kind that ships unnoticed because nothing looks broken.
 */
const CALENDLY = "https://calendly.com/rauhut/20min?utm_source=rauhut-com";
const CALENDLY_TEST =
  "https://calendly.com/rauhut/20min?utm_source=rauhut-com-test";
const CALENDLY_KI =
  "https://calendly.com/rauhut/20min?utm_source=rauhut-com-ki";

for (const [language, path, offersRegionName, kiRegionName] of [
  ["German", "/", "Was Sie buchen können", "KI-Potenzialanalyse"],
  ["English", "/en", "What you can book", "AI potential analysis"],
] as const) {
  test(`${language} homepage offers all three Calendly calls as links, never an embed`, async ({
    page,
  }) => {
    await page.goto(path);

    await expect(
      page.locator("header").locator(`a[href="${CALENDLY}"]`),
      "the hero's Mandat CTA must survive a content pass"
    ).toHaveCount(1);

    const offers = page.getByRole("region", { name: offersRegionName });
    await expect(
      offers.locator(`a[href="${CALENDLY}"]`),
      "the Angebote/Offers lead card repeats the hero's exact CTA on purpose"
    ).toHaveCount(1);
    await expect(
      offers.locator(`a[href="${CALENDLY_TEST}"]`),
      "the Angebote/Offers Test-&-Release card's own CTA must survive a content pass"
    ).toHaveCount(1);

    const ki = page.getByRole("region", { name: kiRegionName });
    await expect(
      ki.locator(`a[href="${CALENDLY_KI}"]`),
      "the KI-Potenzialanalyse block's own, weaker CTA must survive a content pass"
    ).toHaveCount(1);

    // Positive assertions first (above), so the absence check below cannot
    // go vacuously green on a page where every CTA vanished entirely.
    await expect(
      page.locator('script[src*="calendly"], iframe[src*="calendly"]'),
      "an embed would make § 7 of the Datenschutzerklaerung false"
    ).toHaveCount(0);
  });
}

/**
 * Angebote/Offers section — P3 (2026-09-11 d): one lead offer carrying the
 * page's only other filled-Primary button, two visually weaker ones.
 * "Weaker" is a CSS-class claim with no other guard in this suite — a
 * refactor that made Card 2 or 3 filled, or dropped Card 1's fill, would
 * look fine everywhere else and still violate the brief's core rule
 * ("nur das Leitangebot hat den gefüllten Primary-Button").
 */
for (const [language, path, regionName, titles] of [
  [
    "German",
    "/",
    "Was Sie buchen können",
    [
      "Technical Product Ownership",
      "Test, Release, Abnahme",
      "KI-Potenzialanalyse",
    ],
  ],
  [
    "English",
    "/en",
    "What you can book",
    [
      "Technical Product Ownership",
      "Test, release, acceptance",
      "AI potential analysis",
    ],
  ],
] as const) {
  test(`${language} homepage lists three offers with exactly one filled-Primary CTA`, async ({
    page,
  }) => {
    await page.goto(path);

    const section = page.getByRole("region", { name: regionName });
    await expect(section).toBeVisible();

    for (const title of titles) {
      await expect(
        section.getByRole("heading", { level: 3, name: title })
      ).toBeVisible();
    }

    // Exactly one CTA in the section carries the filled-Primary class
    // (`bg-text`) — the same class the hero's own button uses.
    await expect(section.locator("a.bg-text")).toHaveCount(1);
  });
}

test("the privacy policy covers the Calendly link it is written for", async ({
  page,
}) => {
  await page.goto("/datenschutz");

  const policy = page.locator("main");
  await expect(policy).toContainText("Terminbuchung (Calendly)");
  await expect(
    policy,
    "the section's load-bearing claim is that nothing is embedded"
  ).toContainText("nicht in diese Website eingebunden");
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
 * NARROWED 2026-08-16 by Founder instruction, recorded here rather than
 * left to erode quietly: a CTA to NECKARSHORE AI's booking page is now
 * explicitly allowed. That is a company offer with a fixed format, not a
 * statement about this person's availability, and it is the same register
 * as the offer link beside it. What stays forbidden is unchanged — wording
 * that makes HIM the bookable resource ("freie Slots", "Kapazität",
 * "buchbar"). The guard below is untouched by this narrowing: the section's
 * links ("Zur KI-Potenzialanalyse", "20 Min klären, ob sich die Analyse
 * lohnt" as of 2026-09-11 b) don't use that vocabulary; if a future CTA is
 * ever reworded into it, the guard fires and that is correct behaviour, not
 * a false alarm.
 *
 * Scoped to the section on purpose — "Auftrag" and friends are legitimate
 * words elsewhere on a CV page.
 *
 * SUPERSEDED FOR THE HERO 2026-09-11 (M5, Founder brief, verbatim strings
 * "nicht verhandeln, nicht 'verbessern'"): the hero now states "ab sofort
 * buchbar" and a "Mandat besprechen (20 Min)" CTA outside this guard's
 * scope. That is exactly the vocabulary line 137-138 above calls out as
 * forbidden — the brief is a deliberate, explicit reversal of that stance
 * for the hero, not drift. It reads: "rauhut.com verkauft German Rauhut
 * als PERSON für ein Freelance-Mandat." The section this guard scopes to
 * was renamed "KI-Beratung" → "KI-Potenzialanalyse" and moved further down
 * the page 2026-09-11 b (P2/IA pass); the `getByRole` selector below tracks
 * that rename. The guard itself, and what it protects, are untouched — do
 * not widen the regex to cover the hero without a fresh Founder instruction
 * to do so.
 *
 * SAME EXCEPTION EXTENDS TO THE NEW ANGEBOTE/OFFERS SECTION 2026-09-11 d
 * (P3, Founder brief): its H2 ("Was Sie buchen können" / "What you can
 * book") and its lead card's CTA ("Mandat besprechen (20 Min)" — the same
 * label as the hero's own button, by design) both use vocabulary this
 * guard would flag. Not scoped by this guard for the identical reason the
 * hero isn't: it is the page's second filled-Primary CTA, not the
 * KI-Potenzialanalyse offer this guard protects.
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

test("the KI-Potenzialanalyse section stays offer language, not availability language", async ({
  page,
}) => {
  await page.goto("/");

  const copy = await page
    .getByRole("region", { name: "KI-Potenzialanalyse" })
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

  const section = page.getByRole("region", { name: "AI potential analysis" });
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

  /**
   * Proper nouns survive the stylesheet.
   *
   * "iOS" is Apple's own spelling (apple.com/os/ios). An earlier version of
   * this block ran the tags through `text-transform: uppercase` and shipped
   * "IOS" — a styling rule silently rewriting a product's name. The source
   * read "iOS" and looked correct; only the rendered page showed it.
   *
   * Asserted on `innerText`, which is what the BROWSER produces, not on the
   * source value — reading the source is exactly the check that missed it
   * the first time. Re-adding an uppercase class to these tags fails here.
   */
  test(`${language} project block spells iOS the way Apple does`, async ({
    page,
  }) => {
    await page.goto(path);

    const kaze = page
      .getByRole("region", { name: regionLabel })
      .getByRole("link", { name: /^Kaze/ });

    await expect(kaze).toContainText("iOS");
    expect(
      await kaze.innerText(),
      'the tag must render as "iOS", never "IOS" — check for a text-transform on the tag span'
    ).not.toMatch(/\bIOS\b/);
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

  // P8 (2026-09-12) put a second LangToggle in the desktop NavRail sticky
  // rail — the header's own copy hides at lg+ via CSS (`lg:hidden`), the
  // rail's hides below lg (`hidden lg:flex`), so both exist in the DOM but
  // exactly one is ever visible per viewport. This suite runs at Playwright's
  // default desktop viewport, where the rail's copy is the visible one —
  // `:visible` scopes to whichever is actually shown rather than assuming
  // which one that is, so the test keeps working if that viewport changes.
  const langNav = page.locator('nav[aria-label="Language"]:visible');
  await expect(langNav).toHaveCount(1);
  await expect(langNav.locator('span[aria-current="page"]')).toHaveText("DE");
  await langNav.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL("/en");
  // langNav is a live locator (re-evaluated against the current page on
  // each use), so it still resolves correctly on /en without redeclaring it.
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

/**
 * P8 (2026-09-12, Founder brief, artifact-approved before any code): hybrid
 * chrome. Desktop (lg+) gets a sticky rail beside the content column — no
 * sticky topbar. Mobile gets a sticky topbar (Name + CTA) with the same
 * three jumps behind a burger. Both surfaces share one source of truth
 * (src/lib/pageNav.ts) so they cannot drift from each other; NAV_CTA below
 * is that module's href, duplicated here as a literal on purpose — this
 * suite verifies the shipped markup, not the module that generated it.
 */
const NAV_CTA = "https://calendly.com/rauhut/20min?utm_source=rauhut-com-nav";

for (const [language, path, railName, tocName, items] of [
  [
    "German",
    "/",
    "Seitennavigation",
    "Sprungnavigation",
    [
      { label: "Angebote", id: "angebote" },
      { label: "Projekte", id: "projekte" },
      { label: "Kontakt", id: "kontakt" },
    ],
  ],
  [
    "English",
    "/en",
    "Page navigation",
    "Jump navigation",
    [
      { label: "Offers", id: "offers" },
      { label: "Projects", id: "projects" },
      { label: "Contact", id: "contact" },
    ],
  ],
] as const) {
  test(`${language} homepage desktop rail lists the same three jump targets plus the nav CTA`, async ({
    page,
  }) => {
    await page.goto(path);

    const rail = page.getByRole("complementary", { name: railName });
    await expect(rail).toBeVisible();

    const toc = rail.getByRole("navigation", { name: tocName });
    for (const item of items) {
      await expect(toc.getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        `#${item.id}`
      );
    }

    await expect(
      rail.locator(`a[href="${NAV_CTA}"]`),
      "the rail's CTA must carry its own nav UTM, distinct from the hero/Angebote/KI CTAs"
    ).toHaveCount(1);

    // MobileNav exists in the DOM at every viewport (CSS hides it, not a
    // conditional render) — it must not be the visible one here.
    await expect(
      page.getByRole("button", { name: language === "German" ? "Menü" : "Menu" })
    ).toBeHidden();
  });
}

for (const [language, path, homeLabel, railName, ctaLabel, items] of [
  [
    "German",
    "/",
    "Menü",
    "Seitennavigation",
    "Mandat besprechen (20 Min)",
    [
      { label: "Angebote", id: "angebote" },
      { label: "Projekte", id: "projekte" },
      { label: "Kontakt", id: "kontakt" },
    ],
  ],
  [
    "English",
    "/en",
    "Menu",
    "Page navigation",
    "Discuss a mandate (20 min)",
    [
      { label: "Offers", id: "offers" },
      { label: "Projects", id: "projects" },
      { label: "Contact", id: "contact" },
    ],
  ],
] as const) {
  test(`${language} homepage mobile sticky bar shows Name + CTA, burger reveals the same three jumps plus the language switch`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);

    // Desktop rail exists in the DOM at every viewport (CSS hides it) — it
    // must not be the visible one at phone width.
    await expect(
      page.getByRole("complementary", { name: railName })
    ).toBeHidden();

    await expect(page.getByText("German Rauhut").first()).toBeVisible();
    const mobileCta = page.locator(`a[href="${NAV_CTA}"]`).first();
    await expect(mobileCta).toBeVisible();
    await expect(
      mobileCta,
      "the mobile bar's CTA must carry the exact label dictated, not a shortened stand-in"
    ).toHaveText(ctaLabel);

    const burger = page.getByRole("button", { name: homeLabel });
    await expect(burger).toBeVisible();
    await burger.click();

    const drawer = page.locator("#mobile-nav-drawer");
    await expect(drawer).toBeVisible();
    await expect(
      drawer.locator('nav[aria-label="Language"]'),
      "DE/EN must be reachable inside the burger on mobile"
    ).toBeVisible();

    for (const item of items) {
      await expect(
        drawer.getByRole("link", { name: item.label })
      ).toHaveAttribute("href", `#${item.id}`);
    }

    // Tapping a jump target closes the drawer instead of leaving it open
    // behind the anchor scroll.
    await drawer.getByRole("link", { name: items[0].label }).click();
    await expect(drawer).toBeHidden();
  });
}
