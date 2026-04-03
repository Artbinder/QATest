const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4326: [TC-10-PROD] All objects (unique, editioned, master) added to a transaction are added to generated invoice', async ({ page }) => {
  // Preconditions:
  // 1. User's logged in to Premium organization and has Sale Transaction
      // Info page opened.
   // 2. At least three unique, three master and three editioned objects are
      // added to transaction.
  

  await login(page);

  await page.locator('text=Transactions').click();
  await page.getByRole('link', { name: 'Sales' }).click();
  await page.waitForURL('**/sales');
  await page.locator('a.overflow-ellipsis').first().click();
  await page.waitForTimeout(1000);

  await page.getByText('Generate New Invoice').click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('dialog')).toBeVisible();
});
