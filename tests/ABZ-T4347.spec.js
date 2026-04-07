const { test, expect } = require('@playwright/test');
const { login, goToObjects, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4347: [TC02-PROD] Edition Creation - Set', async ({ page }) => {
  test.setTimeout(120000);
  await login(page);
  await goToObjects(page);

  // Search for Swinging Cardinal with retry
  const found = await searchWithRetry(page, 'Swinging Cardinal');
  expect(found, 'Could not find "Swinging Cardinal" in search results').toBeTruthy();

  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Navigate to Edition Sets tab
  await page.getByRole('link', { name: /Edition Sets/ }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Click "Create Edition Set"
  await page.locator('text=Create Edition Set').first().click();
  await page.waitForTimeout(2000);

  // Fill edition set details
  await page.getByPlaceholder('Add Edition Set Title').waitFor({ timeout: 10000 });
  await page.getByPlaceholder('Add Edition Set Title').fill('Test Edition Set');
  await page.waitForTimeout(1000);

  await page.waitForSelector('.x-edition-type-definition', { state: 'visible' });
  await page.locator('.x-edition-type-definition').first().locator('input[type="text"]').nth(0).fill('10');
  await page.locator('.x-edition-type-definition').first().locator('input[placeholder="1-5, 9 or leave blank for none"]').fill('1-10');

  // Click Continue then Create
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Create' }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
});
