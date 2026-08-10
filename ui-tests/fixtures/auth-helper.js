/**
 * Ensures the user is logged in by checking the current auth state.
 * If the auth token has expired (5-minute JWT expiry), registers a
 * fresh account and logs in.
 */
async function ensureLoggedIn(page) {
  // Go to home page to check auth state
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // If user menu is present, we're already logged in
  const userMenu = page.getByTestId('nav-menu');
  if ((await userMenu.count()) > 0) {
    return;
  }

  // Not logged in - register a fresh account and log in
  const uniqueEmail = `qa_${Date.now()}@test.com`;
  const uniquePassword = `Qa${Date.now()}@Test!`;

  await page.goto('/auth/register', { waitUntil: 'domcontentloaded' });
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

  await page.locator('[data-test="email"]').fill(uniqueEmail);
  await page.locator('[data-test="password"]').fill(uniquePassword);
  await page.locator('[data-test="login-submit"]').click();
  await page.waitForLoadState('networkidle');
}

module.exports = { ensureLoggedIn };