import { expect } from '@playwright/test';

export const CREDENTIALS = {
  admin: { username: 'admin', password: 'admin123', homePath: '/admin' },
  cliente: { username: 'cliente', password: 'cliente123', homePath: '/cliente' },
  operario: {
    username: 'operario_demo_serigrafia',
    password: 'operario123',
    homePath: '/operario',
  },
};

export async function clearAppState(page) {
  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

export async function loginAsRole(page, role) {
  const credentials = CREDENTIALS[role];
  if (!credentials) {
    throw new Error(`Rol no soportado en e2e: ${role}`);
  }

  await page.goto('/login');
  await page.fill('#username', credentials.username);
  await page.fill('#password', credentials.password);
  await page.getByRole('button', { name: /iniciar sesi[oó]n/i }).click();

  await expect(page).toHaveURL(new RegExp(`${credentials.homePath}`));
}

