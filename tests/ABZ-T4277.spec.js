const { test, expect } = require('@playwright/test');
const { login, goToObjects } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4277: [TC-10-PROD] Associated Lists', async ({ page }) => {
  await login(page);
  await goToObjects(page);

  // Click the first object
  await page.locator('.x-grid-card__title a').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');

  // Navigate to Associated Lists
  await page.getByText('Associated Lists').click();
  await page.waitForTimeout(1000);

  // Click Add to List
  await page.locator('text=Add to List').first().click();
  await page.waitForTimeout(2000);

  // Verify the modal opens with lists
  const dialog = page.getByRole('dialog');
  await dialog.waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(1000);

  // Select the list using evaluate (custom checkboxes)
  await dialog.evaluate(el => {
    const checkbox = el.querySelector('input[type="checkbox"]');
    if (checkbox) checkbox.click();
  });
  await page.waitForTimeout(500);

  // Click Add
  await dialog.locator('a').filter({ hasText: 'Add' }).click();
  await page.waitForTimeout(1000);
});
