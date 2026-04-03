const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4343: [TC05-PROD] Set Info - Deleting', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic/Premium Account
   // 2. User has created set with several Editions
   // 3. User is on Set Info Page
  

  await login(page);

  // Expected Result: 1. Confirmation message appears
   // 2. Set deleted upon confirmation
  // Step: 1. Try to Delete a set Using Delete button

  await goToObjects(page);
  await page.locator('.typeahead__container input').first().fill('Swinging Cardinal');
  await page.waitForTimeout(1500);
  await page.getByText('Swinging Cardinal').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Edition Sets' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.x-row-card__checkbox').first().click();
  await page.waitForTimeout(1000);

  await page.locator('.sidebar, .left-hand-menu, .x-left-menu').getByText('Delete').click();
  await page.locator('a:has-text("Yes"), button:has-text("Yes")').click();
  await page.waitForTimeout(1000);
});
