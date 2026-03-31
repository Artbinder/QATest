require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4338: [TC13-PROD] Publishing', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the system
   // 2. User published Master and it Editions
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Objects', exact: true }).click();
  await page.waitForURL('**/objects');
  await page.waitForTimeout(500);
  
  // Search for specific master with editions
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Swinging Cardinal');
  await page.waitForTimeout(1000);
  
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.locator('.x-toggle-link__text').filter({ hasText: 'Published' }).click();
  await page.waitForTimeout(1000);
});
