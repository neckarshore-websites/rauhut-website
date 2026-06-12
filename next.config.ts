import type { NextConfig } from "next";

// OWASP-baseline security headers — parity with oakwoodgolfclub-website
// and neckarshore-website (PR #16, 2026-05-25). Applied globally via
// async headers(). Per Linus Bundle-A Plan-Doc 2026-05-21 § Work-Item 2.
//
// HSTS is intentionally omitted here: Vercel auto-emits
// `strict-transport-security: max-age=63072000` for verified custom
// domains (R2-verified 2026-05-25). Adding it twice would double-set
// the header.
//
// X-Frame-Options=SAMEORIGIN (not DENY as oakwood ships): personal-site
// posture per Plan-Doc rationale — allows same-domain embedding while
// still blocking cross-origin clickjacking.
//
// Content-Security-Policy strategy (Linus 2026-06-07, L-RH-CSP-PER-SITE):
// Pragmatic policy for a static personal site with no auth and no
// user-generated content — residual XSS surface from `'unsafe-inline'` is
// minimal. Identical to the neckarshore-website policy; every external host
// the open_item predicted for rauhut turned out wrong when verified against
// the live site:
//   - The MAIN site's fonts are self-hosted via next/font/local — no CDN.
//     BUT the /designs gallery embeds 28 standalone HTML mockups
//     (public/designs/rauhut-*.html, each a self-contained art piece) that
//     DO pull Google Fonts: stylesheet from fonts.googleapis.com (style-src)
//     + font files from fonts.gstatic.com (font-src). These load as
//     same-origin iframe documents, so each inherits this CSP — without the
//     two font hosts the gallery's typefaces are blocked (caught in the
//     browser console-walk, 28 violations). The github/linkedin URLs in the
//     mockups are <a href> links (navigation), so CSP does not govern them.
//   - @vercel/analytics IS used (<Analytics/> in layout), but Vercel v2
//     edge-proxies it SAME-ORIGIN: the script loads from
//     /_vercel/insights/script.js (verified HTTP 200 on rauhut.com) and the
//     beacon posts to /_vercel/insights/* — both same-origin. So
//     script-src 'self' + connect-src 'self' cover analytics with NO
//     external va.vercel-scripts.com / vitals.vercel-insights.com host.
//   - script-src 'unsafe-inline' is REQUIRED: Next.js injects inline
//     hydration/RSC scripts + theme-init bootstrap + inline JSON-LD. A
//     nonce-based strict CSP would need middleware and force every route OUT
//     of static generation — sacrificing the Lighthouse-first static posture.
//     Deliberate trade: keep static + Lighthouse, land ~B+ (not A+) on
//     Mozilla Observatory.
//   - 'unsafe-eval' is DEV-ONLY (React dev + HMR use eval); production omits
//     it and stays strict.
//   - frame-ancestors 'self' mirrors X-Frame-Options=SAMEORIGIN above.
// Cloudflare Turnstile (Spam-Schutz des Kontaktformulars, dormant bis zur
// Aktivierung): das Widget-Script + der Challenge-iframe + die siteverify-
// Fetches laufen gegen https://challenges.cloudflare.com → freigegeben in
// script-src + frame-src + connect-src.
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com"
  : "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // Canonical host enforcement: www → apex (308 permanent).
  // Mirrors neckarshore-website pattern. Apex is the declared canonical
  // (src/app/layout.tsx metadataBase + alternates.canonical).
  //
  // History: until 2026-05-26 the Vercel project was inverted — apex 307→www
  // (platform-level config), conflicting with the HTML canonical. Flipped
  // via Vercel API the same day (apex now primary 200, www 308→apex).
  //
  // This code-level redirect is belt-and-suspenders: version-controlled,
  // visible at review time, and safe even if a future Vercel-dashboard
  // change accidentally re-enables www. Runs at the framework layer; for
  // requests routed through the platform redirect it is a harmless no-op.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.rauhut.com" }],
        destination: "https://rauhut.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
