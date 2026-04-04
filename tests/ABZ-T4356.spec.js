const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4356: [TC11-PROD] Invoice Details page', async ({ page }) => {
  await login(page);

  await page.goto('/invoices', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click on the first invoice
  const invoiceLink = page.locator('a.x-row-card__title.x-row-card__title_straight').first();
  await invoiceLink.waitFor({ state: 'visible', timeout: 10000 });
  await invoiceLink.click();
  await page.waitForTimeout(2000);

  // Dismiss modal if it appears
  const cancelBtn = page.locator('.modal-dialog a:has-text("Cancel")').first();
  if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cancelBtn.click();
    await page.waitForTimeout(1000);
  }

  // Click Add Objects
  await page.locator('a.modal-opener-link:has-text("Add Objects")').click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('dialog')).toBeVisible();
});
