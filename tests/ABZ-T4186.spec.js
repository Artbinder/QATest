const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4186: [TC-09-PROD] Associated Shows', async ({ page }) => {
  test.setTimeout(90000);
  await login(page);
  await goToObjects(page);

  // Click the first object — it was associated with shows during seed
  // (The seed adds the first object to "The Works" and "Van Gogh" shows)
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');

  // Check if this object has associated shows; if not, navigate to one that does
  const showsLink = page.locator('a:has-text("Associated Shows")');
  const showsText = await showsLink.textContent();
  if (showsText.includes('(0)')) {
    // This object has no shows — go back and try the second object
    await goToObjects(page);
    await page.locator('.x-grid-card__title a').nth(1).click();
    await page.waitForLoadState('networkidle');
  }

  await page.getByRole('link', { name: 'Associated Shows' }).click();
  await page.waitForTimeout(1000);

  // Verify shows are listed
  const showCount = page.locator('text=Showing').first();
  await showCount.waitFor({ state: 'visible', timeout: 10000 });

  // Click Add To Show to test the modal opens
  await page.locator('text=Add to Show').first().click();
  await page.waitForTimeout(2000);

  const dialog = page.getByRole('dialog');
  await dialog.waitFor({ state: 'visible', timeout: 10000 });

  // Close the modal
  await dialog.getByRole('link', { name: 'Cancel' }).click();
  await page.waitForTimeout(500);

  // Verify the associated shows are still visible
  await expect(page.locator('.x-grid-card, .x-row-card').first()).toBeVisible();
});
