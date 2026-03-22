import { test, expect } from '@playwright/test';
import { clearAppState, loginAsRole } from '../support/auth';

test.describe('E2E Rutas protegidas por rol', () => {
  test('usuario sin sesión es redirigido a /login al intentar entrar a /admin', async ({ page }) => {
    await clearAppState(page);
    await page.goto('/admin');

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('button', { name: /iniciar sesi[oó]n/i })).toBeVisible();
  });

  test('admin no puede entrar a /cliente y vuelve a /admin', async ({ page }) => {
    await clearAppState(page);
    await loginAsRole(page, 'admin');

    await page.goto('/cliente');

    await expect(page).toHaveURL(/\/admin/);
  });

  test('cliente no puede entrar a /admin y vuelve a /cliente', async ({ page }) => {
    await clearAppState(page);
    await loginAsRole(page, 'cliente');

    await page.goto('/admin');

    await expect(page).toHaveURL(/\/cliente/);
  });
});

