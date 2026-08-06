const { test, expect } = require("@playwright/test");
const { CatalogPage } = require("../../pages/CatalogPage");
const { ProductPage } = require("../../pages/ProductPage");
const { CartPage } = require("../../pages/CartPage");
const { CheckoutPage } = require("../../pages/CheckoutPage");
const { ensureLoggedIn } = require("../../fixtures/auth-helper");

test.describe("E2E-06: Missing Checkout Fields", () => {
  test("checkout is blocked when required address fields are missing", async ({ page }) => {
    // The storageState token may have expired (5-min JWT). Re-authenticate if needed.
    await ensureLoggedIn(page);

    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // Add a product to cart
    await catalog.navigate();
    await catalog.clickProduct(0);
    await product.addToCart();

    // Go to cart and proceed to checkout
    await cart.navigate();
    await cart.proceedToCheckout();
    await checkout.proceedFromLogin();

    // Leave address fields empty - proceed-3 should be disabled
    await checkout.country.waitFor({ state: "visible" });
    await expect(checkout.proceedPastAddress).toBeDisabled();
  });

  test("checkout is blocked when payment method is not selected", async ({ page }) => {
    // The storageState token may have expired (5-min JWT). Re-authenticate if needed.
    await ensureLoggedIn(page);

    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // Add a product to cart
    await catalog.navigate();
    await catalog.clickProduct(0);
    await product.addToCart();

    // Go to cart and proceed to checkout
    await cart.navigate();
    await cart.proceedToCheckout();
    await checkout.proceedFromLogin();

    // Fill address
    await checkout.fillAddress("US", "10001", "123");
    await checkout.proceedFromAddress();

    // Don't select a payment method - finish button should be disabled
    await checkout.paymentMethod.waitFor({ state: "visible" });
    await expect(checkout.confirmButton).toBeDisabled();
  });
});