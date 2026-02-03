## 2026-02-03 - Incomplete Token Revocation Check
**Vulnerability:** Protected routes relied solely on `request.jwtVerify()` which validates signature/expiry but ignores the Redis-based token blacklist.
**Learning:** Fastify's JWT plugin does not automatically integrate with application-level revocation lists. Middleware must explicitly check the blacklist after signature verification.
**Prevention:** Use the centralized `authenticate` middleware for all protected routes; avoid direct `request.jwtVerify()` calls in route handlers.
