// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'
import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10_000,
    ignoreHTTPSErrors: true,
    video: 'off',
    trace: 'on-first-retry',

    // ← AQUI A MÁGICA: todos os testes usam a sessão salva
    storageState: 'e2e/storageState.json',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /setup\/.*\.setup\.ts/,
      teardown: undefined,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'], // ← garante que roda o login antes
    },
  ],

  // Roda o setup antes de tudo
  globalSetup: require.resolve('./e2e/setup/auth.setup.ts'),
}

export default config