import { app } from '../app';
import { envConfig } from '../config/env.config';

describe('Rate Limit Security', () => {
  beforeAll(async () => {
    // Modify config to be strict
    // We cast to any because properties might be readonly or typed strictly,
    // though in env.config.ts they are just properties of an interface.
    (envConfig as any).RATE_LIMIT_MAX_REQUESTS = 2;
    (envConfig as any).RATE_LIMIT_WINDOW_MS = 1000; // 1 second

    // Initialize the app (registers plugins including rate-limit)
    await app.initialize();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should block requests exceeding the rate limit', async () => {
    // Request 1 - Should pass
    const res1 = await app.server.inject({
      method: 'GET',
      url: '/health'
    });
    expect(res1.statusCode).toBe(200);

    // Request 2 - Should pass
    const res2 = await app.server.inject({
      method: 'GET',
      url: '/health'
    });
    expect(res2.statusCode).toBe(200);

    // Request 3 - Should fail with 429
    const res3 = await app.server.inject({
      method: 'GET',
      url: '/health'
    });

    // We expect 429. If rate limit is disabled, this will be 200.
    expect(res3.statusCode).toBe(429);

    const payload = JSON.parse(res3.payload);
    // The global error handler wraps the error
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe(429);
    // The message should come from our rate limit configuration
    expect(payload.error.message).toContain('Muitas tentativas');
  });
});
