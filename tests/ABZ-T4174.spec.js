require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4174: Label Template', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page).not.toHaveURL(/sign_in/);

  // Navigate to Report Templates
  await page.locator('.x-nav-more').filter({ hasText: 'Reports' }).click();
  await page.getByRole('link', { name: 'Report Templates' }).click();
  await page.waitForLoadState('networkidle');

  // Create new template
  await page.locator('.create-link a').click();
  await page.locator('.x-card-selectable').filter({ hasText: 'Label' }).first().click();
  await page.waitForLoadState('networkidle');

  // Fill template with test data
  await page.getByLabel('Name Your Report Template *').fill('Test Label Template');
  
  // TODO: Add fields - drag and drop not working reliably in automation

  // Save the template
  await page.locator('.x-action.x-action_save').scrollIntoViewIfNeeded();
  await page.locator('.x-action.x-action_save').click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toContainText('Successfully created');
});
