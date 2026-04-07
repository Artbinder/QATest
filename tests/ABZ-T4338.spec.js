const { test, expect } = require('@playwright/test');
const { login, goToObjects, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4338: [TC13-PROD] Publishing', async ({ page }) => {
  await login(page);
  await goToObjects(page);

  // Search for Swinging Cardinal
  const found = await searchWithRetry(page, 'Swinging Cardinal');
  expect(found, 'Could not find "Swinging Cardinal" in search results').toBeTruthy();
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Toggle Published status
  await page.locator('.x-toggle-link__text').filter({ hasText: 'Published' }).click();
  await page.waitForTimeout(1000);
});
