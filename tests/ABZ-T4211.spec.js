require('dotenv').config();
const { test, expect } = require('@playwright/test');
const path = require('path');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4285: Object creation from Artist -> Objects page', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(2000);
  await expect(page).not.toHaveURL(/sign_in/);

  // Navigate to Artists page
  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.locator('.x-nav-more').getByRole('link', { name: 'Artists' }).click();
  await page.waitForTimeout(1000);

  // Navigate to First Artist's page
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  // Click Objects link in LHM (sidebar)
  await page.locator('.sidebar a[href*="/objects"]').click();
  await page.waitForTimeout(1000);

  // Click Create New Object in LHM
  await page.locator('.sidebar').getByText('Create New Object').click();
  await page.waitForTimeout(1000);

  // Fill in "Work Title" field and click "Save" button
  await page.locator('#work_title').fill('Test Object Title');
  await page.locator('.x-action.x-action_save').click();
  await page.waitForTimeout(1000);

  // Upload image file
  const filePath = path.join(__dirname, '../Files/256x256bb.jpg');
  const fileInput = await page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(filePath);
  await page.waitForTimeout(2000);
});
