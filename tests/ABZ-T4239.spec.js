const { test, expect } = require('@playwright/test');
const { login, goToShows } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4239: [TC03-PROD] Show Info - Forms creation', async ({ page }) => {
  test.setTimeout(90000);
  await login(page);
  await goToShows(page);

  // Search for The Works show
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('The Works');
  await page.waitForTimeout(1500);
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');

  // Select objects
  await page.locator('.x-grid-card label').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card label').first().click();
  const secondLabel = page.locator('.x-grid-card label').nth(1);
  if (await secondLabel.isVisible({ timeout: 2000 }).catch(() => false)) {
    await secondLabel.click();
  }
  await page.waitForTimeout(500);

  // Create Form -> Loan
  await page.locator('text=Create Form').first().click();
  await page.waitForTimeout(1000);
  await page.getByRole('radio', { name: 'Loan' }).click();
  await page.locator('text=Next').click();
  await page.waitForTimeout(1000);
  await page.getByText('Create', { exact: true }).click();
  await page.waitForLoadState('networkidle');
});
