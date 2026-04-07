const { test, expect } = require('@playwright/test');
const { login, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4341: [TC08-PROD] Master Deleting', async ({ page }) => {
  await login(page);

  await page.goto('/objects', { waitUntil: 'networkidle' });
  const found = await searchWithRetry(page, 'Georgica Association Wainscott, December 2013');
  expect(found, 'Could not find "Georgica Association" in search results').toBeTruthy();
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Click Delete and then Cancel
  await page.locator('a:has-text("Delete")').click();
  await page.waitForTimeout(500);
  await page.locator('.x-confirmation-modal__btn_cancel').click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/objects\/.*\/info$/);
});
