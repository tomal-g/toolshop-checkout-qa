class AccountPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = page.getByTestId("nav-cart");
    this.accountMenu = page.getByTestId("nav-menu");
  }

  async navigate() {
    await this.page.goto("/account");
    await this.page.waitForLoadState("networkidle");
  }
}

module.exports = { AccountPage };
