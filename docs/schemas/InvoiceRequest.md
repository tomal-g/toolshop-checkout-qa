# InvoiceRequest

Source: Swagger POST /invoices request body

Actual fields observed:

{  
    "billing_street": "Janice Pocket",  
    "billing_city": "Port Tristonville",  
    "billing_state": "South Australia",  
    "billing_country": "AU",  
    "billing_postal_code": "1234",  
    "payment_method": "bank-transfer",  
    "cart_id": "{{cartId}}",  
    "payment_details": {  
        "bank_name": "abc",  
        "account_name": "jane doe",  
        "account_number": "0987654321"  
    }  
}