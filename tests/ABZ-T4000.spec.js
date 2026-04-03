const { test, expect } = require('@playwright/test');
const { login, goToExcelImporter, uploadFile } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4183: Import of file with header row for Creation', async ({ page }) => {
  test.setTimeout(600000);

  await login(page);
  await goToExcelImporter(page);

  // Upload Excel file
  await uploadFile(page, 'Files/1.25.2024 (1).xlsx');

  // Verify header row is matched correctly
  await expect(page.locator('body')).toContainText(/header|column|field/i, { timeout: 10000 });

  // Run import and wait for success page
  await page.locator('a.btn.btn-info').last().click();
  await page.waitForSelector('text=File Imported Successfully', { timeout: 600000 });
  await expect(page.locator('body')).toContainText('File Imported Successfully');
});
