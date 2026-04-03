const { test, expect } = require('@playwright/test');
const { login, goToContacts, deleteCurrentRecord } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4246: [TC-07-PROD] Contact Info - Delete', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into the Premium account
   // 2. User on the contacts landing page
   // 3. There are at least one contacts
  
  await login(page);
  await goToContacts(page);

  // Create a throwaway contact to delete (don't delete existing ones)
  await page.locator('text=Create New Contact').click();
  await page.waitForTimeout(1000);
  await page.locator('input[name="contact[first_name]"]').fill('Delete');
  await page.locator('input[name="contact[last_name]"]').fill('Me');
  await page.locator('.x-action.x-action_save').click();
  await page.waitForTimeout(2000);

  // Now delete the contact we just created
  await page.locator('a.x-action_delete').click();
  await page.waitForTimeout(500);
  await page.locator('text=Yes').first().click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/contacts$/);
});
