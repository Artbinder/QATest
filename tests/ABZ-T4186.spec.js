const { test, expect } = require('@playwright/test');
const { login, goToObjects, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4186: [TC-09-PROD] Associated Shows', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic or Premium Account
   // 2. User is on Object Info -> Associated Shows
   // 3. Object contains Associated Shows
  
  await login(page);

  await goToObjects(page);
  await clickFirstGridCard(page);

  await page.getByRole('link', { name: 'Associated Shows' }).click();
  await page.waitForTimeout(1000);

  await page.locator('text=Add To Show').first().click();
  await page.waitForTimeout(1000);
  await page.locator('.modal-dialog .x-grid-card').first().click();
  await page.waitForTimeout(500);
  await page.locator('.modal-dialog').getByRole('link', { name: 'Add', exact: true }).click();
  await page.waitForTimeout(1000);
  await expect(page.locator('.x-grid-card').first()).toBeVisible();
});
