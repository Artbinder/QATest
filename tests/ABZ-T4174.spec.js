const { test, expect } = require('@playwright/test');
const { login, goToReportTemplates } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4174: Label Template', async ({ page }) => {
  // Login
  await login(page);

  // Navigate to Report Templates
  await goToReportTemplates(page);

  // Create new template
  await page.locator('.create-link a').click();
  await page.locator('.x-card-selectable').filter({ hasText: 'Label' }).first().click();
  await page.waitForLoadState('networkidle');

  // Fill template with test data
  await page.getByLabel('Name Your Report Template *').fill('Test Label Template');
  
  // TODO: Add fields - drag and drop not working reliably in automation

  // Save the template
  await page.locator('.x-action.x-action_save').scrollIntoViewIfNeeded();
  await page.locator('.x-action.x-action_save').click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toContainText('Successfully created');
});
