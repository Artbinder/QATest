require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4326: [TC-10-PROD] All objects (unique, editioned, master) added to a transaction are added to generated invoice', async ({ page }) => {
  // Preconditions:
  // 1. User's logged in to Premium organization and has Sale Transaction
      // Info page opened.
   // 2. At least three unique, three master and three editioned objects are
      // added to transaction.
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.locator('text=Transactions').click();
  await page.getByRole('link', { name: 'Sales' }).click();
  await page.waitForURL('**/sales');
  await page.locator('a.overflow-ellipsis').first().click();
  await page.waitForTimeout(1000);

  await page.getByText('Generate New Invoice').click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('dialog')).toBeVisible();
});
