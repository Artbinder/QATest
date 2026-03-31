require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4262: [TC-04-PROD] Show info page', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the system
   // 2. There is at least one Show, Artist
   // 3. There are at least two Object
   // 4. User on Show Info page
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  // Expected Result: 1. The system shows the matching name in the drop-down menu
  // Step: Enter the name of artist existing in the account in "Artist" field.

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: 'Shows', exact: true }).click();
  await page.waitForURL('**/shows');
  await page.locator('.x-grid-card .x-grid-card__title a').first().click();
  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    document.querySelector('a.dissociate.tooltipy').click();
  });
  await page.waitForTimeout(500);
  await page.getByText('No', { exact: true }).click();
  await page.waitForTimeout(500);

  // await page.evaluate(() => {
  //   document.querySelector('a.dissociate.tooltipy').click();
  // });
  // await page.waitForTimeout(500);
  // await page.getByText('Yes', { exact: true }).click();
  // await page.waitForTimeout(1000);

  await page.locator('a.modal-opener-link').filter({ hasText: 'Add Objects' }).click();
  await page.locator('.list-add-works > .x-work-list > .work-catalog > .x-grid > div:nth-child(2) > .x-grid-card__container > .x-grid-card__body > .x-grid-card__image > img').click();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Save' }).first().click();
  await page.waitForTimeout(1000);
});
