const { test, expect } = require('@playwright/test');
const { login, goToShows, searchWithRetry, uploadFile } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4258: [TC-07-PROD] Images Tab of Show', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. User is on "Show Images" tab of Show
  
  await login(page);
  await goToShows(page);

  // Search for "The Works" — a show with associated objects
  const found = await searchWithRetry(page, 'The Works');
  expect(found, 'Could not find "The Works" show').toBeTruthy();
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');

  await page.getByRole('link', { name: 'Show Images' }).click();
  await page.waitForLoadState('networkidle');

  await uploadFile(page, 'Files/256x256bb.jpg');
});
