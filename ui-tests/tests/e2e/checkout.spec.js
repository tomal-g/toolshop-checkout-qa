const { test, expect } = require("@playwright/test");
const { CatalogPage } = require("../../pages/CatalogPage");
const { ProductPage } = require("../../pages/ProductPage");
const { CartPage } = require("../../pages/CartPage");
const { CheckoutPage } = require("../../pages/CheckoutPage");
const { ConfirmationPage } = require("../../pages/ConfirmationPage");

test.describe("E2E-01: Registered User Checkout", () => {
  test("completes checkout successfully", async ({ page }) => {
    // Login with a freshly registered account (the shared seed account is locked)
    await page.goto("/auth/login");
    await page.waitForLoadState("networkidle");

    const uniqueEmail = `qa_${Date.now()}@test.com`;
    const uniquePassword = `Qa${Date.now()}@Test!`;

    // Register a new account first
    await page.goto("/auth/register");
    await page.waitForLoadState("networkidle");
    await page.getByTestId("first-name").fill("QA");
    await page.getByTestId("last-name").fill("Tester");
    await page.getByTestId("dob").fill("1990-01-01");
    await page.getByTestId("country").selectOption("US");
    await page.getByTestId("postal_code").fill("10001");
    await page.getByTestId("house_number").fill("123");
    await page.getByTestId("street").fill("123 Test St");
    await page.getByTestId("city").fill("New York");
    await page.getByTestId("state").fill("NY");
    await page.getByTestId("phone").fill("1234567890");
    await page.getByTestId("email").fill(uniqueEmail);
    await page.getByTestId("password").fill(uniquePassword);
    await page.getByTestId("register-submit").click();
    await page.waitForURL(/.*\/auth\/login.*/);

    // Login with the new account
    await page.getByTestId("email").fill(uniqueEmail);
    await page.getByTestId("password").fill(uniquePassword);
    await page.getByTestId("login-submit").click();
    await page.waitForLoadState("networkidle");

    // Proceed with checkout
    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const confirmation = new ConfirmationPage(page);

    await catalog.navigate();
    await catalog.clickProduct(0);
    await product.addToCart();
    await cart.navigate();
    await cart.proceedToCheckout();
    await checkout.proceedFromLogin();
    await checkout.fillAddress("US", "10001", "123");
    await checkout.proceedFromAddress();
    await checkout.selectPaymentMethod("cash-on-delivery");
    await checkout.confirm();

    await expect(confirmation.successMessage).toBeVisible();
  });
});