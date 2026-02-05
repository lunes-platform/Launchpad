## 2026-02-05 - Rate Limiting & Dependency Compatibility
**Vulnerability:** API endpoints were vulnerable to DoS/Brute-force because rate limiting was commented out in `app.ts`. Also, the build was broken due to `@fastify/jwt` version mismatch.
**Learning:** `fastify-rate-limit` errors (code 429) may be treated as 500s by global error handlers if they check `error.statusCode` but the plugin only provides `error.code` (as a number or string). Explicit handling of `error.code === 429` is necessary for correct status codes. Additionally, Fastify v4 requires `@fastify/jwt` < v10.
**Prevention:** Always test error scenarios (like rate limit exceeded) to verify the correct status code is returned. Pin dependencies strictly when working with Fastify plugins due to rapid version changes.
