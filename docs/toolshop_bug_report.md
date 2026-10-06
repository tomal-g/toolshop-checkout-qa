**Toolshop Checkout QA**

Bug Report - Manual Test Execution

31 July 2026

| **Application** | Toolshop (practicesoftwaretesting.com / api.practicesoftwaretesting.com) |
| --------------- | ------------------------------------------------------------------------ |
| **Role Tested** | Registered Customer · Guest                                              |
| **Tested By**   | Tomal Isidore Gomes                                                      |
| **Modules**     | Login · Product Catalog · Cart · Checkout · Order History · Security     |
| **Browser**     | Chromium (desktop)                                                       |
| **Date**        | 31 July 2026                                                             |

**Summary**

| **Category**             | **Count**  | **Bug IDs**       |
| ------------------------ | ---------- | ----------------- |
| Failed Tests (Hard Bugs) | 3          | BUG_001 - BUG_003 |
| **Total Reported**       | **3 bugs** | **-**             |

**Defect Rationale**

Three test cases returned a Failed status where the actual behaviour diverges from the expected behaviour in a way that affects user trust, data visibility, or error transparency:

- BUG_001 (TC-P02): Guest checkout completes but the user receives no confirmation or invoice - a core deliverable of the checkout flow is absent for guest users.
- BUG_002 (TC-P08): Order history is inconsistently populated - a registered user's newly placed order does not reliably appear in My Invoices, undermining post-purchase trust.
- BUG_003 (TC-E01): Accessing a non-existent product URL shows a silent empty state - no user-facing error, no redirect, no guidance.

**Defect Details**

| **BUG_001 · Guest Checkout - Order confirmation / invoice not displayed to guest user ● FAILED** | |
| --- | | --- |
| **Issue ID** | BUG_001 |
| **Test Case ID** | TC-P02 |
| **Summary** | Guest Checkout - Order confirmation / invoice not displayed to guest user |
| **Status** | **● FAILED** |
| **Environment** | QA - practicesoftwaretesting.com (Web, Chromium) |
| **Preconditions** | 1\. Toolshop application is accessible. 2. No login/session active. 3. At least one product is available for purchase. |
| **Steps to Reproduce** | 1\. Navigate to the Toolshop application without logging in. 2. Browse the product catalog. 3. Select an available product. 4. Add the product to the cart. 5. Proceed to checkout as guest. 6. Enter guest_email, guest_first_name, guest_last_name. 7. Enter a valid shipping address. 8. Enter valid payment details. 9. Complete the checkout process. 10. Observe the confirmation page. |
| **Test Data** | Guest Email: <guest.test@example.com> Guest First Name: John Guest Last Name: Doe Product: Any in-stock product Shipping Address: Valid address Payment Details: Valid payment information |
| **Expected Result** | 1\. Guest checkout form accepts guest details without requiring login. 2. Checkout completes successfully. 3. Order confirmation/invoice is displayed with guest details attached. 4. No validation or system errors are displayed. |
| **Actual Result** | 1\. Guest checkout form accepts guest details without requiring login. 2. Checkout completes successfully. 3. Order confirmation/invoice is NOT displayed with guest details attached. 4. No validation or system errors are displayed. |
| **Priority** | High (P0) |
| **Severity** | Medium |
| **Notes** | An invoice ID is obtained after payment is complete, but no order confirmation or invoice details are rendered for the guest user. Guest has no way to view their order post-checkout. |

| **BUG_002 · Newly placed order does not consistently appear in Order History / My Invoices ● FAILED** | |
| --- | | --- |
| **Issue ID** | BUG_002 |
| **Test Case ID** | TC-P08 |
| **Summary** | Newly placed order does not consistently appear in Order History / My Invoices |
| **Status** | **● FAILED** |
| **Environment** | QA - practicesoftwaretesting.com (Web, Chromium) |
| **Preconditions** | 1\. Registered customer account exists. 2. Customer has just completed a successful checkout (post TC-P01). |
| **Steps to Reproduce** | 1\. Log in as the registered customer. 2. Navigate to My Invoices. 3. Locate the order just placed. 4. Open the order detail. |
| **Test Data** | Account: <customer@practicesoftwaretesting.com> / welcome01 (Same account/session as TC-P01) |
| **Expected Result** | 1\. The newly placed order appears in the order history list. 2. Order detail matches the items, quantities, and total from checkout. 3. Invoice is retrievable and consistent with the order. |
| **Actual Result** | The newly placed order does not consistently appear in the order history list. For the default user (<customer@practicesoftwaretesting.com>), the newly placed order does not always appear in the invoice list. |
| **Priority** | High (P0) |
| **Severity** | High |
| **Notes** | Intermittent - not reproducible 100% of the time. May indicate a race condition or caching issue between order creation and invoice list population. |

| **BUG_003 · Navigating to a non-existent product ID shows empty state with no error message ● FAILED** | |
| --- | | --- |
| **Issue ID** | BUG_003 |
| **Test Case ID** | TC-E01 |
| **Summary** | Navigating to a non-existent product ID shows empty state with no error message |
| **Status** | **● FAILED** |
| **Environment** | QA - practicesoftwaretesting.com (Web, Chromium) |
| **Preconditions** | 1\. Toolshop application is accessible. 2. A product URL/ID pattern can be manipulated via the browser address bar. |
| **Steps to Reproduce** | 1\. Navigate to a valid product detail page. 2. Note the URL pattern (e.g., /product/{id}). 3. Manually edit the URL to use a non-existent product ID. 4. Load the page. 5. If the page loads, attempt to add the (non-existent) product to cart. |
| **Test Data** | Manipulated product URL using a non-existent product ID (changing the product detail URL's ID segment to an invalid value) |
| **Expected Result** | 1\. UI displays a "product not found" state or redirects to an error/404 page. 2. No "Add to Cart" action is possible, or attempting it produces a visible error. |
| **Actual Result** | 1\. UI displays an empty state with no error message or explanation shown to the user. 2. No "Add to Cart" action is possible. |
| **Priority** | Medium (P1) |
| **Severity** | Low |
| **Notes** | The system does not crash, but the silent empty state provides no feedback to the user. A clear "Product not found" message or a redirect to the catalog would improve UX and reduce user confusion. |

_This report covers hard failures only. Passed test cases (TC-P01, TC-P03-TC-P07, TC-N01-TC-N05, TC-E02-TC-E04, TC-S01-TC-S03) are documented separately in the manual test execution log._