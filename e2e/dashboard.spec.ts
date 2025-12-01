// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test'

test('fluxo completo: login → cadastrar → deletar produto', async ({ page }) => {
  // 1. Vai direto pro dashboard (pula login pra teste rápido)
  await page.goto('http://localhost:3000/dashboard/produtos')

  // 2. Espera o botão "Novo Produto" aparecer (com timeout maior e texto exato)
  await page.waitForSelector('text=Novo Produto', { state: 'visible', timeout: 10000 })
  await page.click('text=Novo Produto')

  // 3. Preenche o formulário
  await page.fill('input[name="name"]', 'Camiseta Playwright')
  await page.fill('input[name="salePrice"]', '99.90')
  await page.fill('input[name="costPrice"]', '50')
  await page.fill('input[name="quantity"]', '100')
  await page.fill('input[name="supplier"]', 'Fornecedor Teste')

  // 4. Clica em salvar
  await page.click('text=Salvar')

  // 5. Espera o produto aparecer na lista
  await expect(page.locator('text=Camiseta Playwright')).toBeVisible({ timeout: 10000 })

  // 6. Deleta o produto
  await page.click(`text=Camiseta Playwright >> .. >> button[aria-label="Excluir"]`)
  await page.click('text=Confirmar')

  // 7. Verifica que sumiu
  await expect(page.locator('text=Camiseta Playwright')).toHaveCount(0)
})