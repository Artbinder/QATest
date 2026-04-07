const { test, expect } = require('@playwright/test');
const { login, goToShows, searchWithRetry, uploadFile } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4257: [TC-08-PROD] Show\'s Supporting Docs - New', async ({ page }) => {
  await login(page);
  await goToShows(page);

  // Search for "The Works" — a show with associated objects
  const found = await searchWithRetry(page, 'The Works');
  expect(found, 'Could not find "The Works" show').toBeTruthy();
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');

  await page.getByRole('link', { name: 'Supporting Docs' }).click();
  await page.waitForTimeout(1000);

  await uploadFile(page, 'Files/bartleby.pdf');
});
