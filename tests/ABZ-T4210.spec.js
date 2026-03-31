require('dotenv').config();
const { test, expect } = require('@playwright/test');
const path = require('path');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4284: [TC-02-PROD] Object creation from Objects Landing page', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).waitFor();

  // Navigate to Objects Landing Page
  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.locator('.x-nav-more').getByRole('link', { name: 'Objects' }).click();
  await page.waitForURL('**/objects');

  // Click on "Create New Object" button in LHM
  await page.getByRole('link', { name: 'Create New Object' }).click();
  await page.waitForURL('**/objects/new');
  
  // Fill in all necessary fields and click "Save" button
  await page.getByLabel('Artist Name').fill('First Artist');
  await page.locator('.typeahead-result-item').first().click();
  await page.waitForTimeout(2000);
  await page.getByLabel('Work Title').fill('Test Object');
  await page.getByRole('button', { name: 'Save' }).click();

   // Upload image file
  const filePath = path.join(__dirname, '../Files/256x256bb.jpg');
  const fileInput = await page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(filePath);
  await page.waitForTimeout(2000);
});
