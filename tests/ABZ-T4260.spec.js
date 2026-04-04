const { test, expect } = require('@playwright/test');
const { login, goToShows } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4260: [TC-05-PROD] LHM of Associated Objects in Basic account', async ({ page }) => {
  await login(page);
  await goToShows(page);

  // Search for a show with associated objects
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('The Works');
  await page.waitForTimeout(1500);
  await page.locator('.x-grid-card .x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card .x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  // Select an object checkbox
  await page.locator('.x-grid-card label').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card label').first().click();
  await page.waitForTimeout(1000);

  // Publish -> No
  await page.locator('a:has-text("Publish")').first().click();
  await page.locator('.modal.in a:has-text("No")').click();
  await page.waitForTimeout(500);

  // Publish -> Yes
  await page.locator('a:has-text("Publish")').first().click();
  await page.locator('.modal.in a:has-text("Yes")').click();
  await page.waitForTimeout(1000);

  // Unpublish -> No
  await page.locator('a:has-text("Unpublish")').first().click();
  await page.locator('.modal.in a:has-text("No")').click();
  await page.waitForTimeout(500);

  // Unpublish -> Yes
  await page.locator('a:has-text("Unpublish")').first().click();
  await page.locator('.modal.in a:has-text("Yes")').click();
  await page.waitForTimeout(1000);
});
