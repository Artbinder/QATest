const { test, expect } = require('@playwright/test');
const { login, goToShows, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4259: [TC-07-PROD] Show Info - Deleting - New', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. There are at least two Show
   // 3. User on Show Landing Page
  
  await login(page);
  await goToShows(page);
  await clickFirstGridCard(page);

  await page.locator('text=Delete').first().click();
  await page.waitForTimeout(1000);
});
