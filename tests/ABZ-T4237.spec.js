const { test, expect } = require('@playwright/test');
const { login, goToInvoices } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4237: [TC08-PROD] Invoice Landing page', async ({ page }) => {
  // Preconditions:
  // 1. User is logged in the Premium Account
   // 2. User is on Invoices Landing page
  
  await login(page);

  await goToInvoices(page);
  await expect(page).toHaveURL(/\/invoices/);
});
