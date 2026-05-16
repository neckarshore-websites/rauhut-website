# rauhut.com — Visual Polish Backlog

Visuelle Polish-Ideen fuer die naechste Session. Einzeln durchzugehen, **User entscheidet pro Item** ob ja / nein / spaeter. Keine davon ist ein Muss — der aktuelle Stand ist bereits mobile-first, responsive, Lighthouse 100 auf Desktop. Diese Items sind reine Qualitaets-Akzente im Minimal-Material-Stil.

---

## Status

| # | Item | Prio | Effort | Wer | Blocker? | Status | Impact |
|---|------|------|--------|-----|----------|--------|--------|
| 1 | ~~Dark-Hero-Glow (radial gradient hinter H1)~~ | P2 | XS | Linus | — | ✅ Done (2026-04-17, `b95e8e2`) | Header-Section bekommt Tiefe, kein Fremdkoerper-Chrome |
| 2 | ~~Scroll-Enter-Animation fuer Sections~~ | P2 | S | Linus | — | ✅ Done (2026-04-17, `b95e8e2`) | Moderner Produkt-Feel, premium ohne Jank |
| 3 | ~~Stat-Row unter About (3-4 grosse Zahlen)~~ | P2 | S | Linus | Content-Signoff (Zahlen) | ✅ Done (2026-04-17, `b95e8e2`) | Scroll-Preview wirkt substantiell |
| 4 | ~~Logos-Strip "Taetig bei / fuer"~~ | P3 | M | Linus | Legal-Check Markenrechte | ✅ Done (2026-04-17, `74dba6d`) — **Text-Fallback gewaehlt** | Credibility-Boost fuer Recruiter |
| 5 | ~~Mini-Timeline Mercedes-Benz-Aera~~ | P3 | M | Linus | — | ✅ Done (2026-04-17, `74dba6d`) | Karriere-Progression graphisch klarer als Bullet-List |
| 6 | ~~Kontakt als 3 gleiche Cards~~ | P3 | S | Linus | — | ✅ Done (2026-04-17, `c71298d`) | Mehr visuelles Gewicht fuer CTA-Section |
| 7 | ~~Impressum optisch differenzieren~~ | P3 | XS | Linus | — | ✅ Done (2026-04-17, `fd75ef5`) | "Legal-Mode"-Signalisierung, subtil |
| 8 | ~~Project-Tiles CTA-Label (top-right, always visible)~~ | P3 | S | Linus | — | ✅ Done (2026-04-17, `143c7b5` + `7e79643`) | Clickable-Feel staerker |
| 9 | GSC Domain-Property fuer `rauhut.com` | P3 | S | Linus | IONOS Domain-Connect blockiert manuelle TXT-Eingabe | 🔲 Geparkt | Deckt alle Subdomains + HTTP in einer Property ab; heute via URL-Prefix-Property geloest |
| 10 | ~~WordPress-Decommission IONOS (L4)~~ | — | — | — | superseded | ❌ Won't-Do (2026-05-13 b) | IONOS-Vertrag bleibt (Decision 3, CLAUDE.md). WordPress-Installation idle, kostet nichts extra, DNS zeigt auf Vercel. Nichts zu decommissionieren |

---

## 9. GSC Domain-Property (geparkt)

**Was:** In Google Search Console eine Domain-Property fuer `rauhut.com` anlegen — deckt automatisch alle Subdomains (www, en, etc.) + HTTP+HTTPS in einer Property ab. Einziger offizieller Weg: TXT-Record `google-site-verification=...` in der DNS-Zone.

**Warum geparkt (2026-04-17):**
- IONOS bietet bei DNS-Verifikation primaer Domain-Connect-Flow an
- Domain-Connect wuerde in einem Schritt den ganzen DNS-Satz ueberschreiben, inklusive **Deaktivierung der Mail-Records** — das ist die Katastrophe die wir beim initialen DNS-Cutover sauber vermieden haben
- GSC-UI versteckt die manuelle TXT-Eingabe hinter dem Domain-Connect-Button
- Heute ausreichend: existierende URL-Prefix-Property `https://rauhut.com/` + Sitemap eingereicht

