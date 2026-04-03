const { test, expect } = require('@playwright/test');
const { login, goToContacts } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4222: [TC-08-PROD] Contacts Landing', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. User is on Contacts Landing page
   // 3. The page contains several Contacts and at least one Contact Group
  
  await login(page);

  await goToContacts(page);

  await expect(page.locator('.x-grid-card').first()).toBeVisible();
});
