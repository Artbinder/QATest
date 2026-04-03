const { test, expect } = require('@playwright/test');
const { login, navigateTo, waitForModal } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4169: [TC-04-PROD] Objects Premium', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. User is on Artist -> Object tab
   // 3. Artist contains Object(s) and Editions
  

  // Preconditions:
  // 1. User is logged into the Premium Account
  // 2. User is on Artist -> Object tab
  // 3. Artist contains Object(s) and Editions
  
  // Login
  await login(page);

  // Navigate to Artists page
  await navigateTo(page, 'Artists', 'Artists');
  await page.waitForURL('**/artists');
  
  // Click on first artist name to view artist details
  await page.locator('.x-grid-card__title_name a').first().click();
  await page.waitForURL('**/artists/**');
  
  // Navigate to Objects tab from sidebar
  await page.locator('.sidebar a[href*="/objects"]').click();
  await page.waitForTimeout(1000);

  // Step: Select an Object and an Edition
  await page.locator('.x-grid-card label').first().click();
  await page.waitForTimeout(1000);
  
  // Try to select a second object if available
  const objectCount = await page.locator('.x-grid-card label').count();
  if (objectCount > 1) {
    await page.locator('.x-grid-card label').nth(1).click();
    await page.waitForTimeout(500);
  }

  // Expected Result: LHM appears with the following options:
  // * Add To Show
  // * Add to List
  // * Create Form
  // * Create Transaction
  // * Export
  // Note: LHM is visible on the page after selecting objects
  
  // Verify page has expected action options
  await expect(page.locator('text=Add To Show').first()).toBeVisible();
  await expect(page.locator('text=Add to List').first()).toBeVisible();
  await expect(page.locator('text=Create Form').first()).toBeVisible();
  await expect(page.locator('text=Create Transaction').first()).toBeVisible();

  // Test Add to List functionality
  await page.locator('text=Add to List').first().click();
  await page.waitForTimeout(2000);
  
  // Wait for modal to appear and be visible
  const modal = await waitForModal(page);
  
  // Click the label containing x-grid-card__label__text to select the checkbox
  const listItemLabel = modal.locator('label:has(.x-grid-card__label__text)').first();
  await listItemLabel.click({ force: true });
  await page.waitForTimeout(500);
  
  // Click the Add link
  await modal.locator('a').filter({ hasText: 'Add' }).click();
  await page.waitForTimeout(1000);
});
