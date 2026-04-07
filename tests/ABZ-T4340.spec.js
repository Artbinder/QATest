const { test, expect } = require('@playwright/test');
const { login, goToObjects, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4340: [TC10-PROD] Edition Deleting', async ({ page }) => {
  await login(page);
  await goToObjects(page);

  // Search for Georgica Association edition with retry
  const found = await searchWithRetry(page, 'Georgica Association Wainscott, December 2013');
  expect(found, 'Could not find "Georgica Association" in search results').toBeTruthy();

  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Click Delete
  await page.getByText('Delete').click();
  await page.waitForTimeout(500);
  await expect(page.getByText('Yes', { exact: true })).toBeVisible();
});
