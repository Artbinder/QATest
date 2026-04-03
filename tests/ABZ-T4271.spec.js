const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4271: [TC-16-PROD] Object Selection Premium', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. User on Objects Landing page
   // 3. At least one Object has Editions
  
  await login(page);
  await goToObjects(page);

  await page.locator('.x-grid-card').first().click();
  await page.waitForTimeout(500);

  await expect(page.getByText('Add To Show').first()).toBeVisible();
  await expect(page.getByText('Create Form').first()).toBeVisible();
  await expect(page.getByText('Create Transaction').first()).toBeVisible();
  await expect(page.getByText('Create Report').first()).toBeVisible();
  await expect(page.getByText('Export', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Delete').first()).toBeVisible();
});
