const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4355: [TC12-PROD] Consignment/Loan Details page', async ({ page }) => {
  await login(page);

  // Navigate directly to consignments page
  await page.goto('/consignments', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click on the first consignment
  const consignmentLink = page.locator('a.x-row-card__title.x-row-card__title_straight').first();
  await consignmentLink.waitFor({ state: 'visible', timeout: 10000 });
  await consignmentLink.click();
  await page.waitForTimeout(1000);

  // Dismiss modal if it appears
  const cancelBtn = page.locator('.modal-dialog a:has-text("Cancel")').first();
  if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cancelBtn.click();
    await page.waitForTimeout(1000);
  }

  // Click Add Objects
  await page.getByText('Add Objects').click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('dialog')).toBeVisible();
});
