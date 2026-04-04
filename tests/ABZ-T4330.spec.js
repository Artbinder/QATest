const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4330: Transaction creation', async ({ page }) => {
  await login(page);
  await goToObjects(page);

  // Select objects using checkbox labels
  await page.locator('.x-grid-card label').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card label').first().click();
  await page.locator('.x-grid-card label').nth(1).click();
  await page.locator('.x-grid-card label').nth(2).click();
  await page.waitForTimeout(500);

  await page.locator('text=Create Transaction').first().click();
  await page.waitForTimeout(1000);

  // Set Transaction Type to 'Sale' and Status to 'Available'
  await page.locator('.modal select').first().selectOption('Sale');
  const statusSelect = page.locator('.modal select').nth(1);
  if (await statusSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
    await statusSelect.selectOption('Available');
  }
  await page.getByRole('link', { name: 'Create', exact: true }).click();
  await page.waitForLoadState('networkidle');
});
