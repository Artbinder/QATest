require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4340: [TC10-PROD] Edition Deleting', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic/Premium Account
   // 2. User is on Edition Info page
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Objects', exact: true }).click();
  await page.waitForURL('**/objects');
  await page.waitForTimeout(500);
  
  // Search for specific edition object
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Georgica Association Wainscott, December 2013');
  await page.waitForTimeout(1000);
  
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByText('Delete').click();
  await page.waitForTimeout(500);
  await expect(page.getByText('Yes', { exact: true })).toBeVisible();
});
