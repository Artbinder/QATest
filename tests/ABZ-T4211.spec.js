const { test, expect } = require('@playwright/test');
const { login, goToArtists, uploadFile } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4285: Object creation from Artist -> Objects page', async ({ page }) => {
  // Login
  await login(page);

  // Navigate to Artists page
  await goToArtists(page);

  // Navigate to First Artist's page
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  // Click Objects link in LHM (sidebar)
  await page.locator('.sidebar a[href*="/objects"]').click();
  await page.waitForTimeout(1000);

  // Click Create New Object in LHM
  await page.locator('.sidebar').getByText('Create New Object').click();
  await page.waitForTimeout(1000);

  // Fill in "Work Title" field and click "Save" button
  await page.getByLabel('Work Title').fill('Test Object Title');
  await page.locator('button.x-action_save, .x-action.x-action_save').first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Upload image file
  await uploadFile(page, 'Files/256x256bb.jpg');
});
