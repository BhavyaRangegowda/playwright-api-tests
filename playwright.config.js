// Load the private settings from the .env file into process.env.
// This must come first, so the key is available to all tests.
require('dotenv').config();

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  // Folder where Playwright looks for test files
  testDir: './tests',

  // Create an HTML report after each run
  reporter: 'html',

  use: {
    // Base URL, so tests can use short paths like '/api/users'
    baseURL: 'https://reqres.in',
  },
});