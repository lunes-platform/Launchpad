## 2024-05-23 - Rate Limiting Re-enabled
**Vulnerability:** Rate limiting was explicitly disabled in production code (`backend/src/app.ts`), leaving the API vulnerable to DoS and brute force attacks.
**Learning:** Security features are sometimes disabled during development for convenience and then forgotten.
**Prevention:** Use conditional logic (e.g. `if (isProduction)`) or lenient defaults rather than commenting out security code entirely. Always review commented-out code before release.
