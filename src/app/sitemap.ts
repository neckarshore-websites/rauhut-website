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
    {
      url: `${base}/designs`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
