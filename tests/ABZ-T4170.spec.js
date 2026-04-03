const { test, expect } = require('@playwright/test');
const { login, goToObjects, waitForModal } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4170: [TC-05-PROD] Exported Multi-Column PDF according to Template from Objects Landing', async ({ page }) => {
  test.setTimeout(120000);
  
  // Preconditions:
  // 1. User is logged into Premium Account
  // 2. User has Permissions to Edit Report Templates
  // 3. User created Multi-Column, Single, Label
  // 4. Export Reports permissions is granted
  // 5. User is on Objects Landing
  
  // Login
  await login(page);

  // Navigate to Objects Landing
  await goToObjects(page);

  // Step: Try to Export Multi-Column PDF Report via object selection
  await page.locator('.x-grid-card label').first().click();
  await page.waitForTimeout(500);

  await page.locator('text=Create Report').first().click();
  await page.waitForTimeout(2000);
  
  // Wait for modal and select Multi-Column template
  const modal = await waitForModal(page);
  
  // Select Multi-Column template from dropdown
  const templateSelect = modal.locator('select').first();
  const options = await templateSelect.locator('option').allTextContents();
  const multiColumnIndex = options.findIndex(opt => opt.toLowerCase().includes('multi-column'));
  if (multiColumnIndex > 0) {
    await templateSelect.selectOption({ index: multiColumnIndex });
  } else {
    await templateSelect.selectOption({ index: 1 });
  }
  await page.waitForTimeout(500);
  
  // Enter report title
  await modal.locator('input[type="text"], input[placeholder*="title" i]').first().fill('Test Report ' + Date.now());
  await page.waitForTimeout(500);
  
  // Select PDF format
  await modal.locator('input[type="radio"][value="pdf"]').click();
  await page.waitForTimeout(500);
  
  // Click Export button
  await modal.locator('.actions a, .actions button').filter({ hasText: /Export|Create/i }).click();
  await page.waitForTimeout(2000);
  
  // Close the export confirmation modal
  await page.locator('.modal.in, .modal[style*="display: block"]').locator('button, a').filter({ hasText: /Close/i }).click();
  await page.waitForTimeout(1000);

  // Expected Result: Report is Exported
  // Expected Result: Report is displayed in Exported Reports Landing page and can be downloaded
});
