const { test, expect } = require('@playwright/test');
const { login, goToShows, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4263: [TC-02-PROD] Shows Landing Page - LHM', async ({ page }) => {
  await login(page);
  await goToShows(page);

  // Search for "The Works" to get a specific show, not the empty test show
  const found = await searchWithRetry(page, 'The Works');
  expect(found, 'Could not find "The Works" show').toBeTruthy();
  await page.locator('.x-grid-card label').first().click();
  await page.waitForLoadState('networkidle');

  // Publish -> No
  await page.locator('text=Publish').first().click();
  await page.waitForTimeout(500);
  const modal = page.locator('.modal.in, .modal[style*="display: block"]').first();
  if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
    await modal.locator('a:has-text("No"), button:has-text("No")').first().click();
    await page.waitForTimeout(500);
  } else {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // Publish -> Yes
  await page.locator('text=Publish').first().click();
  await page.waitForTimeout(500);
  const modal2 = page.locator('.modal.in, .modal[style*="display: block"]').first();
  if (await modal2.isVisible({ timeout: 3000 }).catch(() => false)) {
    await modal2.locator('a:has-text("Yes"), button:has-text("Yes")').first().click();
  } else {
    await page.keyboard.press('Enter');
  }
  await page.waitForTimeout(1000);

  // Unpublish -> No
  await page.locator('text=Unpublish').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('text=Unpublish').first().click();
  await page.waitForTimeout(500);
  const modal3 = page.locator('.modal.in, .modal[style*="display: block"]').first();
  if (await modal3.isVisible({ timeout: 3000 }).catch(() => false)) {
    await modal3.locator('a:has-text("No"), button:has-text("No")').first().click();
    await page.waitForTimeout(500);
  } else {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // Unpublish -> Yes
  await page.locator('text=Unpublish').first().click();
  await page.waitForTimeout(500);
  const modal4 = page.locator('.modal.in, .modal[style*="display: block"]').first();
  if (await modal4.isVisible({ timeout: 3000 }).catch(() => false)) {
    await modal4.locator('a:has-text("Yes"), button:has-text("Yes")').first().click();
  } else {
    await page.keyboard.press('Enter');
  }
  await page.waitForTimeout(1000);

  // Add to Home Screen -> No
  await page.locator('text=Add to Home Screen').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('text=Add to Home Screen').click();
  await page.waitForTimeout(500);
  const modal5 = page.locator('.modal.in, .modal[style*="display: block"]').first();
  if (await modal5.isVisible({ timeout: 3000 }).catch(() => false)) {
    await modal5.locator('a:has-text("No"), button:has-text("No")').first().click();
    await page.waitForTimeout(500);
  } else {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // Add to Home Screen -> Yes
  await page.locator('text=Add to Home Screen').click();
  await page.waitForTimeout(500);
  const modal6 = page.locator('.modal.in, .modal[style*="display: block"]').first();
  if (await modal6.isVisible({ timeout: 3000 }).catch(() => false)) {
    await modal6.locator('a:has-text("Yes"), button:has-text("Yes")').first().click();
  } else {
    await page.keyboard.press('Enter');
  }
  await page.waitForTimeout(1000);

  // Remove from Home Screen -> No
  await page.locator('text=Remove from Home Screen').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('text=Remove from Home Screen').click();
  await page.waitForTimeout(500);
  const modal7 = page.locator('.modal.in, .modal[style*="display: block"]').first();
  if (await modal7.isVisible({ timeout: 3000 }).catch(() => false)) {
    await modal7.locator('a:has-text("No"), button:has-text("No")').first().click();
    await page.waitForTimeout(500);
  } else {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // Remove from Home Screen -> Yes
  await page.locator('text=Remove from Home Screen').click();
  await page.waitForTimeout(500);
  const modal8 = page.locator('.modal.in, .modal[style*="display: block"]').first();
  if (await modal8.isVisible({ timeout: 3000 }).catch(() => false)) {
    await modal8.locator('a:has-text("Yes"), button:has-text("Yes")').first().click();
  } else {
    await page.keyboard.press('Enter');
  }
  await page.waitForTimeout(500);
});
