require('dotenv').config();

// ============================================================
// AUTH
// ============================================================

async function login(page) {
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('networkidle');
  await page.locator('.x-nav-more').first().waitFor({ timeout: 10000 });
}

// ============================================================
// NAVIGATION
// ============================================================

async function navigateTo(page, section, subsection) {
  await page.locator('.x-nav-more').filter({ hasText: section }).click();
  await page.locator('.x-nav-more').getByRole('link', { name: subsection }).click();
  await page.waitForLoadState('networkidle');
}

async function goToArtists(page) {
  await navigateTo(page, 'Inventory', 'Artists');
  await page.waitForURL('**/artists');
}

async function goToObjects(page) {
  await navigateTo(page, 'Inventory', 'Objects');
  await page.waitForURL('**/objects');
}

async function goToShows(page) {
  await navigateTo(page, 'Inventory', 'Shows');
  await page.waitForURL('**/shows');
}

async function goToLists(page) {
  await navigateTo(page, 'Inventory', 'Lists');
  await page.waitForURL('**/lists');
}

async function goToContacts(page) {
  await navigateTo(page, 'Contacts', 'Contacts');
  await page.waitForURL('**/contacts');
}

async function goToContactGroups(page) {
  await navigateTo(page, 'Contacts', 'Contact Groups');
  await page.waitForURL('**/contact_groups');
}

async function goToForms(page) {
  await page.goto('/forms', { waitUntil: 'networkidle' });
}

async function goToInvoices(page) {
  await page.goto('/invoices', { waitUntil: 'networkidle' });
}

async function goToConsignments(page) {
  await navigateTo(page, 'Transactions', 'Consignments');
  await page.waitForURL('**/consignments');
}

async function goToLoans(page) {
  await navigateTo(page, 'Transactions', 'Loans');
  await page.waitForURL('**/loans');
}

async function goToReportTemplates(page) {
  await navigateTo(page, 'Reports', 'Report Templates');
  await page.waitForLoadState('networkidle');
}

async function goToExcelImporter(page) {
  await page.locator('text=Tools').click();
  await page.getByRole('link', { name: 'Excel Importer' }).click();
  await page.waitForLoadState('networkidle');
}

// ============================================================
// RECORD SELECTION & GRID HELPERS
// ============================================================

async function clickFirstGridCard(page) {
  await page.locator('.x-grid-card__title a').first().click();
  await page.waitForLoadState('networkidle');
}

async function selectGridCards(page, count = 1) {
  for (let i = 0; i < count; i++) {
    await page.locator('.x-grid-card label').nth(i).click();
    await page.waitForTimeout(300);
  }
}

async function selectAllItems(page) {
  await page.getByText('Select All', { exact: true }).click();
  await page.waitForTimeout(500);
}

// ============================================================
// SEARCH
// ============================================================

async function globalSearch(page, query) {
  const searchInput = page.locator('.x-global-search input[type="search"]').first();
  await searchInput.evaluate(el => el.removeAttribute('readonly'));
  await searchInput.click();
  await searchInput.fill(query);
  await page.waitForTimeout(1500);
  await searchInput.press('ArrowDown');
  await searchInput.press('Enter');
  await page.waitForLoadState('networkidle');
}

async function searchInPage(page, query) {
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill(query);
  await page.waitForTimeout(1500);
}

// ============================================================
// RECORD CREATION
// ============================================================

async function createArtist(page, { firstName = 'Test', lastName = 'Artist' } = {}) {
  await goToArtists(page);
  await page.getByRole('link', { name: 'Create New Artist' }).click();
  await page.waitForURL('**/artists/new');
  await page.locator('#first_name').fill(firstName);
  await page.locator('#last_name').fill(lastName);
  await page.locator('button.x-action_save').click();
  await page.waitForURL('**/artists/**/info');
}

async function createShow(page, { title } = {}) {
  const showTitle = title || 'Test Show ' + Date.now();
  await goToShows(page);
  await page.getByText('Create New Show').click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder('Title').fill(showTitle);
  await page.getByRole('link', { name: 'Create' }).click();
  await page.waitForLoadState('networkidle');
  return showTitle;
}

