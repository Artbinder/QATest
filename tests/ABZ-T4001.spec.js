const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4182: Imported data verification', async ({ page }) => {
  // Login
  await login(page);

  // Navigate to Objects and search for 'Orange'
  await goToObjects(page);
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Orange');
  await page.waitForTimeout(2000);

  // Verify the object appears in the grid
  const objectCard = page.locator('.x-grid-card__title a').first();
  await expect(objectCard).toBeVisible({ timeout: 10000 });

  // Click into the object
  await objectCard.click();
  await page.waitForLoadState('networkidle');

  // Verify object info page loaded
  await expect(page).toHaveURL(/objects\/.*\/info/);
});
