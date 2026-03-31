require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4244: [TC-10-PROD] New Contact Group', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. User is on Contact Groups Landing page
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Contacts' }).click();
  await page.getByRole('link', { name: 'Contact Groups' }).click();
  await page.waitForURL('**/contact_groups');

  await page.locator('.modal-opener-link').filter({ hasText: 'Create Contact Group' }).click();
  await page.waitForTimeout(500);
  await expect(page.getByRole('dialog')).toBeVisible();
});
