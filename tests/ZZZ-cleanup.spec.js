const { test, expect } = require('@playwright/test');
const { login, goToObjects, goToArtists, goToShows, goToLists, goToContacts, goToContactGroups } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

/*
 * CLEANUP SCRIPT — Runs LAST after all tests.
 * Wipes the account completely clean.
 *
 * Deletion order (respects foreign key dependencies):
 *   1. Transactions (Offers, Sales)
 *   2. Forms (Invoices, Consignments, Loans)
 *   3. Report Templates
 *   4. Lists
 *   5. Shows
 *   6. Contact Groups
 *   7. Contacts
 *   8. Objects
 *   9. Artists
 */

test.describe.serial('Cleanup: Wipe all records', () => {
  test.setTimeout(600000);

  async function selectAllAndDelete(page) {
    await page.waitForTimeout(2000);
    // Check if there are any items to delete
    const selectAllLinks = page.locator('a.x-paginated-select-all__spaced-block');
    if (!(await selectAllLinks.first().isVisible({ timeout: 3000 }).catch(() => false))) return;

    const count = await selectAllLinks.count();
    // Click "Select All" (the account-wide one, not "Select All On Page")
    if (count > 1) {
      await selectAllLinks.nth(1).click();
    } else {
      await selectAllLinks.first().click();
    }
    await page.waitForTimeout(2000);

    // Click Delete
    const deleteBtn = page.locator('text=Delete').first();
    if (!(await deleteBtn.isVisible({ timeout: 3000 }).catch(() => false))) return;
    await deleteBtn.click();
    await page.waitForTimeout(1000);

    // Confirm
    const yesBtn = page.getByText('Yes', { exact: true });
    if (await yesBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await yesBtn.click();
    }
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle').catch(() => {});
  }

  async function deleteTransactions(page, type) {
    await page.locator('.x-nav-more').filter({ hasText: 'Transactions' }).click();
    await page.locator('.x-nav-more').getByRole('link', { name: type }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await selectAllAndDelete(page);
  }

  async function deleteForms(page, path) {
    await page.goto(path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await selectAllAndDelete(page);
  }

  test('Cleanup 1: Delete all Offer transactions', async ({ page }) => {
    await login(page);
    await deleteTransactions(page, 'Offers');
  });

  test('Cleanup 2: Delete all Sale transactions', async ({ page }) => {
    await login(page);
    await deleteTransactions(page, 'Sales');
  });

  test('Cleanup 3: Delete all Invoices', async ({ page }) => {
    await login(page);
    await deleteForms(page, '/invoices');
  });

  test('Cleanup 4: Delete all Consignments', async ({ page }) => {
    await login(page);
    await deleteForms(page, '/consignments');
  });

  test('Cleanup 5: Delete all Loans', async ({ page }) => {
    await login(page);
    await deleteForms(page, '/loans');
  });

  test('Cleanup 6: Delete all Exported Reports', async ({ page }) => {
    await login(page);
    await page.locator('.x-nav-more').filter({ hasText: 'Reports' }).click();
    await page.locator('.x-nav-more').getByRole('link', { name: 'Exported Reports' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await selectAllAndDelete(page);
  });

  test('Cleanup 7: Delete all Report Templates', async ({ page }) => {
    await login(page);
    await page.locator('.x-nav-more').filter({ hasText: 'Reports' }).click();
    await page.locator('.x-nav-more').getByRole('link', { name: 'Report Templates' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await selectAllAndDelete(page);
  });

  test('Cleanup 8: Delete all Lists', async ({ page }) => {
    await login(page);
    await goToLists(page);
    await selectAllAndDelete(page);
  });

  test('Cleanup 9: Delete all Shows', async ({ page }) => {
    await login(page);
    await goToShows(page);
    await selectAllAndDelete(page);
  });

  test('Cleanup 10: Delete all Contact Groups', async ({ page }) => {
    await login(page);
    await goToContactGroups(page);
    await selectAllAndDelete(page);
  });

  test('Cleanup 11: Delete all Contacts', async ({ page }) => {
    await login(page);
    await goToContacts(page);
    await selectAllAndDelete(page);
  });

  test('Cleanup 12: Delete all Objects', async ({ page }) => {
    await login(page);
    await goToObjects(page);
    // Loop until all objects are deleted (may need multiple passes for paginated results)
    for (let i = 0; i < 5; i++) {
      await selectAllAndDelete(page);
      await page.waitForTimeout(2000);
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      const remaining = page.locator('.x-grid-card');
      if (!(await remaining.first().isVisible({ timeout: 3000 }).catch(() => false))) break;
    }
  });

  test('Cleanup 13: Delete all Artists', async ({ page }) => {
    await login(page);
    await goToArtists(page);
    // Loop until all artists are deleted
    for (let i = 0; i < 5; i++) {
      await selectAllAndDelete(page);
      await page.waitForTimeout(2000);
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      const remaining = page.locator('.x-grid-card');
      if (!(await remaining.first().isVisible({ timeout: 3000 }).catch(() => false))) break;
    }
  });
});