async function createList(page, { name } = {}) {
  const listName = name || 'Test List ' + Date.now();
  await goToLists(page);
  await page.locator('a:has-text("Create New List"), button:has-text("Create New List")').first().click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder('List Name').fill(listName);
  await page.getByText('Create', { exact: true }).click();
  await page.waitForTimeout(1000);
  return listName;
}

async function createContact(page, { firstName = 'Test', lastName = 'Contact' } = {}) {
  await goToContacts(page);
  await page.locator('text=Create New Contact').click();
  await page.waitForTimeout(1000);
  await page.locator('input[name="contact[first_name]"]').fill(firstName);
  await page.locator('input[name="contact[last_name]"]').fill(lastName);
  await page.locator('.x-action.x-action_save').click();
  await page.waitForTimeout(2000);
}

async function createContactGroup(page) {
  await goToContactGroups(page);
  await page.locator('.modal-opener-link').filter({ hasText: 'Create Contact Group' }).click();
  await page.waitForTimeout(500);
}

async function createObject(page, { artistName = 'First Artist', workTitle = 'Test Object' } = {}) {
  await goToObjects(page);
  await page.getByRole('link', { name: 'Create New Object' }).click();
  await page.waitForURL('**/objects/new');
  await page.getByLabel('Artist Name').fill(artistName);
  await page.locator('.typeahead-result-item').first().click();
  await page.waitForTimeout(2000);
  await page.getByLabel('Work Title').fill(workTitle);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForLoadState('networkidle');
}

async function createTransaction(page, { type = 'Offer', objectCount = 3 } = {}) {
  await goToObjects(page);
  for (let i = 0; i < objectCount; i++) {
    await page.locator('.x-grid-card').nth(i).click();
  }
  await page.locator('text=Create Transaction').first().click();
  await page.locator('.modal select').first().selectOption(type);
  await page.getByRole('link', { name: 'Create', exact: true }).click();
  await page.waitForLoadState('networkidle');
}

// ============================================================
// RECORD DELETION
// ============================================================

async function deleteCurrentRecord(page, { confirm = true } = {}) {
  await page.locator('text=Delete').first().click();
  if (confirm) {
    await page.locator('text=Yes').first().click();
  }
  await page.waitForTimeout(1000);
}

// ============================================================
// MODAL HELPERS
// ============================================================

async function waitForModal(page) {
  const modal = page.locator('.modal.in, .modal[style*="display: block"]').first();
  await modal.waitFor({ state: 'visible', timeout: 10000 });
  return modal;
}

async function closeModal(page) {
  await page.locator('.modal.in .modal-opener-header a').filter({ hasText: 'Cancel' }).first().click();
  await page.waitForTimeout(500);
}

// ============================================================
// FILE UPLOAD
// ============================================================

const path = require('path');

async function uploadFile(page, relativeFilePath) {
  const filePath = path.join(__dirname, '..', relativeFilePath);
  const fileInput = await page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(filePath);
  await page.waitForTimeout(2000);
}

// ============================================================
// LEFT-HAND MENU (LHM) ACTIONS
// ============================================================

async function lhmAction(page, actionName) {
  await page.locator(`text=${actionName}`).first().click();
  await page.waitForTimeout(1000);
}

async function addToShow(page) { await lhmAction(page, 'Add To Show'); }
async function addToList(page) { await lhmAction(page, 'Add to List'); }
async function createForm(page) { await lhmAction(page, 'Create Form'); }

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  // Auth
  login,
  // Navigation
  navigateTo,
  goToArtists,
  goToObjects,
  goToShows,
  goToLists,
  goToContacts,
  goToContactGroups,
  goToForms,
  goToInvoices,
  goToConsignments,
  goToLoans,
  goToReportTemplates,
  goToExcelImporter,
  // Grid & Selection
  clickFirstGridCard,
  selectGridCards,
  selectAllItems,
  // Search
  globalSearch,
  searchInPage,
  // Record Creation
  createArtist,
  createShow,
  createList,
  createContact,
  createContactGroup,
  createObject,
  createTransaction,
  // Record Deletion
  deleteCurrentRecord,
  // Modals
  waitForModal,
  closeModal,
  // File Upload
  uploadFile,
  // LHM Actions
  lhmAction,
  addToShow,
  addToList,
  createForm,
};
