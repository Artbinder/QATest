const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4340: [TC10-PROD] Edition Deleting', async ({ page }) => {
  await login(page);
  await goToObjects(page);

  // Search for Georgica Association edition
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Georgica Association Wainscott, December 2013');
  await page.waitForTimeout(1500);
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Click Delete
  await page.getByText('Delete').click();
  await page.waitForTimeout(500);
  await expect(page.getByText('Yes', { exact: true })).toBeVisible();
});
