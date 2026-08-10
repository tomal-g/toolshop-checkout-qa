const { test, expect } = require("@playwright/test");
const { CatalogPage } = require("../../pages/CatalogPage");
const { ProductPage } = require("../../pages/ProductPage");
const { CartPage } = require("../../pages/CartPage");
const { CheckoutPage } = require("../../pages/CheckoutPage");
const { ensureLoggedIn } = require("../../fixtures/auth-helper");

test.describe("E2E-06: Missing Checkout Fields", () => {
  test("checkout is blocked when required address fields are missing", async ({ page }) => {
    await ensureLoggedIn(page);

    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await catalog.navigate();
    await catalog.clickProduct(0);
    await product.addToCart();

    await cart.navigate();
    await cart.proceedToCheckout();
    await checkout.proceedFromLogin();

    await checkout.country.waitFor({ state: "visible" });
    await expect(checkout.proceedPastAddress).toBeDisabled();
  });

  test("checkout is blocked when payment method is not selected", async ({ page }) => {
    await ensureLoggedIn(page);

    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await catalog.navigate();
    await catalog.clickProduct(0);
    await product.addToCart();

    await cart.navigate();
    await cart.proceedToCheckout();
    await checkout.proceedFromLogin();

    await checkout.fillAddress("US", "10001", "123");
    await checkout.proceedFromAddress();

    await checkout.paymentMethod.waitFor({ state: "visible" });
    await expect(checkout.confirmButton).toBeDisabled();
  });
});