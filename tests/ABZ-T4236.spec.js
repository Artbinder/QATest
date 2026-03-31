require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4236: [TC07-PROD] Forms Landing page', async ({ page }) => {
  // Preconditions:
  // 1. User is logged in the Premium Account
   // 2. User is on Forms Landing page
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(1000);

  await page.goto('https://features.artbinder.com/forms');
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/forms/);
});
