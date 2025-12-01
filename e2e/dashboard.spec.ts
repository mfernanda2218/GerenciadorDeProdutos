// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test'

test('fluxo completo: login → cadastrar → deletar produto', async ({ page }) => {
  await page.goto('http://localhost:3000/login')
  // Simula login com Google (ou usa seu mock)
  // Se usar NextAuth com mock, pode pular direto:
  await page.goto('http://localhost:3000/dashboard/produtos')

  await page.click('text=Novo Produto')
  await page.fill('input[name="name"]', 'Camiseta Playwright')
  await page.fill('input[name="salePrice"]', '99.90')
  await page.fill('input[name="costPrice"]', '50')
  await page.fill('input[name="quantity"]', '50')
  await page.click('button:has-text("Cadastrar Produto")')

  await expect(page.locator('text=Camiseta Playwright')).toBeVisible()

  await page.click('button[aria-label="Excluir"]')
  await page.on('dialog', dialog => dialog.accept())
  await expect(page.locator('text=Camiseta Playwright')).toHaveCount(0)
})