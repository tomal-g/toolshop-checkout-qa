class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.country = page.getByTestId("country");
    this.postalCode = page.getByTestId("postal_code");
    this.houseNumber = page.getByTestId("house_number");
    this.street = page.getByTestId("street");
    this.city = page.getByTestId("city");
    this.state = page.getByTestId("state");
    this.proceedPastLogin = page.getByTestId('proceed-2');
    this.proceedPastAddress = page.getByTestId("proceed-3");
    this.paymentMethod = page.getByTestId("payment-method");
    this.confirmButton = page.getByTestId("finish");
    this.guestTab = page.locator('a[data-bs-toggle="tab"][href="#guest-tab"]');
    this.guestEmail = page.getByTestId("guest-email");
    this.guestFirstName = page.getByTestId("guest-first-name");
    this.guestLastName = page.getByTestId("guest-last-name");
    this.guestSubmit = page.getByTestId("guest-submit");
    this.proceedPastGuest = page.getByTestId("proceed-2-guest");
  }

  async proceedFromLogin() {
    await this.proceedPastLogin.waitFor({ state: 'visible' });
    await this.proceedPastLogin.click();
    await this.country.waitFor({ state: 'visible' });
  }

  async proceedAsGuest(email, firstName, lastName) {
    await this.guestTab.click();
    await this.guestEmail.waitFor({ state: 'visible' });
    await this.guestEmail.fill(email);
    await this.guestFirstName.fill(firstName);
    await this.guestLastName.fill(lastName);
    await this.guestSubmit.click();
    await this.proceedPastGuest.waitFor({ state: 'visible' });
    await this.proceedPastGuest.click();
    await this.country.waitFor({ state: 'visible' });
  }

  async fillAddress(country, postalCode, houseNumber) {
    await this.country.waitFor({ state: 'visible' });
    await this.country.selectOption(country);
    await this.postalCode.waitFor({ state: 'visible' });
    await this.postalCode.fill(postalCode);
    await this.houseNumber.waitFor({ state: 'visible' });
    await this.houseNumber.fill(houseNumber);
    await this.street.waitFor({ state: 'visible' });
  }

  async proceedFromAddress() {
    await this.proceedPastAddress.waitFor({ state: 'visible' });
    await this.proceedPastAddress.click();
    await this.paymentMethod.waitFor({ state: 'visible' });
  }

  async selectPaymentMethod(method) {
    await this.paymentMethod.waitFor({ state: 'visible' });
    await this.paymentMethod.selectOption(method);
  }

  async confirm() {
    await this.confirmButton.waitFor({ state: 'visible' });
    await this.confirmButton.click();
    await this.page.getByTestId('payment-success-message').waitFor({ state: 'visible' });
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  async confirmInvoice() {
    const confirmBtn = this.page.locator('button:has-text("Confirm")');
    if ((await confirmBtn.count()) > 0 && (await confirmBtn.isVisible())) {
      await confirmBtn.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
    }
  }
}

module.exports = { CheckoutPage };