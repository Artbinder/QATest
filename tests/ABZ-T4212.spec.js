const { test, expect } = require('@playwright/test');
const { login, goToLists } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4255: [TC-03-PROD] List creation', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Basic/Premium Account
   // 2. User is on Lists Landing Page
  
  await login(page);

  // Expected Result: 1. "Create New List" modal window is displayed
   // 2. There are fields:
          // o List Name
  // Step: Click on "Create New List" button

  await goToLists(page);

  await page.locator('a:has-text("Create New List"), button:has-text("Create New List")').first().click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder('List Name').fill('Test List ' + Date.now());
  await page.locator('.modal.in .modal-opener-header a:has-text("Cancel")').first().click();
  await page.waitForTimeout(500);

  await page.locator('a:has-text("Create New List"), button:has-text("Create New List")').first().click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder('List Name').fill('Test List ' + Date.now());
  await page.getByText('Create', { exact: true }).click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/lists\/\d+/);
});
