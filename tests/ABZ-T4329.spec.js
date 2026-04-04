const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4329: [TC-02-PROD] User can add objects to transaction with "Add Objects" option', async ({ page }) => {
  test.setTimeout(90000);
  await login(page);

  // Navigate to Sales transactions
  await navigateTo(page, 'Transactions', 'Sales');
  await page.waitForURL('**/transactions/sales');

  // Create a new sale transaction
  await page.locator('.x-action.x-action_plus').click();
  await page.waitForTimeout(500);
  await page.locator('select#transaction-type-select-type').selectOption('Sale');
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: 'Create' }).click();
  await page.waitForTimeout(2000);

  // Try to add objects using "+Add Objects" button
  await page.locator('text=Add Objects').click();
  await page.waitForTimeout(1500);

  // Select an object in the modal
  const modal = page.locator('.modal.in, .modal[style*="display: block"]').first();
  await modal.waitFor({ state: 'visible', timeout: 10000 });
  await modal.locator('.x-grid-card').first().waitFor({ state: 'visible', timeout: 10000 });
  await modal.locator('.x-grid-card').first().click();
  await page.waitForTimeout(500);

  // Click Add
  await modal.locator('a').filter({ hasText: 'Add' }).click();
  await page.waitForTimeout(1000);
});
