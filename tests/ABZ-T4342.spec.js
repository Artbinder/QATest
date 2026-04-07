const { test, expect } = require('@playwright/test');
const { login, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4342: [TC06-PROD] Edition Sets list', async ({ page }) => {
  await login(page);

  await page.goto('/objects', { waitUntil: 'networkidle' });
  const found = await searchWithRetry(page, 'Georgica Association Wainscott, December 2013');
  expect(found, 'Could not find "Georgica Association" in search results').toBeTruthy();
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Navigate to Edition Sets tab
  await page.getByRole('link', { name: 'Edition Sets' }).click();
  await page.waitForTimeout(1000);
  await expect(page.locator('.x-row-card').first()).toBeVisible({ timeout: 10000 });
});
