## 2024-05-23 - Rate Limiting & Input Validation
**Vulnerability:** The application had rate limiting explicitly disabled in code, and the `getNonce` endpoint relied on manual type casting without runtime validation.
**Learning:** Comments like "DESABILITADO PARA DESENVOLVIMENTO" can easily persist into production if not managed via environment variables. Type casting in TypeScript (`as Type`) does not provide runtime security.
**Prevention:** Always use environment variables to toggle security features instead of commenting out code. Use schema validation libraries like Zod for all inputs, especially `request.params`.
