const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4274: [TC-12-PROD] Associated Invoices', async ({ page }) => {
  await login(page);
  await goToObjects(page);

  // Search for the object that has associated invoices
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Orange');
  await page.waitForTimeout(1500);
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');

  // Navigate to Associated Forms -> Invoices
  await page.getByText('Associated Forms').click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: /Invoices/ }).click();
  await page.waitForTimeout(1000);

  // Click on the first invoice
  const invoiceRow = page.locator('.x-row-card__title').first();
  await invoiceRow.waitFor({ state: 'visible', timeout: 10000 });
  await invoiceRow.click();
  await page.waitForTimeout(500);
  await expect(page.getByText('Delete')).toBeVisible();
});
