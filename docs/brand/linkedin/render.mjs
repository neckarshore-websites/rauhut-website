// Renders the LinkedIn brand images from HTML at exact pixel sizes.
// Run from the repo root: node docs/brand/linkedin/render.mjs
// Output lands next to this file. Font and colors come from the site
// itself (src/fonts, src/app/globals.css dark tokens), so a token change
// there is one re-run away from updated images.
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const font = path.resolve(dir, "../../../src/fonts/Inter-Variable-subset.woff2");

// Dark tokens from globals.css (the banner uses them as they are).
const site = {
  bg: "#0A0A0A", text: "#F5F5F5", muted: "#A3A3A3", line: "#333333",
  node: "#404040", live: "#22D3EE", amber: "#F59E0B", glow: 0.14,
  grid: "rgba(255,255,255,0.035)",
};
// The Fokus card is shown heavily downscaled, so its grays are one step
// lighter than the site's — otherwise the second line and the path blur out.
const card = { ...site, muted: "#B5B5B5", line: "#3A3A3A", node: "#4A4A4A", glow: 0.16 };
let t = site;

// The motif: a release path of five stations. `lit` is the station that
// glows — the last one on the banner ("live"), the first one on the
// booking card ("this is where it starts").
function releasePath({ x0, x1, y, r, stroke, lit }) {
  const n = 5;
  const step = (x1 - x0) / (n - 1);
  const segFrom = lit === 0 ? x0 : x0 + step * (n - 2);
  const segTo = lit === 0 ? x0 + step : x1;
  let s = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${t.line}" stroke-width="${stroke}"/>`;
  s += `<line x1="${segFrom}" y1="${y}" x2="${segTo}" y2="${y}" stroke="${t.live}" stroke-width="${stroke}"/>`;
  for (let i = 0; i < n; i++) {
    const x = x0 + step * i;
    s += i === lit
      ? `<circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="${t.live}" opacity="${t.glow}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${t.live}"/>`
      : `<circle cx="${x}" cy="${y}" r="${r}" fill="${t.bg}" stroke="${t.node}" stroke-width="${stroke}"/>`;
  }
  return s;
}

const page = (w, h, css, svg, body) => `<html><head><style>
@font-face{font-family:I;src:url("file://${font}") format("woff2");font-weight:400 700}
*{margin:0;box-sizing:border-box}
body{background:${t.bg};font-family:I,sans-serif;color:${t.text};
background-image:radial-gradient(${t.grid} 1.5px,transparent 1.5px);background-size:24px 24px}
.w{position:relative;width:${w}px;height:${h}px;overflow:hidden}
svg{position:absolute;left:0;top:0}${css}</style></head><body><div class="w">
<svg width="${w}" height="${h}">${svg}</svg>${body}</div></body></html>`;

const images = [
  {
    // Profile banner. Text sits right but well inside the edge: the round
    // profile photo covers the lower left, and the mobile app crops both
    // sides (crop width unmeasured — check on a phone after changes).
    file: "linkedin-banner-dark.png", w: 1584, h: 396, scale: 1, palette: site,
    html: () => page(1584, 396,
      `.tx{position:absolute;right:264px;top:118px;text-align:right}
       .o{width:48px;height:3px;background:${t.amber};margin:0 0 22px auto}
       h1{font-size:46px;font-weight:700;letter-spacing:-0.02em;line-height:1.1}
       p{font-size:26px;color:${t.muted};margin-top:14px;letter-spacing:-0.005em}`,
      releasePath({ x0: 600, x1: 1320, y: 318, r: 7, stroke: 2, lit: 4 }),
      `<div class="tx"><div class="o"></div><h1>IT-Projekte stabil live bringen.</h1><p>Mit KI-Agenten im Betrieb.</p></div>`),
  },
  {
    // "Im Fokus" card for the intro call. LinkedIn shows this card at
    // roughly 1.91:1 (measured on the Founder's screenshot 2026-09-28),
    // NOT the square the guides describe — a square got centre-cropped.
    // Rendered at 2x so it stays sharp after LinkedIn scales it down.
    file: "linkedin-fokus-intro-call-dark.png", w: 1200, h: 627, scale: 2, palette: card,
    html: () => page(1200, 627,
      `.tx{position:absolute;left:110px;top:110px}
       .o{width:64px;height:5px;background:${t.amber};margin-bottom:30px}
       h1{font-size:112px;font-weight:700;letter-spacing:-0.025em;line-height:1.04}
       p{font-size:64px;color:${t.muted};margin-top:24px;font-weight:500}`,
      releasePath({ x0: 110, x1: 1090, y: 520, r: 11, stroke: 3, lit: 0 }),
      `<div class="tx"><div class="o"></div><h1>Erst zuhören.</h1><p>Dann entscheiden Sie.</p></div>`),
  },
];

const browser = await chromium.launch();
for (const img of images) {
  t = img.palette;
  const tmp = path.join(dir, `.${img.file}.html`);
  fs.writeFileSync(tmp, img.html());
  const p = await browser.newPage({ viewport: { width: img.w, height: img.h }, deviceScaleFactor: img.scale });
  await p.goto(`file://${tmp}`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(dir, img.file) });
  await p.close();
  fs.unlinkSync(tmp);
  console.log(`${img.file}  ${img.w * img.scale}x${img.h * img.scale}`);
}
await browser.close();
