const { test, expect } = require('@playwright/test');
const { login, goToObjects, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4343: [TC05-PROD] Set Info - Deleting', async ({ page }) => {
  await login(page);
  await goToObjects(page);

  // Search for Swinging Cardinal
  const found = await searchWithRetry(page, 'Swinging Cardinal');
  expect(found, 'Could not find "Swinging Cardinal" in search results').toBeTruthy();
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Navigate to Edition Sets tab
  await page.getByRole('link', { name: 'Edition Sets' }).click();
  await page.waitForTimeout(1000);

  // Select the first edition set checkbox
  await page.locator('.x-row-card__checkbox').first().click();
  await page.waitForTimeout(1000);

  // Click Delete in the sidebar/LHM
  await page.locator('.sidebar, .left-hand-menu, .x-left-menu').getByText('Delete').click();
  await page.locator('a:has-text("Yes"), button:has-text("Yes")').click();
  await page.waitForTimeout(1000);
});
