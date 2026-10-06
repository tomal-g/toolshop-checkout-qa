const { test, expect } = require("@playwright/test");
const { CatalogPage } = require("../../pages/CatalogPage");
const { ProductPage } = require("../../pages/ProductPage");
const { CartPage } = require("../../pages/CartPage");
const { CheckoutPage } = require("../../pages/CheckoutPage");
const { AccountPage } = require("../../pages/AccountPage");
const { ensureLoggedIn } = require("../../fixtures/auth-helper");

test.describe("E2E-08: Order History", () => {
  test("completed order appears in order history", async ({ page }) => {
    await ensureLoggedIn(page);

    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const account = new AccountPage(page);

    await catalog.navigate();
    await catalog.clickProduct(0);
    await product.addToCart();

    await cart.navigate();
    await cart.proceedToCheckout();
    await checkout.proceedFromLogin();
    await checkout.fillAddress("US", "10001", "123");
    await checkout.proceedFromAddress();
    await checkout.selectPaymentMethod("cash-on-delivery");
    await checkout.confirm();
    await checkout.confirmInvoice();

    await account.navigateToInvoices();

    await expect(account.pageTitle).toHaveText("Invoices");

    await expect.poll(async () => {
      const table = page.locator('table');
      if ((await table.count()) === 0) return 0;
      return table.locator('tbody tr').count();
    }, {
      message: "expected at least one invoice row to appear",
      timeout: 20000,
    }).toBeGreaterThan(0);
  });
});