const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4344: [TC05-PROD] Set Info - Managing', async ({ page }) => {
  await login(page);
  await goToObjects(page);

  // Search for Swinging Cardinal
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Swinging Cardinal');
  await page.waitForTimeout(1500);
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Navigate to Edition Sets tab
  await page.getByRole('link', { name: 'Edition Sets' }).click();
  await page.waitForTimeout(1000);

  // Click on the first edition set
  await page.locator('.x-row-card__title, .x-row-card a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-row-card__title, .x-row-card a').first().click();
  await page.waitForTimeout(1000);

  // Click Manage Set
  await page.locator('button:has-text("Manage Set"), a:has-text("Manage Set"), .x-action:has-text("Manage Set")').first().click();
  await page.waitForTimeout(1000);
});
