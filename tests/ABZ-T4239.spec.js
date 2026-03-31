require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4239: [TC03-PROD] Show Info - Forms creation', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. User is on Show Info page
   // 3. Show contains Object without price and Object with Price
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('load');

  // Expected Result: 1. There is an ability to create Loan
   // 2. Loan created without Object which doesn't have a Price
  // Step: 1. Select both Objects
   // 2. Click Create Form -> Loan
   // 3. Choose ignore Object without Price

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Shows', exact: true }).click();
  await page.waitForURL('**/shows');
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('The Works');
  await page.waitForTimeout(1000);
  await page.locator('.x-grid-card a[href*="/shows/"][href*="/info"]').first().click();
  await page.waitForLoadState('networkidle');

  await page.locator('.x-grid-card').first().click();
  await page.locator('.x-grid-card').nth(1).click();
  await page.waitForTimeout(500);

  await page.locator('text=Create Form').first().click();
  await page.getByRole('radio', { name: 'Loan' }).click();
  await page.locator('text=Next').click();
  await page.waitForTimeout(1000);
  await page.getByText('Create', { exact: true }).click();
  await page.waitForLoadState('networkidle');

});
