import { test, expect } from '@playwright/test';
import { clearAppState, loginAsRole } from '../support/auth';

test.describe('E2E Inventario Admin - flujo crítico CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppState(page);
    await loginAsRole(page, 'admin');
    await page.goto('/admin/inventario');
    await expect(page.getByRole('heading', { name: 'Inventario', exact: true })).toBeVisible();
  });

  test('crear, editar y eliminar un producto de inventario', async ({ page }) => {
    const uniqueName = `E2E Producto ${Date.now()}`;

    // Crear
    await page.getByTestId('inventario-add-button').click();
    await page.fill('#add-nombre', uniqueName);
    await page.selectOption('#add-categoria', 'Textil');
    await page.fill('#add-stock', '50');
    await page.fill('#add-stock-minimo', '10');
    await page.fill('#add-precio', '12.5');
    await page.getByLabel('Serigrafía').check();
    await page.getByRole('button', { name: /anadir producto/i }).click();

    // Verificar creación
    await expect(page.getByText(uniqueName)).toBeVisible();

    // Editar stock
    const row = page.locator('tr', { hasText: uniqueName });
    await row.getByRole('button', { name: /editar/i }).click();
    await page.fill('#edit-stock', '99');
    await page.getByRole('button', { name: /guardar cambios/i }).click();

    // Verificar edición
    await expect(page.locator('tr', { hasText: uniqueName })).toContainText('99');

    // Eliminar
    await page.locator('tr', { hasText: uniqueName }).getByRole('button', { name: /eliminar/i }).click();

    // Verificar eliminación
    await expect(page.getByText(uniqueName)).toHaveCount(0);
  });
});
