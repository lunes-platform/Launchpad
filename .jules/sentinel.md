## 2024-05-22 - Incomplete Token Revocation Bypass
**Vulnerability:** The application implemented a token blacklist mechanism in `AuthService` but failed to enforce it in the API routes. The `preHandler` hooks only called `request.jwtVerify()`, which validates the signature and expiration but ignores the blacklist. This meant that a "logged out" token (present in the blacklist) could still be used to access protected endpoints until it naturally expired.
**Learning:** Security features must be enforced at the gate (middleware). Implementing a service method (`isTokenBlacklisted`) is useless if it's not invoked during the request lifecycle. Code duplication in route definitions (`preHandler` blocks) makes it easy to miss security checks and hard to update them globally.
**Prevention:**
1.  Centralize authentication logic in a single middleware (e.g., `auth.middleware.ts`).
2.  Avoid inline `preHandler` definitions that repeat boilerplate code.
3.  Ensure that "logout" actions actually invalidate the session on the server side (via blacklist/revocation list) and that this list is checked on *every* request.
