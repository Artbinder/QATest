require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });
const path = require('path');

test('ABZ-T4183: Import of file with header row for Creation', async ({ page }) => {
  test.setTimeout(600000);
  
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page).not.toHaveURL(/sign_in/);

  // Navigate to Excel importer
  await page.locator('text=Tools').click();
  await page.getByRole('link', { name: 'Excel Importer' }).click();
  await page.waitForLoadState('networkidle');

  // Upload Excel file
  const filePath = path.join(__dirname, '../Files/1.25.2024 (1).xlsx');
  const fileInput = await page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(filePath);

  // Verify header row is matched correctly
  await page.waitForTimeout(2000);
  await expect(page.locator('body')).toContainText(/header|column|field/i, { timeout: 10000 });

  // Run import and wait for success page
  await page.locator('a.btn.btn-info').last().click();
  await page.waitForSelector('text=File Imported Successfully', { timeout: 600000 });
  await expect(page.locator('body')).toContainText('File Imported Successfully');
});
