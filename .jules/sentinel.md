## 2024-05-22 - [Critical] Enabled Global Rate Limiting
**Vulnerability:** The application had rate limiting middleware installed but explicitly commented out (`DESABILITADO PARA DESENVOLVIMENTO`).
**Learning:** Security controls disabled for development often accidentally make it to production if not controlled by environment flags rather than code comments.
**Prevention:** Always use configuration flags (e.g., `ENABLE_RATE_LIMIT=true`) to toggle features instead of commenting out code. Commented-out security code is a major risk.
