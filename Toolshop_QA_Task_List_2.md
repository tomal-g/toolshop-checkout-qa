# Toolshop Checkout QA — Implementation Task List

**For:** 2 Junior QA Automation Engineers
**Parent spec:** `Toolshop_Checkout_QA_Task.md` (read this first — it has the full User Story, ACs, and test scenarios)
**Feature:** TS-1420 — Registered & Guest Checkout with Payment
**Duration:** 2-week sprint
**How to use this file:** Work top-to-bottom by phase. Each task has an **owner**, **depends-on**, **steps**, and a **Done when** gate. Don't start a task until its dependencies are green. Tick the boxes as you go.

---

## 0. Team & Ownership

| | Junior A — *UI & Automation track* | Junior B — *API, Performance & CI/CD track* |
|---|---|---|
| Primary | Manual UI test cases, Playwright framework + E2E tests, accessibility | API test suite, performance (k6), CI/CD pipeline |
| Shared | Environment setup, traceability matrix, defect logging, final report, sign-off |

> **Golden rule:** anything that needs a decision affecting both tracks (test-data conventions, naming, traceability IDs) is decided **together at kickoff** and written down in the README before coding starts.

---

## 1. Shared Reference Pack (everything you need)

### 1.1 Environments
| Purpose | URL |
|---------|-----|
| Web UI (stable) | `https://practicesoftwaretesting.com` |
| Web UI (bug-seeded) | `https://with-bugs.practicesoftwaretesting.com` |
| API (stable) | `https://api.practicesoftwaretesting.com` |
| API (bug-seeded) | `https://api-with-bugs.practicesoftwaretesting.com` |
| Swagger / OpenAPI docs | `https://api.practicesoftwaretesting.com/api/documentation` |
| OpenAPI JSON | `https://api.practicesoftwaretesting.com/docs?api-docs.json` |
| Source (self-host) | `github.com/testsmith-io/practice-software-testing` |

### 1.2 Local instance (REQUIRED for performance + CI)
```bash
git clone https://github.com/testsmith-io/practice-software-testing
cd practice-software-testing
docker compose up -d        # UI → http://localhost:4200 , API → http://localhost:8091
```
> Never run load tests against the shared public server. Point k6 at `http://localhost:8091`.

### 1.3 Seed accounts (verify against the login page before relying on them)
| Role | Email | Password |
|------|-------|----------|
| Customer | `customer@practicesoftwaretesting.com` | `welcome01` |
| Customer 2 | `customer2@practicesoftwaretesting.com` | `welcome01` |
| Admin | `admin@practicesoftwaretesting.com` | `welcome01` |

### 1.4 Key API endpoints (from the live OpenAPI spec)
| Method & Path | Purpose | Auth |
|---------------|---------|------|
| `POST /users/login` | Get JWT `access_token` | No |
| `GET /products?by_category={id}&between=price,10,30&sort=price,asc` | Browse/filter/sort | No |
| `GET /products/search?q=pliers` | Search | No |
| `GET /products/{productId}` | Product detail | No |
| `POST /carts` | Create cart → `{ "id": "<cartId>" }` | No |
| `POST /carts/{cartId}` `{ "product_id", "quantity" }` | Add item | No |
| `GET /carts/{cartId}` | Cart contents/totals | No |
| `PUT /carts/{cartId}/product/quantity` | Update quantity | No |
| `DELETE /carts/{cartId}/product/{productId}` | Remove item | No |
| `POST /payment/check` | Validate payment | No |
| `POST /invoices` / `POST /invoices/guest` | Create order/invoice | Registered: Yes |
| `GET /invoices` / `GET /invoices/{invoiceId}` | Order history / single order | Yes |

### 1.5 Toolchain to install
| Track | Tools |
|-------|-------|
| Junior A | Node.js LTS, `@playwright/test` (`npm init playwright@latest`), VS Code, an accessibility checker (axe-core / `@axe-core/playwright`) |
| Junior B | Postman + Newman (`npm i -g newman`) **or** Python + pytest + requests + jsonschema, k6 (`brew install k6` / choco / apt), Docker |
| Both | Git, a test-management sheet or tool (even a shared spreadsheet), GitHub account for the CI repo |

### 1.6 Conventions (agree once, write in README)
- **Repo layout:** `/api-tests`, `/ui-tests` (Playwright), `/perf` (k6), `/.github/workflows`, `/docs`.
- **Test IDs:** manual `TC-P/N/E/S##`; automated tests reference the manual TC ID in the title.
- **Locators (UI):** prefer the app's `data-test` attributes via `getByTestId`; confirm exact values in DevTools. No brittle XPath.
- **Secrets/config:** base URLs + credentials come from **env vars / CI secrets**, never hard-coded.
- **Branching:** `feature/<track>-<task-id>`; PR into `main`; no direct pushes to `main`.
- **Traceability:** every AC (AC-01…AC-06) and NFR maps to ≥ 1 test — maintained in one shared matrix.

---

## 2. Phase Plan (suggested 2-week schedule)

