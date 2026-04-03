const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4240: [TC02-PROD] Objects Landing - Forms creation', async ({ page }) => {
  // Login
  await login(page);

  // Navigate to Objects Landing page
  await goToObjects(page);
  await page.waitForTimeout(2000);

  // Select both Objects
  await page.locator('.x-grid-card').first().click();
  await page.locator('.x-grid-card').nth(1).click();
  await page.waitForTimeout(500);
  
  // Click Create Form -> Consignment
  await page.locator('text=Create Form').first().click();
  await page.getByRole('radio', { name: 'Consignment' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.modal').locator('text=Create').first().click();
  await page.waitForLoadState('networkidle');
});
