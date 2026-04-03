const { test, expect } = require('@playwright/test');
const { login, goToArtists } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4291: [TC-05-PROD] Shows', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the system (Premium/Basic)
   // 2. User is on Artist -> Shows tab in LHM
   // 3. Shows List contains Show(s)
  

  await login(page);

  // Expected Result: 1. All Shows related to the Artist are present in the List
  // Step: Observe the List of Shows

  await goToArtists(page);
  // Search for an artist that has associated shows
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Warren Neidich');
  await page.waitForTimeout(1500);
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
