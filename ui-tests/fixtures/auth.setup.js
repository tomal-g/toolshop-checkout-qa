const { chromium } = require('@playwright/test');
const path = require('path');

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://practicesoftwaretesting.com/auth/login');
  await page.locator('[data-test="email"]').fill('customer@practicesoftwaretesting.com');
  await page.locator('[data-test="password"]').fill('welcome01');
  await page.locator('[data-test="login-submit"]').click();
  await page.waitForLoadState('networkidle');

  await page.context().storageState({
    path: path.join(__dirname, '../auth/storageState.json')
  });

  await browser.close();
}

module.exports = globalSetup;