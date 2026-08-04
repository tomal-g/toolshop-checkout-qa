class ProductPage {
  constructor(page) {
    this.page = page;
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.productName = page.getByTestId('product-name');
  }

  async addToCart() {
    await this.addToCartButton.click();
    // Wait for the cart quantity badge to update, confirming the item was added
    await this.page.getByTestId('cart-quantity').waitFor({ state: 'visible' });
  }
}

module.exports = { ProductPage };