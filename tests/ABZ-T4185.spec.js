const { test, expect } = require('@playwright/test');
const { login, goToShows } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4204: [TC-03-PROD] Show creation', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Basic/Premium Account
  // 2. User is on Shows Landing Page
  
  await login(page);

  // Step: Click on "Create New Show" button
  // Expected Result: 1. "Create New Show" modal window is displayed
  // 2. There are fields:
  //       o Title
  //       o Start Date
  //       o End Date

  await goToShows(page);

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
