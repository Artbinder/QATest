require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4253: [TC-06-PROD] LHM of Associated Objects in Premium account', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. User on List Info page
   // 3. Objects added to the List
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Lists' }).click();
  await page.waitForURL('**/lists');
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/lists\/\d+/);
});
