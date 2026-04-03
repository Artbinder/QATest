const { test, expect } = require('@playwright/test');
const { login, goToObjects, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4279: [TC-07-PROD] Financials', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User is on Object Info -> Financial
  
  await login(page);
  await goToObjects(page);
  await clickFirstGridCard(page);

  await page.getByRole('link', { name: 'Financial' }).click();
  await page.waitForTimeout(1000);

  await page.locator('span.h-mr-xs:has-text("Add More")').first().click();
  await page.waitForTimeout(1000);
});
