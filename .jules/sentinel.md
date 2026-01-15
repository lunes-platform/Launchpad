## 2026-01-15 - Rate Limiting Disabled by Default
**Vulnerability:** Rate limiting middleware was explicitly commented out in the codebase, leaving the API vulnerable to DoS and brute-force attacks.
**Learning:** Security features like rate limiting should be enabled by default with safe defaults, rather than disabled. Configuration should be handled via environment variables, not by commenting out code.
**Prevention:** Enable rate limiting middleware globally with permissive defaults for development, and strict defaults for production. Ensure CI/CD pipelines run security tests that verify these protections are active.
