class ProductPage {
  constructor(page) {
    this.page = page;
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.productName = page.getByTestId('product-name');
    this.quantityInput = page.getByTestId('quantity');
    this.increaseQuantity = page.getByTestId('increase-quantity');
    this.decreaseQuantity = page.getByTestId('decrease-quantity');
    this.unitPrice = page.getByTestId('unit-price');
  }

  async addToCart() {
    // Wait for the button to be enabled (not out of stock)
    await this.addToCartButton.waitFor({ state: 'visible' });
    // Read the current cart quantity before adding (if present)
    const cartQty = this.page.getByTestId('cart-quantity');
    let beforeCount = 0;
    if ((await cartQty.count()) > 0) {
      const beforeText = (await cartQty.textContent()).trim();
      beforeCount = parseInt(beforeText) || 0;
    }

    await this.addToCartButton.click();

    // Wait for the cart quantity badge to appear and increment, confirming the item was added
    await cartQty.waitFor({ state: 'visible' });
    await this.page.waitForFunction(
      (prev) => {
        const el = document.querySelector('[data-test="cart-quantity"]');
        if (!el) return false;
        const current = parseInt(el.textContent.trim()) || 0;
        return current > prev;
      },
      beforeCount,
      { timeout: 15000 }
    );
  }

  async setQuantity(quantity) {
    await this.quantityInput.fill(String(quantity));
  }

  async getUnitPrice() {
    const priceText = await this.unitPrice.textContent();
    return parseFloat(priceText.replace('$', ''));
  }
}

module.exports = { ProductPage };
