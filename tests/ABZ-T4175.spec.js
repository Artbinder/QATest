require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4175: Search for Basic and Premium users', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('networkidle');

  // Try to search Artist
  await page.getByRole('searchbox', { name: 'Search…' }).fill('Charles Gaines');
  await page.waitForTimeout(1000);
  await page.getByRole('searchbox', { name: 'Search…' }).press('ArrowDown');
  await page.getByRole('searchbox', { name: 'Search…' }).press('Enter');
  await page.waitForLoadState('networkidle');
  
  // Try to search Object
  await page.getByRole('searchbox', { name: 'Search…' }).fill('Landscape Assorted Trees With Regression #6');
  await page.waitForTimeout(1000);
  await page.getByRole('searchbox', { name: 'Search…' }).press('ArrowDown');
  await page.getByRole('searchbox', { name: 'Search…' }).press('Enter');
  await page.waitForLoadState('networkidle');
  
  // Try to search Show
  await page.getByRole('searchbox', { name: 'Search…' }).fill('Van Gogh');
  await page.waitForTimeout(1000);
  await page.getByRole('searchbox', { name: 'Search…' }).press('ArrowDown');
  await page.getByRole('searchbox', { name: 'Search…' }).press('Enter');
  await page.waitForLoadState('networkidle');
  
  // Try to search List
  await page.getByRole('searchbox', { name: 'Search…' }).fill('Big Ol List');
  await page.waitForTimeout(1000);
  await page.getByRole('searchbox', { name: 'Search…' }).press('ArrowDown');
  await page.getByRole('searchbox', { name: 'Search…' }).press('Enter');
  await page.waitForLoadState('networkidle');
});
