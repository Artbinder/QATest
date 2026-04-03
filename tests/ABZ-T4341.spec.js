const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4341: [TC08-PROD] Master Deleting', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic/Premium Account
   // 2. User is on Master info page
   // 3. Master Contains Several Sets with Editions
  

  await login(page);

  await page.goto('/objects', { waitUntil: 'networkidle' });
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Georgica Association Wainscott, December 2013');
  await page.waitForTimeout(1000);
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.locator('a:has-text("Delete")').click();
  await page.locator('.x-confirmation-modal__btn_cancel').click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/objects\/.*\/info$/);
});
