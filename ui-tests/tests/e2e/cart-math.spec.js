const { test, expect } = require("@playwright/test");
const { CatalogPage } = require("../../pages/CatalogPage");
const { ProductPage } = require("../../pages/ProductPage");
const { CartPage } = require("../../pages/CartPage");
const { ensureLoggedIn } = require("../../fixtures/auth-helper");

test.describe("E2E-03: Cart Math Validation", () => {
  test("cart total equals sum of unit_price x quantity for multiple items", async ({ page }) => {
    // The auth token may have expired (5-min JWT). Re-auth if needed.
    await ensureLoggedIn(page);

    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);

    // Add first product with quantity 2
    await catalog.navigate();
    await catalog.clickProduct(0);
    const price1 = await product.getUnitPrice();
    await product.setQuantity(2);
    await product.addToCart();

    // Add second product with quantity 3
    await catalog.navigate();
    await catalog.clickProduct(1);
    const price2 = await product.getUnitPrice();
    await product.setQuantity(3);
    await product.addToCart();

    // Go to cart
    await cart.navigate();

    // Verify cart contents
    const titles = await cart.getProductTitles();
    expect(titles.length).toBe(2);

    const quantities = await cart.getProductQuantities();
    expect(quantities).toEqual([2, 3]);

    const prices = await cart.getProductPrices();
    expect(prices[0]).toBeCloseTo(price1, 2);
    expect(prices[1]).toBeCloseTo(price2, 2);

    // Verify line prices
    const linePrices = await cart.getLinePrices();
    expect(linePrices[0]).toBeCloseTo(price1 * 2, 2);
    expect(linePrices[1]).toBeCloseTo(price2 * 3, 2);

    // Verify cart total
    const expectedTotal = price1 * 2 + price2 * 3;
    const actualTotal = await cart.getCartTotal();
    expect(actualTotal).toBeCloseTo(expectedTotal, 2);
  });

  test("cart total recalculates after quantity update", async ({ page }) => {
    // The auth token may have expired (5-min JWT). Re-auth if needed.
    await ensureLoggedIn(page);

    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);

    // Add a product
    await catalog.navigate();
    await catalog.clickProduct(0);
    const price = await product.getUnitPrice();
    await product.addToCart();

    // Go to cart
    await cart.navigate();

    // Initial total
    const initialTotal = await cart.getCartTotal();
    expect(initialTotal).toBeCloseTo(price, 2);

    // Update quantity to 4
    await cart.updateQuantity(0, 4);

    // Verify total recalculated
    const updatedTotal = await cart.getCartTotal();
    expect(updatedTotal).toBeCloseTo(price * 4, 2);

    // Verify line price
    const linePrices = await cart.getLinePrices();
    expect(linePrices[0]).toBeCloseTo(price * 4, 2);
  });
});