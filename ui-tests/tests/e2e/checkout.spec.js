const { test, expect } = require("@playwright/test");
const { CatalogPage } = require("../../pages/CatalogPage");
const { ProductPage } = require("../../pages/ProductPage");
const { CartPage } = require("../../pages/CartPage");
const { CheckoutPage } = require("../../pages/CheckoutPage");
const { ConfirmationPage } = require("../../pages/ConfirmationPage");
const { ensureLoggedIn } = require("../../fixtures/auth-helper");

test.describe("E2E-01: Registered User Checkout", () => {
  test("completes checkout successfully", async ({ page }) => {
    await ensureLoggedIn(page);

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