## 2024-05-23 - JWT Blacklist Bypass
**Vulnerability:** The application was not checking the JWT blacklist during request authentication, allowing revoked tokens (e.g., after logout) to remain valid until expiration.
**Learning:** Using `request.jwtVerify()` from `@fastify/jwt` only verifies the signature and expiration. It does not perform custom checks like blacklisting. A custom middleware wrapping `jwtVerify` is required.
**Prevention:** Always implement a central authentication middleware that explicitly checks the token status against a revocation list (Redis/Database) in addition to signature verification.