| Days | Phase | Junior A | Junior B |
|------|-------|----------|----------|
| 1 | Setup & kickoff | Env + Playwright scaffold | Env + Docker + Postman/pytest scaffold |
| 2 | Analysis | Traceability matrix (UI rows) | Traceability matrix (API/NFR rows) |
| 3–4 | Manual + API design | Write manual test cases | Build API suite skeleton + auth |
| 5–7 | Automation build | Playwright POM + E2E-01/02 | Complete API suite + schema + security |
| 8 | Cross-checks | E2E-03…08 | Run suite vs bug-seeded API |
| 9–10 | Perf + CI | Accessibility + stabilize | k6 scripts + report |
| 11–12 | CI/CD | Support pipeline (UI stage) | Build pipeline + gates |
| 13 | Docs & reports | Execution report (UI) | Perf + API reports |
| 14 | Closeout | Joint summary report + defect log + sign-off | (same) |

---

## 3. Task List

### PHASE 0 — Setup & Kickoff (both)

- [ ] **T0.1 (Both)** Kickoff meeting: read the parent spec together, agree conventions (§1.6), split test scenarios into UI vs API responsibility.
  - **Done when:** conventions written in README; each person knows their task list.
- [ ] **T0.2 (Both)** Create the shared Git repo with the folder layout in §1.6; add a README with env URLs, run instructions, and conventions.
  - **Done when:** repo exists, `main` protected, both have access.
- [ ] **T0.3 (Both)** Explore the AUT manually: place one real order on the stable UI and one via Swagger ("Authorize" with a JWT, then run the cart → payment → invoice chain).
  - **Done when:** each person has completed one manual end-to-end purchase and can describe the flow.
- [ ] **T0.4 (Junior B)** Stand up the local instance via Docker (§1.2); confirm UI on :4200 and API on :8091 respond.
  - **Done when:** `GET http://localhost:8091/products` returns data.

### PHASE 1 — Requirement Analysis (both)

- [ ] **T1.1 (Both)** Build the **traceability matrix**: rows = every AC (AC-01…06), FR, and NFR; columns = mapped manual TC IDs + automated test names + API test names. Junior A owns UI rows, Junior B owns API/NFR rows.
  - **Done when:** every AC/FR/NFR maps to ≥ 1 planned test; no gaps.

### PHASE 2 — Manual Test Cases (Junior A)

- [ ] **T2.1 (A)** Write **positive** test cases TC-P01…P07 (registered + guest checkout, cart math, filters, order history). Each: preconditions, steps, expected result, priority.
- [ ] **T2.2 (A)** Write **negative/validation** cases TC-N01…N05.
- [ ] **T2.3 (A)** Write **edge/boundary** cases TC-E01…E04.
- [ ] **T2.4 (A + B)** Write **security** cases TC-S01…S03 (A drafts UI-visible ones; B owns the API auth/IDOR ones).
- [ ] **T2.5 (A)** Execute all manual cases once on the **stable** UI and record pass/fail + evidence.
  - **Done when (Phase 2):** all P0/P1 cases written, reviewed by the other junior, executed, results recorded, and linked in the traceability matrix.

### PHASE 3 — API Test Suite (Junior B)

- [ ] **T3.1 (B)** Scaffold the API project (`/api-tests`): Newman collection **or** pytest. Add env config for base URL + credentials via env vars.
- [ ] **T3.2 (B)** Implement **auth**: `POST /users/login`, capture the JWT, and set `Authorization: Bearer` for protected calls.
- [ ] **T3.3 (B)** Implement the **checkout chain** tests: create cart → add item → get cart (assert totals = Σ price×qty) → `POST /payment/check` → `POST /invoices` (registered) and `POST /invoices/guest` → `GET /invoices/{id}`.
- [ ] **T3.4 (B)** Add **schema validation** for each response against the OpenAPI file (`ProductResponse`, `CartResponse`, `InvoiceResponse`, …).
- [ ] **T3.5 (B)** Add **negative/boundary** tests: quantity 0/negative/non-integer → `422`; unknown `product_id`; malformed payment; missing required fields.
- [ ] **T3.6 (B)** Add **auth/security matrix**: protected route with no token / expired token / another user's token (TC-S01, TC-S02 IDOR).
- [ ] **T3.7 (B)** Run the whole suite against the **bug-seeded API** and confirm it **catches** the seeded defects; log any real bugs found.
  - **Done when (Phase 3):** suite is green on stable, correctly red on bug-seeded, runnable from CLI (`newman run …` / `pytest`), and covers all rows assigned to it in the matrix.

### PHASE 4 — Playwright UI Automation (Junior A)

