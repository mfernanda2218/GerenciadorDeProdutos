import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000')
  
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/./)
})

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:3000')
  
  // Basic test - adjust according to your app
  await expect(page.locator('body')).toBeVisible()
})
