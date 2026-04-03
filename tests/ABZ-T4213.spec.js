const { test, expect } = require('@playwright/test');
const { login, goToLists } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4213: [TC-04-PROD] List info Page', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Basic/Premium Account
   // 2. User is on Lists Info page
  
  await login(page);

  // Expected Result: 1. "Add to List" modal window is opened
   // 2. List of Object is displayed
  // Step: Click on "Add Associated Objects"* button and upload any image(s)

// (*the "Add Associated Objects" button is available if there are no Object
// in the "Associated Objects" tab)

  await goToLists(page);
  await page.locator('.test-list-name').first().click();
  await page.waitForTimeout(2000);

  await page.getByText('Add Objects').click();
  await page.waitForTimeout(2000);
  const modal = page.locator('.modal.in');
  await modal.locator('.x-grid-card').first().click();
  await modal.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);

  await page.getByText('Add Objects').click();
  await page.waitForTimeout(2000);
  const modal2 = page.locator('.modal.in');
  await modal2.locator('.x-grid-card').nth(1).click();
  await modal2.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Save' }).first().click();
  await page.waitForTimeout(1000);
});
