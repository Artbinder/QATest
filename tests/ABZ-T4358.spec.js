const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4358: [TC09-PROD] Consignments Landing page', async ({ page }) => {
  await login(page);

  // Navigate directly to consignments page
  await page.goto('/consignments', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click on the first consignment row
  const row = page.locator('.x-row-card').first();
  await row.waitFor({ state: 'visible', timeout: 10000 });
  await row.click();
  await page.waitForTimeout(500);

  await expect(page.getByText('Delete')).toBeVisible();
});
