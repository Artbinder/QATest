const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4214: [TC-05-PROD] LHM of Associated Objects in Basic account', { timeout: 120000 }, async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Basic Account
   // 2. User on Show Info page
   // 3. Object and Edition added to the List
  
  await login(page);

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

  await page.goto('/lists', { waitUntil: 'networkidle' });
  await page.locator('.test-list-name').first().click();
  await page.waitForTimeout(3000);

  // Add objects to the list first
  await page.getByText('Add Objects').click();
  await page.waitForTimeout(2000);
  const modal = page.locator('.modal.in');
  await modal.locator('.x-grid-card').first().click();
  await modal.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(3000);

  // Wait for the object count to update
  await page.waitForTimeout(2000);

  // Select the first object checkbox (not the Show Mobile Order checkbox)
  await page.locator('.x-grid-card .css-checkbox').first().evaluate(el => el.click());
  await page.waitForTimeout(2000);

  // The LHM (Left Hand Menu) appears with actions - click Publish
  await page.getByText('Publish').first().click();
  await page.getByText('No', { exact: true }).click();
  await page.waitForTimeout(1000);

  await page.getByText('Publish').first().click();
  await page.getByText('Yes', { exact: true }).click();
  
  // Wait for processing modal to appear and then disappear (can take a while)
  await page.waitForSelector('text=Please wait while your updates are being processed', { timeout: 10000 });
  await page.waitForSelector('text=Please wait while your updates are being processed', { state: 'hidden', timeout: 60000 });
  await page.waitForTimeout(1000);

  await page.getByText('Unpublish').first().click();
  await page.getByText('No', { exact: true }).click();
  await page.waitForTimeout(1000);

  await page.getByText('Unpublish').first().click();
  await page.getByText('Yes', { exact: true }).click();
  await page.waitForTimeout(1000);
});
