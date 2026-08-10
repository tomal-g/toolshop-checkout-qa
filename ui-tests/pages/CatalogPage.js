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
    await this.productCards.first().waitFor({ state: "visible", timeout: 30000 });
  }

  async clickProduct(nthInStock = 0) {
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

    const cards = this.productCards;
    const count = await cards.count();
    let inStockCount = 0;
    let clicked = false;

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const outOfStockBadge = await card.locator('[data-test="out-of-stock"]').count();
      if (outOfStockBadge > 0) continue;

      const nameLocator = card.locator('[data-test="product-name"]');
      if ((await nameLocator.count()) === 0) continue;
      const name = await nameLocator.textContent();
      if (!name || name.trim() === '') continue;

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
        await this.page.goBack();
        await this.productCards.first().waitFor({ state: 'visible' });
      } catch (e) {
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
    await this.productCards.first().waitFor({ state: 'visible' });
    await this.page.waitForTimeout(2000);
  }

  async filterByCategory(categoryName) {
    const categoryCheckbox = this.page.locator('label', { hasText: categoryName }).locator('[data-test^="category-"]');
    await categoryCheckbox.check();
    await this.productCards.first().waitFor({ state: 'visible' });
    await this.page.waitForTimeout(2000);
  }

  async getProductCardCount() {
    return this.productCards.count();
  }
}

module.exports = { CatalogPage };
