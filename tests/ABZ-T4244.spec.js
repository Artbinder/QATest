const { test, expect } = require('@playwright/test');
const { login, goToContactGroups } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4244: [TC-10-PROD] New Contact Group', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. User is on Contact Groups Landing page
  
  await login(page);

  await goToContactGroups(page);

  await page.locator('.modal-opener-link').filter({ hasText: 'Create Contact Group' }).click();
  await page.waitForTimeout(500);
  await expect(page.getByRole('dialog')).toBeVisible();
});
