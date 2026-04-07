const { test, expect } = require('@playwright/test');
const { login, goToShows, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4261: [TC-06-PROD] LHM of Associated Objects in Premium account', async ({ page }) => {
  await login(page);
  await goToShows(page);

  // Search for a show with associated objects
  const found = await searchWithRetry(page, 'The Works');
  expect(found, 'Could not find "The Works" in search results').toBeTruthy();
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');

  // Select the first object checkbox
  await page.locator('.x-grid-card label').first().waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('.x-grid-card label').first().click();
  await page.waitForTimeout(1000);

  // Verify LHM options
  await expect(page.locator('.sidebar')).toContainText('Add to Show');
  await expect(page.locator('.sidebar')).toContainText('Create Form');
  await expect(page.locator('.sidebar')).toContainText('Create Transaction');
  await expect(page.locator('.sidebar')).toContainText('Export');
  await expect(page.locator('.sidebar')).toContainText('Dissociate');
});
