# Blockers

## BLK-001 — Local /products Endpoint Returns HTTP 500

| Field | Detail |
|-------|--------|
| **ID** | BLK-001 |
| **Date** | 2026-08-03 |
| **Environment** | Local Docker |
| **Severity** | High |
| **Status** | Open |

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