- [ ] **T4.1 (A)** Initialize Playwright with the **Page Object Model**; add base config (baseURL from env, 3 browser projects: Chromium/Firefox/WebKit; trace/video/screenshot on failure).
- [ ] **T4.2 (A)** Build an **auth fixture**: log in via `POST /users/login` and save `storageState` so tests that aren't testing login skip the login UI.
- [ ] **T4.3 (A)** Build **Page Objects**: Catalog/Search, Product Detail, Cart, Checkout (address + payment), Confirmation, Account/Orders — using `data-test` locators.
- [ ] **T4.4 (A)** Implement **E2E-01** (registered happy path) and **E2E-02** (guest checkout), with dual-layer assertions (UI text **and** intercepted `POST /invoices`).
- [ ] **T4.5 (A)** Implement **E2E-03…E2E-08**: cart math, remove item, invalid quantity, checkout blocked on missing fields, filter+sort, order-in-history.
- [ ] **T4.6 (A)** Tag tests `@smoke` / `@regression`; ensure the suite is stable (no hard sleeps, no flakes on 3 consecutive runs).
  - **Done when (Phase 4):** all in-scope journeys automated, green across all 3 browsers, stable, and using API-based setup where login isn't under test.

### PHASE 5 — Performance Testing (Junior B)

- [ ] **T5.1 (B)** Write k6 scripts under `/perf` against **localhost**: catalog browse (`GET /products`, `GET /products/{id}`) + cart create/add.
- [ ] **T5.2 (B)** Configure scenarios: **load** (200 VUs, 10–15 min), **stress**, **spike**, **soak**; encode thresholds as k6 `thresholds` (P95 `GET /products` ≤ 500 ms, P95 add-item ≤ 800 ms, error rate < 1%).
- [ ] **T5.3 (B)** Run and produce the **performance report**: latency distribution, throughput, error rate, bottleneck analysis, pass/fail per threshold.
  - **Done when (Phase 5):** scripts run headless, thresholds evaluated automatically, report written with an explicit verdict.

### PHASE 6 — CI/CD Pipeline (Junior B leads, Junior A supports)

- [ ] **T6.1 (B)** Create `.github/workflows/qa.yml` with stages: build/lint → api-tests → ui-smoke → perf-smoke, using CI secrets for config.
- [ ] **T6.2 (A)** Wire the **Playwright UI stage** (install browsers, run `@smoke` on PR, upload HTML report + traces as artifacts).
- [ ] **T6.3 (B)** Add the **quality gate**: pipeline fails if any suite fails or any k6 threshold is breached; publish all reports as artifacts.
- [ ] **T6.4 (B)** (Stretch) Spin up the Toolshop via Docker Compose inside CI so every run hits a clean instance.
  - **Done when (Phase 6):** pipeline runs on PR + merge, blocks on failure, and surfaces report links on the PR.

### PHASE 7 — Documentation, Reporting & Sign-off (both)

- [ ] **T7.1 (Both)** Complete the **traceability matrix** — every AC/FR/NFR shows executed, passing coverage.
- [ ] **T7.2 (A)** UI/manual **execution report**; **T7.2b (B)** API + performance reports.
- [ ] **T7.3 (Both)** Consolidate **defect reports** (reproducible, prioritized, with evidence — include bugs found on the bug-seeded sites).
- [ ] **T7.4 (Both)** Write the **test summary report** with a go/no-go recommendation.
- [ ] **T7.5 (Both)** Finalize the **README/runbook**: how to run api-tests, ui-tests, perf, and read CI results locally.
  - **Done when (Phase 7):** all Section-12 deliverables from the parent spec exist, reviewed, and merged.

---

## 4. Coordination / Handoff Points

- **After T1.1:** both agree on test-data conventions (which product, which user, which quantities) so UI and API tests use the same data.
- **Junior B → Junior A:** share the working login/JWT approach from T3.2 so A's `storageState` fixture (T4.2) reuses it.
- **Junior A → Junior B:** share `data-test` locator findings so any UI-driven checks in CI stay consistent.
- **Before CI (Phase 6):** both suites must run cleanly from the CLI locally, or the pipeline will just fail.

---

## 5. Definition of Done (whole task)

- [ ] Traceability matrix complete; every AC/FR/NFR covered by ≥ 1 executed test.
- [ ] All P0/P1 manual cases executed and recorded.
- [ ] API suite green on stable, red on bug-seeded, CI-runnable, schema-validated.
- [ ] Playwright suite covers all journeys, green cross-browser, stable (no flakes).
- [ ] All ACs (AC-01…06) pass.
- [ ] Performance thresholds met on the local instance.
- [ ] CI/CD pipeline runs all suites, blocks on failure, publishes reports.
- [ ] Security (JWT enforcement, IDOR, input sanitization) and accessibility (WCAG 2.1 AA on checkout) checks pass.
- [ ] Zero open Critical/High defects; Medium/Low triaged.
- [ ] All deliverables merged; README/runbook complete; joint summary report signed off.

---

## 6. Common Gotchas (read before you start)

- **Don't load-test the public server** — use the local Docker instance. Public perf runs will be throttled and skew results.
- **Cart IDs and JWTs expire** — create fresh setup data per test; don't reuse stale IDs across runs.
- **Seeded data can reset** — re-verify credentials/products if something 404s unexpectedly.
- **Bug-seeded ≠ broken tests** — when the suite goes red there, that's success; capture it as evidence, not a failure.
- **Keep secrets out of Git** — base URLs/creds via env vars from day one; retrofitting is painful.
- **Flaky tests fail the sprint** — fix the root cause (waits, data isolation), never add `sleep()`.
