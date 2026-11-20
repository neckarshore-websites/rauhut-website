// Umami visitor counting (planning #4006 row 6, AD-65 layer 4).
//
// The host is the estate's own Umami instance on the Hostinger box, behind
// Traefik (Founder 2026-11-18: subdomain stats.neckarshore.ai). It is the one
// place to change if the box ever moves.
export const UMAMI_HOST = "https://stats.neckarshore.ai";

// Umami's website id for rauhut.com. It is public by design (it ships in every
// page's HTML). Read on the box by Bob, 2026-11-18 ~17:35Z (read-only psql,
// "Rauhut.com Website"). If this is ever emptied, the tracker is not rendered
// at all. NEXT_PUBLIC_UMAMI_WEBSITE_ID overrides it for the e2e run.
const UMAMI_WEBSITE_ID_RAUHUT = "07c51819-e442-42cd-9c1a-f95e51e63821";

// The real id is used on Vercel production builds ONLY (carried over from
// neckarshore-website #389, 2026-11-20). A local `next build`, a CI run and every
// Vercel preview get an empty id, so the tracker is not rendered there and none of
// those visits reach the box. NEXT_PUBLIC_UMAMI_WEBSITE_ID overrides both, for e2e.
export function resolveUmamiWebsiteId(env: {
  NEXT_PUBLIC_UMAMI_WEBSITE_ID?: string;
  VERCEL_ENV?: string;
}): string {
  if (env.NEXT_PUBLIC_UMAMI_WEBSITE_ID !== undefined) {
    return env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  }
  return env.VERCEL_ENV === "production" ? UMAMI_WEBSITE_ID_RAUHUT : "";
}

export const UMAMI_WEBSITE_ID = resolveUmamiWebsiteId({
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  VERCEL_ENV: process.env.VERCEL_ENV,
});
