require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4248: [TC-06-PROD] Contact Info - Notes', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. User is on Contact Info any contact -> Notes page
  

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

  await page.getByRole('link', { name: 'Notes' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.modal-opener-link').getByText('Create New Note').first().click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/contacts\/\d+\/notes/);
});
