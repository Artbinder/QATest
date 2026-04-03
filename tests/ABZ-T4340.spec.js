const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4340: [TC10-PROD] Edition Deleting', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic/Premium Account
   // 2. User is on Edition Info page
  

  await login(page);

  await goToObjects(page);
  
  // Search for specific edition object
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Georgica Association Wainscott, December 2013');
  await page.waitForTimeout(1000);
  
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByText('Delete').click();
  await page.waitForTimeout(500);
  await expect(page.getByText('Yes', { exact: true })).toBeVisible();
});
