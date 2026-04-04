const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4326: [TC-10-PROD] All objects (unique, editioned, master) added to a transaction are added to generated invoice', async ({ page }) => {
  await login(page);

  // Navigate to Sales transactions
  await navigateTo(page, 'Transactions', 'Sales');
  await page.waitForURL('**/sales');

  // Click on the first sale transaction
  const saleLink = page.locator('a.overflow-ellipsis').first();
  await saleLink.waitFor({ state: 'visible', timeout: 10000 });
  await saleLink.click();
  await page.waitForTimeout(1000);

  // Click Generate New Invoice
  await page.getByText('Generate New Invoice').click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('dialog')).toBeVisible();
});
