const { test, expect } = require('@playwright/test');
const { login, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4238: [TC05-PROD] Edition Sets page - Forms creation', async ({ page }) => {
  await login(page);

  await page.goto('/objects', { waitUntil: 'networkidle' });
  const found = await searchWithRetry(page, 'Swinging Cardinal');
  expect(found, 'Could not find "Swinging Cardinal" in search results').toBeTruthy();

  // Click on the Swinging Cardinal object
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Navigate to Edition Sets tab
  await page.getByRole('link', { name: 'Edition Sets' }).click();
  await page.waitForLoadState('networkidle');

  // Select all edition sets
  await page.getByText('Select All', { exact: true }).click();
  await page.waitForTimeout(500);

  // Click Create Form in the LHM
  await page.locator('text=Create Form').click();
  await page.waitForTimeout(1000);
  await page.getByRole('radio', { name: 'Invoice' }).click();
  await page.locator('text=Next').click();
  await page.waitForTimeout(1000);
  await page.getByText('Create', { exact: true }).click();
  await page.waitForLoadState('networkidle');
});
