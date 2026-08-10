# Toolshop Checkout QA — Parent Spec

**Feature ID:** TS-1420 — Registered & Guest Checkout with Payment
**System Under Test:** Toolshop (Practice Software Testing) — API v5.0.0 / OpenAPI 3.2.0
**Prepared for:** Solo QA execution (originally scoped as 2-person sprint; compressed to 1)
**Sprint length:** 5 working days

---

## 1. Fact-Check Notice (read first)

This spec corrects one thing found in the original AI-generated task list before any test case is written against them:

1. **Schema field names for `PaymentRequest`, `InvoiceRequest`, and `ProductResponse` were not independently verifiable** at spec-drafting time (the OpenAPI JSON fetch truncated past `/products/search`). **Before writing T3.3–T3.5, open Swagger UI (`https://api.practicesoftwaretesting.com/api/documentation`), expand these three schemas, and copy the literal field names/types into your test code.** Do not assume field names from this doc or from memory — verify from the live spec.

Everything else below (endpoint paths, cart/invoice flow, local Docker ports 4200/8091) was confirmed directly against the live OpenAPI 3.2.0 spec.

---

## 2. User Story

> **As a** customer (registered or guest) of the Toolshop,
> **I want** to browse products, build a cart, and complete checkout with a payment method,
> **so that** I can successfully place an order and receive a retrievable invoice/order record.

---

## 3. Acceptance Criteria

| ID        | Acceptance Criterion                                                                                                                                                                                                         |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AC-01** | A registered user can log in, add ≥1 product to cart, complete checkout, and receive a valid invoice retrievable via `GET /invoices/{id}` and visible in their order history.                                                |
| **AC-02** | A guest (no account) can complete checkout by providing `guest_email`, `guest_first_name`, `guest_last_name`, and receive a valid invoice via `POST /invoices/guest`.                                                        |
| **AC-03** | Cart totals are mathematically correct: `sum(unit_price × quantity)` for every line item, recalculated correctly after quantity updates and item removal.                                                                    |
| **AC-04** | Checkout cannot complete with invalid/missing required fields (address, payment details) — system returns `422` with field-level errors, no invoice is created.                                                              |
| **AC-05** | Product browsing supports filtering (`by_category`, `by_brand`, `is_rental`, `between=price,min,max`) and sorting (`sort=price,asc/desc`, `name,asc/desc`), and results match the applied filters.                           |
| **AC-06** | Security: protected endpoints (`GET /invoices`, `GET /invoices/{id}`, etc.) reject requests with no token (`401`) and reject a token belonging to a different user attempting to access another user's invoice (IDOR check). |

---

## 4. Non-Functional Requirements (NFRs)

| ID     | NFR                                 | Threshold                                                                 |
| ------ | ----------------------------------- | ------------------------------------------------------------------------- |
| NFR-01 | `GET /products` latency under load  | P95 ≤ 500 ms                                                              |
| NFR-02 | Add-item-to-cart latency under load | P95 ≤ 800 ms                                                              |
| NFR-03 | Error rate under load               | < 1%                                                                      |
| NFR-04 | Accessibility                       | WCAG 2.1 AA on checkout flow (axe-core, zero critical/serious violations) |
| NFR-05 | Cross-browser                       | Checkout flow passes on Chromium, Firefox, WebKit                         |

---

## 5. Test Scenarios (source material for manual + automated test case IDs)

### 5.1 Positive (TC-P01–P07)

- TC-P01: Registered user — full happy-path checkout (login → browse → cart → address → payment → invoice)
- TC-P02: Guest checkout — full happy-path (no login, guest fields on invoice)
- TC-P03: Cart math correctness — multiple items, multiple quantities
- TC-P04: Update quantity in cart — total recalculates
- TC-P05: Remove item from cart — total recalculates, item gone
- TC-P06: Filter products by category + price range, verify results
- TC-P07: Sort products by price asc/desc, verify order
- TC-P08 _(added)_: Order appears in registered user's order history (`GET /invoices`) after checkout

### 5.2 Negative / Validation (TC-N01–N05)

- TC-N01: Checkout with missing required address field → `422`, no invoice created
- TC-N02: Checkout with invalid/malformed payment details → rejected, no invoice created
- TC-N03: Add to cart with quantity `0`
- TC-N04: Add to cart with negative quantity
- TC-N05: Add to cart with non-integer quantity (e.g. `"abc"` or `2.5`) — per your established convention, test only the documented type violations; don't invent coercion cases beyond what the schema declares as invalid

### 5.3 Edge / Boundary (TC-E01–E04)

- TC-E01: Add to cart with unknown/non-existent `product_id`
- TC-E02: Cart with quantity at a very high boundary (e.g. 9999) — verify no overflow/rounding error in total
- TC-E03: Guest checkout with an already-registered email (verify system behavior — does it still allow guest checkout, or block it?)
- TC-E04: Retrieve an expired/deleted cart ID (`GET /carts/{cartId}` after `DELETE`) → expect `404`

### 5.4 Security (TC-S01–S03)

- TC-S01 (API, Junior B scope): Access `GET /invoices/{invoiceId}` with **no token** → expect `401`
- TC-S02 (API, Junior B scope): Access `GET /invoices/{invoiceId}` with **customer2's token** on **customer1's invoice ID** → IDOR check, expect `401`/`403`, not the other user's data
- TC-S03 (UI-visible, Junior A scope): Checkout form does not leak payment details in DOM/localStorage/console after submission; input sanitization on address/name fields (basic XSS payload in a text field does not execute)

---

## 6. Section 12 Deliverables (referenced by parent task list §7)

1. Traceability matrix (AC/FR/NFR → test IDs)
2. Manual test case log with pass/fail + evidence
3. API test suite (green on stable, red on bug-seeded)
4. Playwright E2E suite (cross-browser, stable)
5. k6 performance report with threshold verdicts
6. CI/CD pipeline (GitHub Actions) with quality gate
7. Defect log (from both stable and bug-seeded runs)
8. Test summary report with go/no-go recommendation
9. README/runbook
