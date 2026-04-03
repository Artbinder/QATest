const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4296: [TC-09-PROD] Exported Single DOC according to Template from Edition Set Info', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User has Permissions to Edit Report Templates
   // 3. User created Multi-Column, Single, Label
   // 4. Export Reports permissions is granted
   // 5. User is on Edition Set Info page
   // 6. Set has several Editions
   // 7. User selected 2 Editions
  

  test.setTimeout(120000);
  
  await login(page);

  await page.goto('/objects', { waitUntil: 'networkidle' });
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Swinging Cardinal');
  await page.waitForTimeout(1000);

  // Click on the Swinging Cardinal object to enter its details
  await page.locator('.x-grid-card a[href*="/objects/"][href*="/info"]').first().click({ timeout: 10000 });
  await page.waitForTimeout(2000);

     // Navigate to Edition Sets tab
  await page.getByRole('link', { name: 'Edition Sets' }).click();
  await page.waitForLoadState('networkidle');

  await page.locator('.x-row-card__title').first().click();
  await page.waitForTimeout(500);

  // Select all edition sets
  await page.getByText('Select All', { exact: true }).click();
  await page.waitForTimeout(500);


  await page.locator('text=Create Report').first().click();
  await page.waitForTimeout(1000);
  await page.getByPlaceholder('Enter Report Title').fill('Test Report');
  await page.locator('select').first().selectOption({ index: 1 });
  await page.getByRole('radio', { name: 'DOC' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Export' }).click();
  await page.waitForTimeout(5000);
  await page.locator('text=Close').click();
  await page.waitForTimeout(500);
  
});
