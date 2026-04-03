const { test, expect } = require('@playwright/test');
const { login, globalSearch } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4177: Search for Premium users', async ({ page }) => {
  // Login
  await login(page);

  // Search Report Templates
  await globalSearch(page, 'Editions Labels');

  // Search Exported Reports
  const searchInput = page.locator('.x-global-search input[type="search"]').first();
  await searchInput.evaluate(el => el.removeAttribute('readonly'));
  await searchInput.click();
  await searchInput.clear();
  await searchInput.fill('tester');
  await page.waitForTimeout(3000);

  // Search Contacts
  await globalSearch(page, 'Maxwell Adams');

  // Search Contact Groups
  await globalSearch(page, 'Ankunding LLC');
});
