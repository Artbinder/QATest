const { test, expect } = require('@playwright/test');
const { login, goToLists } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4213: [TC-04-PROD] List info Page', async ({ page }) => {
  await login(page);
  await goToLists(page);

  // Click on the first list
  const listLink = page.locator('.x-grid-card__title a, .test-list-name').first();
  await listLink.waitFor({ state: 'visible', timeout: 10000 });
  await listLink.click();
  await page.waitForTimeout(2000);

  // Add first object
  await page.getByText('Add Objects').click();
  await page.waitForTimeout(2000);
  const modal = page.locator('.modal.in, .modal[style*="display: block"]').first();
  await modal.waitFor({ state: 'visible', timeout: 10000 });
  await modal.locator('.x-grid-card').first().waitFor({ state: 'visible', timeout: 10000 });
  await modal.locator('.x-grid-card').first().click();
  await modal.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);

  // Add second object
  await page.getByText('Add Objects').click();
  await page.waitForTimeout(2000);
  const modal2 = page.locator('.modal.in, .modal[style*="display: block"]').first();
  await modal2.waitFor({ state: 'visible', timeout: 10000 });
  const secondCard = modal2.locator('.x-grid-card').nth(1);
  if (await secondCard.isVisible({ timeout: 5000 }).catch(() => false)) {
    await secondCard.click();
  } else {
    await modal2.locator('.x-grid-card').first().click();
  }
  await modal2.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);

  // Save the list page
  await page.getByRole('button', { name: 'Save' }).first().click();
  await page.waitForTimeout(1000);
});
