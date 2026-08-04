## DEF-001

**Endpoint:** POST /carts  
**Environment:** Bug Seeded  
**Expected:** HTTP 201 with cart ID  
**Actual:** HTTP 404 with { "message": 'Resource not found' }  
**Severity:** Critical  
**Classification:** Intentional bug  
**Evidence:** Newman CLI output / bug-seeded-report.html

## DEF-002

**Endpoint:** POST /carts/{{cartId}}  
**Environment:** Bug Seeded  
**Expected:** HTTP 200 with {
"result": "item added or updated"
}  
**Actual:** HTTP 404 with { "message": 'Resource not found' }  
**Severity:** Critical  
**Classification:** Intentional bug  
**Evidence:** Newman CLI output / bug-seeded-report.html

## DEF-003

**Endpoint:** GET /carts/{{cartId}}  
**Environment:** Bug Seeded  
**Expected:** HTTP 200 with cart_items, length, valid first cart item quantity, and product details  
**Actual:** HTTP 404 with { "message": 'Resource not found' }  
**Severity:** Critical  
**Classification:** Intentional bug  
**Evidence:** Newman CLI output / bug-seeded-report.html

## DEF-004

**Endpoint:** POST /invoices  
**Environment:** Bug Seeded  
**Expected:** HTTP 200 with invoice ID  
**Actual:** HTTP 422 with no invoice ID  
**Severity:** Critical  
**Classification:** Intentional bug  
**Evidence:** Newman CLI output / bug-seeded-report.html

## DEF-005

**Endpoint:** GET /invoices/{{invoiceId}}  
**Environment:** Bug Seeded  
**Expected:** HTTP 200 with invoice fields matching submission  
**Actual:** HTTP 404 with invoice fields not matching submission  
**Severity:** Critical  
**Classification:** Intentional bug  
**Evidence:** Newman CLI output / bug-seeded-report.html

## DEF-006

**Endpoint:** GET /invoices?page=1  
**Environment:** Bug Seeded  
**Expected:** HTTP 200 with created invoice appearing in list and response containing data array  
**Actual:** HTTP 200 with and response containing data array but created invoice not appearing in list  
**Severity:** Critical  
**Classification:** Intentional bug  
**Evidence:** Newman CLI output / bug-seeded-report.html

## DEF-007

**Endpoint:** GET /invoices  
**Environment:** Bug Seeded  
**Expected:** HTTP 401 or 403  
**Actual:** HTTP 200 with response body  
**Severity:** Critical  
**Classification:** Intentional bug  
**Evidence:** Newman CLI output / bug-seeded-report.html

## DEF-008

**Endpoint:** POST /payment/check  
**Environment:** Bug Seeded  
**Expected:** HTTP 401 or 403  
**Actual:** HTTP 200 with {
"message": "Payment was successful"
}  
**Severity:** Critical  
**Classification:** Intentional bug  
**Evidence:** Newman CLI output / bug-seeded-report.html

## DEF-009

**Endpoint:** POST /invoices  
**Environment:** Bug Seeded  
**Expected:** HTTP 200 with response containing invoice ID  
**Actual:** HTTP 422 with containing message asking to fill required fields  
**Severity:** Critical  
**Classification:** Intentional bug  
**Evidence:** Newman CLI output / bug-seeded-report.html
