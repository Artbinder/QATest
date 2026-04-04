const { test, expect } = require('@playwright/test');
const { login, goToArtists, waitForModal } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4169: [TC-04-PROD] Objects Premium', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
  // 2. User is on Artist -> Object tab
  // 3. Artist contains Object(s) and Editions

  await login(page);

  // Navigate to Artists page
  await goToArtists(page);

  // Wait for artists to load and click on first artist
  await page.locator('.x-grid-card__title_name a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card__title_name a').first().click();
  await page.waitForURL('**/artists/**');

  // Navigate to Objects tab from sidebar
  await page.locator('.sidebar a[href*="/objects"]').click();
  await page.waitForTimeout(1000);

  // Select an Object
  await page.locator('.x-grid-card label').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card label').first().click();
  await page.waitForTimeout(1000);

  // Try to select a second object if available
  const objectCount = await page.locator('.x-grid-card label').count();
  if (objectCount > 1) {
    await page.locator('.x-grid-card label').nth(1).click();
    await page.waitForTimeout(500);
  }

  // Verify LHM action options are visible
  await expect(page.locator('text=Add To Show').first()).toBeVisible();
  await expect(page.locator('text=Add to List').first()).toBeVisible();
  await expect(page.locator('text=Create Form').first()).toBeVisible();
  await expect(page.locator('text=Create Transaction').first()).toBeVisible();

  // Test Add to List functionality
  await page.locator('text=Add to List').first().click();
  await page.waitForTimeout(2000);

  // Wait for modal
  const modal = await waitForModal(page);

  // Click the label to select a list
  const listItemLabel = modal.locator('label:has(.x-grid-card__label__text)').first();
  if (await listItemLabel.isVisible({ timeout: 5000 }).catch(() => false)) {
    await listItemLabel.click({ force: true });
    await page.waitForTimeout(500);
    await modal.locator('a').filter({ hasText: 'Add' }).click();
    await page.waitForTimeout(1000);
  } else {
    // No lists available — close modal
    await modal.locator('a').filter({ hasText: /Cancel|Close/i }).first().click();
    await page.waitForTimeout(500);
  }
});
