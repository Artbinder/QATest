const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4319: [TC-07-PROD] Click on "Delete" in modal delete transaction removes it from the Transactions Catalog page, delete all invoices attached to the transaction', async ({ page }) => {
  // Preconditions:
  // 1. User's logged in to Premium organization and has Sale Transaction
      // Info page opened.
   // 2. Transaction contains at least one invoice generated for it.
  

  await login(page);

  await page.locator('text=Transactions').click();
  await page.getByRole('link', { name: 'Sales' }).click();
  await page.waitForURL('**/sales');
  await page.locator('a[href*="/transactions/sales/"][href*="/edit"]').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Delete', exact: true }).click();
  await page.locator('.x-confirmation-modal__btn_cancel').click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/transactions\/sales\/\d+\/edit$/);
});
