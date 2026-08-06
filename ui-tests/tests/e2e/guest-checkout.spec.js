const { test, expect } = require("@playwright/test");
const { CatalogPage } = require("../../pages/CatalogPage");
const { ProductPage } = require("../../pages/ProductPage");
const { CartPage } = require("../../pages/CartPage");
const { CheckoutPage } = require("../../pages/CheckoutPage");
const { ConfirmationPage } = require("../../pages/ConfirmationPage");

test.describe("E2E-02: Guest Checkout", () => {
  test("completes checkout as a guest", async ({ page }) => {
    // Clear auth state to ensure we're testing as a guest
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "domcontentloaded" });

    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const confirmation = new ConfirmationPage(page);

    // Browse and add a product to cart
    await catalog.navigate();
    await catalog.clickProduct(0);
    await product.addToCart();

    // Go to cart and proceed to checkout
    await cart.navigate();
    await cart.proceedToCheckout();

    // Proceed as guest
    const guestEmail = `guest_${Date.now()}@test.com`;
    await checkout.proceedAsGuest(guestEmail, "Guest", "User");

    // Fill address and complete checkout
    await checkout.fillAddress("US", "10001", "123");
    await checkout.proceedFromAddress();
    await checkout.selectPaymentMethod("cash-on-delivery");
    await checkout.confirm();

    // Verify success message
    await expect(confirmation.successMessage).toBeVisible();
    await expect(confirmation.successMessage).toHaveText("Payment was successful");
  });
});