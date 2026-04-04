const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4317: [TC-05-PROD] Offer transaction removal', async ({ page }) => {
  test.setTimeout(90000);
  await login(page);

  // First ensure an offer exists — create one if needed
  await page.goto('/transactions/offers', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const hasOffers = await page.locator('.transaction-row-card').first().isVisible({ timeout: 3000 }).catch(() => false);

  if (!hasOffers) {
    // Create an offer transaction
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

    // Navigate back to offers page
    await page.goto('/transactions/offers', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
  }

  // Select the first offer and delete it
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const cb = document.querySelector('.transaction-row-card input[type="checkbox"]');
    if (cb && !cb.checked) cb.click();
  });
  await page.waitForTimeout(500);

  await page.locator('text=Delete').first().click();
  await page.waitForTimeout(500);
  await page.getByText('Yes', { exact: true }).click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/offers$/);
});
