# AUT Reconnaissance

**Feature:** TS-1420 — Registered & Guest Checkout with Payment  
**Environment:** https://practicesoftwaretesting.com  
**Date:** 30 July 2026

---

# Objective

Explore the application before designing manual, API, and automation tests. Record verified application behavior, important observations, and implementation details.

---

# Phase A — Homepage

**Title**

TOOLSHOP DEMO

**URL**

https://practicesoftwaretesting.com/

## Navigation

- Home
- Categories
- Contact
- Sign In
- Language Selector

## Features

- Product grid
- Search
- Sorting
- Price slider
- Category filter
- Brand filter
- Sustainability filter
- Pagination

---

# Phase B — Product Browsing

## Sample Products

| Product            |  Price | Observation                                              |
| ------------------ | -----: | -------------------------------------------------------- |
| Combination Pliers | $14.15 | Loaded after ~2.7 seconds                                |
| Pliers             | $12.01 | Loaded after ~2.7 seconds                                |
| Bolt Cutters       | $48.41 | Failed to load on local machine; worked on other devices |

Observed product requests:

GET /products/{id}

---

# Phase C — Authentication

Login page:

https://practicesoftwaretesting.com/auth/login

Required fields

- Email
- Password

Successful login redirects to:

My Account

Observed network request

POST /users/login

Authentication endpoint verified via:

• Live Swagger UI
• Browser Network tab

Endpoint:

POST /users/login

---

# Phase D — Cart

Baseline product selected

Product:

Thor Hammer

Price:

$11.14

Observed requests

POST /carts

---

# Phase E — Checkout Flow

Observed checkout flow

Product
→ Cart
→ Login / Guest
→ Billing Address
→ Payment
→ Confirmation

Observed payment methods

- Bank Transfer
- Cash on Delivery
- Credit Card
- Buy Now Pay Later
- Gift Card

Successful payment displays

Payment was successful

Second confirmation displays

Invoice number

---

# Phase F — Invoices

Application uses an **Invoices** page rather than an Orders page.

Observation:

The shared seed account did not display the newly created invoice.

A newly registered account displayed invoices correctly.

---

# Phase G — Swagger Review

Reviewed endpoints

- POST /users/login
- GET /products
- POST /carts
- GET /carts
- POST /payment/check
- POST /invoices
- GET /invoices

Authentication mechanism was not immediately obvious from Swagger exploration and will be revisited during API implementation.

---

# General Observations

- Product details are loaded through API requests.
- Product detail pages show a noticeable loading delay (~2.7 s).
- Checkout contains multiple payment methods with client-side validation.
- Address fields are auto-populated after entering country, postal code, and house number.
