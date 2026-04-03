const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4290: [TC-06-PROD] Lists', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the system (Premium/Basic)
   // 2. User is on Artist -> List
   // 3. Lists List contains List(s)
  

  await login(page);

  await navigateTo(page, 'Artists', 'Artists');
  await page.waitForURL('**/artists');
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Lists' }).click();
  await page.waitForTimeout(1000);
  await expect(page.locator('.x-grid-card').first()).toBeVisible();
});
