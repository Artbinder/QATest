require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4356: [TC11-PROD] Invoice Details page', async ({ page }) => {
  // Preconditions:
  // 1. User is logged in the Premium Account
   // 2. Invoice without Object created
   // 3. User is on Invoice Details
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Transactions' }).click();
  await page.locator('label[for="forms-toggler"]').click({ force: true });
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.waitForURL('**/invoices');
  await page.locator('a.x-row-card__title.x-row-card__title_straight').first().click();
  await page.waitForTimeout(1000);

  await page.locator('.modal-dialog a:has-text("Cancel")').first().click();
  await page.waitForTimeout(1000);

  await page.locator('a.modal-opener-link:has-text("Add Objects")').click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('dialog')).toBeVisible();
});
