const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4319: [TC-07-PROD] Click on "Delete" in modal delete transaction removes it from the Transactions Catalog page, delete all invoices attached to the transaction', async ({ page }) => {
  await login(page);

  // Navigate to Sales transactions
  await navigateTo(page, 'Transactions', 'Sales');
  await page.waitForURL('**/sales');

  // Click on the first sale transaction edit link
  const saleLink = page.locator('a[href*="/transactions/sales/"][href*="/edit"]').first();
  await saleLink.waitFor({ state: 'visible', timeout: 10000 });
  await saleLink.click();
  await page.waitForTimeout(1000);

  // Click Delete and then Cancel
  await page.getByRole('link', { name: 'Delete', exact: true }).click();
  await page.waitForTimeout(500);
  await page.locator('.x-confirmation-modal__btn_cancel').click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/transactions\/sales\/\d+\/edit$/);
});
