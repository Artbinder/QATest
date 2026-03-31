require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.use({ storageState: { cookies: [], origins: [] } });

test('ABZ-T4347: [TC02-PROD] Edition Creation - Set', async ({ page }) => {
  // Login
  await page.goto('https://features.artbinder.com/users/sign_in');
  await page.getByPlaceholder('Email').fill(process.env.TEST_EMAIL);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).waitFor();

  // Navigate to Objects page
  await page.locator('.x-nav-more').filter({ hasText: 'Inventory' }).click();
  await page.locator('.x-nav-more').getByRole('link', { name: 'Objects' }).click();
  await page.waitForURL('**/objects');
  await page.locator('.x-grid-card__title a').first().click();
  await page.locator('text=Edition Set').waitFor();
  
  // Click Edition Set button at top right
  await page.locator('text=Edition Set').click();
  await page.waitForTimeout(500);
  await page.locator('text=Yes').click();
  await page.getByPlaceholder('Add Edition Set Title').waitFor();
  
  // Add edition set title
  await page.getByPlaceholder('Add Edition Set Title').fill('Test Edition Set');
  await page.waitForTimeout(1000);
  
  // Wait for the form to be ready
  await page.waitForSelector('.x-edition-type-definition', { state: 'visible' });
  
  // Provide Edition Total (10)
  await page.locator('.x-edition-type-definition').first().locator('input[type="text"]').nth(0).fill('10');
  
  // Provide Edition Numbers (1-10)
  await page.locator('.x-edition-type-definition').first().locator('input[placeholder="1-5, 9 or leave blank for none"]').fill('1-10');
  
  // Select Proof Type (EP)
  await page.locator('select').filter({ hasText: 'Select Proof Type' }).selectOption('EP');
  await page.waitForTimeout(500);
  
  // Click Add Proof Type
  await page.locator('text=Add Proof Type').click();
  await page.waitForTimeout(500);
  
  // Fill EP Proof Total (10)
  await page.locator('.x-edition-type-definition').nth(1).locator('input[type="text"]').nth(0).fill('10');
  
  // Select Unassigned Entries radio button for EP
  await page.locator('.x-edition-type-definition').nth(1).locator('input[value="unassigned"]').click();
  await page.waitForTimeout(500);
  
  // Fill Number of Unassigned Entries (10)
  await page.locator('.x-edition-type-definition').nth(1).locator('input[placeholder="Number of editions to create e.g. 20"]').fill('10');
  
  // Click 'Continue'
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Create' }).waitFor();
  
  // Click Create
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForTimeout(2000);
});
