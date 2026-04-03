const { test, expect } = require('@playwright/test');
const { login, goToObjects, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4280: [TC-06-PROD] Object Status -> Condition Status', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User is on Object Info -> Object Status -> Condition Status tab
  
  await login(page);
  await goToObjects(page);
  await clickFirstGridCard(page);

  await page.getByRole('link', { name: 'Object Status' }).click();
  await page.getByRole('link', { name: 'Condition Status' }).click();
  await page.waitForTimeout(1000);

  await expect(page).toHaveURL(/#condition/);
});
