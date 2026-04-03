const { test, expect } = require('@playwright/test');
const { login, goToShows, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4167: [TC-07-PROD] Exported Label DOC according to Template from Show Info', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User has Permissions to Edit Report Templates
   // 3. User created Multi-Column, Single, Label
   // 4. Export Reports permissions is granted
   // 5. User is on Show Info
  

  test.setTimeout(120000);
  
  await login(page);

  await goToShows(page);
  await clickFirstGridCard(page);
  await page.waitForTimeout(1000);

  await page.locator('.x-grid-card').first().click();
  await page.waitForTimeout(500);

  await page.locator('text=Create Report').first().click();
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Enter Report Title').fill('Test Report ' + Date.now());
  await page.waitForTimeout(500);
  await page.getByRole('radio', { name: 'Export as DOC' }).click();
  await page.waitForTimeout(500);
  await page.locator('.modal-dialog a:has-text("Export")').click();
  await page.waitForTimeout(5000);

  await page.locator('.modal-dialog a:has-text("Close")').click();
  await page.waitForTimeout(1000);
});
