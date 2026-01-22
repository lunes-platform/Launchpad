# Sentinel Journal

## 2024-05-22 - Missing Test Infrastructure & Disabled Rate Limiting
**Vulnerability:** The backend had NO executed tests (despite having `jest` in dependencies) and Rate Limiting was explicitly commented out in `app.ts`.
**Learning:** Checking for test files is not enough; one must verify they run. A project can have "test" scripts that do nothing. Also, "disabled for development" comments often leak into production if not handled by conditional logic.
**Prevention:** Always run the test suite as part of the initial scan. Use conditional logic (e.g., `if (env.isProduction)`) instead of commenting out security features.
