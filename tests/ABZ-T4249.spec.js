const { test, expect } = require('@playwright/test');
const { login, goToContacts } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4249: [TC-03-PROD] Contact Info - Contact Groups', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. There is at least one Contact
   // 3. There is at least one Contact Group
   // 4. User is on the Contact Info -> Contact Groups tab
  
  await login(page);

  // Expected Result: 1. "Add to Groups" modal window is opened
  // Step: Click "Add to Groups"

  await goToContacts(page);
  await page.locator('.x-grid-card').first().click();
  await page.waitForTimeout(500);

  await page.locator('text=Add To').first().click();
  await page.waitForTimeout(500);
  await page.getByText('Group', { exact: true }).first().click();
  await page.waitForTimeout(1000);
  await page.locator('.x-grid-card.x-grid-card_stacked').first().click();
  await page.waitForTimeout(500);
  await page.locator('.modal-opener-header a:has-text("Add")').click();
  await page.waitForTimeout(1000);
});
