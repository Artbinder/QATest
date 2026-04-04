const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 45000,
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: 'https://features.artbinder.com',
    headless: false,
    screenshot: 'on',
    video: 'on',
  },
});
