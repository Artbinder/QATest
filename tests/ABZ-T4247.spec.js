require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4247: [TC-05-PROD] Contact Info - Associated Forms', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. User added the Contact to an Invoice as Ship to or Bill To
   // 3. There's no Consignments and Loans associated with this contact
   // 4. User is on Contact Info page any Contact
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  // Expected Result: 1. The invoice list page associated with this contact is opened
  // Step: Click on "Invoices" button in "Associated Forms" tab of LHM

  await page.locator('.x-nav-more').filter({ hasText: 'Contacts' }).click();
  await page.getByRole('link', { name: 'Contacts', exact: true }).click();
  await page.waitForURL('**/contacts');
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Maxwell Adams');
  await page.waitForTimeout(1000);
  await page.locator('.x-grid-card a[href*="/contacts/"]').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.waitForURL('**/invoices');
});
