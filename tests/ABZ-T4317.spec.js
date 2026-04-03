const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4317: [TC-05-PROD] Offer transaction removal', async ({ page }) => {
  // Preconditions:
  // 1. User's logged in as any Premium user who has their "Offers"
      // permission set to write.
   // 2. User's on already created Offer Transaction Info page.
   // 3. The offer contains at least one unique, one editioned, one master
      // objects.
  

  await login(page);

  // Expected Result: Transaction is removed.
// User is redirected to Offers Catalog page which doesn't longer display the
// removed transaction.
  // Step: Click "Delete" icon in the top of the page and confirm deletion

  await page.locator('text=Transactions').click();
  await page.getByRole('link', { name: 'Offers' }).click();
  await page.waitForURL('**/offers');
  await page.waitForTimeout(2000);
  await page.locator('.transaction-row-card .checkbox label').first().click();
  await page.waitForTimeout(500);

  await page.locator('.delete-transaction-link').click();
  await page.getByText('Yes', { exact: true }).click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/offers$/);
});
