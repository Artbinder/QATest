const { test, expect } = require('@playwright/test');
const { login, goToShows, clickFirstGridCard, uploadFile } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4258: [TC-07-PROD] Images Tab of Show', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. User is on "Show Images" tab of Show
  
  await login(page);
  await goToShows(page);
  await clickFirstGridCard(page);

  await page.getByRole('link', { name: 'Show Images' }).click();
  await page.waitForTimeout(1000);

  await uploadFile(page, 'Files/256x256bb.jpg');
});
