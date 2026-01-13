## 2026-01-13 - [Revoked Token Bypass in Fastify JWT]
**Vulnerability:** The application relied solely on `request.jwtVerify()` which only validates the JWT signature and expiration. Revoked tokens (via logout) stored in Redis blacklist were not checked during authentication, allowing use of blacklisted tokens.
**Learning:** `fastify-jwt` (and similar libraries) are stateless by default. Stateful revocation checks must be explicitly implemented in the request lifecycle.
**Prevention:** Implement a global `onRequest` hook or a custom decorator that consults the blacklist/revocation store after extracting the token, ensuring every authenticated request is validated against the current state.
