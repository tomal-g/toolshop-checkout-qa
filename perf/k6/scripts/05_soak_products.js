import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Rate } from "k6/metrics";
import { THRESHOLDS } from "../config/thresholds.js";
import { validatePublicTarget } from "../config/target.js";
import { registerAndLogin } from "../lib/auth.js";

const responseTime = new Trend("soak_response_time", true);
const errorRate = new Rate("soak_error_rate");

export const options = {
  stages: [
    { duration: "2m", target: 20 },
    { duration: "30m", target: 20 },
    { duration: "2m", target: 0 },
  ],

  thresholds: {
    ...THRESHOLDS.soak,
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

  responseTime.add(res.timings.duration);

  const successful = check(res, {
    "status is 200": (r) => r.status === 200,
  });

  errorRate.add(!successful);

  sleep(3);
}
