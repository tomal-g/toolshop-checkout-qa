const { test, expect } = require("@playwright/test");
const { CatalogPage } = require("../../pages/CatalogPage");
const { ProductPage } = require("../../pages/ProductPage");
const { CartPage } = require("../../pages/CartPage");

test.describe("E2E-05: Invalid Quantity", () => {
  test("quantity cannot be set to zero", async ({ page }) => {
    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);

    await catalog.navigate();
    await catalog.clickProduct(0);

    // Try to set quantity to 0
    await product.setQuantity(0);

    // The input has min=1, so the value should be clamped or rejected
    const quantityValue = await product.quantityInput.inputValue();
    // Either it stays at 1 (clamped) or the add-to-cart is disabled
    expect(parseInt(quantityValue)).toBeGreaterThanOrEqual(1);
  });

  test("quantity cannot be negative", async ({ page }) => {
    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);

    await catalog.navigate();
    await catalog.clickProduct(0);

    // Try to set quantity to -1
    await product.setQuantity(-1);

    // The input has min=1, so the value should be clamped or rejected
    const quantityValue = await product.quantityInput.inputValue();
    expect(parseInt(quantityValue)).toBeGreaterThanOrEqual(1);
  });

  test("quantity cannot be non-integer", async ({ page }) => {
    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);

    await catalog.navigate();
    await catalog.clickProduct(0);

    // Try to set quantity to a decimal
    await product.setQuantity(2.5);

    // The input is type=number with step=1, so decimals should be rejected
    const quantityValue = await product.quantityInput.inputValue();
    expect(Number.isInteger(parseFloat(quantityValue))).toBe(true);
  });
});