const { test, expect } = require('@playwright/test');
const { login, goToShows, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4259: [TC-07-PROD] Show Info - Deleting - New', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. There are at least two Show
   // 3. User on Show Landing Page
  
  await login(page);
  await goToShows(page);

  // Search for "Test Show" (created by T4204) — don't delete "The Works" since other tests need it
  let found = await searchWithRetry(page, 'Test Show');
  if (!found) {
    // Fall back to "Van Gogh" if Test Show doesn't exist
    found = await searchWithRetry(page, 'Van Gogh');
  }
  expect(found, 'Could not find a show to delete').toBeTruthy();
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');

  // Wait for the show info page to fully load before attempting delete
  await page.locator('text=Delete').first().waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('text=Delete').first().click();
  await page.waitForTimeout(1000);
});
