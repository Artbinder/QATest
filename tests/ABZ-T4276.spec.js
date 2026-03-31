require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4276: [TC-11-PROD] Associated Reports', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User is on Object Info -> Associated Reports
   // 3. Object contains Associated Reports
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Objects', exact: true }).click();
  await page.waitForURL('**/objects');
  await page.waitForTimeout(500);
  
  // Search for specific object with associated reports
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Art Before Philosophy After Art');
  await page.waitForTimeout(1000);
  
  // Click on object title to go to object info page
  await page.locator('.x-grid-card .x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByText('Associated Reports').click();
  await page.waitForTimeout(1000);

  // Verify Associated Reports tab is visible
  await expect(page.getByText('Associated Reports')).toBeVisible();
});
