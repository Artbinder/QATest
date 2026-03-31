require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4238: [TC05-PROD] Edition Sets page - Forms creation', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. User is on Master -> Edition Sets page
   // 3. Page contains two Sets and each set contains two Editions
   // 4. Editions in Sets don't have Prices
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('networkidle');

  // Expected Result: 1. There is an ability to create Invoice
   // 2. Invoice created with 4 Editions
   // 3. $0.00 is set as Object Price
  // Step: 1. Select two sets from Preconditions
   // 2. Click Create Form -> Invoice -> The "Display Master" flag is
      // unchecked
   // 3. Choose Use $0.00

  await page.goto('/objects', { waitUntil: 'networkidle' });
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Swinging Cardinal');
  await page.waitForTimeout(1000);

  // Click on the Swinging Cardinal object to enter its details
  await page.locator('.x-grid-card a[href*="/objects/"][href*="/info"]').first().click({ timeout: 10000 });
  await page.waitForTimeout(2000);

  // Navigate to Edition Sets tab
  await page.getByRole('link', { name: 'Edition Sets' }).click();
  await page.waitForLoadState('networkidle');

  // Select all edition sets
  await page.getByText('Select All', { exact: true }).click();
  await page.waitForTimeout(500);

  // Click Create Form in the left-hand menu
  await page.locator('text=Create Form').click();
  await page.getByRole('radio', { name: 'Invoice' }).click();
  await page.locator('text=Next').click();
  await page.waitForTimeout(1000);
  await page.getByText('Create', { exact: true }).click();
  await page.waitForLoadState('networkidle');
});
