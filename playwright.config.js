const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: 'https://features.artbinder.com',
    headless: true,
    screenshot: 'on',
    video: 'on',
  },
});
