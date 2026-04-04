const { test, expect } = require('@playwright/test');
const { login, goToObjects, waitForModal } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4170: [TC-05-PROD] Exported Multi-Column PDF according to Template from Objects Landing', async ({ page }) => {
  test.setTimeout(120000);

  await login(page);
  await goToObjects(page);

  // Select the first object
  await page.locator('.x-grid-card label').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.x-grid-card label').first().click();
  await page.waitForTimeout(500);

  // Click Create Report
  await page.locator('text=Create Report').first().click();
  await page.waitForTimeout(2000);

  // Wait for modal
  const modal = await waitForModal(page);

  // Select template from dropdown
  const templateSelect = modal.locator('select').first();
  if (await templateSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
    const options = await templateSelect.locator('option').allTextContents();
    const multiColumnIndex = options.findIndex(opt => opt.toLowerCase().includes('multi-column'));
    if (multiColumnIndex > 0) {
      await templateSelect.selectOption({ index: multiColumnIndex });
    } else if (options.length > 1) {
      await templateSelect.selectOption({ index: 1 });
    }
    await page.waitForTimeout(500);
  }

  // Enter report title
  const titleInput = modal.locator('input[type="text"], input[placeholder*="title" i], input[placeholder*="Report" i]').first();
  if (await titleInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await titleInput.fill('Test Report ' + Date.now());
    await page.waitForTimeout(500);
  }

  // Select PDF format
  const pdfRadio = modal.locator('input[type="radio"][value="pdf"]');
  if (await pdfRadio.isVisible({ timeout: 3000 }).catch(() => false)) {
    await pdfRadio.click();
  } else {
    await page.getByRole('radio', { name: /PDF/i }).click();
  }
  await page.waitForTimeout(500);

  // Click Export
  await modal.locator('.actions a, .actions button').filter({ hasText: /Export|Create/i }).click();
  await page.waitForTimeout(5000);

  // Close the export modal
  const closeBtn = page.locator('.modal.in, .modal[style*="display: block"]').locator('button, a').filter({ hasText: /Close/i });
  if (await closeBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await closeBtn.click();
    await page.waitForTimeout(1000);
  }
});
