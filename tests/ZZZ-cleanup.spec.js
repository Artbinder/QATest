const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

/*
 * CLEANUP SCRIPT — Runs LAST after all tests.
 * Wipes the account completely clean by going to each catalog page,
 * selecting all records, and deleting them.
 *
 * Deletion order matters due to foreign key dependencies:
 *   1. Transactions (Offers, Sales) — these reference objects
 *   2. Forms (Invoices, Consignments, Loans) — these reference objects
 *   3. Exported Reports — generated from objects/shows/lists
 *   4. Report Templates — used to generate reports
 *   5. Lists — contain associated objects
 *   6. Shows — contain associated objects
 *   7. Contact Groups — contain contacts
 *   8. Contacts — standalone
 *   9. Objects — referenced by everything above
 *  10. Artists — referenced by objects
 */

test.describe.serial('Cleanup: Wipe all records', () => {
  test.setTimeout(600000);

  async function deleteAllOnPage(page, maxPages = 50) {
    for (let i = 0; i < maxPages; i++) {
      // Check if there are any selectable items
      const hasItems = await page.locator('.x-grid-card, .x-row-card, .transaction-row-card').first().isVisible().catch(() => false);
      if (!hasItems) break;

      // Try "Select All" if available
      const selectAll = page.getByText('Select All', { exact: true });
      if (await selectAll.isVisible().catch(() => false)) {
        await selectAll.click();
        await page.waitForTimeout(500);
      } else {
        // Select items individually via checkboxes
        const checkboxes = page.locator('.css-checkbox, .x-grid-card label, .checkbox label');
        const count = await checkboxes.count();
        if (count === 0) break;
        for (let j = 0; j < Math.min(count, 50); j++) {
          await checkboxes.nth(j).click({ force: true });
          await page.waitForTimeout(200);
        }
      }
      await page.waitForTimeout(500);

      // Click Delete
      const deleteBtn = page.locator('text=Delete').first();
      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click();
        await page.waitForTimeout(500);

        // Confirm deletion
        const yesBtn = page.getByText('Yes', { exact: true });
        if (await yesBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await yesBtn.click();
        }
        await page.waitForTimeout(2000);
        await page.waitForLoadState('networkidle').catch(() => {});
      } else {
        break;
      }

      // Check if page is now empty
      const remaining = await page.locator('.x-grid-card, .x-row-card, .transaction-row-card').count();
      if (remaining === 0) break;
    }
  }

  async function deleteTransactions(page, type) {
    await page.locator('.x-nav-more').filter({ hasText: 'Transactions' }).click();
    await page.locator('.x-nav-more').getByRole('link', { name: type }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    for (let i = 0; i < 50; i++) {
      const rows = page.locator('.transaction-row-card .checkbox label');
      const count = await rows.count();
      if (count === 0) break;

      await rows.first().click();
      await page.waitForTimeout(300);

      const deleteLink = page.locator('.delete-transaction-link');
      if (await deleteLink.isVisible().catch(() => false)) {
        await deleteLink.click();
        await page.getByText('Yes', { exact: true }).click();
        await page.waitForTimeout(2000);
      } else {
        break;
      }
    }
  }

  async function deleteForms(page, type) {
    await page.locator('.x-nav-more').filter({ hasText: 'Transactions' }).click();
    await page.locator('label[for="forms-toggler"]').click({ force: true });
    await page.getByRole('link', { name: type }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    for (let i = 0; i < 50; i++) {
      const rows = page.locator('.x-row-card');
      const count = await rows.count();
      if (count === 0) break;

      await rows.first().click();
      await page.waitForTimeout(1000);

      // Try to delete from detail page
      const deleteBtn = page.locator('a:has-text("Delete"), button:has-text("Delete")').first();
      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click();
        await page.waitForTimeout(500);
        const yesBtn = page.getByText('Yes', { exact: true });
        if (await yesBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await yesBtn.click();
        }
        await page.waitForTimeout(2000);
      } else {
        break;
      }
    }
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
    await deleteForms(page, 'Invoices');
  });

  test('Cleanup 4: Delete all Consignments', async ({ page }) => {
    await login(page);
    await deleteForms(page, 'Consignments');
  });

  test('Cleanup 5: Delete all Loans', async ({ page }) => {
    await login(page);
    await deleteForms(page, 'Loans');
  });

  test('Cleanup 6: Delete all Report Templates', async ({ page }) => {
    await login(page);
    await page.locator('.x-nav-more').filter({ hasText: 'Reports' }).click();
    await page.locator('.x-nav-more').getByRole('link', { name: 'Report Templates' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Delete templates one by one from the list
    for (let i = 0; i < 50; i++) {
      const templateCard = page.locator('.x-grid-card, .x-row-card').first();
      if (!(await templateCard.isVisible().catch(() => false))) break;

      await templateCard.click();
      await page.waitForTimeout(1000);
      const deleteBtn = page.locator('text=Delete').first();
      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click();
        await page.waitForTimeout(500);
        const yesBtn = page.getByText('Yes', { exact: true });
        if (await yesBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await yesBtn.click();
        }
        await page.waitForTimeout(2000);
      } else {
        break;
      }
    }
  });

  test('Cleanup 7: Delete all Lists', async ({ page }) => {
    await login(page);
    await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
    await page.getByRole('link', { name: 'Lists', exact: true }).click();
    await page.waitForURL('**/lists');
    await page.waitForTimeout(1000);
    await deleteAllOnPage(page);
  });

  test('Cleanup 8: Delete all Shows', async ({ page }) => {
    await login(page);
    await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
    await page.getByRole('link', { name: 'Shows', exact: true }).click();
    await page.waitForURL('**/shows');
    await page.waitForTimeout(1000);
    await deleteAllOnPage(page);
  });

  test('Cleanup 9: Delete all Contact Groups', async ({ page }) => {
    await login(page);
    await page.locator('.x-nav-more').filter({ hasText: 'Contacts' }).click();
    await page.getByRole('link', { name: 'Contact Groups' }).click();
    await page.waitForURL('**/contact_groups');
    await page.waitForTimeout(1000);
    await deleteAllOnPage(page);
  });

  test('Cleanup 10: Delete all Contacts', async ({ page }) => {
    await login(page);
    await page.locator('.x-nav-more').filter({ hasText: 'Contacts' }).click();
    await page.getByRole('link', { name: 'Contacts', exact: true }).click();
    await page.waitForURL('**/contacts');
    await page.waitForTimeout(1000);
    await deleteAllOnPage(page);
  });

  test('Cleanup 11: Delete all Objects', async ({ page }) => {
    await login(page);
    await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
    await page.getByRole('link', { name: 'Objects', exact: true }).click();
    await page.waitForURL('**/objects');
    await page.waitForTimeout(1000);
    await deleteAllOnPage(page);
  });

  test('Cleanup 12: Delete all Artists', async ({ page }) => {
    await login(page);
    await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
    await page.getByRole('link', { name: 'Artists', exact: true }).click();
    await page.waitForURL('**/artists');
    await page.waitForTimeout(1000);
    await deleteAllOnPage(page);
  });
});
