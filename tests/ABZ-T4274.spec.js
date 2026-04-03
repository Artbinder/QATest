const { test, expect } = require('@playwright/test');
const { login, goToObjects, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4274: [TC-12-PROD] Associated Invoices', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User is on Object Info -> Associated Forms -> Invoices page
   // 3. Object contains Associated Invoices
  
  await login(page);
  await goToObjects(page);

  // Search for the object that has associated invoices (seeded on White Noise)
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('White Noise');
  await page.waitForTimeout(1500);
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');

  await page.getByText('Associated Forms').click();
  await page.getByRole('link', { name: /Invoices \(\d+\)/ }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-row-card__title').first().click();
  await page.waitForTimeout(500);
  await expect(page.getByText('Delete')).toBeVisible();
});
