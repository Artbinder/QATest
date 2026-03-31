require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4295: Artists Landing', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page).not.toHaveURL(/sign_in/);

  // Navigate to Artists
  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.locator('.x-nav-more').getByRole('link', { name: 'Artists' }).click();
  await page.waitForTimeout(2000);

  // Switch to List View
  await page.locator('.x-switch.x-switch_list').click();
  await page.waitForLoadState('networkidle');

  // Switch back to Grid View
  await page.locator('.x-switch.x-switch_grid').click();
  await page.waitForLoadState('networkidle');

  // Test Publish/Unpublish using icons on first Artist card
  const artistCard = page.locator('.x-grid-card').first();
  await artistCard.hover();
  await artistCard.locator('.x-grid-card__actions .x-grid-card__action').first().click({ force: true });
  await page.waitForTimeout(1000);
  await page.keyboard.press('Escape');
  await artistCard.hover();
  await artistCard.locator('.x-grid-card__actions .x-grid-card__action').first().click({ force: true });
  await page.waitForTimeout(1000);
  await page.keyboard.press('Escape');
  
  // Test Add to HomeScreen/Remove from HomeScreen using icons on Artist card
  await artistCard.hover();
  await artistCard.locator('.x-grid-card__actions .x-grid-card__action').nth(1).click({ force: true });
  await page.waitForTimeout(1000);
  await page.keyboard.press('Escape');
  await artistCard.hover();
  await artistCard.locator('.x-grid-card__actions .x-grid-card__action').nth(1).click({ force: true });
  await page.waitForTimeout(1000);
  await page.keyboard.press('Escape');

  // Select an Artist by clicking checkbox
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await artistCard.locator('.css-checkbox').evaluate(el => el.click());
  await page.waitForLoadState('networkidle');

  // Test Publish/Unpublish using LHM (Left Hand Menu)
  await page.locator('text=Publish').first().click();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  await page.locator('text=Unpublish').first().click();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Test Add to HomeScreen/Remove from HomeScreen using LHM
  await page.locator('text=Add to Home Screen').click();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  await page.locator('text=Remove from Home Screen').click();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Click Delete button on LHM
  await page.locator('text=Delete').first().click();
  await page.waitForTimeout(2000);
});
