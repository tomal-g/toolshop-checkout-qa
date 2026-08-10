const { test, expect } = require("@playwright/test");
const { CatalogPage } = require("../../pages/CatalogPage");
const { ProductPage } = require("../../pages/ProductPage");
const { CartPage } = require("../../pages/CartPage");
const { ensureLoggedIn } = require("../../fixtures/auth-helper");

test.describe("E2E-04: Remove Item from Cart", () => {
  test("removing an item recalculates the total and removes the item", async ({ page }) => {
    await ensureLoggedIn(page);

    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);

    await catalog.navigate();
    await catalog.clickProduct(0);
    const price1 = await product.getUnitPrice();
    await product.addToCart();

    await catalog.navigate();
    await catalog.clickProduct(1);
    const price2 = await product.getUnitPrice();
    await product.addToCart();

    await cart.navigate();

    const titles = await cart.getProductTitles();
    expect(titles.length).toBe(2);

    const initialTotal = await cart.getCartTotal();
    expect(initialTotal).toBeCloseTo(price1 + price2, 2);

    await cart.removeItem(0);

    const remainingTitles = await cart.getProductTitles();
    expect(remainingTitles.length).toBe(1);

    expect(remainingTitles[0].trim()).toBe(titles[1].trim());

    const updatedTotal = await cart.getCartTotal();
    expect(updatedTotal).toBeCloseTo(price2, 2);
  });
});