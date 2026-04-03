const { test, expect } = require('@playwright/test');
const { login, goToObjects, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4282: [TC-04-PROD] Object Status -> Availability Status', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. User is on Object Info -> Object Status -> Availability Status tab
   // 3. There is at least one contact
  
  await login(page);
  await goToObjects(page);
  await clickFirstGridCard(page);

  // Expected Result: 1. The Object has the value 'Not Specified'.
  // Step: Open a object with no information in the status lines

  await page.getByRole('link', { name: 'Object Status' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: 'Availability Status' }).click();
  await page.waitForTimeout(2000);

  await page.locator('select').first().selectOption({ index: 1 });
  await page.waitForTimeout(500);
  await page.locator('input[type="checkbox"]').filter({ visible: true }).first().click();
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Info' }).click();
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Availability:')).toBeVisible();

  await page.locator('text=Availability:').click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Reset/Clear' }).click();
  await page.waitForTimeout(500);
  await page.getByText('Yes', { exact: true }).click();
  await page.waitForTimeout(1000);
});
