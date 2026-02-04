## 2024-05-22 - [Insecure Production Defaults]
**Vulnerability:** The application was configured to fall back to hardcoded "dev" credentials (e.g., 'dev-access-key') for critical services (AWS, SMTP) if the environment variables were missing in production.
**Learning:** Checking `NODE_ENV === 'production'` is not enough; we must explicitly validate the presence of *all* required secrets to prevent silent failures or insecure fallbacks.
**Prevention:** Maintain a strict `requiredProdVars` list in `env.config.ts` and ensure it covers all external service credentials.
