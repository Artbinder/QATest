const { test, expect } = require('@playwright/test');
const { login, goToArtists } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4291: [TC-05-PROD] Shows', async ({ page }) => {
  test.setTimeout(90000);
  await login(page);
  await goToArtists(page);

  // Search for an artist that has associated shows
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Warren Neidich');
  await page.waitForTimeout(1500);
  await page.locator('.x-grid-card .x-grid-card__title a, .x-grid-card__title_name a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card .x-grid-card__title a, .x-grid-card__title_name a').first().click();
  await page.waitForTimeout(1000);

  // Navigate to Shows tab
  await page.getByRole('link', { name: 'Shows' }).click();
  await page.waitForTimeout(1000);

  // If no shows, add one via "Add to Show"
  const hasShows = await page.locator('.x-grid-card').first().isVisible({ timeout: 3000 }).catch(() => false);

  if (!hasShows) {
    // Add artist to a show
    await page.locator('text=Add to Show').first().click();
    await page.waitForTimeout(2000);
    const modal = page.locator('.modal.in, .modal[style*="display: block"]').first();
    await modal.waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(1000);
    await modal.evaluate(el => {
      const checkbox = el.querySelector('input[type="checkbox"]');
      if (checkbox) checkbox.click();
    });
    await page.waitForTimeout(500);
    await modal.locator('a').filter({ hasText: 'Add' }).click();
    await page.waitForTimeout(2000);
  }

  // Verify shows are visible
  await expect(page.locator('.x-grid-card').first()).toBeVisible({ timeout: 10000 });
});
