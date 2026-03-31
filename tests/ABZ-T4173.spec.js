require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4173: Multi-column Template', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page).not.toHaveURL(/sign_in/);

  // Navigate to Report Templates
  await page.locator('.x-nav-more').filter({ hasText: 'Reports' }).click();
  await page.getByRole('link', { name: 'Report Templates' }).click();
  await page.locator('.create-link a').waitFor({ state: 'visible' });

  // Create new template
  await page.locator('.create-link a').click();
  await page.locator('.x-card-selectable').filter({ hasText: 'Multi-Column' }).first().click();
  await page.locator('.x-card-selectable').filter({ hasText: '3 Columns' }).first().click();
  await page.waitForLoadState('networkidle');

  // Fill template with test data
  await page.getByLabel('Name Your Report Template *').fill('Test Multi-Column Template');
  await page.getByLabel('Include Letterhead').check();
  
  // Add fields
  await page.locator('text=Expand Fields to Add/Edit').first().click();
  await page.waitForTimeout(1000);
  
  // Drag Title field using HTML5 drag and drop
  const titleField = page.locator('.drag-area__field').filter({ hasText: 'Title' }).first();
  const dropZone = page.locator('.drag-area-dropzone').first();
  
  await titleField.dragTo(dropZone);
  await page.waitForTimeout(500);
  
  // Drag Artist Name field using HTML5 drag and drop
  const artistField = page.locator('.drag-area__field').filter({ hasText: 'Artist Name' }).first();
  
  await artistField.dragTo(dropZone);

  // Save the template
  await page.locator('.x-action.x-action_save').scrollIntoViewIfNeeded();
  await page.locator('.x-action.x-action_save').click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toContainText('Successfully created');
});