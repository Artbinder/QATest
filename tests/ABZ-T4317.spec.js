const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4317: [TC-05-PROD] Offer transaction removal', async ({ page }) => {
  await login(page);

  // Navigate to offers page
  await page.goto('/transactions/offers', { waitUntil: 'networkidle' });

  // Check if there are any offers by looking for an offer link (e.g. "O-1")
  const offerLink = page.locator('a[href*="/transactions/offers/"]').first();
  const hasOffers = await offerLink.isVisible({ timeout: 5000 }).catch(() => false);

  if (!hasOffers) {
    // Create an offer transaction
    await goToObjects(page);
    await page.locator('.x-grid-card label').first().waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('.x-grid-card label').first().click();
    await page.waitForTimeout(500);
    await page.locator('text=Create Transaction').first().click();
    await page.waitForTimeout(1000);
    await page.locator('.modal select').first().selectOption('Offer');
    await page.getByRole('link', { name: 'Create', exact: true }).click();
    await page.waitForLoadState('networkidle');

    // Navigate back to offers page
    await page.goto('/transactions/offers', { waitUntil: 'networkidle' });
  }

  // Use "Select All On Page" to select the offer(s)
  await page.getByText('Select All On Page').click();
  await page.waitForTimeout(1000);

  // Click Delete from the action bar
  await page.getByText('Delete').last().click();
  await page.waitForTimeout(1000);

  // Confirm deletion
  await page.getByText('Yes', { exact: true }).first().click();
  await page.waitForLoadState('networkidle');
});
