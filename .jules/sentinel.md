## 2026-01-16 - Dependency Version Mismatch in Fastify Ecosystem
**Vulnerability:** Application availability risk (DoS) due to dependency incompatibility.
**Learning:** `package.json` contained `@fastify/jwt` v10 which requires Fastify v5, but Fastify v4 was installed. This caused the application to crash on startup (`FST_ERR_PLUGIN_VERSION_MISMATCH`). The build process (`tsc`) did not catch this as it only checks types.
**Prevention:** Pin dependencies strictly when working with Fastify plugins, or use `npm audit` and runtime checks in CI to detect startup failures. When upgrading Fastify plugins, always check the required Fastify version.
