class CatalogPage {
  constructor(page) {
    this.page = page;
    this.productCards = page.locator('[data-test^="product-"]');
    this.searchInput = page.getByTestId("search-query");
    this.searchButton = page.getByTestId("search-submit");
    this.sortSelect = page.getByTestId("sort");
    this.filtersToggle = page.getByTestId("filters").first();
  }

  async navigate() {
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
    // Wait for product cards to load (products load via API after page load)
    await this.productCards.first().waitFor({ state: "visible", timeout: 30000 });
  }

  async clickProduct(nthInStock = 0) {
    // Wait for a reasonable number of product cards to have their names loaded
    // (lazy-loaded via API). Some cards may not have names at all (e.g. out of stock).
    await this.page.waitForFunction(() => {
      const cards = document.querySelectorAll('[data-test^="product-"]');
      if (cards.length === 0) return false;
      let namedCount = 0;
      for (const c of cards) {
        const name = c.querySelector('[data-test="product-name"]');
        if (name && name.textContent && name.textContent.trim() !== '') {
          namedCount++;
        }
      }
      return namedCount >= 5;
    }, { timeout: 30000 });

    // Find the nth in-stock product by iterating through all cards.
    // For each card, click it and verify the add-to-cart button is enabled.
    // This ensures clickProduct(0) and clickProduct(1) always select
    // different products even when earlier cards are out of stock.
    const cards = this.productCards;
    const count = await cards.count();
    let inStockCount = 0;
    let clicked = false;

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      // Skip cards that explicitly show "Out of stock"
      const outOfStockBadge = await card.locator('[data-test="out-of-stock"]').count();
      if (outOfStockBadge > 0) continue;

      // Skip cards whose product name hasn't loaded yet (lazy-loaded)
      const nameLocator = card.locator('[data-test="product-name"]');
      if ((await nameLocator.count()) === 0) continue;
      const name = await nameLocator.textContent();
      if (!name || name.trim() === '') continue;

      // Click the card and check if add-to-cart is enabled
      await card.click();
      await this.page.waitForURL(/.*\/product\/.*/);

      const addToCart = this.page.getByTestId('add-to-cart');
      try {
        await addToCart.waitFor({ state: 'visible', timeout: 10000 });
        const isEnabled = await addToCart.isEnabled();
        if (isEnabled) {
          if (inStockCount === nthInStock) {
            clicked = true;
            break;
          }
          inStockCount++;
        }
        // Go back and try next product
        await this.page.goBack();
        await this.productCards.first().waitFor({ state: 'visible' });
      } catch (e) {
        // Product page didn't load properly, go back and try next
        await this.page.goBack();
        await this.productCards.first().waitFor({ state: 'visible' });
      }
    }

    if (!clicked) {
      throw new Error("No in-stock product found in catalog");
    }
  }

  async getProductNames() {
    return this.productCards.locator('[data-test="product-name"]').allTextContents();
  }

  async getProductPrices() {
    return this.productCards.locator('[data-test="product-price"]').allTextContents();
  }

  async sortBy(label) {
    await this.sortSelect.selectOption({ label });
    // Wait for the product list to refresh
    await this.productCards.first().waitFor({ state: 'visible' });
    await this.page.waitForTimeout(2000);
  }

  async filterByCategory(categoryName) {
    // Find the category checkbox by its label text
    const categoryCheckbox = this.page.locator('label', { hasText: categoryName }).locator('[data-test^="category-"]');
    await categoryCheckbox.check();
    // Wait for the product list to refresh
    await this.productCards.first().waitFor({ state: 'visible' });
    await this.page.waitForTimeout(2000);
  }

  async getProductCardCount() {
    return this.productCards.count();
  }
}

module.exports = { CatalogPage };