**Moegliche Wege wenn wir es brauchen:**
1. **DevTools-Extraktion:** GSC-Setup-Seite, Inspect, suche nach `google-site-verification` im HTML, Wert rausziehen, dann manuell als TXT in IONOS anlegen.
2. **DNS-Provider wechseln:** Cloudflare oder Hostinger als DNS-Host setzen (Nameserver-Wechsel), dort saubere manuelle Zone-Verwaltung. Aber: ganzer Mail-Relay zu ueberpruefen.
3. **Warten:** IONOS ueberarbeitet die Domain-Connect-Integration (unbestimmt).

**Heutiger Ersatz reicht fuer Google Indexing:** `https://rauhut.com/` URL-Prefix-Property + Sitemap → Google crawlt und indexiert. Spalten-Einschraenkung: keine separate Metrik pro Subdomain-Satz, aber wir haben aktuell keine.

**Affected files:**
- Keine Code-Aenderungen. Rein DNS + GSC-Konfiguration.

**Prereq:** Entscheidung ob DevTools-Move oder DNS-Provider-Wechsel.

**Acceptance Criteria:**
- GSC zeigt Domain-Property `rauhut.com` als "Verified"
- Alle vier Sitemap-URLs werden unter Domain-Property erkannt
- Keine Mail-Regression (MX, SPF, DKIM, DMARC unveraendert)

---

## 1. Dark-Hero-Glow

**Was:** Zarter radialer Gradient hinter dem `<h1>` "German Rauhut" — nur im Dark Mode. Radius ca. 400px, `#22D3EE` bei 4-6% Opacity, zentriert hinter dem Namen. Light Mode bleibt flat (weisser Hintergrund ist bereits ruhig genug).

**Warum (Linus):** Aktuell sitzt der Name auf pechschwarzem Hintergrund — technisch sauber, aber atmosphaerisch leer. Ein subtiler Glow gibt der Header-Section Tiefe ohne Chrome hinzuzufuegen (keine Shadows, keine Glasmorphism, keine Gradients im Text selbst). Passt zum minimal-Material-Stil, weil es ein **Hintergrund-Effekt** ist, nicht ein Element-Effekt.

**Affected files:**
- `src/app/globals.css` — neue utility-Klasse `.hero-glow` mit `radial-gradient(...)` als pseudo-element oder `background-image`
- `src/app/page.tsx` — Klasse auf `<header>` oder `<div>`-Wrapper um H1
- `src/app/en/page.tsx` — idem

**Prereq:** keiner

**Acceptance Criteria:**
- Nur sichtbar in Dark Mode (Light Mode unveraendert)
- Keine Lighthouse-Regressions (Performance 100 bleibt)
- `prefers-reduced-motion` nicht tangiert (statischer Gradient, keine Animation)
- Visual-Abnahme durch User (Screenshot Dark vs. Light)

---

## 2. Scroll-Enter-Animation fuer Sections

**Was:** Jede `<section>` fadet beim Scrollen in den Viewport ein + translatet leicht nach oben (12px). 300ms ease-out. Via `IntersectionObserver` in einem kleinen `<Reveal>`-Wrapper-Component (Client Component). Respektiert `prefers-reduced-motion: reduce` → Animation disabled, Inhalt sofort sichtbar.

**Warum (Linus):** Macht die Seite lebendig, ohne Jank oder Distraction. Standard-Device in zeitgemaessen Personal-Sites (Vercel, Linear, Rauno). Richtig gemacht = unsichtbar, faellt erst auf wenn es fehlt. Falsch gemacht = billige Landing-Page-Schmiere — also Animation-Werte bewusst konservativ halten.

**Affected files:**
- `src/components/Reveal.tsx` (neu) — Client Component mit `IntersectionObserver`, `motion-safe` via Tailwind
- `src/app/page.tsx` — jede `<section>` in `<Reveal>` wrappen
- `src/app/en/page.tsx` — idem

**Prereq:** keiner

**Acceptance Criteria:**
- Smooth auf 60fps (keine Layout-Shifts)
- `prefers-reduced-motion: reduce` → Animation off, Content direkt sichtbar
- Server-Rendered Content ist immer im finalen State lesbar (Animation nur progressive Enhancement)
- Keine CLS-Regression (Lighthouse Cumulative Layout Shift bleibt < 0.1)
- Kein Flash-of-invisible-content bei langsamen Netzen

