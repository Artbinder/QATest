const { test, expect } = require('@playwright/test');
const { login, goToContacts } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4246: [TC-07-PROD] Contact Info - Delete', async ({ page }) => {
  test.setTimeout(60000);

  await login(page);
  await goToContacts(page);

  // Create a throwaway contact to delete
  await page.locator('text=Create New Contact').click();
  await page.waitForTimeout(1000);
  await page.locator('input[name="contact[first_name]"]').fill('Delete');
  await page.locator('input[name="contact[last_name]"]').fill('Me');
  await page.locator('.x-action.x-action_save').click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Delete the contact — use text selector like all other delete tests
  const deleteBtn = page.locator('a:has-text("Delete"), button:has-text("Delete")').first();
  await deleteBtn.waitFor({ state: 'visible', timeout: 10000 });
  await deleteBtn.click();
  await page.waitForTimeout(500);
  await page.getByText('Yes', { exact: true }).click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/contacts/);
});
