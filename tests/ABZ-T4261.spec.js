const { test, expect } = require('@playwright/test');
const { login, goToShows, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4261: [TC-06-PROD] LHM of Associated Objects in Premium account', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. User on Show Info page
   // 3. Objects and Editions added to the Show
  
  await login(page);
  await goToShows(page);
  await clickFirstGridCard(page);

  await page.evaluate(() => {
    document.querySelectorAll('.x-grid-card input[type="checkbox"]')[0].click();
  });
  await page.waitForTimeout(1000);

  await expect(page.locator('.sidebar')).toContainText('Add to Show');
  await expect(page.locator('.sidebar')).toContainText('Create Form');
  await expect(page.locator('.sidebar')).toContainText('Create Transaction');
  await expect(page.locator('.sidebar')).toContainText('Export');
  await expect(page.locator('.sidebar')).toContainText('Dissociate');
});
