# LinkedIn brand images

The images on German Rauhut's personal LinkedIn profile, plus the source that renders them. **Reference for further images:** start from `render.mjs`, not from a PNG.

| # | File | Size | Where it is used | Text |
|---|------|------|------------------|------|
| 1 | `linkedin-banner-dark.png` | 1584 × 396 | Profile banner (live since 2026-09-28) | "IT-Projekte stabil live bringen." / "Mit KI-Agenten im Betrieb." |
| 2 | `linkedin-fokus-intro-call-dark.png` | 2400 × 1254 | "Im Fokus" card "Intro-Call buchen – 30 Min., kostenlos" (live since 2026-09-28) | "Erst zuhören." / "Dann entscheiden Sie." |

Both texts are Founder decisions. Change them only on his word.

## The design system in one paragraph

Dark background and Inter, both taken from rauhut.com (`src/app/globals.css`, `src/fonts`). A faint dot grid, a short amber rule above the headline, and one motif: a **release path** of five stations. The banner lights the **last** station ("live"), the booking card lights the **first** ("this is where it starts"). Together they tell one story instead of repeating each other, which is why the card carries its own text rather than the banner's.

## What we learned the hard way

- **The "Im Fokus" card is landscape, not square.** Guides online say 1:1; the card on the profile shows about 1.91:1 (measured on a screenshot, 2026-09-28). A square image got centre-cropped and blurred. Deliver 1.91:1, render at 2x, keep a margin all round.
- **The card is shown heavily downscaled.** It uses lighter grays than the site (`card` palette in `render.mjs`) and larger type, or the second line blurs out.
- **The banner is covered and cropped.** The round profile photo sits over the lower left; the mobile app crops both sides (how much is unmeasured). Text sits right, well inside the edge. Check a change on a phone.

## Re-render

```bash
node docs/brand/linkedin/render.mjs
```

Output is deterministic: an unchanged script reproduces both PNGs byte for byte (verified 2026-09-28 against the uploaded files). Uploading is done by hand in LinkedIn.
