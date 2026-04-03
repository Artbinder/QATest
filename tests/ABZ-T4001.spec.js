const { test, expect } = require('@playwright/test');
const { login, globalSearch } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4182: Imported data verification', async ({ page }) => {
  // Login
  await login(page);

  // Search for 'White Noise' object
  await globalSearch(page, 'White Noise');
  
  // Verify object info page loaded
  await expect(page).toHaveURL(/objects\/.*\/info/);
});
