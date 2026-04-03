const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4357: [TC10-PROD] Loans Landing page', async ({ page }) => {
  // Preconditions:
  // 1. User is logged in the Premium Account
   // 2. Loan without Object created
   // 3. User is on Loan Details
  

  await login(page);

  await page.locator('.x-nav-more').filter({ hasText: 'Transactions' }).click();
  await page.locator('label[for="forms-toggler"]').click({ force: true });
  await page.getByRole('link', { name: 'Loans' }).click();
  await page.waitForURL('**/loans');
  await page.locator('a.x-row-card__title.x-row-card__title_straight').first().click();
  await page.waitForTimeout(1000);

  await page.locator('.modal-dialog a:has-text("Cancel")').first().click();
  await page.waitForTimeout(1000);

  await page.locator('a.modal-opener-link:has-text("Add Objects")').click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('dialog')).toBeVisible();
});
