require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4172: [TC-03-PROD] Single Template', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User has Permissions to Edit Report Templates
   // 3. User is on More -> Reports -> Templates Page
   // 4. User clicks + Add New Report Template button
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(2000);

  // Step: 1. Try to create Single Report Template
  // Expected Result: 1. Single Report Template is created

  await page.locator('.x-nav-more').filter({ hasText: 'Reports' }).click();
  await page.locator('.x-nav-more').getByRole('link', { name: 'Report Templates' }).click();
  await page.waitForTimeout(3000);

  // Click create new template button
  await page.locator('.x-plus-icon-link').click();
  await page.waitForTimeout(3000);
  
  // Select Single template
  await page.locator('.x-card-selectable').filter({ hasText: /Single/i }).first().click();
  await page.waitForTimeout(2000);

  await page.getByPlaceholder('Enter Template Title').fill('Test Single Template ' + Date.now());
  await page.waitForTimeout(500);
  await page.locator('.x-action_save').click();
  await page.waitForTimeout(2000);

  await expect(page.getByText(/Successfully created/)).toBeVisible();
});
