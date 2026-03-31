require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4321: [TC-02-PROD] User can add objects to transaction with "Add Objects" option', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();

  // Navigate to Transactions (Offers) page
  await page.locator('.x-nav-more').filter({ hasText: 'Transactions' }).waitFor();
  await page.locator('.x-nav-more').filter({ hasText: 'Transactions' }).click();
  await page.locator('.x-nav-more').getByRole('link', { name: 'Offers' }).click();
  await page.waitForURL('**/transactions/offers');
  await page.locator('.x-action.x-action_plus').click();
  await page.waitForTimeout(500);
  await page.locator('select#transaction-type-select-type').selectOption('Offer');
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: 'Create' }).click();
  await page.waitForTimeout(2000);
  
  // Now we should be on the offer transaction page with the object already added
  // Try to add more objects using "+Add Objects" button
  await page.locator('text=Add Objects').click();
  await page.waitForTimeout(1500);
  // Select objects by clicking the card (which triggers the checkbox)
  await page.locator('.x-grid-card').first().click();
  await page.waitForTimeout(500);
  // Click the Add button in the visible modal
  await page.locator('.modal.in .actions a').filter({ hasText: 'Add' }).click();
  await page.waitForTimeout(1000);
});
