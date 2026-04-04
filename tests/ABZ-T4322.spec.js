const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4322: Transaction creation', async ({ page }) => {
  await login(page);
  await goToObjects(page);

  // Select objects using checkbox labels (not the card itself which navigates away)
  await page.locator('.x-grid-card label').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card label').first().click();
  await page.locator('.x-grid-card label').nth(1).click();
  await page.locator('.x-grid-card label').nth(2).click();
  await page.waitForTimeout(500);

  await page.locator('text=Create Transaction').first().click();
  await page.waitForTimeout(1000);

  // Set Transaction Type to 'Offer'
  await page.locator('.modal select').first().selectOption('Offer');
  await page.getByRole('link', { name: 'Create', exact: true }).click();
  await page.waitForLoadState('networkidle');
});
