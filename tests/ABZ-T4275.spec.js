require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4275: [TC-13-PROD] Associated Consignments/Loans', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User is on Object Info -> Associated Consignments page
   // 3. Object contains Associated Consignments
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Objects', exact: true }).click();
  await page.waitForURL('**/objects');
  await page.waitForTimeout(500);
  
  // Click on object title to go to object info page
  await page.locator('.x-grid-card .x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByText('Associated Forms').click();
  await page.getByRole('link', { name: /Consignments \(\d+\)/ }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-row-card__title').first().click();
  await page.waitForTimeout(500);
  await expect(page.getByRole('link', { name: /Delete/ }).last()).toBeVisible();
});
