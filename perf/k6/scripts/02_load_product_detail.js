import http from "k6/http";
import { check, sleep } from "k6";
import { THRESHOLDS } from "../config/thresholds.js";
import { validatePublicTarget } from "../config/target.js";
import { registerAndLogin } from "../lib/auth.js";

export const options = {
  stages: [
    { duration: "2m", target: 200 },
    { duration: "8m", target: 200 },
    { duration: "2m", target: 0 },
  ],

  thresholds: THRESHOLDS.productDetail,
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
  const res = http.get(`${data.baseUrl}/products/${data.productId}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${data.authToken}`,
    },
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response contains product ID": (r) => {
      try {
        return JSON.parse(r.body).id !== undefined;
      } catch {
        return false;
      }
    },
  });

  sleep(2);
}
