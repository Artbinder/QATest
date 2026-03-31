require('dotenv').config();
const { test, expect } = require('@playwright/test');
const path = require('path');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4257: [TC-08-PROD] Show\'s Supporting Docs - New', async ({ page }) => {
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Shows', exact: true }).click();
  await page.waitForURL('**/shows');
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Supporting Docs' }).click();
  await page.waitForTimeout(1000);

  const filePath = path.join(__dirname, '../Files/bartleby.pdf');
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await page.waitForTimeout(2000);
});