---

## 3. Stat-Row unter About

**Was:** Horizontale Reihe mit 3-4 grossen Zahlen + kleiner Label-Zeile, reine Typo (keine Icons, keine Boxes). Unter der About-Section, ueber dem `<hr>`. Beispiel-Draft:

```
10+              466               12+                95
Jahre Konzern    Tests shipped     AI-Agenten         API-Endpunkte
```

Grosse Zahl: `text-[2.4rem]` weight 600, darunter Label `text-xs uppercase tracking-widest text-text-subtle`.

**Warum (Linus):** Macht den Scroll-Preview substantieller. Aktuell dominiert der About-Absatz, und konkrete Zahlen ueberzeugen schneller als Prosa. Stil passt, weil es **nur Typo** ist — keine Karten, keine Icons, keine Boxes, die den Minimal-Stil brechen.

**Affected files:**
- `src/app/page.tsx` — Stat-Row-Komponente inline oder als neues `<StatsRow lang="de">`
- `src/app/en/page.tsx` — idem mit `lang="en"`
- ggf. `src/components/StatsRow.tsx` (neu)

**Prereq:** **Content-Signoff durch User** (welche Zahlen genau, bilingual Labels). Kandidaten (bestaetigen):
- "10+ Jahre Konzern" / "10+ years corporate" (Mercedes)
- "466 Tests shipped" / "466 tests shipped" (OMNIXIS)
- "12+ AI-Agenten" / "12+ AI agents" (Multi-Agent-Prozess)
- "95 API-Endpunkte" / "95 API endpoints" (OMNIXIS)
- Alternativ: "23 Jahre Laufbahn", "2 Kontinente" (fuer Thailand-Phase)

**Acceptance Criteria:**
- Mobile: Stacked oder 2x2 Grid (nicht 4-in-Reihe — zu schmal)
- Desktop: 4 in Reihe mit gleichmaessigen Abstaenden
- Kontrast + Lesbarkeit in Dark + Light
- Zahlen bei Light Mode nicht zu leicht (min. weight 500)

---

## 4. Logos-Strip "Taetig bei / fuer" — ✅ Done als Text-Fallback

**Entscheidung (2026-04-17):** Text-Fallback gewaehlt, Logo-Variante verworfen. Commit `74dba6d` — 11 Firmennamen in Typo-Zeile unter der Zusammenfassung. Gruende:
- Markenrechts-Risiko real (Mercedes-Benz-Rechtsabteilung aktiv), Upside mager fuer Einzelperson-Site
- User ist Freelancer, kein Consulting-Shop der mit Logos wirbt
- Text ist schon substanziell (11 Namen), scannt zwar langsamer als Logos, aber Recruiter die den Text ignorieren, ignorieren auch grayscale-Logos
- Konsistenz mit restlicher typographischer Minimal-Aesthetik

---

### Urspruengliche Spec (zur Historie)

**Was:** Horizontale Logo-Reihe unter About oder in Frueheren Stationen: Mercedes-Benz, Allianz, Deutsche Bank, Contargo, Rhenus, TestGilde. Standard-Device: alle Logos grayscale/desaturated by default, bei Hover Original-Farben oder leicht erhoelltes Opacity.

**Warum (Linus):** Credibility-Amplifier. Recruiter scannen Logos in Sekunden, Text braucht Minuten. Visual rhythm der Seite profitiert auch — bisher nur Typo, Logos wuerden einen visuellen "Anker" setzen ohne die Sektion zu dominieren (da grayscale).

**Affected files:**
- `public/logos/*.svg` (neu) — SVG-Logos, idealerweise monochrom aufbereitet
- `src/components/LogoStrip.tsx` (neu)
- `src/app/page.tsx` + `src/app/en/page.tsx` — Komponente einbinden

**Prereq:** **Legal-Check (Markenrecht)**. Mercedes-Benz ist heikel — Markennutzung auf einer Referenz-Seite ist in Deutschland toleriert wenn nicht werblich/irrefuehrend, aber nicht risikofrei. **Fallback-Option falls unsicher:** stattdessen **Textnennung** in derselben Strip-Form — kleine Typo-Zeile `Mercedes-Benz · Allianz · Deutsche Bank · Contargo · Rhenus · TestGilde`. Gibt 80% des Effekts ohne Logo-Rechte-Risiko.

