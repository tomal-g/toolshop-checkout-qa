# Toolshop Checkout QA — TS-1420

**Feature:** Registered & Guest Checkout with Payment  
**Executor:** Tomal (solo, 5-day sprint)  
**API Version:** Toolshop API v5.0.0 (OpenAPI 3.2.0)

---

## Environments

| Purpose | URL |
|---------|-----|
| UI (stable) | https://practicesoftwaretesting.com |
| UI (bug-seeded) | https://with-bugs.practicesoftwaretesting.com |
| API (stable) | https://api.practicesoftwaretesting.com |
| API (bug-seeded) | https://api-with-bugs.practicesoftwaretesting.com |
| Swagger UI | https://api.practicesoftwaretesting.com/api/documentation |
| UI (local) | http://localhost:4200 |
| API (local) | http://localhost:8091 |

---

## Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer 1 | customer@practicesoftwaretesting.com | welcome01 |
| Customer 2 | customer2@practicesoftwaretesting.com | welcome01 |
| Admin | admin@practicesoftwaretesting.com | welcome01 |

---

## Conventions

### Test IDs
- Manual: `TC-P##` (positive), `TC-N##` (negative), `TC-E##` (edge), `TC-S##` (security)
- Automated tests reference the manual TC ID in their title
  - Example: `test('TC-P01 — registered user happy path checkout', ...)`

### Locators (Playwright)
- **Primary:** `data-test` attributes via `getByTestId('...')`
- **Fallback:** Semantic selectors (`getByRole`, `getByLabel`)
- **Never:** XPath or positional CSS selectors

### Environment Variables
- Never hardcode credentials or base URLs
- Local: copy `.env.example` to `.env` and fill in
- CI: use GitHub Actions secrets

### Branching
- `main` is protected — no direct pushes
- Feature branches: `feature/day-1-setup`, `feature/day-2-api`, etc.
- One PR per phase; merge into `main` at end of each day

### Repo Layout
toolshop-qa/
├── api-tests/ → Postman collection or pytest suite  
├── ui-tests/ → Playwright POM + E2E specs  
├── perf/ → k6 scripts   
├── .github/  
│ └── workflows/ → GitHub Actions pipeline  
└── docs/  
├── README.md  
├── .gitignore  
├── .env.example  
└── LICENSE  