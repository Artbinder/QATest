require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4343: [TC05-PROD] Set Info - Deleting', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic/Premium Account
   // 2. User has created set with several Editions
   // 3. User is on Set Info Page
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  // Expected Result: 1. Confirmation message appears
   // 2. Set deleted upon confirmation
  // Step: 1. Try to Delete a set Using Delete button

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Objects', exact: true }).first().click();
  await page.waitForURL('**/objects');
  await page.locator('.typeahead__container input').first().fill('Swinging Cardinal');
  await page.waitForTimeout(1500);
  await page.getByText('Swinging Cardinal').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Edition Sets' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.x-row-card__checkbox').first().click();
  await page.waitForTimeout(1000);

  await page.locator('.sidebar, .left-hand-menu, .x-left-menu').getByText('Delete').click();
  await page.locator('a:has-text("Yes"), button:has-text("Yes")').click();
  await page.waitForTimeout(1000);
});