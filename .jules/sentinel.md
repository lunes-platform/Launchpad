# Sentinel Journal

## 2026-01-07 - Rate Limiting Implementation
**Vulnerability:** Missing rate limiting on sensitive API endpoints (auth, user data).
**Learning:** The `@fastify/rate-limit` plugin was present but commented out. Also, the project has a dependency mismatch where `@fastify/jwt` v10 (for Fastify v5) is installed alongside Fastify v4, causing runtime errors when trying to verify the app, although it might compile.
**Prevention:** Enable rate limiting by default. Ensure dependencies are compatible (Fastify v5 vs v4 plugins). Always verify plugin compatibility when upgrading major versions.
