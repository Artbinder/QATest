const { test, expect } = require('@playwright/test');
const { login, goToContacts } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4247: [TC-05-PROD] Contact Info - Associated Forms', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. User added the Contact to an Invoice as Ship to or Bill To
   // 3. There's no Consignments and Loans associated with this contact
   // 4. User is on Contact Info page any Contact
  
  await login(page);

  // Expected Result: 1. The invoice list page associated with this contact is opened
  // Step: Click on "Invoices" button in "Associated Forms" tab of LHM

  await goToContacts(page);
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Maxwell Adams');
  await page.waitForTimeout(1000);
  await page.locator('.x-grid-card a[href*="/contacts/"]').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.waitForURL('**/invoices');
});
