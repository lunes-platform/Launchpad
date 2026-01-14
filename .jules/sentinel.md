## 2026-01-14 - Dependency Version Mismatch blocking Testing/Startup
**Vulnerability:** Application crashed on startup/test due to `@fastify/jwt` v10 incompatibility with `fastify` v4 (requires v5).
**Learning:** `npm install` without lockfile or with loose versions can pull incompatible major versions if plugins break semver or update requirements faster than core.
**Prevention:** Pin dependencies strictly or ensure peer dependencies are checked. Use `pnpm` workspace strictness.

## 2026-01-14 - Rate Limiting Disabled in Production Code
**Vulnerability:** Rate limiting middleware was commented out in `app.ts`.
**Learning:** Security features should not be commented out for "development". They should be conditionally configured or enabled with looser limits.
**Prevention:** Use environment variables to control enablement or limits, never comment out code.
