import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://rauhut.com";
  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
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
      lastModified: now,
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
      url: `${base}/impressum`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/datenschutz`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
