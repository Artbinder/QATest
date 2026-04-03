const { test, expect } = require('@playwright/test');
const { login, goToShows, goToLists, goToContacts, goToContactGroups, goToObjects, goToReportTemplates } = require('../utils/helpers');

test.use({ storageState: { cookies: [], origins: [] } });

/*
 * SEED SCRIPT — Runs after T4000 (Excel import) to create the remaining
 * dependencies that the import doesn't cover:
 *   - Shows: "The Works", "Van Gogh" (with objects associated)
 *   - Lists: "Big Ol List" (with objects associated)
 *   - Contacts: "Maxwell Adams", "Test First Name" (placeholder)
 *   - Contact Groups: "Ankunding LLC"
 *   - Report Templates: "Editions Labels" (single), plus multi-column and label
 *   - Transactions: 1 Offer (with objects), 1 Sale (with objects + invoice)
 *   - Forms: 1 Consignment, 1 Invoice, 1 Loan
 *
 * The Excel import (T4000) creates 60 objects + artists including:
 *   Swinging Cardinal, White Noise, Georgica Association...,
 *   Art Before Philosophy After Art, Landscape Assorted Trees...,
 *   Untitled (First the Dust...), Charles Gaines, etc.
 */

test.describe.serial('Seed: Create test dependencies', () => {
  test.setTimeout(300000);

  test('Seed: Create shows with associated objects', async ({ page }) => {
    await login(page);

    // Create "The Works" show
    await goToShows(page);
    await page.getByText('Create New Show').click();
    await page.waitForTimeout(500);
    await page.getByPlaceholder('Title').fill('The Works');
    await page.getByRole('link', { name: 'Create' }).click();
    await page.waitForLoadState('networkidle');

    // Add objects to "The Works"
    await page.locator('a.modal-opener-link').filter({ hasText: 'Add Objects' }).click();
    await page.waitForTimeout(1000);
    await page.locator('.list-add-works .x-grid-card').first().click();
    await page.locator('.list-add-works .x-grid-card').nth(1).click();
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.waitForTimeout(1000);

    // Create "Van Gogh" show
    await goToShows(page);
    await page.getByText('Create New Show').click();
    await page.waitForTimeout(500);
    await page.getByPlaceholder('Title').fill('Van Gogh');
    await page.getByRole('link', { name: 'Create' }).click();
    await page.waitForLoadState('networkidle');

    // Add objects to "Van Gogh"
    await page.locator('a.modal-opener-link').filter({ hasText: 'Add Objects' }).click();
    await page.waitForTimeout(1000);
    await page.locator('.list-add-works .x-grid-card').first().click();
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.waitForTimeout(1000);
  });

  test('Seed: Create lists with associated objects', async ({ page }) => {
    await login(page);
    await goToLists(page);

    // Create "Big Ol List"
    await page.locator('a:has-text("Create New List"), button:has-text("Create New List")').first().click();
    await page.waitForTimeout(500);
    await page.getByPlaceholder('List Name').fill('Big Ol List');
    await page.getByText('Create', { exact: true }).click();
    await page.waitForTimeout(2000);

    // Add objects to the list
    await page.getByText('Add Objects').click();
    await page.waitForTimeout(2000);
    const modal = page.locator('.modal.in');
    await modal.locator('.x-grid-card').first().click();
    await modal.locator('.x-grid-card').nth(1).click();
    await modal.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(2000);
  });

  test('Seed: Create contacts', async ({ page }) => {
    await login(page);
    await goToContacts(page);

    // Create "Maxwell Adams"
    await page.locator('text=Create New Contact').click();
    await page.waitForTimeout(1000);
    await page.locator('input[name="contact[first_name]"]').fill('Maxwell');
    await page.locator('input[name="contact[last_name]"]').fill('Adams');
    await page.locator('.x-action.x-action_save').click();
    await page.waitForTimeout(2000);
  });

  test('Seed: Create contact groups', async ({ page }) => {
    await login(page);
    await goToContactGroups(page);

    // Create "Ankunding LLC"
    await page.locator('.modal-opener-link').filter({ hasText: 'Create Contact Group' }).click();
    await page.waitForTimeout(500);
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });
    await dialog.locator('input[type="text"]').first().fill('Ankunding LLC');
    await dialog.locator('a, button').filter({ hasText: /Create|Save/i }).first().click();
    await page.waitForTimeout(2000);
  });

  test('Seed: Create report templates', async ({ page }) => {
    await login(page);
    await goToReportTemplates(page);

    // Create "Editions Labels" template
    await page.locator('.x-plus-icon-link, .create-link a').first().click();
    await page.waitForTimeout(2000);
    await page.locator('.x-card-selectable').filter({ hasText: 'Label' }).first().click();
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Name Your Report Template *').fill('Editions Labels');
    await page.locator('.x-action.x-action_save, .x-action_save').first().click();
    await page.waitForTimeout(2000);
  });

  test('Seed: Create offer transaction with objects', async ({ page }) => {
    await login(page);
    await goToObjects(page);

    // Select 3 objects and create an Offer transaction
    await page.locator('.x-grid-card').first().click();
    await page.locator('.x-grid-card').nth(1).click();
    await page.locator('.x-grid-card').nth(2).click();
    await page.locator('text=Create Transaction').first().click();
    await page.locator('.modal select').first().selectOption('Offer');
    await page.getByRole('link', { name: 'Create', exact: true }).click();
    await page.waitForLoadState('networkidle');
  });

  test('Seed: Create sale transaction with objects', async ({ page }) => {
    await login(page);
    await goToObjects(page);

    // Select 3 objects and create a Sale transaction
    await page.locator('.x-grid-card').nth(3).click();
    await page.locator('.x-grid-card').nth(4).click();
    await page.locator('.x-grid-card').nth(5).click();
    await page.locator('text=Create Transaction').first().click();
    await page.locator('.modal select').first().selectOption('Sale');
    await page.getByRole('link', { name: 'Create', exact: true }).click();
    await page.waitForLoadState('networkidle');

    // Generate an invoice for this sale
    await page.getByText('Generate New Invoice').click();
    await page.waitForTimeout(2000);
    await page.getByText('Create', { exact: true }).click();
    await page.waitForTimeout(2000);
  });

  test('Seed: Create consignment form', async ({ page }) => {
    await login(page);
    await goToObjects(page);

    await page.locator('.x-grid-card').nth(6).click();
    await page.locator('.x-grid-card').nth(7).click();
    await page.waitForTimeout(500);
    await page.locator('text=Create Form').first().click();
    await page.getByRole('radio', { name: 'Consignment' }).click();
    await page.waitForTimeout(500);
    await page.locator('.modal').locator('text=Create').first().click();
    await page.waitForLoadState('networkidle');
  });

  test('Seed: Create loan form', async ({ page }) => {
    await login(page);
    await goToObjects(page);

    await page.locator('.x-grid-card').nth(8).click();
    await page.locator('.x-grid-card').nth(9).click();
    await page.waitForTimeout(500);
    await page.locator('text=Create Form').first().click();
    await page.getByRole('radio', { name: 'Loan' }).click();
    await page.waitForTimeout(500);
    await page.locator('.modal').locator('text=Create').first().click();
    await page.waitForLoadState('networkidle');
  });

  test('Seed: Create invoice form', async ({ page }) => {
    await login(page);
    await goToObjects(page);

    // Navigate to page 2 to get fresh unassociated objects
    await page.locator('nav button:has-text("Next"), nav a:has-text("Next")').click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.locator('.x-grid-card').first().click();
    await page.locator('.x-grid-card').nth(1).click();
    await page.waitForTimeout(500);
    await page.locator('text=Create Form').first().click();
    await page.waitForTimeout(2000);
    await page.getByRole('radio', { name: 'Invoice' }).click();
    await page.waitForTimeout(500);
    // Target the Next link inside the modal's .actions div, not the page pagination
    await page.locator('.modal .actions a:has-text("Next")').click();
    await page.waitForTimeout(1000);
    await page.getByText('Create', { exact: true }).click();
    await page.waitForLoadState('networkidle');
  });

  // --- Edition Sets for "Swinging Cardinal" ---
  // Needed by: T4238, T4296, T4343, T4344, T4345
  test('Seed: Create edition sets on Swinging Cardinal', async ({ page }) => {
    await login(page);
    await page.goto('/objects', { waitUntil: 'networkidle' });
    await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Swinging Cardinal');
    await page.waitForTimeout(1500);
    await page.locator('.x-grid-card__title a').first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Go to Edition Sets tab
    await page.getByRole('link', { name: 'Edition Sets' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check how many sets exist
    const existingSets = await page.locator('.x-row-card').count();
    if (existingSets >= 2) return; // Already have enough

    // Click the "Create Edition Set" link in the left-hand menu
    const addBtn = page.locator('text=Create Edition Set').first();
    await addBtn.click();
    await page.waitForTimeout(2000);

    // Confirm if prompted
    const yesBtn = page.getByText('Yes', { exact: true });
    if (await yesBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await yesBtn.click();
      await page.waitForTimeout(2000);
    }

    // Fill edition set form
    const titleInput = page.getByPlaceholder('Add Edition Set Title');
    await titleInput.waitFor({ timeout: 10000 });
    await titleInput.fill('Edition Set B');
    await page.waitForTimeout(500);
    await page.waitForSelector('.x-edition-type-definition', { state: 'visible' });
    await page.locator('.x-edition-type-definition').first().locator('input[type="text"]').nth(0).fill('2');
    await page.locator('.x-edition-type-definition').first().locator('input[placeholder="1-5, 9 or leave blank for none"]').fill('1-2');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Create' }).waitFor();
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  // --- Edition Sets for "Georgica Association Wainscott, December 2013" ---
  // Needed by: T4342
  test('Seed: Create edition sets on Georgica Association', async ({ page }) => {
    await login(page);
    await page.goto('/objects', { waitUntil: 'networkidle' });
    await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('Georgica Association Wainscott, December 2013');
    await page.waitForTimeout(1500);
    await page.locator('.x-grid-card__title a').first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if already a master with edition sets
    const editionSetsTab = page.locator('a:has-text("Edition Sets")').first();
    const alreadyMaster = await editionSetsTab.isVisible({ timeout: 3000 }).catch(() => false);

    if (alreadyMaster) {
      // Already has edition sets, skip
      return;
    }

    // Convert to master — click the Edition Set button and confirm
    await page.locator('text=Edition Set').waitFor({ timeout: 5000 });
    await page.locator('text=Edition Set').click();
    await page.waitForTimeout(1000);
    const yesBtn = page.getByText('Yes', { exact: true });
    if (await yesBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await yesBtn.click();
    }
    await page.waitForTimeout(2000);

    await page.getByPlaceholder('Add Edition Set Title').waitFor({ timeout: 10000 });
    await page.getByPlaceholder('Add Edition Set Title').fill('Georgica Set A');
    await page.waitForTimeout(500);
    await page.waitForSelector('.x-edition-type-definition', { state: 'visible' });
    await page.locator('.x-edition-type-definition').first().locator('input[type="text"]').nth(0).fill('2');
    await page.locator('.x-edition-type-definition').first().locator('input[placeholder="1-5, 9 or leave blank for none"]').fill('1-2');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Create' }).waitFor();
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  // --- Associate first artist with a show ---
  // Needed by: T4291 (Artist -> Shows tab must have shows)
  // The shows created earlier ("The Works", "Van Gogh") already have objects
  // associated, which creates the artist-show link automatically.
  // This step is a no-op if associations already exist.

  // --- Create forms using the FIRST object (for Associated Forms tests) ---
  // Needed by: T4274 (Associated Invoices), T4275 (Associated Consignments)
  test('Seed: Create forms for first object associations', async ({ page }) => {
    await login(page);
    await goToObjects(page);

    // Search for a specific unique object (no edition sets) to associate forms with
    await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('White Noise');
    await page.waitForTimeout(1500);

    // Select the object checkbox
    await page.locator('.x-grid-card label').first().click();
    await page.waitForTimeout(500);

    // Create an invoice form
    await page.locator('text=Create Form').first().click();
    await page.waitForTimeout(2000);
    await page.getByRole('radio', { name: 'Invoice' }).click();
    await page.waitForTimeout(500);
    await page.locator('.modal .actions a:has-text("Next")').click();
    await page.waitForTimeout(1000);
    await page.getByText('Create', { exact: true }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Handle "Change Object Status" modal if it appears
    const changeSold = page.locator('text=Change to Sold');
    if (await changeSold.isVisible({ timeout: 3000 }).catch(() => false)) {
      await changeSold.click();
      await page.waitForTimeout(1000);
    }

    // Go back and create a consignment for the same object
    await goToObjects(page);
    await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('White Noise');
    await page.waitForTimeout(1500);
    await page.locator('.x-grid-card label').first().click();
    await page.waitForTimeout(500);
    await page.locator('text=Create Form').first().click();
    await page.waitForTimeout(2000);
    await page.getByRole('radio', { name: 'Consignment' }).click();
    await page.waitForTimeout(500);
    // Click Next if present, then Create
    const nextBtn = page.locator('.modal .actions a:has-text("Next")');
    if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(1000);
    }
    await page.locator('.modal .actions a:has-text("Create"), .modal a:has-text("Create")').first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  // --- Add first object to a list ---
  // Needed by: T4277 (Associated Lists)
  test('Seed: Add first object to a list', async ({ page }) => {
    await login(page);
    await goToObjects(page);

    // Select the first object checkbox to trigger the LHM
    await page.locator('.x-grid-card label').first().click();
    await page.waitForTimeout(500);

    // Click "Add to List" in the LHM
    await page.locator('text=Add to List').first().click();
    await page.waitForTimeout(2000);

    // The modal shows available lists — select the first one
    const modal = page.locator('.modal.in, .modal[style*="display: block"]').first();
    await modal.waitFor({ state: 'visible', timeout: 10000 });
    const listItemLabel = modal.locator('label:has(.x-grid-card__label__text)').first();
    await listItemLabel.click({ force: true });
    await page.waitForTimeout(500);
    await modal.locator('a').filter({ hasText: 'Add' }).click();
    await page.waitForTimeout(1000);
  });
});
