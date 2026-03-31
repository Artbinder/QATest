require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4245: [TC-09-PROD] Contact Groups Landing page', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. User is on Contact Groups Landing page
   // 3. Landing page contains several Groups
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Contacts' }).click();
  await page.getByRole('link', { name: 'Contact Groups' }).click();
  await page.waitForURL('**/contact_groups');

  await page.locator('.x-switch.x-switch_grid').click();
  await page.waitForTimeout(500);
  await page.locator('.x-switch.x-switch_list').click();
  await page.waitForTimeout(500);
});
