const { test, expect } = require('@playwright/test');
const { login, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4296: [TC-09-PROD] Exported Single DOC according to Template from Edition Set Info', async ({ page }) => {
  test.setTimeout(120000);

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

  // Select all edition sets from the list (not individual editions)
  await page.getByText('Select All', { exact: true }).click();
  await page.waitForTimeout(500);

  // Create Report from the edition sets
  await page.locator('text=Create Report').first().click();
  await page.waitForTimeout(1000);
  await page.getByPlaceholder('Enter Report Title').fill('Test Report');
  const templateSelect = page.locator('select').first();
  if (await templateSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
    await templateSelect.selectOption({ index: 1 });
  }
  await page.getByRole('radio', { name: 'DOC' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Export' }).click();
  await page.waitForTimeout(5000);
  await page.locator('text=Close').click();
  await page.waitForTimeout(500);
});
