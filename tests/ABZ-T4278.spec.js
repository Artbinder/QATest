require('dotenv').config();
const { test, expect } = require('@playwright/test');
const path = require('path');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4278: [TC-08-PROD] Supporting Docs and Notes', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic or Premium Account
   // 2. User is on Object Info -> Supporting Docs
   // 3. After Docs user is on Object Info -> Notes
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Objects', exact: true }).click();
  await page.waitForURL('**/objects');
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Supporting Docs' }).click();
  await page.waitForTimeout(1000);

  const filePath = path.join(__dirname, '../Files/bartleby.pdf');
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await page.waitForTimeout(2000);

  await page.getByRole('link', { name: 'Notes' }).click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/notes/);
});
