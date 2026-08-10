import http from "k6/http";

function generateTestUser() {
  const timestamp = Date.now();

  return {
    first_name: "John",
    last_name: "Doe",
    address: "Street 1, House 12",
    city: "City",
    state: "State",
    country: "Country",
    postal_code: "1234AA",
    phone: `098765${String(timestamp).slice(-4)}`,
    dob: "1970-01-01",
    password: "SuperSecure@12345",
    email: `k6.performance.${timestamp}@example.com`,
  };
}

export function registerAndLogin(baseUrl) {
  const user = generateTestUser();

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const registerRes = http.post(`${baseUrl}/users/register`, JSON.stringify(user), { headers });

  if (registerRes.status !== 201) {
    throw new Error(`Registration failed: HTTP ${registerRes.status} - ${registerRes.body}`);
  }

  const loginRes = http.post(
    `${baseUrl}/users/login`,
    JSON.stringify({
      email: user.email,
      password: user.password,
    }),
    { headers },
  );

  if (loginRes.status !== 200) {
    throw new Error(`Authentication failed: HTTP ${loginRes.status} - ${loginRes.body}`);
  }

  const body = JSON.parse(loginRes.body);

  if (!body.access_token) {
    throw new Error("Authentication succeeded but no token was returned.");
  }

  return body.access_token;
}
