const { test, expect } = require('@playwright/test');
const { login, goToObjects, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4186: [TC-09-PROD] Associated Shows', async ({ page }) => {
  await login(page);
  await goToObjects(page);

  // Search for an object that was added to shows during seeding.
  // The seed adds the first grid card's object to "The Works" and "Van Gogh",
  // but grid order changes over time. Use a known imported object instead.
  // Try multiple objects that the seed may have associated with shows.
  let foundWithShows = false;

  // The seed adds objects to shows by clicking the first grid card at seed time.
  // We don't know which object that was, so click through objects until we find
  // one with Associated Shows > 0.
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });

  for (let i = 0; i < 5; i++) {
    await page.locator('.x-grid-card__title a').nth(i).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const showsLink = page.locator('a:has-text("Associated Shows")');
    const showsText = await showsLink.textContent().catch(() => '(0)');
    if (!showsText.includes('(0)')) {
      foundWithShows = true;
      break;
    }
    // Go back and try next object
    await goToObjects(page);
    await page.waitForTimeout(500);
  }

  expect(foundWithShows, 'No object found with associated shows in first 5 grid cards').toBeTruthy();

  await page.getByRole('link', { name: 'Associated Shows' }).click();
  await page.waitForLoadState('networkidle');
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
