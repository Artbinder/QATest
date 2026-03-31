require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4182: Imported data verification', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('networkidle');

  // Search for 'White Noise' object
  const searchInput = page.locator('.x-global-search input[type="search"]').first();
  await searchInput.evaluate(el => el.removeAttribute('readonly'));
  await searchInput.click();
  await searchInput.fill('White Noise');
  await page.waitForTimeout(2000);
  await searchInput.press('ArrowDown');
  await searchInput.press('Enter');
  await page.waitForLoadState('networkidle');
  
  // Verify object info page loaded
  await expect(page).toHaveURL(/objects\/.*\/info/);
});
