import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Open Graph image for social shares (LinkedIn, Slack, Discord, Facebook).
// Twitter/X uses the same via twitter-image.tsx (which re-exports this).
//
// Design: minimal, typographic, dark. Matches the site's dark default.
// Colors pulled from globals.css @theme tokens:
//   bg      #0A0A0A
//   text    #F5F5F5
//   muted   #A3A3A3
//   teal    #22D3EE

export const alt =
  "German Rauhut — Technical Product Owner & AI Product Builder";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  // Satori (behind ImageResponse) only accepts TTF/OTF — not WOFF/WOFF2 —
  // and chokes on certain variable TTFs. We therefore keep two static-weight
  // TTFs next to the site's WOFF2. Files come from Google Fonts' gstatic
  // CDN and are checked into src/fonts/ so the build is offline-reproducible.
  const [interRegular, interSemiBold] = await Promise.all([
    readFile(join(process.cwd(), "src/fonts/Inter-Regular.ttf")),
    readFile(join(process.cwd(), "src/fonts/Inter-SemiBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0A0A0A",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          fontFamily: "Inter",
          color: "#F5F5F5",
        }}
      >
        {/* Top: eyebrow (employer) + name + title */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "#22D3EE",
            }}
          >
            Neckarshore AI
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 112,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1,
              color: "#F5F5F5",
            }}
          >
            German Rauhut
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 42,
              fontWeight: 400,
              lineHeight: 1.2,
              color: "#A3A3A3",
              maxWidth: 1000,
            }}
          >
            Technical Product Owner &amp; AI Product Builder
          </div>
        </div>

        {/* Bottom: both domains + location, on same baseline.
            rauhut.com = personal brand, neckarshore.ai = company. */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          <div style={{ display: "flex", gap: 16, color: "#22D3EE" }}>
            <span>rauhut.com</span>
            <span style={{ color: "#525252" }}>·</span>
            <span>neckarshore.ai</span>
          </div>
          <span
            style={{
              color: "#9CA3AF",
              fontSize: 22,
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
            }}
          >
            Stuttgart · Germany
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: interSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
