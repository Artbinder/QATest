const { test, expect } = require('@playwright/test');
const { login, goToObjects, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4277: [TC-10-PROD] Associated Lists', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic or Premium Account
   // 2. User is on Object Info -> Associated Lists
   // 3. Object contains Associated Lists
  
  await login(page);
  await goToObjects(page);
  await clickFirstGridCard(page);

  await page.getByText('Associated Lists').click();
  await page.waitForTimeout(1000);

  await page.locator('.x-add-entity-button').filter({ hasText: 'Add to List' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.modal .x-grid-card').first().click();
  await page.locator('.modal a').filter({ hasText: 'Add' }).click();
  await page.waitForTimeout(1000);
});
