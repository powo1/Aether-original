// playwright.config.js
// Basic Playwright config for running tests on the frontend

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: "./tests",
  timeout: 30000,
  retries: 0,
  use: {
    headless: true,
    baseURL: "http://localhost:3000", // Adjust if your frontend runs on a different port
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
};

module.exports = config;
