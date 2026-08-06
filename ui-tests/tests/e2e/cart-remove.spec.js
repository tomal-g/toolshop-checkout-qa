const { test, expect } = require("@playwright/test");
const { CatalogPage } = require("../../pages/CatalogPage");
const { ProductPage } = require("../../pages/ProductPage");
const { CartPage } = require("../../pages/CartPage");
const { ensureLoggedIn } = require("../../fixtures/auth-helper");

test.describe("E2E-04: Remove Item from Cart", () => {
  test("removing an item recalculates the total and removes the item", async ({ page }) => {
    // The auth token may have expired (5-min JWT). Re-auth if needed.
    await ensureLoggedIn(page);

    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);

    // Add two products to cart
    await catalog.navigate();
    await catalog.clickProduct(0);
    const price1 = await product.getUnitPrice();
    await product.addToCart();

    await catalog.navigate();
    await catalog.clickProduct(1);
    const price2 = await product.getUnitPrice();
    await product.addToCart();

    // Go to cart
    await cart.navigate();

    // Verify both items are present
    const titles = await cart.getProductTitles();
    expect(titles.length).toBe(2);

    // Initial total
    const initialTotal = await cart.getCartTotal();
    expect(initialTotal).toBeCloseTo(price1 + price2, 2);

    // Remove the first item
    await cart.removeItem(0);

    // Verify only one item remains
    const remainingTitles = await cart.getProductTitles();
    expect(remainingTitles.length).toBe(1);

    // Verify the remaining item is the second product
    expect(remainingTitles[0].trim()).toBe(titles[1].trim());

    // Verify total recalculated to only the remaining item
    const updatedTotal = await cart.getCartTotal();
    expect(updatedTotal).toBeCloseTo(price2, 2);
  });
});