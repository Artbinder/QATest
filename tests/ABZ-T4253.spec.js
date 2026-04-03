const { test, expect } = require('@playwright/test');
const { login, goToLists, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4253: [TC-06-PROD] LHM of Associated Objects in Premium account', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. User on List Info page
   // 3. Objects added to the List
  
  await login(page);

  await goToLists(page);
  await clickFirstGridCard(page);
  await expect(page).toHaveURL(/\/lists\/\d+/);
});
