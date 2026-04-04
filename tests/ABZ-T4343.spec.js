const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4343: [TC05-PROD] Set Info - Deleting', async ({ page }) => {
  await login(page);
  await goToObjects(page);

  // Search for Swinging Cardinal
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Swinging Cardinal');
  await page.waitForTimeout(1500);
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
