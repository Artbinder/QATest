require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4271: [TC-16-PROD] Object Selection Premium', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. User on Objects Landing page
   // 3. At least one Object has Editions
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Objects', exact: true }).click();
  await page.waitForURL('**/objects');

  await page.locator('.x-grid-card').first().click();
  await page.waitForTimeout(500);

  await expect(page.getByText('Add To Show').first()).toBeVisible();
  await expect(page.getByText('Create Form').first()).toBeVisible();
  await expect(page.getByText('Create Transaction').first()).toBeVisible();
  await expect(page.getByText('Create Report').first()).toBeVisible();
  await expect(page.getByText('Export', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Delete').first()).toBeVisible();
});
