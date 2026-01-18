## 2026-01-18 - Rate Limiting & Dependency Compatibility

**Vulnerability:** Rate limiting was explicitly commented out in `backend/src/app.ts`, exposing the API to DoS and brute-force attacks. Additionally, `fastify-jwt` v10 was installed but is incompatible with Fastify v4, preventing the application/tests from starting.

**Learning:** Security features like rate limiting should never be disabled in the main codebase. Use environment variables to configure limits (e.g., higher limits for dev) rather than disabling the middleware. Also, verify peer dependencies when updating packages.

**Prevention:** Added a test case `backend/src/__tests__/rate_limit.test.ts` to enforce rate limiting is active. Downgraded `@fastify/jwt` to `^8.0.0` to match Fastify v4.
