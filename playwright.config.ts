import { defineConfig } from 'playwright/test'

const e2eBaseURL = 'http://127.0.0.1:4174'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: e2eBaseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4174 --strictPort',
    url: e2eBaseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
