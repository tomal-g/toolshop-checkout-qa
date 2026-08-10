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

  thresholds: THRESHOLDS.products,
};

export function setup() {
  const baseUrl = validatePublicTarget();
  const authToken = registerAndLogin(baseUrl);

  return {
    baseUrl,
    authToken,
  };
}

export default function (data) {
  const res = http.get(`${data.baseUrl}/products?page=1`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${data.authToken}`,
    },
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response has product data": (r) => {
      try {
        return Array.isArray(JSON.parse(r.body).data);
      } catch {
        return false;
      }
    },
  });

  sleep(2);
}
