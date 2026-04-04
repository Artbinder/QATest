const { test, expect } = require('@playwright/test');
const { login, goToObjects, navigateTo } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4321: [TC-02-PROD] User can add objects to transaction with "Add Objects" option', async ({ page }) => {
  test.setTimeout(90000);
  await login(page);

  // Navigate to Offers page
  await navigateTo(page, 'Transactions', 'Offers');
  await page.waitForURL('**/transactions/offers');
  await page.waitForTimeout(1000);

  // Check if any offers exist; if not, create one
  const hasOffers = await page.locator('a[href*="/transactions/offers/"][href*="/edit"]').first().isVisible({ timeout: 3000 }).catch(() => false);

  if (!hasOffers) {
    // Create an offer from Objects page
    await goToObjects(page);
    await page.locator('.x-grid-card label').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.x-grid-card label').first().click();
    await page.waitForTimeout(500);
    await page.locator('text=Create Transaction').first().click();
    await page.waitForTimeout(1000);
    await page.locator('.modal select').first().selectOption('Offer');
    await page.getByRole('link', { name: 'Create', exact: true }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  } else {
    // Open the existing offer
    await page.locator('a[href*="/transactions/offers/"][href*="/edit"]').first().click();
    await page.waitForTimeout(2000);
  }

  // Add objects using "Add Objects" button
  await page.locator('text=Add Objects').click();
  await page.waitForTimeout(1500);

  const modal = page.locator('.modal.in, .modal[style*="display: block"]').first();
  await modal.waitFor({ state: 'visible', timeout: 10000 });
  await modal.locator('.x-grid-card').first().waitFor({ state: 'visible', timeout: 10000 });
  await modal.locator('.x-grid-card').first().click();
  await page.waitForTimeout(500);
  await modal.locator('a').filter({ hasText: 'Add' }).click();
  await page.waitForTimeout(1000);
});
