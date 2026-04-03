const { test, expect } = require('@playwright/test');
const { login, goToArtists } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4292: [TC-04.2-PROD] Objects Basic', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Basic Account
   // 2. User is on Artist -> Object page
   // 3. Artist contains Object(s)
  

  await login(page);

  // Expected Result: 1. LHM appears:
    // * Add to Show
    // * Add to List
    // * Export
    // * Bulk Edit
    // * Update Location
    // * Publish
    // * Unpublish
    // * Add to Bookmarks
    // * Remove from Bookmarks
    // * Delete
  // Step: Select an Object

  await goToArtists(page);
  await page.locator('.x-grid-card .x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Objects' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-grid-card').first().click();
  await page.waitForTimeout(500);

  await expect(page.getByText('Add to Show').first()).toBeVisible();
  await expect(page.getByText('Add to List').first()).toBeVisible();
  await expect(page.getByText('Publish').first()).toBeVisible();

  await page.getByText('Add to List').first().click();
  await page.waitForTimeout(1000);
});
