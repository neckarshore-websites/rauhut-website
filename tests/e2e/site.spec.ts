import { test, expect } from "@playwright/test";

test("German homepage renders the primary profile content", async ({ page }) => {
  await page.goto("/");

  // P1b/P5a-fix (2026-09-12): the visible H1 is the role ("Freelance
  // Technical Product Owner") — "German Rauhut" is the second line beneath
  // it, not a heading. P11 (2026-09-12): the H1 is white (text-text), not
  // teal — teal is text-links only now; no heading on the page carries it.
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1, "exactly one H1 on the page").toHaveCount(1);
  await expect(h1).toHaveText("Freelance Technical Product Owner");
  await expect(h1).toHaveClass(/text-text/);
  await expect(h1).not.toHaveClass(/text-brand-teal/);
  await expect(
    page.locator("main :is(h1, h2, h3)[class*='text-brand-teal']"),
    "P11: no heading carries brand-teal"
  ).toHaveCount(0);

  // Scoped to <header> — "German Rauhut" also appears in the (hidden at
  // this viewport) MobileNav bar and in the footer's copyright line;
  // .first() alone would resolve to whichever comes first in DOM order,
  // not necessarily the hero's own second line.
  const nameLine = page.locator("header").getByText("German Rauhut").first();
  await expect(nameLine).toBeVisible();
  await expect(
    nameLine,
    "the name, not a role, must not carry the role-title color"
  ).not.toHaveClass(/text-brand-teal/);

  await expect(page.locator("main")).not.toHaveAttribute("lang", "en");
  // P11: the amber section label is a <p>; the real h2 is the headline.
  await expect(
    page.getByRole("heading", { level: 2, name: "Konzern-Erfahrung, hands-on KI" })
  ).toBeVisible();
  await expect(page.locator("main p#zusammenfassung-label")).toHaveText("Zusammenfassung");
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
    page.getByRole("heading", { level: 2, name: "Enterprise experience, hands-on AI" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "What I bring" })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Imprint (German)" })
  ).toHaveAttribute("href", "/impressum");
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
 *
 * P5b (2026-09-12) removed a 4th entry point that used to live here: the
 * KI-Potenzialanalyse bridge SECTION's own weaker link
 * (`utm_source=rauhut-com-ki`) — that whole section was deleted (redundant
 * with the Angebote/Offers Card 3 of the same name, which is untouched and
 * still asserted below). If that UTM ever reappears in analytics, the
 * section it belonged to no longer exists on this page.
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

