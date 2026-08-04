const { chromium } = require('@playwright/test');
const path = require('path');

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // The shared seed account (customer@practicesoftwaretesting.com) is locked.
  // Register a fresh account with a unique email/password instead.
  const uniqueEmail = `qa_${Date.now()}@test.com`;
  const uniquePassword = `Qa${Date.now()}@Test!`;

  // 1. Register a new account
  await page.goto('https://practicesoftwaretesting.com/auth/register');
  await page.waitForLoadState('networkidle');

  await page.locator('[data-test="first-name"]').fill('QA');
  await page.locator('[data-test="last-name"]').fill('Tester');
  await page.locator('[data-test="dob"]').fill('1990-01-01');
  await page.locator('[data-test="country"]').selectOption('US');
  await page.locator('[data-test="postal_code"]').fill('10001');
  await page.locator('[data-test="house_number"]').fill('123');
  await page.locator('[data-test="street"]').fill('123 Test St');
  await page.locator('[data-test="city"]').fill('New York');
  await page.locator('[data-test="state"]').fill('NY');
  await page.locator('[data-test="phone"]').fill('1234567890');
  await page.locator('[data-test="email"]').fill(uniqueEmail);
  await page.locator('[data-test="password"]').fill(uniquePassword);
  await page.locator('[data-test="register-submit"]').click();
  await page.waitForURL(/.*\/auth\/login.*/);

  // 2. Login with the new account
  await page.locator('[data-test="email"]').fill(uniqueEmail);
  await page.locator('[data-test="password"]').fill(uniquePassword);
  await page.locator('[data-test="login-submit"]').click();
  await page.waitForLoadState('networkidle');

  // 3. Save the authenticated storage state
  await page.context().storageState({
    path: path.join(__dirname, '../auth/storageState.json')
  });

  await browser.close();
}

module.exports = globalSetup;