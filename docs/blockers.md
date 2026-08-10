# Blockers

## BLK-001 — Local /products Endpoint Returns HTTP 500

| Field           | Detail       |
| --------------- | ------------ |
| **ID**          | BLK-001      |
| **Date**        | 2026-08-03   |
| **Environment** | Local Docker |
| **Severity**    | High         |
| **Status**      | Open         |

**Description:**
The local Toolshop Docker stack consistently returns HTTP 500 for `GET /products`.

**Diagnostics completed:**

- ✅ Laravel bootstraps successfully (`php artisan about` — Laravel 11.54, debug ON)
- ✅ Routes registered correctly (`php artisan route:list` — `ProductController@index` present)
- ✅ Database connectivity confirmed (`DB::connection()->getPdo()` returns valid PDO)
- ✅ Request reaches the container (`docker compose logs -f laravel-api` shows `GET /index.php 500`)
- ❌ No Laravel exception or stack trace generated — rules out standard application exception
- ❌ Internal `curl` attempts (`localhost/products`, `localhost/index.php/products`) inconclusive

**Root cause:** Unknown. Endpoint-specific application behavior suspected. Requires source-level debugging beyond QA scope.

**Resolution:** API automation continues against public stable API (`https://api.practicesoftwaretesting.com`).

## BLK-004 — Cart Add-Item Endpoint Unavailable on Bug-Seeded API

| Field           | Detail                                                                      |
| --------------- | --------------------------------------------------------------------------- |
| **ID**          | BLK-004                                                                     |
| **Date**        | 10-08-2026                                                                  |
| **Environment** | Bug-seeded public API (`https://api-with-bugs.practicesoftwaretesting.com`) |
| **Severity**    | High                                                                        |
| **Status**      | Open                                                                        |

**Description:**
The bug-seeded API does not provide the cart add-item endpoint required by the performance test scenario. `POST /carts` successfully creates a cart, but `POST /carts/{cartId}/items` returns HTTP 404 with `{"message":"Resource not found"}`.

**Diagnostics completed:**

- `GET /products?page=1` returns HTTP 200 with product data.
- Authentication succeeds against the bug-seeded API.
- `POST /carts` returns HTTP 201 and a valid cart ID.
- `POST /carts/{cartId}/items` returns HTTP 404 (`Resource not found`).
- The failure was reproduced independently using `diagnose_cart_add.js`.
- The required cart add-item operation cannot therefore be performance-tested against this environment.

**Root cause:** The bug-seeded API environment does not expose/support the cart add-item endpoint required by T5.1.

**Impact:**
The cart create/add performance scenario (`03_load_cart_flow.js`) cannot be validly completed against the bug-seeded environment. The observed 404 is an environment/API availability issue rather than evidence of a performance threshold failure.

**Resolution:** Cart add-item performance testing is blocked for the bug-seeded environment. The test remains in the performance suite for execution against an environment that exposes the required endpoint. Stable API execution was considered but deferred because of its short authentication-token lifetime and the additional setup overhead it introduces.
