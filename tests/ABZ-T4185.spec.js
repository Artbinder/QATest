require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4204: [TC-03-PROD] Show creation', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Basic/Premium Account
  // 2. User is on Shows Landing Page
  

  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForURL('https://features.artbinder.com/');

  // Step: Click on "Create New Show" button
  // Expected Result: 1. "Create New Show" modal window is displayed
  // 2. There are fields:
  //       o Title
  //       o Start Date
  //       o End Date

  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.getByRole('link', { name: 'Shows', exact: true }).first().click();
  await page.waitForURL('**/shows');

  await page.getByText('Create New Show').click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder('Title').fill('Test Show ' + Date.now());
  await page.getByRole('link', { name: 'Cancel' }).click();
  await page.waitForTimeout(500);

  await page.getByText('Create New Show').click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder('Title').fill('Test Show ' + Date.now());
  await page.getByRole('link', { name: 'Create' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/shows\/\d+/);
});
