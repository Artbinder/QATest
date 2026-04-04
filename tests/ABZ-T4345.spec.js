const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4345: [TC04-PROD] Set Info', async ({ page }) => {
  test.setTimeout(90000);
  await login(page);
  await goToObjects(page);

  // Search for Swinging Cardinal
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Swinging Cardinal');
  await page.waitForTimeout(1500);
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });

  // Get the object URL and navigate to its edition sets
  const objectHref = await page.locator('.x-grid-card__title a').first().getAttribute('href');
  const editionSetsUrl = objectHref.replace('/info', '/edition_sets');
  await page.goto(editionSetsUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // On the edition sets list — click the first set name to go to detail
  const setLinks = page.locator('a[href*="/edition_sets/"]').filter({ hasNotText: 'Create' });
  await setLinks.first().waitFor({ state: 'visible', timeout: 10000 });
  await setLinks.first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Verify the set info page elements
  await expect(page.locator('text=Manage Set')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('text=Save')).toBeVisible();
});
