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

    // Headers sent automatically with EVERY API request in every test.
    // The key comes from your private .env file, never typed in the code.
    extraHTTPHeaders: {
      'x-api-key': process.env.REQRES_API_KEY || '',
    },
  },
});