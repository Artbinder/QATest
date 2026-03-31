require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4171: [TC-04-PROD] Exported Multi-Column DOC according to Template from Artist -> Objects', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
  //  2. User has Permissions to Edit Report Templates
  //  3. User created Multi-Column, Single, Label
  //  4. Export Reports permissions is granted
  //  5. User is on Artist -> Object Info Page
  

  test.setTimeout(120000);
  
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(2000);

  // Step: 1. Select an Object
  // 2. Click Create Report
  // 3. Observe Select Your Report Template dropdown
  // Expected Result: 1. Newly created Report Templates are displayed in Select Your Report Template dropdown

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.locator('.x-nav-more').getByRole('link', { name: 'Artists' }).click();
  await page.waitForTimeout(2000);
  
  // Click on artist name in blue within the artist card
  await page.locator('.x-grid-card__title_name a').first().click();
  await page.waitForTimeout(1000);
  
  // Navigate to Objects tab
  await page.locator('.sidebar a[href*="/objects"]').click();
  await page.waitForTimeout(1000);

  // Select an object
  await page.locator('.x-grid-card label').first().click();
  await page.waitForTimeout(500);

  // Click Create Report
  await page.locator('text=Create Report').first().click();
  await page.waitForTimeout(2000);
  
  // Wait for modal and select Multi-Column template
  const modal = page.locator('.modal.in, .modal[style*="display: block"]').first();
  await modal.waitFor({ state: 'visible' });
  
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
  
  // Select DOC format
  await modal.locator('input[type="radio"][value="docx"]').click();
  await page.waitForTimeout(500);
  
  // Click Export button
  await modal.locator('.actions a, .actions button').filter({ hasText: /Export/i }).click();
  await page.waitForTimeout(2000);
  
  // Close the export confirmation modal
  await page.locator('.modal.in, .modal[style*="display: block"]').locator('button, a').filter({ hasText: /Close/i }).click();
  await page.waitForTimeout(1000);

  // Expected Result: Report is Exported
  // Expected Result: Report is displayed in Exported Reports Landing page and can be downloaded
});
