const { test, expect } = require('@playwright/test');
const { login, goToLists, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4297: [TC-08-PROD] Exported Single PDF according to Template from List Info', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User has Permissions to Edit Report Templates
   // 3. User created Multi-Column, Single, Label
   // 4. Export Reports permissions is granted
   // 5. User is on List Info
  

  test.setTimeout(120000);
  
  await login(page);

  await goToLists(page);
  await clickFirstGridCard(page);

  await page.getByText('Select All', { exact: true }).click();
  await page.waitForTimeout(500);

  await page.locator('text=Create Report').first().click();
  await page.waitForTimeout(1000);
  await page.getByPlaceholder('Enter Report Title').fill('Test Report');
  await page.getByRole('dialog').locator('select').first().selectOption({ index: 1 });
  await page.getByRole('radio', { name: 'PDF' }).click();
  await page.getByRole('link', { name: 'Export' }).last().click();
  await page.waitForTimeout(5000);
  await page.locator('text=Close').click();
  await page.waitForTimeout(500);
});
