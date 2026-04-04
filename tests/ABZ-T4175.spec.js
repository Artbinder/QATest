const { test, expect } = require('@playwright/test');
const { login, globalSearch } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4175: Search for Basic and Premium users', async ({ page }) => {
  // Login
  await login(page);

  // Search Artist
  await globalSearch(page, 'Charles Gaines');
  await page.waitForTimeout(1000);

  // Search Object
  await globalSearch(page, 'Landscape Assorted Trees With Regression #6');
  await page.waitForTimeout(1000);

  // Search Show
  await globalSearch(page, 'Van Gogh');
  await page.waitForTimeout(1000);

  // Search List
  await globalSearch(page, 'Big Ol List');
  await page.waitForTimeout(1000);
});
