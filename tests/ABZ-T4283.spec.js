const { test, expect } = require('@playwright/test');
const { login, goToObjects, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4283: [TC-03-PROD] Object editing', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic or Premium Account
   // 2. User on Object info page of newly created Object
  
  await login(page);

  // Expected Result: 1. Window with list of files (external files, existing on the local
      // disk) is opened
  // Step: Click on "Select Files" button in "Additional Images" section

  await goToObjects(page);
  await clickFirstGridCard(page);

  await page.locator('#work_title').fill('Updated Title ' + Date.now());
  await page.getByRole('button', { name: 'Save' }).first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Actions' }).click();
  await page.locator('text=Add To Show').click();
  await page.waitForTimeout(1000);
  await page.locator('.modal.fade.in .modal-opener-header .actions a').filter({ hasText: 'Cancel' }).first().click();
  await page.waitForTimeout(1000);
});
