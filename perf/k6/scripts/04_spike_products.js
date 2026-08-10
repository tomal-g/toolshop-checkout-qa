import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Counter } from "k6/metrics";
import { THRESHOLDS } from "../config/thresholds.js";
import { validatePublicTarget } from "../config/target.js";
import { registerAndLogin } from "../lib/auth.js";

const errorRate = new Rate("spike_error_rate");
const rateLimited = new Counter("spike_rate_limited");

export const options = {
  stages: [
    { duration: "2m", target: 10 },
    { duration: "30s", target: 200 },
    { duration: "3m", target: 200 },
    { duration: "2m", target: 10 },
    { duration: "3m", target: 10 },
  ],

  thresholds: {
    ...THRESHOLDS.spike,
  },
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

  const acceptable = check(res, {
    "status is 200 or 429": (r) => r.status === 200 || r.status === 429,
    "response is not 5xx": (r) => r.status < 500,
  });

  errorRate.add(!acceptable);

  if (res.status === 429) {
    rateLimited.add(1);
  }

  sleep(0.5);
}
