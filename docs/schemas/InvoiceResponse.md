# InvoiceResponse

Source: Swagger POST /invoices and GET /invoices/{id} responses

Actual fields observed:

{  
"billing_street": "Janice Pocket",  
"billing_city": "Port Tristonville",  
"billing_state": "South Australia",  
"billing_country": "AU",  
"billing_postal_code": "1234",  
"user_id": "01KZ3H2E6H5V1TAEFQNF48W3H8",  
"invoice_date": "2026-08-03T10:45:22.850134Z",  
"invoice_number": "INV-2026000031",  
"id": "01kz3kmv97qsrrhywy80aryv14",  
"created_at": "2026-08-03T10:45:22.000000Z",  
"subtotal": 14.15,  
"total": 14.15,  
"status": "ON_HOLD",  
"status_message": null,  
"created_at": "2026-08-03T10:45:22.000000Z",  
"user_id": "01KZ3H2E6H5V1TAEFQNF48W3H8",  
"invoicelines": [  
{  
"id": "01kz3kmva31dq3w21dp62wnt4j",  
"invoice_id": "01kz3kmv97qsrrhywy80aryv14",  
"product_id": "01KZ3H2EEXX9XHHG1FQRXYJ3M7",  
"unit_price": 14.15,  
"quantity": 1,  
"discount_percentage": null,  
"discounted_price": null,  
"product": {  
"id": "01KZ3H2EEXX9XHHG1FQRXYJ3M7",  
"name": "Combination Pliers",  
"description": "Versatile combination pliers designed for gripping, bending, and cutting wire with ease. Featuring chrome vanadium steel construction with induction-hardened cutting edges, these pliers deliver excellent grip and leverage for a wide range of tasks. The precision-machined jaws combine flat gripping surfaces with a pipe-grip section and integrated wire cutter for true multi-purpose functionality. Ergonomic bi-component handles reduce hand fatigue during extended use and provide a secure hold even with oily or gloved hands. The joint is precisely fitted to eliminate play and ensure smooth operation over thousands of cycles. Ideal for electricians, mechanics, and DIY enthusiasts tackling everyday projects around the workshop or job site.",  
"price": 14.15,  
"co2_rating": "D",  
"is_rental": false,  
"in_stock": false,  
"is_eco_friendly": false,  
"product_image": {  
"id": "01KZ3H2EEBMSX5XZJEQRJW15MX",  
"by_name": "Helinton Fantin",  
"by_url": "https://unsplash.com/@fantin"  
},  
"category": {  
"id": "01KZ3H2EDZGX9BV2ENKXXKA7P9",  
"name": "Pliers"  
},  
"brand": {  
"id": "01KZ3H2E3VJMP1GMVM092PCXV5",  
"name": "ForgeFlex Tools"  
}  
}  
}  
],  
"payment": {  
"payment_method": "bank-transfer",  
"payment_details": {  
"bank_name": "abc",  
"account_name": "jane doe",  
"account_number": "0987654321"  
}  
}  
}