**Acceptance Criteria (Logo-Variante):**
- SVGs self-hosted, kein externer CDN-Fetch
- Grayscale via CSS `filter: grayscale(1)`, Hover: `filter: none` oder leicht reduziert
- Alle Logos auf gleicher visueller Hoehe (height normalisiert, Width variiert)
- Responsive: mobile horizontal scroll oder 2-Reihen-Grid
- Keine Verzerrung durch zu grosse Logos

**Acceptance Criteria (Text-Fallback):**
- Eine Zeile, `text-sm text-text-subtle`, Trennzeichen `·`
- Mobile: umbricht normal, Ueberschrift "Taetig bei / fuer"
- Keine Urheberrechts-Referenzen, reine sachliche Erwaehnung

---

## 5. Mini-Timeline Mercedes-Benz-Aera

**Was:** Statt der aktuellen 3-Bullet-Liste (Tester → Senior Consultant → Technical Product Owner) eine **vertikale Timeline** mit 4 Meilensteinen: `2015 Tester → 2017 Senior IT Consultant → 2021 Technical PO → 2025 Exit`. Pure Typo + 1px hairline als Timeline-Line, kleine Kreise als Knotenpunkte (2px Border, transparent fill). Kein Chrome.

**Warum (Linus):** Karriere-Progression ist graphisch deutlich klarer als Text. 10 Jahre in 3 Phasen + Exit-Moment — das ist eine Story, die ein visuelles Medium verlangt. Timeline-Form hebt Bewegung/Progression hervor, was eine Bullet-List platt laesst. Minimal-Material-kompatibel, weil **nur Typo + Hairline**.

**Affected files:**
- `src/components/Timeline.tsx` (neu) — bilingual via `lang`-Prop wie bei `ProjectTiles`
- `src/app/page.tsx` — Mercedes-Benz Section, 3-Bullet-Liste → `<Timeline lang="de">`
- `src/app/en/page.tsx` — idem mit `lang="en"`
- Evtl. `src/app/globals.css` — Timeline-spezifische utility-Klassen falls nicht pure Tailwind

**Prereq:** keiner (Daten existieren bereits in beiden Seiten)

