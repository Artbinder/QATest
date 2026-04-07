const { test, expect } = require('@playwright/test');
const { login, goToObjects, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4344: [TC05-PROD] Set Info - Managing', async ({ page }) => {
  await login(page);
  await goToObjects(page);

  // Search for Swinging Cardinal with retry
  const found = await searchWithRetry(page, 'Swinging Cardinal');
  expect(found, 'Could not find "Swinging Cardinal" in search results').toBeTruthy();

  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Navigate to Edition Sets tab
  await page.getByRole('link', { name: 'Edition Sets' }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Click on the first edition set
  await page.locator('.x-row-card a, .x-row-card__title').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-row-card a, .x-row-card__title').first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Click Manage Set
  const manageBtn = page.locator('text=Manage Set').first();
  await manageBtn.waitFor({ state: 'visible', timeout: 10000 });
  await manageBtn.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Verify we're on the Manage Set page
  await expect(page.locator('text=Step 1')).toBeVisible({ timeout: 10000 });
});
