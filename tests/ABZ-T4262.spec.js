const { test, expect } = require('@playwright/test');
const { login, goToShows, searchWithRetry } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4262: [TC-04-PROD] Show info page', async ({ page }) => {
  await login(page);
  await goToShows(page);

  // Search for a show with associated objects
  const found = await searchWithRetry(page, 'The Works');
  expect(found, 'Could not find "The Works" in search results').toBeTruthy();
  await page.locator('.x-grid-card .x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card .x-grid-card__title a').first().click();
  await page.waitForTimeout(2000);

  // Try to dissociate an object — click No to cancel
  const dissociateLink = page.locator('a.dissociate.tooltipy').first();
  if (await dissociateLink.isVisible({ timeout: 5000 }).catch(() => false)) {
    await dissociateLink.click({ force: true });
    await page.waitForTimeout(500);
    await page.getByText('No', { exact: true }).click();
    await page.waitForTimeout(500);
  }

  // Add another object
  await page.locator('a.modal-opener-link').filter({ hasText: 'Add Objects' }).click();
  await page.waitForTimeout(2000);
  const modal = page.locator('.modal.in, .modal[style*="display: block"]').first();
  await modal.waitFor({ state: 'visible', timeout: 10000 });
  await modal.locator('.x-grid-card').first().waitFor({ state: 'visible', timeout: 10000 });
  await modal.locator('.x-grid-card img').first().click();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.waitForTimeout(1000);

  // Save the show page
  await page.getByRole('button', { name: 'Save' }).first().click();
  await page.waitForTimeout(1000);
});
