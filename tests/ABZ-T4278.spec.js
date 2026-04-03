const { test, expect } = require('@playwright/test');
const { login, goToObjects, clickFirstGridCard, uploadFile } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4278: [TC-08-PROD] Supporting Docs and Notes', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Basic or Premium Account
   // 2. User is on Object Info -> Supporting Docs
   // 3. After Docs user is on Object Info -> Notes
  
  await login(page);
  await goToObjects(page);
  await clickFirstGridCard(page);

  await page.getByRole('link', { name: 'Supporting Docs' }).click();
  await page.waitForTimeout(1000);

  await uploadFile(page, 'Files/bartleby.pdf');

  await page.getByRole('link', { name: 'Notes' }).click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/notes/);
});
