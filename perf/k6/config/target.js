export function getBaseUrl() {
  const baseUrl = __ENV.BASE_URL;

  if (!baseUrl) {
    throw new Error("BASE_URL is required. Example: --env BASE_URL=http://localhost:8091");
  }

  return baseUrl.replace(/\/$/, "");
}

export function requireCredentials() {
  if (!__ENV.TEST_USER) {
    throw new Error("TEST_USER environment variable is required.");
  }

  if (!__ENV.TEST_PASSWORD) {
    throw new Error("TEST_PASSWORD environment variable is required.");
  }
}

export function validatePublicTarget() {
  const baseUrl = getBaseUrl();

  const isPublicApi = baseUrl === "https://api.practicesoftwaretesting.com";

  if (isPublicApi && __ENV.ALLOW_PUBLIC_API !== "true") {
    throw new Error(
      "Public API execution is disabled. Set ALLOW_PUBLIC_API=true only after explicit authorization.",
    );
  }

  return baseUrl;
}
