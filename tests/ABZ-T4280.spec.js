require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4280: [TC-06-PROD] Object Status -> Condition Status', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User is on Object Info -> Object Status -> Condition Status tab
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Objects', exact: true }).click();
  await page.waitForURL('**/objects');
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Object Status' }).click();
  await page.getByRole('link', { name: 'Condition Status' }).click();
  await page.waitForTimeout(1000);

  await expect(page).toHaveURL(/#condition/);
});
