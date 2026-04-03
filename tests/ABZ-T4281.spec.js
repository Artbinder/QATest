const { test, expect } = require('@playwright/test');
const { login, goToObjects, clickFirstGridCard } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4281: [TC-05-PROD] Object Status -> Location Status', async ({ page }) => {
  // Preconditions:
  // 1. User is logged into Premium Account
   // 2. There is at least one contact
   // 3. User is on Object Info -> Object Status -> Location Status tab
  
  await login(page);
  await goToObjects(page);
  await clickFirstGridCard(page);

  // Expected Result: 1. The Object has the value 'Not Specified'.
  // Step: Open a object with no information in the status lines

  await page.getByRole('link', { name: 'Object Status' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: 'Location Status' }).click();
  await page.waitForTimeout(2000);

  await page.waitForSelector('#loc-input', { timeout: 10000 });
  await page.locator('#loc-input').fill('Test Location');
  await page.waitForTimeout(1000);
  await page.locator('#location-contacts-input').fill('Test');
  await page.waitForTimeout(1000);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Info' }).click();
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Location:')).toBeVisible();

  await page.locator('text=Location:').click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Reset/Clear' }).click();
  await page.waitForTimeout(500);
  await page.getByText('Yes', { exact: true }).click();
  await page.waitForTimeout(1000);
});
