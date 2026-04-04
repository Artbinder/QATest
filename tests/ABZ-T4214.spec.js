const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4214: [TC-05-PROD] LHM of Associated Objects in Basic account', { timeout: 120000 }, async ({ page }) => {
  await login(page);

  await page.goto('/lists', { waitUntil: 'networkidle' });

  // Click on the first list
  const listLink = page.locator('.x-grid-card__title a, .test-list-name').first();
  await listLink.waitFor({ state: 'visible', timeout: 10000 });
  await listLink.click();
  await page.waitForTimeout(3000);

  // Add objects to the list first
  await page.getByText('Add Objects').click();
  await page.waitForTimeout(2000);
  const modal = page.locator('.modal.in, .modal[style*="display: block"]').first();
  await modal.waitFor({ state: 'visible', timeout: 10000 });
  await modal.locator('.x-grid-card').first().waitFor({ state: 'visible', timeout: 10000 });
  await modal.locator('.x-grid-card').first().click();
  await modal.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(3000);

  // Select the first object checkbox
  await page.locator('.x-grid-card label').first().click();
  await page.waitForTimeout(2000);

  // Click Publish -> No
  await page.getByText('Publish').first().click();
  await page.getByText('No', { exact: true }).click();
  await page.waitForTimeout(1000);

  // Click Publish -> Yes
  await page.getByText('Publish').first().click();
  await page.getByText('Yes', { exact: true }).click();

  // Wait for processing modal
  const processingText = page.locator('text=Please wait while your updates are being processed');
  if (await processingText.isVisible({ timeout: 10000 }).catch(() => false)) {
    await processingText.waitFor({ state: 'hidden', timeout: 60000 });
  }
  await page.waitForTimeout(1000);

  // Click Unpublish -> No
  await page.getByText('Unpublish').first().click();
  await page.getByText('No', { exact: true }).click();
  await page.waitForTimeout(1000);

  // Click Unpublish -> Yes
  await page.getByText('Unpublish').first().click();
  await page.getByText('Yes', { exact: true }).click();
  await page.waitForTimeout(1000);
});
