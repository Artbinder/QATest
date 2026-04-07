const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90000,
  retries: 2,
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: 'https://features.artbinder.com',
    headless: false,
    screenshot: 'on',
    video: 'on',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
});
