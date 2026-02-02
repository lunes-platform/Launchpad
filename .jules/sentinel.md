## 2026-02-02 - Fastify Rate Limit Error Handling
**Vulnerability:** API endpoints were vulnerable to DoS/brute force because rate limiting was disabled.
**Learning:** `@fastify/rate-limit` errors (code 429) are not automatically mapped to HTTP 429 in a custom global error handler if the handler relies on `error.statusCode` which might be missing on the error object thrown by the plugin. It requires explicit checks for `error.code === 429` (numeric) or ensuring the plugin configuration sets the statusCode on the error object.
**Prevention:** Always verify that security middleware errors (like 429, 401, 403) are correctly intercepted and returned with the proper status code by the global error handler.
