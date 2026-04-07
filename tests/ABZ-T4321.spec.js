const { test, expect } = require('@playwright/test');
const { login, goToObjects, navigateTo } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4321: [TC-02-PROD] User can add objects to transaction with "Add Objects" option', async ({ page }) => {
  await login(page);

  // Navigate to Offers page
  await navigateTo(page, 'Transactions', 'Offers');
  await page.waitForURL('**/transactions/offers');
  await page.waitForLoadState('networkidle');

  // Check for existing offers
  const noOffers = await page.locator('text=You have no Offers').isVisible({ timeout: 5000 }).catch(() => false);

  if (noOffers) {
    // Create an offer — select multiple objects like the seed does
    await goToObjects(page);
    await page.locator('.x-grid-card label').first().waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('.x-grid-card label').nth(0).click();
    await page.waitForTimeout(300);
    await page.locator('.x-grid-card label').nth(1).click();
    await page.waitForTimeout(300);
    await page.locator('.x-grid-card label').nth(2).click();
    await page.locator('text=Create Transaction').first().click();
    await page.locator('.modal select').first().selectOption('Offer');
    await page.getByRole('link', { name: 'Create', exact: true }).click();
    await page.waitForLoadState('networkidle');
  } else {
    // Open the first existing offer
    const offerLink = page.locator('.transaction-row-card a, .x-grid-card__title a, a[href*="/transactions/offers/"]').first();
    await offerLink.waitFor({ state: 'visible', timeout: 15000 });
    await offerLink.click();
    await page.waitForLoadState('networkidle');
  }

  // Wait for the transaction detail page to fully load
  const addObjectsBtn = page.locator('text=Add Objects').first();
  await addObjectsBtn.waitFor({ state: 'visible', timeout: 15000 });
  await addObjectsBtn.click();

  // Wait for the modal with objects grid to appear
  const modal = page.locator('.modal.in, .modal[style*="display: block"]').first();
  await modal.waitFor({ state: 'visible', timeout: 15000 });
  await modal.locator('.x-grid-card').first().waitFor({ state: 'visible', timeout: 20000 });
  await modal.locator('.x-grid-card').first().click();
  await page.waitForTimeout(500);
  await modal.locator('a, button').filter({ hasText: 'Add' }).first().click();
  await page.waitForLoadState('networkidle');
});
