const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4344: [TC05-PROD] Set Info - Managing', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic/Premium Account
   // 2. User has created set with several Editions
   // 3. User is on Set Info Page
  

  await login(page);

  // Expected Result: 1. There is an ability to Manage the Set using Manage Set button
  // Step: 1. Try to Manage the Set using Manage Set button

  await goToObjects(page);
  await page.locator('.typeahead__container input').first().fill('Swinging Cardinal');
  await page.waitForTimeout(1500);
  await page.getByText('Swinging Cardinal').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Edition Sets' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.x-row-card__title, .x-row-card a').first().click();
  await page.waitForTimeout(1000);

  await page.locator('button:has-text("Manage Set"), a:has-text("Manage Set"), .x-action:has-text("Manage Set")').first().click();
  await page.waitForTimeout(1000);
});
