import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3001";
const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: skipWebServer
    ? undefined
    : {
        // `next dev`, matching the family (goldoni/oakwood/neckarshore). The
        // "Next.js package not found" Turbopack panic that briefly pushed this
        // to a prod build was a corrupt local node_modules, not committed code —
        // a clean `npm ci` clears it (CI does a fresh install every run). Dev
        // mode kept @vercel/analytics out of the page; Umami replaced it on
        // 2026-11-18 (planning #4006 row 6). (Linus 2026-06-13.)
        command: "npm run dev",
        // A test Umami id makes the layout render the tracker in e2e; the
        // host is answered by the stub in tests/e2e/fixtures.ts.
        env: { NEXT_PUBLIC_UMAMI_WEBSITE_ID: "e2e00000-0000-4000-8000-000000000000" },
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
