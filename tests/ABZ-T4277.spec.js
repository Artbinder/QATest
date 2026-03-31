require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4277: [TC-10-PROD] Associated Lists', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic or Premium Account
   // 2. User is on Object Info -> Associated Lists
   // 3. Object contains Associated Lists
  

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

  await page.getByText('Associated Lists').click();
  await page.waitForTimeout(1000);

  await page.locator('.x-add-entity-button').filter({ hasText: 'Add to List' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.modal .x-grid-card').first().click();
  await page.locator('.modal a').filter({ hasText: 'Add' }).click();
  await page.waitForTimeout(1000);
});
