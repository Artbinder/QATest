require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4291: [TC-05-PROD] Shows', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the system (Premium/Basic)
   // 2. User is on Artist -> Shows tab in LHM
   // 3. Shows List contains Show(s)
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  // Expected Result: 1. All Shows related to the Artist are present in the List
  // Step: Observe the List of Shows

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Artists', exact: true }).click();
  await page.waitForURL('**/artists');
  await page.locator('.x-grid-card .x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Shows' }).click();
  await page.waitForTimeout(1000);
  await expect(page.locator('.x-grid-card').first()).toBeVisible();

  await page.locator('.x-grid-card').first().click();
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    document.querySelector('a.dissociate.tooltipy').click();
  });
  await page.waitForTimeout(500);
  await page.getByText('Yes', { exact: true }).click();
  await page.waitForTimeout(1000);
});