**Acceptance Criteria:**
- Vertikale Anordnung auf mobile, evtl. horizontal auf Desktop (Option offen — Linus schlaegt vor, User entscheidet)
- Scroll-Enter-Animation (#2) darauf appliziert falls #2 done
- Lesbar auch ohne CSS (reine OL/UL-Basis, CSS-Layer Timeline-Visual darueber)
- `aria-label` auf Timeline-Element
- Kontrast Line/Circle in Dark + Light

---

## 6. Kontakt als 3 gleiche Cards

**Was:** Statt der drei-Zeilen-Liste `E-Mail · LinkedIn · GitHub` drei gleichbreite Cards in einem 3-Spalten-Grid (mobile: gestackt). Jede Card: kleines Icon (inline SVG), Kanal-Label (`E-Mail`), Handle (`german@rauhut.com`), subtiler Hover-State mit Border-Tint.

**Warum (Linus):** Kontakt ist die **wichtigste Action-Section** der Seite — dort soll Conversion passieren (Recruiter klickt LinkedIn, User schickt Mail). Aktuelle Liste ist zu zurueckhaltend. Cards geben visuelles Gewicht, ohne pushy zu sein. Gleiche Breite = gleichberechtigt, keine Kanal-Hierarchie aufdraengen.

**Affected files:**
- `src/components/ContactCards.tsx` (neu)
- `src/app/page.tsx` — Kontakt-Section-Liste → `<ContactCards lang="de">`
- `src/app/en/page.tsx` — idem

**Prereq:** keiner

**Acceptance Criteria:**
- Desktop: 3 gleichbreite Cards in Grid
- Mobile: gestacked, volle Breite
- Icons klein (16-20px), nicht dominierend
- Hover-State: Border-Tint `brand-teal` oder `accent`, kein starker Shadow
- Focus-State deutlich sichtbar (Tab-Navigation)
- Links intakt (mailto:, LinkedIn, GitHub haben korrekte `rel`)

---

## 7. Impressum optisch differenzieren

**Was:** Impressum-Page bekommt eine subtile visuelle Abgrenzung zur Hauptseite: weniger Padding oben (`py-12` statt `py-24`), Eyebrow "Rechtliches" in `text-text-subtle` statt `text-brand-amber`, H2s in gedaempfterer Farbe. Soll unterschwellig signalisieren: "du bist in Legal-Mode, nicht in der Hauptseite".

**Warum (Linus):** Aktuell ist das Impressum optisch identisch zur Hauptseite — dieselbe Teal-H1, dieselben amber-Eyebrows. Funktional OK, aber ein Hauch Differenzierung hilft dem mentalen Modell des Nutzers ("Legal-Page, andere Informationsklasse"). Sehr zurueckhaltend umsetzen — keine grellen Color-Flips, nur Ton abnehmen.

**Affected files:**
- `src/app/impressum/page.tsx` — Padding-Reduktion, Eyebrow-Farbwechsel, H2-Farbwechsel

**Prereq:** keiner

**Acceptance Criteria:**
- Unterschied erkennbar aber nicht schreiend
- Impressum bleibt lesbar, Kontrast-AA erfuellt
- Keine Aenderung an Inhalten oder rechtlich relevanten Strukturen
- Back-Link funktioniert weiterhin

---

## 8. Project-Tiles Hover-Second-State

**Was:** Beim Hover ueber die Neckarshore- oder Obsidian-Tile zeigt sich ein subtiler Second-State: z.B. Pfeil nach rechts groesser + sichtbares CTA-Label "Open →" / "View on GitHub →" rechts oben. Oder ein zusaetzlicher Text-Fade-in mit einem Mini-Detail ("OMNIXIS Documenter v0.5 · 466 tests"). Dezent, kein Flash, kein aggressives Overlay.

**Warum (Linus):** Aktuelle Tiles sind statisch — das reduzierte Ring + Shadow ist ok, aber Tiles fuehlen sich nicht ganz **clickable** an. Ein leichter Content-Shift bei Hover verstaerkt das "hier gibt's was zu entdecken" ohne gaudy zu werden.

**Affected files:**
- `src/components/ProjectTiles.tsx` — group-hover utilities erweitern, evtl. ein zweites unsichtbares Element dazu

**Prereq:** keiner

**Acceptance Criteria:**
- Hover-State smooth (max 200ms transition)
- Touch-Devices: State nicht aktiv oder nur kurz (Taps != Hovers)
- `prefers-reduced-motion: reduce` respektiert
- Keine Layout-Shifts beim Hover (absolute Positionierung fuer Additional Content)

---

## Explizit skippen (kein Backlog)

Aus der Visual-Liste bewusst ausgeschlossen, damit keine Diskussion wieder aufgemacht wird:

- **Grosses "GR"-Watermark** im Header-Hintergrund (20rem, 3% opacity). Kollidiert mit dem zurueckhaltenden Ton, wirkt auf Personal-Sites schnell praetentioes.
- **Filmkorn/Grain-Overlay** am Portrait. Zu "design-forward" — drueckt eine Editorial-Aesthetik auf, die zur restlichen sachlichen Minimal-Haltung nicht passt.
- **GitHub-Activity-Widget** (Badges, Commit-Streaks). Layout-Shift durch API-Fetch, Jitter, und die Aussage "schaut meine Commits an" ist auf einer Personal-Branding-Seite eher Anti-Signal.
- **Animated Gradient** irgendwo. Gehoert zur Neckarshore-Brand (waermere, juicy Bordeaux-Palette), nicht zu rauhut.com (sachlich, Schwarz/Weiss + Pastell).

---

## Prozess fuer naechste Session

User geht die Items einzeln durch. Fuer jedes: ja / nein / spaeter. Bei "ja" setzt Linus es um, committet, pusht, deployed zu Vercel, zeigt URL. User macht visuelle Abnahme. Dann naechstes Item.

Kein Batch-Approach — jedes Item einzeln bewerten, sonst frisst die Diskussion die Zeit die wir eigentlich zum Bauen haben.
