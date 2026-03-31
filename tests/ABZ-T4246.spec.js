require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4246: [TC-07-PROD] Contact Info - Delete', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. User on the contacts landing page
   // 3. There are at least one contacts
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Contacts' }).click();
  await page.getByRole('link', { name: 'Contacts', exact: true }).click();
  await page.waitForURL('**/contacts');
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.locator('text=Delete').first().click();
  await page.locator('text=Yes').first().click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/contacts$/);
});
