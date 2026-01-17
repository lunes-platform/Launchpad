## 2026-01-17 - Dependency Incompatibility in Fastify Plugins
**Vulnerability:** Application failed to start due to incompatible plugin versions, preventing security tests.
**Learning:** `@fastify/jwt` v10+ requires Fastify v5. This project uses Fastify v4, so `@fastify/jwt` must be pinned to `^8.0.0`.
**Prevention:** Strictly manage peer dependencies and verify plugin compatibility when upgrading.

## 2026-01-17 - Error Handling Shadows Rate Limit Status
**Vulnerability:** Rate limiting was active but returned 500 Internal Server Error instead of 429, obscuring the cause.
**Learning:** The global `errorHandler` overrides status codes if `error.statusCode` is missing. `fastify-rate-limit` errors may present `code: 429` (property) but not `statusCode`.
**Prevention:** Ensure global error handlers check for both `statusCode` and known error `code` values.
