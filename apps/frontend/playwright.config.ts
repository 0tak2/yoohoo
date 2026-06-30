import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/e2e",
  fullyParallel: false,
  use: {
    baseURL: "http://127.0.0.1:3001",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: [
    {
      command:
        "FRONTEND_ORIGIN=http://127.0.0.1:3001 pnpm --filter @yoohoo/backend start:e2e",
      url: "http://127.0.0.1:3000/health",
      reuseExistingServer: true,
      timeout: 30_000
    },
    {
      command: "NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3000 pnpm --filter @yoohoo/frontend dev",
      url: "http://127.0.0.1:3001",
      reuseExistingServer: true,
      timeout: 30_000
    }
  ]
});
