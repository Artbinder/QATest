const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4357: [TC10-PROD] Loans Landing page', async ({ page }) => {
  await login(page);

  await page.goto('/loans', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check if any loans exist
  const hasLoans = await page.locator('a.x-row-card__title.x-row-card__title_straight').first().isVisible({ timeout: 3000 }).catch(() => false);

  if (!hasLoans) {
    // Create a loan using the "Create New Loan" link on the page
    await page.locator('text=Create New Loan').first().click();
    await page.waitForTimeout(2000);

    // A "Customize Form" dialog appears — click Create to accept defaults
    const dialog = page.getByRole('dialog');
    if (await dialog.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dialog.locator('text=Create').click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }
  } else {
    // Click on the first loan
    await page.locator('a.x-row-card__title.x-row-card__title_straight').first().click();
    await page.waitForTimeout(2000);
  }

  // Dismiss any modal that appears (e.g. "Add Objects" prompt)
  const cancelBtn = page.locator('.modal-dialog a:has-text("Cancel")').first();
  if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cancelBtn.click();
    await page.waitForTimeout(1000);
  }

  // Click Add Objects
  await page.locator('text=Add Objects').first().click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('dialog')).toBeVisible();
});
