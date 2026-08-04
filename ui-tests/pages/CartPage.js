class CartPage {
  constructor(page) {
    this.page = page;
    this.proceedButton = page.getByTestId('proceed-1');
    this.cartItems = page.getByTestId('cart-item');
  }

  async navigate() {
    await this.page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    // Wait for the proceed button (cart step) to be ready before continuing
    await this.proceedButton.waitFor({ state: 'visible' });
  }

  async proceedToCheckout() {
    await this.proceedButton.waitFor({ state: 'visible' });
    await this.proceedButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { CartPage };