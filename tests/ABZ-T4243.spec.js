require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4250: New Contact', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(2000);

  // Navigate to Contacts page
  await page.locator('.x-nav-more').filter({ hasText: 'Contacts' }).click();
  await page.locator('.x-nav-more').getByRole('link', { name: 'Contacts' }).click();
  await page.waitForTimeout(2000);

  // Click on "+ Create New Contact" button
  await page.locator('text=Create New Contact').click();
  await page.waitForTimeout(2000);

  // Fill in Contact info and Contact details and Click on "Save" button
  // TODO: Add specific field selectors and values
  await page.locator('input[name="contact[first_name]"]').fill('Test First Name');
  await page.locator('input[name="contact[last_name]"]').fill('Test Last Name');
  await page.locator('.x-action.x-action_save').click();
  await page.waitForTimeout(2000);

  // Try to Edit info and click on "Save" button
  await page.locator('input[name="contact[first_name]"]').clear();
  await page.locator('input[name="contact[first_name]"]').fill('Updated First Name');
  await page.locator('.x-action.x-action_save').click();
  await page.waitForTimeout(2000);
});
