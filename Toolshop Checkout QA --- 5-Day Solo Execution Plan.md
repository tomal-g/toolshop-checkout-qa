**Toolshop Checkout QA - 5-Day Solo Execution Plan**

**Day 1 - Setup, Reconnaissance, Traceability & Manual Foundation**

**Goal:** Get the environment understood and establish the shared testing foundation.

- **T0.1** - Read parent spec and establish conventions.
  - Test IDs: TC-P/N/E/S##
  - Repo structure: /api-tests, /ui-tests, /perf, /.github/workflows, /docs
  - Environment variables for credentials/base URLs.
- **T0.2** - Create/configure the Git repository and README.
- **T0.3** - Manually explore the stable AUT:
  - Registered checkout
  - Guest checkout
  - Cart → payment → invoice flow
  - Verify seed credentials
  - Inspect UI and record actual data-test attributes.
- **T0.4** - Verify local Docker instance:
  - UI → localhost:4200
  - API → localhost:8091
- **T1.1** - Start the traceability matrix.
  - Map AC-01-AC-06
  - Map NFRs
  - Map manual/API/UI/performance coverage.
- **T2.1** - Draft positive cases TC-P01-TC-P08.
- **T2.2** - Draft negative cases TC-N01-TC-N05.
- **T2.3** - Draft edge cases TC-E01-TC-E04.
- **T2.4** - Draft security cases TC-S01-TC-S03.
- Begin **API suite skeleton** alongside manual design.

**End-of-day gate:**  
Stable application understood, credentials/data verified, locators identified, repo structure ready, 20 manual cases drafted, traceability started, API project scaffolded.

**Day 2 - Manual Execution + API Authentication & Checkout Foundation**

**Goal:** Finish the manual foundation while getting the API chain working.

**Manual**

- **T2.5** - Execute all 20 manual cases against the stable UI.
- Record:
  - Pass/fail
  - Evidence
  - Defects
  - Actual behavior for ambiguous cases such as TC-E03.

The parent spec explicitly requires manual execution with pass/fail evidence as a deliverable.

**API**

- **T3.1** - Complete API project configuration.
- **T3.2** - Implement authentication using the **verified POST /login** endpoint.
- Capture JWT and configure authenticated requests.
- **T3.3** - Build the checkout chain:

Create cart

↓

Add product

↓

Get cart

↓

Validate quantity/totals

↓

Payment check

↓

Create registered invoice

↓

Create guest invoice

↓

Retrieve invoice

- Implement assertions for cart mathematical correctness based on AC-03.

**Important:** Don't implement schema-dependent assertions until the Swagger schemas have been manually verified.

**End-of-day gate:**  
Manual suite executed; API login works; registered and guest checkout API chains are functioning.

**Day 3 - API Completion + Schema Validation + Playwright Foundation**

**Goal:** Finish the API layer and start UI automation using what was learned from manual exploration.

**API**

- **T3.4** - Schema validation.
  - ProductResponse
  - CartResponse
  - InvoiceResponse
  - PaymentRequest
  - InvoiceRequest
  - Other relevant schemas.

Before coding the uncertain schemas, manually copy the literal field names/types from Swagger, as required by the parent spec.

- **T3.5** - Negative/boundary API tests:
  - Quantity 0
  - Negative quantity
  - Non-integer quantity
  - Unknown product_id
  - Malformed payment
  - Missing required fields
- **T3.6** - Security matrix:
  - No token → 401
  - Invalid/expired token
  - Customer 2 accessing Customer 1's invoice → IDOR check.
- **T3.7** - Run API suite against bug-seeded API and document caught defects.

**Playwright**

- **T4.1** - Initialize Playwright + POM.
- Configure:
  - Chromium
  - Firefox
  - WebKit
  - Environment-based baseURL
  - Failure traces/screenshots/video.
- **T4.2** - Implement authentication/storage state.
- **T4.3** - Start Page Objects:
  - Catalog/Search
  - Product Detail
  - Cart
  - Checkout
  - Confirmation
  - Account/Orders.

**End-of-day gate:**  
API suite green on stable and demonstrating expected failures on bug-seeded environment; Playwright framework and core POM structure operational.

**Day 4 - Playwright E2E + Accessibility + Stabilization**

**Goal:** Complete the UI automation layer and make it reliable.

**Playwright**

- **T4.4**
  - E2E-01 - Registered happy path
  - E2E-02 - Guest checkout
  - UI assertions + intercepted invoice API assertions.
- **T4.5**
  - E2E-03 - Cart math
  - E2E-04 - Remove item
  - E2E-05 - Invalid quantity
  - E2E-06 - Missing checkout fields
  - E2E-07 - Filter/sort
  - E2E-08 - Order history.
- **T4.6**
  - @smoke
  - @regression
  - Remove flaky waits
  - Run repeatedly
  - Verify Chromium/Firefox/WebKit.

The source task list specifically requires three consecutive stable runs and no hard sleeps.

**Accessibility / Security**

- Run checkout accessibility checks with axe-core.
- Cover the UI-visible portion of TC-S03:
  - Payment details not unnecessarily exposed
  - Basic XSS input sanitization.

**Documentation**

- Update traceability matrix with actual automated test names.
- Start defect consolidation.

**End-of-day gate:**  
Playwright suite passes across all three browsers with no known flakiness; accessibility/security checks executed.

**Day 5 - k6 + CI/CD + Reports + Final QA Gate**

**Goal:** Turn the completed test layers into a runnable QA pipeline and produce the final deliverables.

**Performance**

- **T5.1** - Build k6 scripts against **local Docker**, not the public server.
  - GET /products
  - GET /products/{id}
  - Cart creation
  - Cart add-item.
- **T5.2** - Configure:
  - Load: 200 VUs, 10-15 min
  - Stress
  - Spike
  - Soak
  - Thresholds:
    - Products P95 ≤ 500 ms
    - Add-item P95 ≤ 800 ms
    - Error rate < 1%.
- **T5.3** - Generate performance report and explicit threshold verdict.

These thresholds come directly from the parent NFRs and implementation task list.

**CI/CD**

- **T6.1** - Create GitHub Actions workflow.
- **T6.2** - Add Playwright smoke stage.
- **T6.3** - Add quality gates:
  - API failure → pipeline fails
  - UI failure → pipeline fails
  - k6 threshold breach → pipeline fails.
- Upload:
  - API results
  - Playwright HTML report
  - traces/screenshots
  - k6 report.
- **T6.4** - Docker-in-CI only if time permits; this remains a stretch task in the source.

**Finalization**

- **T7.1** - Complete traceability matrix.
- **T7.2** - Consolidate manual/API/UI/performance reports.
- **T7.3** - Final defect log.
- **T7.4** - Test summary + go/no-go recommendation.
- **T7.5** - README/runbook.

The final deliverables should match the parent's Section 12 list.

**The compressed execution flow**

| **Day** | **Primary focus**                      | **Secondary work**            |
| ------- | -------------------------------------- | ----------------------------- |
| **1**   | Setup + reconnaissance + manual design | API skeleton                  |
| **2**   | Manual execution + API foundation      | Auth + checkout chain         |
| **3**   | API completion                         | Playwright framework + POM    |
| **4**   | Playwright E2E                         | Accessibility + stabilization |
| **5**   | k6 + CI/CD                             | Reports + final sign-off      |