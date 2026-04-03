const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4345: [TC04-PROD] Set Info', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic/Premium Account
   // 2. User has created set with several Editions
   // 3. User is on Set Info Page
  

  await login(page);

  // Expected Result: 1. Editions field and Editioned Objects section contain correct number
      // of editions
  // Step: 1. Observe Editions field and Editioned Objects section

  await goToObjects(page);
  await page.locator('.typeahead__container input').first().fill('Swinging Cardinal');
  await page.waitForTimeout(1500);
  await page.getByText('Swinging Cardinal').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Edition Sets' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.x-row-card__title, .x-row-card a').first().click();
  await page.waitForTimeout(1000);

  await expect(page.locator('label:has-text("Editions")')).toBeVisible();

  await page.evaluate(() => {
    document.querySelectorAll('.x-grid-card.unbookmarked input[type="checkbox"]')[0].click();
    document.querySelectorAll('.x-grid-card.unbookmarked input[type="checkbox"]')[1].click();
  });
  await page.waitForTimeout(1000);

  await page.locator('text=Update Location').first().click();
  await page.waitForTimeout(500);
  await page.locator('text=+ Create New').first().click();
  await page.waitForTimeout(500);
  await page.locator('#loc-input').fill('New Location ' + Date.now());
  await page.locator('#loc-input').press('Enter');
  await page.waitForTimeout(500);
  await page.locator('.actions').getByText('Save').click();
  await page.waitForTimeout(1000);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
});
