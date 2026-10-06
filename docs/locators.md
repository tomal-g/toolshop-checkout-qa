# Playwright Locator Reference

## Login

| Element      | data-test    |
| ------------ | ------------ |
| Email        | email        |
| Password     | password     |
| Login button | login-submit |

---

## Product

| Element      | data-test    |
| ------------ | ------------ |
| Product name | product-name |
| Add to Cart  | add-to-cart  |

---

## Navigation

| Element | data-test |
| ------- | --------- |
| Cart    | nav-cart  |

---

## Checkout

| Element                       | data-test      |
| ----------------------------- | -------------- |
| Proceed to Checkout (Cart)    | proceed-1      |
| Proceed to Checkout (Login)   | proceed-2      |
| Proceed to Checkout (Address) | proceed-3      |
| Payment Method                | payment-method |
| Confirm Purchase              | finish         |

---

## Notes

Primary locator strategy:

page.getByTestId()

Fallbacks:

- getByRole()
- getByLabel()

Avoid XPath and positional CSS selectors.
