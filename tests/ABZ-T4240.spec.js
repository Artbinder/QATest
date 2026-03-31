require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4240: [TC02-PROD] Objects Landing - Forms creation', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('networkidle');

  // Navigate to Objects Landing page
  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.locator('.x-nav-more').getByRole('link', { name: 'Objects' }).click();
  await page.waitForURL('**/objects');
  await page.waitForTimeout(2000);

  // Select both Objects
  await page.locator('.x-grid-card').first().click();
  await page.locator('.x-grid-card').nth(1).click();
  await page.waitForTimeout(500);
  
  // Click Create Form -> Consignment
  await page.locator('text=Create Form').first().click();
  await page.getByRole('radio', { name: 'Consignment' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.modal').locator('text=Create').first().click();
  await page.waitForLoadState('networkidle');
});
