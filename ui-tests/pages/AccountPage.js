class AccountPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = page.getByTestId("nav-cart");
    this.accountMenu = page.getByTestId("nav-menu");
    this.pageTitle = page.getByTestId("page-title");
    this.invoiceTable = page.locator('table');
    this.invoiceRows = page.locator('table tbody tr');
  }

  async navigate() {
    await this.page.goto("/account", { waitUntil: "domcontentloaded" });
    await this.pageTitle.waitFor({ state: "visible" });
  }

  async navigateToInvoices() {
    await this.page.goto("/account/invoices", { waitUntil: "domcontentloaded" });
    await this.pageTitle.waitFor({ state: "visible" });
  }

  async getInvoiceCount() {
    return this.invoiceRows.count();
  }

  async getInvoiceNumbers() {
    return this.invoiceRows.locator('td').first().allTextContents();
  }
}

module.exports = { AccountPage };