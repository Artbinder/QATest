require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4294: [TC-02-PROD] Artist Creation', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).waitFor();

  // Navigate to Artists Landing page
  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.locator('.x-nav-more').getByRole('link', { name: 'Artists' }).click();
  await page.waitForURL('**/artists');

  // Click on "+Create New Artist" button on LHM
  await page.getByRole('link', { name: 'Create New Artist' }).click();
  await page.waitForURL('**/artists/new');
  
  // Fill Artist Info and Contact Details and Click "Save" button
  await page.locator('#first_name').fill('Test');
  await page.locator('#last_name').fill('Artist');
  
  // Add address
  await page.locator('a.add-fields').filter({ hasText: 'Add Address' }).click();
  await page.locator('input[placeholder="Address 1"]').fill('123 Fake Street');
  
  // Click Save button
  await page.locator('button.x-action_save').click();
  await page.waitForURL('**/artists/**/info');
});
