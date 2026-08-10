class ConfirmationPage {
  constructor(page) {
    this.page = page;
    this.successMessage = page.getByTestId('payment-success-message');
  }
}

module.exports = { ConfirmationPage };