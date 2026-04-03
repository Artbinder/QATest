const { test, expect } = require('@playwright/test');
const { login, navigateTo, uploadFile } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4288: [TC-08-PROD] Press', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the system (Premium/Basic)
   // 2. User is on Artist -> Press
  

  await login(page);

  await navigateTo(page, 'Artists', 'Artists');
  await page.waitForURL('**/artists');
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Press' }).click();
  await page.waitForTimeout(1000);

  await uploadFile(page, 'Files/bartleby.pdf');
});
