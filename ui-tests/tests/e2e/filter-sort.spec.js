const { test, expect } = require("@playwright/test");
const { CatalogPage } = require("../../pages/CatalogPage");

test.describe("E2E-07: Product Filtering & Sorting", () => {
  test("sort products by price ascending", async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.navigate();

    await catalog.sortBy("Price (Low - High)");

    await page.waitForFunction(() => {
      const prices = document.querySelectorAll('[data-test="product-price"]');
      return prices.length > 0;
    }, { timeout: 15000 });

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

    await catalog.sortBy("Price (High - Low)");

    await page.waitForFunction(() => {
      const prices = document.querySelectorAll('[data-test="product-price"]');
      return prices.length > 0;
    }, { timeout: 15000 });

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

    const initialCount = await catalog.getProductCardCount();

    await catalog.filterByCategory("Pliers");

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