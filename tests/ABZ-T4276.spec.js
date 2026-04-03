const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4276: [TC-11-PROD] Associated Reports', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User is on Object Info -> Associated Reports
   // 3. Object contains Associated Reports
  
  await login(page);
  await goToObjects(page);
  
  // Search for specific object with associated reports
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Art Before Philosophy After Art');
  await page.waitForTimeout(1000);
  
  // Click on object title to go to object info page
  await page.locator('.x-grid-card .x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByText('Associated Reports').click();
  await page.waitForTimeout(1000);

  // Verify Associated Reports tab is visible
  await expect(page.getByText('Associated Reports')).toBeVisible();
});
