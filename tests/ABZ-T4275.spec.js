const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4275: [TC-13-PROD] Associated Consignments/Loans', async ({ page }) => {
  await login(page);
  await goToObjects(page);

  // Search for the object that has associated consignments
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Orange');
  await page.waitForTimeout(1500);
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');

  // Navigate to Associated Forms -> Consignments
  await page.getByText('Associated Forms').click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: /Consignments/ }).click();
  await page.waitForTimeout(1000);

  // Click on the first consignment
  const consignmentRow = page.locator('.x-row-card__title').first();
  await consignmentRow.waitFor({ state: 'visible', timeout: 10000 });
  await consignmentRow.click();
  await page.waitForTimeout(500);
  await expect(page.getByRole('link', { name: /Delete/ }).last()).toBeVisible();
});
