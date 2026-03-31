require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4222: [TC-08-PROD] Contacts Landing', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. User is on Contacts Landing page
   // 3. The page contains several Contacts and at least one Contact Group
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Contacts' }).click();
  await page.getByRole('link', { name: 'Contacts', exact: true }).click();
  await page.waitForURL('**/contacts');

  await expect(page.locator('.x-grid-card').first()).toBeVisible();
});
