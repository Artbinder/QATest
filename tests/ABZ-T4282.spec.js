require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4282: [TC-04-PROD] Object Status -> Availability Status', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User is on Object Info -> Object Status -> Availability Status tab
   // 3. There is at least one contact
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  // Expected Result: 1. The Object has the value ‘Not Specified’.
  // Step: Open a object with no information in the status lines

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Objects', exact: true }).click();
  await page.waitForURL('**/objects');
  await page.locator('.x-grid-card .x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Object Status' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: 'Availability Status' }).click();
  await page.waitForTimeout(2000);

  await page.locator('select').first().selectOption({ index: 1 });
  await page.waitForTimeout(500);
  await page.locator('input[type="checkbox"]').filter({ visible: true }).first().click();
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Info' }).click();
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Availability:')).toBeVisible();

  await page.locator('text=Availability:').click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Reset/Clear' }).click();
  await page.waitForTimeout(500);
  await page.getByText('Yes', { exact: true }).click();
  await page.waitForTimeout(1000);
});
