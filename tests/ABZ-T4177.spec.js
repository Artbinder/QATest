const { test, expect } = require('@playwright/test');
const { login, globalSearch } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4177: Search for Premium users', async ({ page }) => {
  await login(page);

  // Search Report Templates
  await globalSearch(page, 'Editions Labels');
  await page.waitForTimeout(1000);

  // Search Exported Reports
  await globalSearch(page, 'tester');
  await page.waitForTimeout(1000);

  // Search Contacts
  await globalSearch(page, 'Maxwell Adams');
  await page.waitForTimeout(1000);

  // Search Contact Groups
  await globalSearch(page, 'Ankunding LLC');
  await page.waitForTimeout(1000);
});
