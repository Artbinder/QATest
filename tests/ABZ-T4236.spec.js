const { test, expect } = require('@playwright/test');
const { login, goToForms } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4236: [TC07-PROD] Forms Landing page', async ({ page }) => {
  // Preconditions:
  // 1. User is logged in the Premium Account
   // 2. User is on Forms Landing page
  
  await login(page);

  await goToForms(page);
  await expect(page).toHaveURL(/\/forms/);
});
