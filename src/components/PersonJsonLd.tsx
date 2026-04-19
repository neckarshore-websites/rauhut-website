// Server-rendered Schema.org Person JSON-LD.
//
// Rendering rule: raw <script> tag with text children.
// Do NOT use next/script — it escapes the JSON into a hydration string,
// which Google (and AI crawlers) cannot parse.
// This was the AD-19 lesson from the neckarshore.ai Session C incident.
//
// The `<` -> `\u003c` escape is defensive: it prevents any stray `</script>`
// substring inside the JSON payload from closing the tag prematurely.
// For our hardcoded, URL-safe content this is a theoretical concern,
// but standard practice for inline JSON-LD. See:
// https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
//
// Verification checklist after deploy:
//   curl -s https://rauhut.com/ | grep -c '"@type":"Person"'     # must be 1
//   curl -s https://rauhut.com/ | grep -c 'application/ld+json'  # must be >= 1
// Do NOT rely on Lighthouse or CI — the failure mode is a schema that
// lives in the hydration payload but not in the rendered HTML.

type Lang = "de" | "en";

const DESCRIPTIONS: Record<Lang, string> = {
  de: "Brückenbauer zwischen Business und Technologie. 10+ Jahre Mercedes-Benz, heute Freelance AI Product Builder bei Neckarshore AI. Eigene Produkte (Omnopsis Documentor, Obsidian Vault Autopilot) und Multi-Agent-Entwicklungsprozesse.",
  en: "Bridge-builder between business and technology. 10+ years at Mercedes-Benz, now freelance AI product builder at Neckarshore AI. Own products (Omnopsis Documentor, Obsidian Vault Autopilot) and multi-agent development processes.",
};

export default function PersonJsonLd({ lang = "de" }: { lang?: Lang }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "German Rauhut",
    url: "https://rauhut.com",
    image: "https://rauhut.com/opengraph-image",
    jobTitle: "Technical Product Owner & AI Product Builder",
    description: DESCRIPTIONS[lang],
    worksFor: {
      "@type": "Organization",
      name: "Neckarshore AI",
      url: "https://neckarshore.ai",
    },
    alumniOf: [
      {
        "@type": "Organization",
        name: "Mercedes-Benz AG",
        url: "https://www.mercedes-benz.com",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Duale Hochschule Baden-Württemberg Stuttgart",
        url: "https://www.dhbw-stuttgart.de",
      },
    ],
    sameAs: [
      "https://www.linkedin.com/in/german-rauhut/",
      "https://github.com/GmanFooFoo",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Stuttgart",
      addressCountry: "DE",
    },
    email: "german@rauhut.com",
    knowsAbout: [
      "AI Product Development",
      "Multi-Agent Systems",
      "Large Language Model Integration",
      "Technical Product Ownership",
      "Requirements Engineering",
      "Test Management",
      "Full-Stack Engineering",
      "Enterprise IT Consulting",
    ],
  };

  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script type="application/ld+json">
      {json}
    </script>
  );
}
