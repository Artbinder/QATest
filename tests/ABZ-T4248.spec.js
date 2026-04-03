const { test, expect } = require('@playwright/test');
const { login, goToContacts, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4248: [TC-06-PROD] Contact Info - Notes', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. User is on Contact Info any contact -> Notes page
  
  await login(page);

  await goToContacts(page);
  await clickFirstGridCard(page);

  await page.getByRole('link', { name: 'Notes' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.modal-opener-link').getByText('Create New Note').first().click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/contacts\/\d+\/notes/);
});
