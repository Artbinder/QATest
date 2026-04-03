const { test, expect } = require('@playwright/test');
const { login, goToShows, clickFirstGridCard, uploadFile } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4257: [TC-08-PROD] Show\'s Supporting Docs - New', async ({ page }) => {
  await login(page);
  await goToShows(page);
  await clickFirstGridCard(page);

  await page.getByRole('link', { name: 'Supporting Docs' }).click();
  await page.waitForTimeout(1000);

  await uploadFile(page, 'Files/bartleby.pdf');
});
