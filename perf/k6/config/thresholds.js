export const THRESHOLDS = {
  products: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },

  productDetail: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },

  cartCreate: {
    cart_create_response_time: ["p(95)<800"],
  },

  addItem: {
    add_item_response_time: ["p(95)<800"],
  },

  errors: {
    cart_flow_error_rate: ["rate<0.01"],
    http_req_failed: ["rate<0.01"],
  },

  spike: {
    spike_error_rate: ["rate<0.10"],
    http_req_failed: ["rate<0.10"],
  },

  soak: {
    soak_response_time: ["p(95)<1200", "p(99)<2500"],
    soak_error_rate: ["rate<0.05"],
    http_req_failed: ["rate<0.05"],
  },
};
