// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test'

test('deve carregar a página de produtos e permitir limpeza do produto de teste', async ({ page }) => {
  const testProductName = 'Camiseta Playwright E2E'

  // 1. Acessa a página de produtos
  await page.goto('http://localhost:3000/dashboard/produtos')

  // 2. Verifica o título principal
  await expect(page.getByRole('heading', { name: 'Todos os Produtos' })).toBeVisible({ timeout: 15000 })

  // 3. Verifica o botão "Novo Produto"
  await expect(page.getByRole('link', { name: 'Novo Produto' })).toBeVisible()

  // 4. Limpa produto de teste antigo, se existir
  const productRow = page.getByRole('row').filter({ hasText: testProductName })

  // Enquanto existir pelo menos uma linha com o nome do produto de teste
  while (await productRow.count() > 0) {
    await productRow.first().getByRole('button', { name: /excluir/i }).click()
    await page.getByRole('button', { name: /confirmar/i }).click()
    // Espera a linha sumir (ou recarregar)
    await expect(productRow).toHaveCount(0, { timeout: 10000 })
  }

  // 5. Verifica o estado final da página (com ou sem produtos)

  // Caso 1: tem produtos → tabela aparece
  const table = page.getByRole('table')
  const hasTable = await table.isVisible({ timeout: 5000 }).catch(() => false)

  if (hasTable) {
    await expect(table).toBeVisible()
    console.log('Tabela de produtos visível (existem produtos cadastrados)')
  } 
  // Caso 2: não tem produtos → aparece a mensagem amigável
  else {
    await expect(page.getByText('Nenhum produto cadastrado')).toBeVisible({ timeout: 8000 })
    await expect(page.getByRole('link', { name: 'Cadastrar Primeiro Produto' })).toBeVisible()
    console.log('Estado vazio exibido corretamente')
  }

  console.log('Teste E2E passou com sucesso — página de produtos está funcionando perfeitamente!')
})