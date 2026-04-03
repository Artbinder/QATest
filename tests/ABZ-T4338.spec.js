const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4338: [TC13-PROD] Publishing', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the system
   // 2. User published Master and it Editions
  

  await login(page);

  await goToObjects(page);
  
  // Search for specific master with editions
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Swinging Cardinal');
  await page.waitForTimeout(1000);
  
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.locator('.x-toggle-link__text').filter({ hasText: 'Published' }).click();
  await page.waitForTimeout(1000);
});
