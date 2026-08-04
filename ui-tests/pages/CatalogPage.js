class CatalogPage {
  constructor(page) {
    this.page = page;
    this.productCards = page.locator('[data-test^="product-"]');
    this.searchInput = page.getByTestId("search-query");
    this.searchButton = page.getByTestId("search-submit");
  }

  async navigate() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  async clickProduct(index = 0) {
    await this.productCards.nth(index).click();
    await this.page.waitForURL(/.*\/product\/.*/); // wait for URL to change to product detail
    // Product content is loaded via API after the URL changes; wait for it to be ready
    await this.page.getByTestId('add-to-cart').waitFor({ state: 'visible' });
  }

  //   async clickProduct(index = 0) {
  //     await this.productCards.nth(index).click();
  //     await this.page.waitForLoadState("networkidle");
  //   }
}

module.exports = { CatalogPage };
