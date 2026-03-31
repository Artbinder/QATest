require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4261: [TC-06-PROD] LHM of Associated Objects in Premium account', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium Account
   // 2. User on Show Info page
   // 3. Objects and Editions added to the Show
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Shows', exact: true }).click();
  await page.waitForURL('**/shows');
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForTimeout(1000);

  await page.evaluate(() => {
    document.querySelectorAll('.x-grid-card input[type="checkbox"]')[0].click();
  });
  await page.waitForTimeout(1000);

  await expect(page.locator('.sidebar')).toContainText('Add to Show');
  await expect(page.locator('.sidebar')).toContainText('Create Form');
  await expect(page.locator('.sidebar')).toContainText('Create Transaction');
  await expect(page.locator('.sidebar')).toContainText('Export');
  await expect(page.locator('.sidebar')).toContainText('Dissociate');
});
