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
const securityHeaders = [
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
};

export default nextConfig;
