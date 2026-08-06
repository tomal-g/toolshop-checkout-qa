class CartPage {
  constructor(page) {
    this.page = page;
    this.proceedButton = page.getByTestId('proceed-1');
    this.cartItems = page.locator('table tbody tr');
    this.cartTotal = page.getByTestId('cart-total');
    this.productTitles = page.getByTestId('product-title');
    this.productQuantities = page.getByTestId('product-quantity');
    this.productPrices = page.getByTestId('product-price');
    this.linePrices = page.getByTestId('line-price');
    this.removeButtons = page.locator('a.btn-danger');
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

  async getCartTotal() {
    const totalText = await this.cartTotal.textContent();
    return parseFloat(totalText.replace('$', ''));
  }

  async getProductTitles() {
    return this.productTitles.allTextContents();
  }

  async getProductPrices() {
    const prices = await this.productPrices.allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  async getLinePrices() {
    const prices = await this.linePrices.allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  async getProductQuantities() {
    const quantities = await this.productQuantities.all();
    const values = [];
    for (const q of quantities) {
      values.push(parseInt(await q.inputValue()));
    }
    return values;
  }

  async updateQuantity(index, quantity) {
    const input = this.productQuantities.nth(index);
    // Read the current total before updating
    const beforeTotal = await this.getCartTotal();

    // Use the native input value setter to properly trigger Angular's ngModel
    await input.evaluate((el, value) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, String(quantity));
    await input.blur();

    // Wait for the total to actually change (Angular recalculation)
    await this.page.waitForFunction(
      (prevTotal) => {
        const el = document.querySelector('[data-test="cart-total"]');
        if (!el) return false;
        const current = parseFloat(el.textContent.replace('$', '').trim());
        return !isNaN(current) && Math.abs(current - prevTotal) > 0.001;
      },
      beforeTotal,
      { timeout: 15000 }
    );
  }

  async removeItem(index) {
    // Get the current item count before removing
    const beforeCount = await this.productTitles.count();

    // Try data-test attribute first, fall back to btn-danger class
    const removeBtn = this.page.locator('[data-test="remove"]').nth(index);
    if ((await removeBtn.count()) > 0) {
      await removeBtn.click();
    } else {
      await this.removeButtons.nth(index).click();
    }

    // Wait for the item count to decrease
    await this.page.waitForFunction(
      (prevCount) => {
        return document.querySelectorAll('[data-test="product-title"]').length < prevCount;
      },
      beforeCount,
      { timeout: 15000 }
    );
  }

  async getItemCount() {
    return this.cartItems.count();
  }
}

module.exports = { CartPage };
