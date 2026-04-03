const { test, expect } = require('@playwright/test');
const { login, goToContacts, clickFirstGridCard, deleteCurrentRecord } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4246: [TC-07-PROD] Contact Info - Delete', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. User on the contacts landing page
   // 3. There are at least one contacts
  
  await login(page);

  await goToContacts(page);
  await clickFirstGridCard(page);

  await deleteCurrentRecord(page);
  await expect(page).toHaveURL(/\/contacts$/);
});
