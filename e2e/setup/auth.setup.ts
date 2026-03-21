import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Login logic here - adjust according to your app's authentication
    await page.goto('http://localhost:3000/login')
    
    // Example: Fill in login form
    // await page.fill('[data-testid=email]', 'test@example.com')
    // await page.fill('[data-testid=password]', 'password')
    // await page.click('[data-testid=login-button]')
    
    // Wait for successful login
    // await page.waitForURL('http://localhost:3000/dashboard')
    
    // Save storage state to be used in tests
    await context.storageState({ path: 'e2e/storageState.json' })
  } catch (error) {
    console.error('Setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

export default globalSetup
