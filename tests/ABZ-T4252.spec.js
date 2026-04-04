const { test, expect } = require('@playwright/test');
const { login, goToLists, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4252: [TC-07-PROD] List Info - Deleting - New', async ({ page }) => {
  await login(page);
  await goToLists(page);

  // Wait for lists to load and click first one
  await page.locator('.x-grid-card__title a, .test-list-name').first().waitFor({ state: 'visible', timeout: 10000 });
  await clickFirstGridCard(page);

  // Click Delete
  await page.locator('text=Delete').first().click();
  await page.waitForTimeout(1000);
});
