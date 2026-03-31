require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4186: [TC-09-PROD] Associated Shows', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic or Premium Account
   // 2. User is on Object Info -> Associated Shows
   // 3. Object contains Associated Shows
  

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

  await page.getByRole('link', { name: 'Associated Shows' }).click();
  await page.waitForTimeout(1000);

  await page.locator('text=Add To Show').first().click();
  await page.waitForTimeout(1000);
  await page.locator('.modal-dialog .x-grid-card').first().click();
  await page.waitForTimeout(500);
  await page.locator('.modal-dialog').getByRole('link', { name: 'Add', exact: true }).click();
  await page.waitForTimeout(1000);
  await expect(page.locator('.x-grid-card').first()).toBeVisible();
});
