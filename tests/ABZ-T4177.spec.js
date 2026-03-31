require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4177: Search for Premium users', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page).not.toHaveURL(/sign_in/);

  // Search Report Templates
  const searchInput = page.locator('.x-global-search input[type="search"]').first();
  await searchInput.evaluate(el => el.removeAttribute('readonly'));
  await searchInput.click();
  await searchInput.fill('Editions Labels');
  await page.waitForTimeout(2000);
  await searchInput.press('Enter');
  await page.waitForLoadState('networkidle');

  // Search Exported Reports
  await page.locator('.x-global-search input[type="search"]').first().evaluate(el => el.removeAttribute('readonly'));
  await page.locator('.x-global-search input[type="search"]').first().click();
  await page.locator('.x-global-search input[type="search"]').first().clear();
  await page.locator('.x-global-search input[type="search"]').first().fill('tester');
  await page.waitForTimeout(3000);

  // Search Contacts
  await page.locator('.x-global-search input[type="search"]').first().evaluate(el => el.removeAttribute('readonly'));
  await page.locator('.x-global-search input[type="search"]').first().click();
  await page.locator('.x-global-search input[type="search"]').first().clear();
  await page.locator('.x-global-search input[type="search"]').first().fill('Maxwell Adams');
  await page.waitForTimeout(2000);
  await page.locator('.x-global-search input[type="search"]').first().press('Enter');
  await page.waitForLoadState('networkidle');

  // Search Contact Groups
  await page.locator('.x-global-search input[type="search"]').first().evaluate(el => el.removeAttribute('readonly'));
  await page.locator('.x-global-search input[type="search"]').first().click();
  await page.locator('.x-global-search input[type="search"]').first().clear();
  await page.locator('.x-global-search input[type="search"]').first().fill('Ankunding LLC');
  await page.waitForTimeout(2000);
  await page.locator('.x-global-search input[type="search"]').first().press('Enter');
  await page.waitForLoadState('networkidle');
});
