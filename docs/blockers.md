# Blockers

## BLK-001 — Local /products Endpoint Returns HTTP 500

| Field | Detail |
|-------|--------|
| **ID** | BLK-001 |
| **Date** | 03-08-2026 |
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


## BLK-002 — Hard Waits Required for Filter/Sort/Order History Due to Unpredictable API Response Timing

| Field | Detail |
|-------|--------|
| **ID** | BLK-002 |
| **Date** | 10-08-2026 |
| **Environment** | Chromium E2E Tests |
| **Severity** | Medium |
| **Status** | Open |

**Description:**
Filter, sort, and order history operations require hard `page.waitForTimeout()` calls to pass reliably. Attempts to replace with polling logic (`waitForFunction`) result in race conditions and timeout failures.

**Root cause analysis:**
- **Filter/sort API responses:** Backend returns data at unpredictable intervals; polling for DOM state changes cannot reliably detect when product list has been re-fetched and re-rendered
- **Order history table:** Invoice creation is genuinely async (POST completes, but rows don't populate until backend job finishes); no DOM event signals completion
- **No test data hooks:** Application provides no API endpoint or database seeding mechanism to pre-create test invoices or control sort/filter response timing

**Tests affected:**
- E2E-07: Product Filtering & Sorting (sort ascending, sort descending, filter by category)
- E2E-08: Order History (invoice table population)

**Attempted solutions (failed):**
- ❌ `waitForFunction()` polling prices for sort order — times out on descending sort
- ❌ `waitForFunction()` polling product names for category match — times out inconsistently
- ❌ `waitForFunction()` polling invoice table rows — times out, table remains empty
- ❌ Extended `networkidle` waits — breaks auth flow, causes additional timeouts

**Current workaround:**
```javascript
// CatalogPage.sortBy() and filterByCategory()
await this.page.waitForTimeout(2000);

// AccountPage.navigateToInvoices()
await this.page.waitForTimeout(2000);
```

**Proper resolution:** Requires one of:
1. Backend test data seeding endpoint (e.g., `POST /api/test/seed-invoices`)
2. API response time guarantees documented and honored
3. Conditional test skips for known slow operations (not ideal)

**Recommendation:** Accept hard waits as technical debt. Document in test cases. Escalate to backend team for test infrastructure improvements.

## BLK-003 — Cross-Browser E2E Execution Deferred Due to Browser-Specific Test Stability

| Field | Detail |
|-------|--------|
| **ID** | BLK-003 |
| **Date** | 10-08-2026 |
| **Environment** | Firefox / WebKit E2E Tests |
| **Severity** | Medium |
| **Status** | Deferred |

**Description:**
The Toolshop E2E test suite is currently stable and fully passing on Chromium, but the same test suite does not achieve equivalent stability on Firefox and WebKit. Due to the asynchronous behavior and timing sensitivity already identified in BLK-002, cross-browser execution was deferred following mentor guidance.

**Current test status:**
- ✅ Chromium: 14/14 tests passing
- ⚠️ Firefox: Not considered stable enough for final execution
- ⚠️ WebKit: Not considered stable enough for final execution
- ⏸️ Cross-browser validation deferred pending resolution of underlying timing issues

**Relationship to BLK-002:**
The cross-browser limitation is primarily associated with the existing timing-sensitive behavior documented in BLK-002. Filter, sorting, and order-history operations depend on backend responses and UI updates that do not occur at predictable times. The current hard-wait workaround provides stable results on Chromium but does not provide sufficient confidence that the same timing assumptions will remain reliable across Firefox and WebKit.

**Tests potentially affected:**
- E2E-01 through E2E-08, where browser-specific timing or rendering behavior may affect execution
- Particularly E2E-07: Product Filtering & Sorting
- Particularly E2E-08: Order History

**Attempted approach:**
- ❌ Cross-browser execution does not currently provide the same stability as Chromium
- ❌ Replacing hard waits with polling logic was unsuccessful and introduced additional race conditions/timeouts (see BLK-002)
- ✅ Chromium execution retained as the stable baseline
- ⏸️ Firefox and WebKit execution deferred rather than treating unstable results as application defects

**Current workaround:**
Use Chromium as the supported execution browser for the current E2E test baseline.

The stable baseline is:

```text
Chromium — 14/14 passing
Firefox   — Deferred
WebKit    — Deferred