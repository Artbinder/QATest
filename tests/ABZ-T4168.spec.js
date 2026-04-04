const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4168: [TC-06-PROD] Exported Label PDF according to Template from Object Info', async ({ page }) => {
  test.setTimeout(120000);

  await login(page);
  await goToObjects(page);

  // Search for the object
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Untitled (First the Dust...)');
  await page.waitForTimeout(1500);

  // Select the first object checkbox
  await page.locator('.x-grid-card label').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card label').first().click();
  await page.waitForTimeout(500);

  // Click Create Report
  await page.locator('text=Create Report').first().click();
  await page.waitForTimeout(2000);

  // Fill report details
  await page.getByPlaceholder('Enter Report Title').fill('Test Report ' + Date.now());
  await page.waitForTimeout(500);
  await page.getByRole('radio', { name: 'Export as PDF' }).click();
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
