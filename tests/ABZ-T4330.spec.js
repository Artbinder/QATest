const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4330: Transaction creation', async ({ page }) => {
  // Login
  await login(page);

  // Navigate to Objects page
  await goToObjects(page);

  // Select a few objects, editions, and masters and click "Create Transaction" in LHM
  await page.locator('.x-grid-card').first().click();
  await page.locator('.x-grid-card').nth(1).click();
  await page.locator('.x-grid-card').nth(2).click();
  await page.locator('text=Create Transaction').first().click();
  
  // Set Transaction Type to 'Sale' and Status to 'Available'
  await page.locator('.modal select').first().selectOption('Sale');
  await page.locator('.modal select').nth(1).selectOption('Available');
  await page.getByRole('link', { name: 'Create', exact: true }).click();
  await page.waitForLoadState('networkidle');
});
