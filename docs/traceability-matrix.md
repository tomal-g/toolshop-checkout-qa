| Requirement | Description                   | Manual TC(s)           | API Test(s)                 | Playwright Test(s)  | Performance             | Status      |
| ----------- | ----------------------------- | ---------------------- | --------------------------- | ------------------- | ----------------------- | ----------- |
| AC-01       | Registered checkout           | TC-P01, TC-P08         | T3.3 Registered Checkout    | E2E-01, E2E-08      | —                       | Manual Done |
| AC-02       | Guest checkout                | TC-P02                 | T3.3 Guest Checkout         | E2E-02              | —                       | Manual Done |
| AC-03       | Cart calculations             | TC-P03, TC-P04, TC-P05 | Cart Math Validation        | E2E-03, E2E-04      | —                       | Manual Done |
| AC-04       | Validation of required fields | TC-N01, TC-N02         | Invalid Checkout Validation | E2E-06              | —                       | Manual Done |
| AC-05       | Product filtering & sorting   | TC-P06, TC-P07         | Products Filter/Sort API    | E2E-07              | —                       | Manual Done |
| AC-06       | Authorization & IDOR          | TC-S01, TC-S02         | Auth Matrix / IDOR          | —                   | —                       | Manual Done |
| NFR-01      | GET /products latency ≤500ms  | —                      | —                           | —                   | k6 Load Test - Products | Planned     |
| NFR-02      | Add-to-cart latency ≤800ms    | —                      | —                           | —                   | k6 Load Test - Cart     | Planned     |
| NFR-03      | Error rate <1%                | —                      | —                           | —                   | k6 Thresholds           | Planned     |
| NFR-04      | WCAG 2.1 AA                   | TC-S03                 | —                           | axe-core Checkout   | —                       | Manual Done |
| NFR-05      | Chromium/Firefox/WebKit       | —                      | —                           | Cross-browser Suite | —                       | Planned     |
