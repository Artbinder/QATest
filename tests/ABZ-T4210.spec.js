const { test, expect } = require('@playwright/test');
const { login, goToObjects, uploadFile } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4284: [TC-02-PROD] Object creation from Objects Landing page', async ({ page }) => {
  // Login
  await login(page);

  // Navigate to Objects Landing Page
  await goToObjects(page);

  // Click on "Create New Object" button in LHM
  await page.getByRole('link', { name: 'Create New Object' }).click();
  await page.waitForURL('**/objects/new');
  
  // Fill in all necessary fields and click "Save" button
  await page.getByLabel('Artist Name').fill('First Artist');
  await page.waitForTimeout(1000);
  
  // If "First Artist" doesn't exist in typeahead, click "here" to create inline
  const typeaheadItem = page.locator('.typeahead-result-item').first();
  if (await typeaheadItem.isVisible({ timeout: 2000 }).catch(() => false)) {
    await typeaheadItem.click();
  } else {
    await page.locator('a:has-text("here")').click();
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('Add First Name').fill('First');
    await page.getByPlaceholder('Add Last Name').fill('Artist');
    await page.getByText('Add', { exact: true }).click();
    await page.waitForTimeout(2000);
  }
  await page.waitForTimeout(2000);
  await page.getByLabel('Work Title').fill('Test Object');
  await page.getByRole('button', { name: 'Save' }).click();

   // Upload image file
  await uploadFile(page, 'Files/256x256bb.jpg');
});
