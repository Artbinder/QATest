const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4273: [TC-14-PROD] Objects Landing', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the system (Basic/Premium)
   // 2. User is on Objects Landing page
   // 3. Landing page contains Object(s)
  
  await login(page);
  await goToObjects(page);

  await expect(page.locator('.x-grid-card').first()).toBeVisible();

  await page.locator('.x-switch_grid').click();
  await page.waitForTimeout(500);
});
