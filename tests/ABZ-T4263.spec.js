require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4263: [TC-02-PROD] Shows Landing Page - LHM', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('networkidle');

  // Navigate to Shows Landing Page
  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.locator('.x-nav-more').getByRole('link', { name: 'Shows' }).click();
  await page.waitForLoadState('networkidle');

  // Select, by ticking the checkbox, a Show that not published
  const showCard = page.locator('.x-grid-card').first();
  await showCard.locator('.css-checkbox').evaluate(el => el.click());
  await page.waitForLoadState('networkidle');
  
  // Click on "Publish" button on LHM
  await page.locator('text=Publish').first().click();
  
  // Click on "No" button
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  // Click on "Publish" button on LHM
  await page.locator('text=Publish').first().click();
  
  // Click on "Yes" button
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  
  // Click on "Unpublish" button on LHM in the same Show
  await page.locator('text=Unpublish').first().click();
  
  // Click on "No" button
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  // Click on "Unpublish" button on LHM in the same Show
  await page.locator('text=Unpublish').first().click();
  
  // Click on "Yes" button
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  
  // Repeat 2-9 steps for "Add to Home screen"/"Remove from home screen" buttons
  await page.locator('text=Add to Home Screen').click();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  await page.locator('text=Add to Home Screen').click();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  await page.locator('text=Remove from Home Screen').click();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  await page.locator('text=Remove from Home Screen').click();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
});
