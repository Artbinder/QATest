const { test, expect } = require('@playwright/test');
const { login, goToArtists } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4293: [TC-03-PROD] Artist Info', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the system (Basic/Premium)
   // 2. User is on newly created Artists Info page
  

  await login(page);

  // Expected Result: 1. Info is corresponding to entered data during Artist creation
  // Step: Observe all info

  await goToArtists(page);

  await page.getByText('Create New Artist').click();
  await page.waitForTimeout(1000);
  await page.locator('#first_name').fill('Test');
  await page.locator('#last_name').fill('Artist ' + Date.now());
  await page.getByRole('button', { name: 'Save' }).first().click();
  await page.waitForTimeout(1000);

  await expect(page.locator('.x-page-title')).toContainText('Test');

  await page.locator('#first_name').fill('Updated');
  await page.getByRole('button', { name: 'Save' }).first().click();
  await page.waitForTimeout(1000);

  await page.getByText('Delete').click();
  await page.getByText('Yes', { exact: true }).click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/artists$/);
});
