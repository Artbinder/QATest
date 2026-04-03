const { test, expect } = require('@playwright/test');
const { login, goToShows } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4260: [TC-05-PROD] LHM of Associated Objects in Basic account', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Basic Account
   // 2. User on Show Info page
   // 3. Objects and Editions added to the Show
  
  await login(page);
  await goToShows(page);

  // Expected Result: 1. LHM appears
    // * Add to Show
    // * Add to List
    // * Create Packet
    // * Export
    // * Bulk Edit
    // * Update Location
    // * Publish
    // * Unpublish
    // * Add to Bookmarks
    // * Remove from Bookmarks
    // * Dissociate
  // Step: Select any Object or Edition

  await page.locator('.x-grid-card .x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  // Now we're inside the show, select an object checkbox
  await page.locator('.x-grid-card .css-label').first().click();
  await page.waitForTimeout(1000);

  await page.locator('a:has-text("Publish")').first().click();
  await page.locator('.modal.in a:has-text("No")').click();
  await page.waitForTimeout(500);

  await page.locator('a:has-text("Publish")').first().click();
  await page.locator('.modal.in a:has-text("Yes")').click();
  await page.waitForTimeout(1000);

  await page.locator('a:has-text("Unpublish")').first().click();
  await page.locator('.modal.in a:has-text("No")').click();
  await page.waitForTimeout(500);

  await page.locator('a:has-text("Unpublish")').first().click();
  await page.locator('.modal.in a:has-text("Yes")').click();
  await page.waitForTimeout(1000);
});
