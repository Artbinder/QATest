const { test, expect } = require('@playwright/test');
const { login, goToContactGroups } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4245: [TC-09-PROD] Contact Groups Landing page', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. User is on Contact Groups Landing page
   // 3. Landing page contains several Groups
  
  await login(page);

  await goToContactGroups(page);

  await page.locator('.x-switch.x-switch_grid').click();
  await page.waitForTimeout(500);
  await page.locator('.x-switch.x-switch_list').click();
  await page.waitForTimeout(500);
});
