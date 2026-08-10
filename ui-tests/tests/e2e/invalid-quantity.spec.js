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

    await product.setQuantity(0);

    const quantityValue = await product.quantityInput.inputValue();
    expect(parseInt(quantityValue)).toBeGreaterThanOrEqual(1);
  });

  test("quantity cannot be negative", async ({ page }) => {
    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);

    await catalog.navigate();
    await catalog.clickProduct(0);

    await product.setQuantity(-1);

    const quantityValue = await product.quantityInput.inputValue();
    expect(parseInt(quantityValue)).toBeGreaterThanOrEqual(1);
  });

  test("quantity cannot be non-integer", async ({ page }) => {
    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);

    await catalog.navigate();
    await catalog.clickProduct(0);

    await product.setQuantity(2.5);

    const quantityValue = await product.quantityInput.inputValue();
    expect(Number.isInteger(parseFloat(quantityValue))).toBe(true);
  });
});
