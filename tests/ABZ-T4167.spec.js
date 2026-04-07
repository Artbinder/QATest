const { test, expect } = require('@playwright/test');
const { login, goToShows, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4167: [TC-07-PROD] Exported Label DOC according to Template from Show Info', async ({ page }) => {
  test.setTimeout(120000);

  await login(page);
  await goToShows(page);

  // Search for "The Works" — a show with associated objects
  const found = await searchWithRetry(page, 'The Works');
  expect(found, 'Could not find "The Works" show').toBeTruthy();
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');

  // Wait for objects grid to load in the show detail page
  await page.locator('.x-grid-card label').first().waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('.x-grid-card label').first().click();
  await page.waitForTimeout(500);

  // Click Create Report
  await page.locator('text=Create Report').first().click();
  await page.waitForTimeout(2000);

  // Fill report details
  await page.getByPlaceholder('Enter Report Title').fill('Test Report ' + Date.now());
  await page.waitForTimeout(500);
  await page.getByRole('radio', { name: 'Export as DOC' }).click();
  await page.waitForTimeout(500);
  await page.locator('.modal-dialog a:has-text("Export")').click();
  await page.waitForTimeout(5000);

  // Close the export modal
  const closeBtn = page.locator('.modal-dialog a:has-text("Close")').first();
  if (await closeBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await closeBtn.click();
    await page.waitForTimeout(1000);
  }
});
