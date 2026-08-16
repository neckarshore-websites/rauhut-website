import type { MetadataRoute } from "next";

// Only indexable pages belong here: /impressum and /datenschutz are
// robots:{index:false} and would trigger "submitted URL marked noindex"
// warnings in Search Console if listed. No lastModified — the previous
// build-time `new Date()` stamped every deploy as a content change, which
// makes the signal meaningless; better to omit it than to lie about it.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://rauhut.com";

  return [
    {
      url: `${base}/`,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: {
        languages: {
          de: `${base}/`,
          en: `${base}/en`,
        },
      },
    },
    {
      url: `${base}/en`,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          de: `${base}/`,
          en: `${base}/en`,
        },
      },
    },
    // /designs is DELIBERATELY ABSENT (2026-08-16). The gallery now ships
    // `X-Robots-Tag: noindex` (see next.config.ts for the full reasoning).
    // Listing a noindex URL in the sitemap sends search engines two opposite
    // instructions in the same breath — "please index this" and "do not index
    // this" — and the sitemap entry is the half that has to go, because the
    // noindex is the decision.
  ];
}
