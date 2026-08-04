# API Test Summary

## Environment
- Stable: https://api.practicesoftwaretesting.com
- Bug-seeded: https://api-with-bugs.practicesoftwaretesting.com

## Endpoints Tested

| Endpoint | Method | Happy Path | Negative | Security |
|---|---|---|---|---|
| /users/login | POST | ✓ | — | ✓ |
| /users/me | GET | ✓ | — | ✓ |
| /carts | POST | ✓ | — | — |
| /carts/{id} | POST | ✓ | ✓ | — |
| /carts/{id} | GET | ✓ | — | — |
| /products | GET | ✓ | — | — |
| /invoices | POST | ✓ | — | ✓ |
| /invoices/{id} | GET | ✓ | — | ✓ |
| /invoices | GET | ✓ | — | ✓ |
| /payment/check | POST | ✓ | — | ✓ |

## Acceptance Criteria Coverage

| AC | Description | Status | Notes |
|---|---|---|---|
| AC-01 | | Covered | |
| AC-02 | | Covered | |
| AC-03 | Cart totals | Partial | GET /carts returns no subtotal/tax |
| AC-04 | | Covered | |
| AC-05 | | Covered | |
| AC-06 | | Covered | |

## Known Limitations

- AC-03 cannot be fully validated — cart endpoint returns no total/tax fields
- IDOR test - complete
- Local Docker API blocked — /products returns HTTP 500, no Laravel exception

## Defects

See docs/defects.md