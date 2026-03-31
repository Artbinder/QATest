require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4273: [TC-14-PROD] Objects Landing', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the system (Basic/Premium)
   // 2. User is on Objects Landing page
   // 3. Landing page contains Object(s)
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Objects', exact: true }).click();
  await page.waitForURL('**/objects');

  await expect(page.locator('.x-grid-card').first()).toBeVisible();

  await page.locator('.x-switch_grid').click();
  await page.waitForTimeout(500);
});
