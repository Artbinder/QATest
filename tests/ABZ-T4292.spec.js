require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4292: [TC-04.2-PROD] Objects Basic', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Basic Account
   // 2. User is on Artist -> Object page
   // 3. Artist contains Object(s)
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

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

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Artists', exact: true }).click();
  await page.waitForURL('**/artists');
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
