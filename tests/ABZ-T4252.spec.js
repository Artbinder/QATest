const { test, expect } = require('@playwright/test');
const { login, goToLists, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4252: [TC-07-PROD] List Info - Deleting - New', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. There are at least two List
   // 3. User on List Info page
  
  await login(page);

  await goToLists(page);
  await clickFirstGridCard(page);

  await page.locator('text=Delete').first().click();
  await page.waitForTimeout(1000);
});
