require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4297: [TC-08-PROD] Exported Single PDF according to Template from List Info', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User has Permissions to Edit Report Templates
   // 3. User created Multi-Column, Single, Label
   // 4. Export Reports permissions is granted
   // 5. User is on List Info
  

  test.setTimeout(120000);
  
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Lists' }).click();
  await page.waitForURL('**/lists');
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByText('Select All', { exact: true }).click();
  await page.waitForTimeout(500);

  await page.locator('text=Create Report').first().click();
  await page.waitForTimeout(1000);
  await page.getByPlaceholder('Enter Report Title').fill('Test Report');
  await page.getByRole('dialog').locator('select').first().selectOption({ index: 1 });
  await page.getByRole('radio', { name: 'PDF' }).click();
  await page.getByRole('link', { name: 'Export' }).last().click();
  await page.waitForTimeout(5000);
  await page.locator('text=Close').click();
  await page.waitForTimeout(500);
});
