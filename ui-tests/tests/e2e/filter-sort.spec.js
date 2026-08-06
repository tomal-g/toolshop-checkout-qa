const { test, expect } = require("@playwright/test");
const { CatalogPage } = require("../../pages/CatalogPage");

test.describe("E2E-07: Product Filtering & Sorting", () => {
  test("sort products by price ascending", async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.navigate();

    // Sort by price low-high
    await catalog.sortBy("Price (Low - High)");

    // Wait for product prices to load before reading them
    await page.waitForFunction(() => {
      const prices = document.querySelectorAll('[data-test="product-price"]');
      return prices.length > 0;
    }, { timeout: 15000 });

    // Get prices and verify they're in ascending order
    const prices = await catalog.getProductPrices();
    const numericPrices = prices.map(p => parseFloat(p.replace("$", "")));
    expect(numericPrices.length).toBeGreaterThan(0);

    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i - 1]);
    }
  });

  test("sort products by price descending", async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.navigate();

    // Sort by price high-low
    await catalog.sortBy("Price (High - Low)");

    // Wait for product prices to load before reading them
    await page.waitForFunction(() => {
      const prices = document.querySelectorAll('[data-test="product-price"]');
      return prices.length > 0;
    }, { timeout: 15000 });

    // Get prices and verify they're in descending order
    const prices = await catalog.getProductPrices();
    const numericPrices = prices.map(p => parseFloat(p.replace("$", "")));
    expect(numericPrices.length).toBeGreaterThan(0);

    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i - 1]);
    }
  });

  test("filter products by category", async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.navigate();

    // Get initial product count
    const initialCount = await catalog.getProductCardCount();

    // Filter by "Pliers" category
    await catalog.filterByCategory("Pliers");

    // Get product names and verify all are in the Pliers category.
    // Note: the Pliers subcategory on this site includes "Bolt Cutters",
    // which does not contain "pliers" in its name.
    const names = await catalog.getProductNames();
    expect(names.length).toBeGreaterThan(0);
    expect(names.length).toBeLessThan(initialCount);

    const pliersCategoryProducts = [
      "Pliers",
      "Combination Pliers",
      "Long Nose Pliers",
      "Slip Joint Pliers",
      "Bolt Cutters",
    ];

    for (const name of names) {
      const trimmed = name.trim();
      expect(pliersCategoryProducts.some(p => trimmed.includes(p))).toBe(true);
    }
  });
});