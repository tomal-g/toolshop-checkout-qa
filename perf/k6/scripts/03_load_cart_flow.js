import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Rate } from "k6/metrics";
import { THRESHOLDS } from "../config/thresholds.js";
import { validatePublicTarget } from "../config/target.js";
import { registerAndLogin } from "../lib/auth.js";

const cartCreateTime = new Trend("cart_create_response_time", true);
const addItemTime = new Trend("add_item_response_time", true);
const errorRate = new Rate("cart_flow_error_rate");

export const options = {
  stages: [
    { duration: "2m", target: 30 },
    { duration: "8m", target: 30 },
    { duration: "2m", target: 0 },
  ],

  thresholds: {
    ...THRESHOLDS.cartCreate,
    ...THRESHOLDS.addItem,
    ...THRESHOLDS.errors,
  },
};

export function setup() {
  const baseUrl = validatePublicTarget();
  const authToken = registerAndLogin(baseUrl);

  const productsRes = http.get(`${baseUrl}/products?page=1`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (productsRes.status !== 200) {
    throw new Error(`Product lookup failed during setup: HTTP ${productsRes.status}`);
  }

  const products = JSON.parse(productsRes.body).data || [];

  if (products.length === 0) {
    throw new Error("No products returned during setup.");
  }

  return {
    baseUrl,
    authToken,
    productId: products[0].id,
  };
}

export default function (data) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${data.authToken}`,
  };

  // Create cart
  const cartRes = http.post(`${data.baseUrl}/carts`, null, { headers });

  cartCreateTime.add(cartRes.timings.duration);

  const cartCreated = check(cartRes, {
    "cart created with 201": (r) => r.status === 201,
    "cart contains ID": (r) => {
      try {
        return JSON.parse(r.body).id !== undefined;
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!cartCreated);

  if (!cartCreated) {
    sleep(1);
    return;
  }

  const cartId = JSON.parse(cartRes.body).id;

  // Add product
  const itemRes = http.post(
    `${data.baseUrl}/carts/${cartId}/items`,
    JSON.stringify({
      product_id: data.productId,
      quantity: 1,
    }),
    { headers },
  );

  addItemTime.add(itemRes.timings.duration);

  const itemAdded = check(itemRes, {
    "item added with 201": (r) => r.status === 201,
  });

  errorRate.add(!itemAdded);

  sleep(2);
}
