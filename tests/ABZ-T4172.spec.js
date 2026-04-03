const { test, expect } = require('@playwright/test');
const { login, goToReportTemplates } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4172: [TC-03-PROD] Single Template', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User has Permissions to Edit Report Templates
   // 3. User is on More -> Reports -> Templates Page
   // 4. User clicks + Add New Report Template button
  

  await login(page);

  // Step: 1. Try to create Single Report Template
  // Expected Result: 1. Single Report Template is created

  await goToReportTemplates(page);

  // Click create new template button
  await page.locator('.x-plus-icon-link').click();
  await page.waitForTimeout(3000);
  
  // Select Single template
  await page.locator('.x-card-selectable').filter({ hasText: /Single/i }).first().click();
  await page.waitForTimeout(2000);

  await page.getByPlaceholder('Enter Template Title').fill('Test Single Template ' + Date.now());
  await page.waitForTimeout(500);
  await page.locator('.x-action_save').click();
  await page.waitForTimeout(2000);

  await expect(page.getByText(/Successfully created/)).toBeVisible();
});
