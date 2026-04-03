const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4342: [TC06-PROD] Edition Sets list', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic/Premium Account
   // 2. Go to Master -> Edition Sets list
   // 3. The List contains three Sets and each set contains two Editions
  

  await login(page);

  await page.goto('/objects', { waitUntil: 'networkidle' });
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Georgica Association Wainscott, December 2013');
  await page.waitForTimeout(1000);
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Edition Sets' }).click();
  await page.waitForTimeout(1000);
  await expect(page.locator('.x-row-card').first()).toBeVisible();
});