for (const [language, path, offersRegionName] of [
  ["German", "/", "Was Sie buchen können"],
  ["English", "/en", "What you can book"],
] as const) {
  test(`${language} homepage offers its Calendly calls as links, never an embed`, async ({
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

// P5b (2026-09-12, Founder brief) removed both the KI-Potenzialanalyse
// bridge section and the ProjectTiles ("Eigene Produkte"/"Own Products")
// block from the homepage — redundant with the Freelance-Kapitel's "Was
// ich baue" list and the KI-Potenzialanalyse OFFER CARD in Angebote (both
// untouched). This deleted, with them, several tests that had no section
// left to guard: the C4 availability-vocabulary guard scoped to the
// KI-Potenzialanalyse section, the EN "(German)" offer-page bridge test,
// and the whole Projektblock test group (product-row targets, the "iOS"
// casing guard, the no-repository-links guard). None of those guards are
// silently gone: PersonJsonLd/product info that mattered lives on in
// content the Freelance-Kapitel/Angebote tests already cover.

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
      { label: "Zusammenfassung", id: "zusammenfassung" },
      { label: "Angebote", id: "angebote" },
      { label: "Kernkompetenzen", id: "kernkompetenzen" },
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
      { label: "About", id: "about" },
      { label: "Offers", id: "offers" },
      { label: "Core Competencies", id: "competencies" },
      { label: "Projects", id: "projects" },
      { label: "Contact", id: "contact" },
    ],
  ],
] as const) {
  test(`${language} homepage desktop rail lists the same five jump targets plus the nav CTA`, async ({
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
      { label: "Zusammenfassung", id: "zusammenfassung" },
      { label: "Angebote", id: "angebote" },
      { label: "Kernkompetenzen", id: "kernkompetenzen" },
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
      { label: "About", id: "about" },
      { label: "Offers", id: "offers" },
      { label: "Core Competencies", id: "competencies" },
      { label: "Projects", id: "projects" },
      { label: "Contact", id: "contact" },
    ],
  ],
] as const) {
  test(`${language} homepage mobile sticky bar shows Name + CTA, burger reveals the same five jumps plus the language switch`, async ({
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

// P6-mail (2026-09-12): the public "Folie" mail is the mandat@ alias, not
// german@ — Hero-CTA, Kontakt-Zeile/ContactCards and mailto links all move.
// Impressum/Datenschutz keep german@ on purpose (legally mandated contact,
// same carve-out as the rest of that pass) — a separate test below asserts
// those are UNCHANGED, so a future edit can't quietly scrub the wrong side.
const MANDAT_MAILTO = {
  de: "mailto:mandat@rauhut.com?subject=Mandat-Anfrage%20über%20rauhut.com",
  en: "mailto:mandat@rauhut.com?subject=Mandate%20enquiry%20via%20rauhut.com",
} as const;

for (const [language, path, emailCtaLabel] of [
  ["German", "/", "E-Mail"],
  ["English", "/en", "Email"],
] as const) {
  test(`${language} homepage hero mails the mandat@ alias with the exact brief subject, not german@`, async ({
    page,
  }) => {
    await page.goto(path);

    // Scoped to the hero's own <header class="hero-glow"> — the page has
    // two further plain <header> elements (chapter intros further down),
    // and an unscoped "header" locator would match all three.
    const heroEmailCta = page
      .locator("header.hero-glow")
      .getByRole("link", { name: emailCtaLabel, exact: true });
    await expect(heroEmailCta).toHaveAttribute(
      "href",
      MANDAT_MAILTO[language === "German" ? "de" : "en"]
    );

    await expect(
      page.locator('a[href*="german@rauhut.com"]'),
      "the homepage must not link german@rauhut.com anywhere — that address is retired to Impressum/Datenschutz only"
    ).toHaveCount(0);
  });
}

test("German ContactCards shows the mandat@ alias, not german@, with the DE subject", async ({
  page,
}) => {
  await page.goto("/");
  const emailCard = page.getByRole("link", { name: /E-Mail/ }).filter({
    has: page.getByText("mandat@rauhut.com"),
  });
  await expect(emailCard).toBeVisible();
  await expect(emailCard).toHaveAttribute("href", MANDAT_MAILTO.de);
});

test("English ContactCards shows the mandat@ alias, not german@, with the EN subject", async ({
  page,
}) => {
  await page.goto("/en");
  const emailCard = page.getByRole("link", { name: /Email/ }).filter({
    has: page.getByText("mandat@rauhut.com"),
  });
  await expect(emailCard).toBeVisible();
  await expect(emailCard).toHaveAttribute("href", MANDAT_MAILTO.en);
});

test("Impressum and Datenschutz keep the statutory german@ address untouched by P6-mail", async ({
  page,
}) => {
  await page.goto("/impressum");
  await expect(
    page.locator('a[href="mailto:german@rauhut.com"]')
  ).toHaveCount(1);

  await page.goto("/datenschutz");
  await expect(
    page.locator('a[href="mailto:german@rauhut.com"]')
  ).toHaveCount(2);
});

// P6-lead (2026-09-12): a closing lead paragraph in Kontakt/Contact, before
// the channels — text only, no second "Mandat besprechen"/"Discuss a
// mandate" button (that CTA already lives in the hybrid nav, P8). The
// contact form itself now also renders on /en, which had none before.
for (const [
  language,
  path,
  sectionName,
  leadText,
  formIntro,
  ctaLabel,
] of [
  [
    "German",
    "/",
    "Kontakt",
    "Ab sofort buchbar — Mandate in Anforderung, Test und Release, remote DACH. 20 Minuten über „Mandat besprechen“, sonst kurz per Mail oder Formular.",
    "Ohne Kalender — schreiben Sie mir direkt:",
    "Mandat besprechen (20 Min)",
  ],
  [
    "English",
    "/en",
    "Contact",
    "Available immediately — mandates in requirements, test and release, remote DACH. Twenty minutes via “Discuss a mandate”, or a short note by email or the form.",
    "No calendar — write to me directly:",
    "Discuss a mandate (20 min)",
  ],
] as const) {
  test(`${language} Kontakt/Contact carries the P6-lead paragraph, form intro, and no second CTA button`, async ({
    page,
  }) => {
    await page.goto(path);

    const section = page.getByRole("region", { name: sectionName });
    await expect(section.getByText(leadText)).toBeVisible();
    await expect(section.getByText(formIntro)).toBeVisible();

    // The section may still legitimately contain the CTA *label* somewhere
    // if it were duplicated as a link, so assert on the actual control: no
    // <button> and no second <a> reading exactly ctaLabel inside Kontakt/
    // Contact — the only place that label may appear as an interactive
    // control is the nav rail/bar (P8), outside this section.
    await expect(
      section.getByRole("button", { name: ctaLabel, exact: true })
    ).toHaveCount(0);
    await expect(
      section.getByRole("link", { name: ctaLabel, exact: true })
    ).toHaveCount(0);
  });
}

test("English Contact now renders a working contact form, localized", async ({
  page,
}) => {
  await page.goto("/en");
  const section = page.getByRole("region", { name: "Contact" });

  await expect(section.getByLabel("Email", { exact: true })).toBeVisible();
  await expect(section.getByLabel("Message", { exact: true })).toBeVisible();
  await expect(
    section.getByRole("button", { name: "Send message" })
  ).toBeVisible();

  // Submitting empty must come back in English, not the German defaults —
  // proves the hidden `lang` field actually reaches the Server Action.
  await section.getByRole("button", { name: "Send message" }).click();
  await expect(section.getByText("Please enter your name.")).toBeVisible();
  await expect(
    section.getByText("Please enter your email address.")
  ).toBeVisible();
  await expect(section.getByText("Please enter a message.")).toBeVisible();
  await expect(section.getByText("Please check your entries.")).toBeVisible();
});

test("German contact form still answers in German after the P6-lead lang wiring", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Kontakt" });

  await section.getByRole("button", { name: "Nachricht senden" }).click();
  await expect(section.getByText("Bitte Namen angeben.")).toBeVisible();
  await expect(section.getByText("Bitte E-Mail angeben.")).toBeVisible();
  await expect(section.getByText("Bitte Nachricht angeben.")).toBeVisible();
  await expect(section.getByText("Bitte Eingaben prüfen.")).toBeVisible();
});

// P11 (2026-09-12): /stylesheet is the internal style reference — footer-
// linked with rel="nofollow", noindex via meta + X-Robots-Tag, not in the
// sitemap. Same shape as the /designs guard.
test("stylesheet page is reachable, footer-linked nofollow, and marked noindex", async ({
  page,
}) => {
  const response = await page.goto("/stylesheet");
  expect(response?.status()).toBe(200);
  expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  await expect(page.getByRole("heading", { level: 1, name: "Stylesheet" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await page.goto("/");
  await expect(page.locator('footer a[href="/stylesheet"]')).toHaveAttribute("rel", "nofollow");
  const sitemap = await page.goto("/sitemap.xml");
  expect(await sitemap?.text()).not.toContain("/stylesheet");
});
