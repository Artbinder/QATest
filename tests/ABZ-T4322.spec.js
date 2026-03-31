require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4322: Transaction creation', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('networkidle');

  // Navigate to Objects page
  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.locator('.x-nav-more').getByRole('link', { name: 'Objects' }).click();
  await page.waitForLoadState('networkidle');

  // Select a few objects, editions, and masters and click "Create Transaction" in LHM
  await page.locator('.x-grid-card').first().click();
  await page.locator('.x-grid-card').nth(1).click();
  await page.locator('.x-grid-card').nth(2).click();
  await page.locator('text=Create Transaction').first().click();
  
  // Set Transaction Type to 'Offer'
  await page.locator('.modal select').first().selectOption('Offer');
  await page.getByRole('link', { name: 'Create', exact: true }).click();
  await page.waitForLoadState('networkidle');
});
