import { test, expect } from '@playwright/test';
import { clearAppState, loginAsRole } from '../support/auth';

test.describe('E2E Auth por roles', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppState(page);
  });

  test('login de admin redirige a /admin', async ({ page }) => {
    await loginAsRole(page, 'admin');
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
  });

  test('login de cliente redirige a /cliente', async ({ page }) => {
    await loginAsRole(page, 'cliente');
    await expect(page.getByText(/panel de cliente/i)).toBeVisible();
  });
});
