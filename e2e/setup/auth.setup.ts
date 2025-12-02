// e2e/setup/auth.setup.ts
import { chromium, expect } from '@playwright/test';

const STORAGE_PATH = 'e2e/storageState.json';

async function globalSetup() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Iniciando login via GitHub OAuth com PAT...');

  await page.goto('http://localhost:3000');

  // Clica no botão de login com GitHub
  await page.getByRole('button', { name: /continuar com github/i }).click();

  // Agora estamos na página de login do GitHub
  await page.waitForURL('https://github.com/login**');

  // Preenche usuário
  await page.getByLabel('Username or email address').fill('mfernanda2218');

  // Preenche o PAT no campo de senha
  await page.getByLabel('Password').fill(process.env.GITHUB_PAT || 'MFdmt2207');

  // Clica em Sign in
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  // Lida com possível tela de verificação (2FA, suspicious login, etc)
  // Se aparecer "Verify your browser", clica em "Continue"
  const continueBtn = page.getByRole('button', { name: 'Continue' });
  if (await continueBtn.isVisible({ timeout: 8000 })) {
    await continueBtn.click();
  }

  // Autoriza o app (só aparece na primeira vez ou se revogou)
  const authorizeBtn = page.getByRole('button', { name: 'Authorize' });
  if (await authorizeBtn.isVisible({ timeout: 8000 })) {
    await authorizeBtn.click();
  }

  // Aguarda redirecionar de volta para sua aplicação
  await page.waitForURL('**http://localhost:3000/dashboard**', { timeout: 30000 });

  console.log('Login bem-sucedido! Salvando sessão...');
  await page.context().storageState({ path: STORAGE_PATH });
  console.log(`Sessão salva em ${STORAGE_PATH}`);

  await browser.close();
}

export default globalSetup;