const { test, expect } = require('@playwright/test');
const { login, goToContacts } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4250: New Contact', async ({ page }) => {
  // Login
  await login(page);

  // Navigate to Contacts page
  await goToContacts(page);

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
