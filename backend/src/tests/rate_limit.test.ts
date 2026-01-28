import { envConfig } from '../config/env.config';
import { app } from '../app';

describe('Rate Limiting', () => {
  beforeAll(async () => {
    // Configure rate limit for testing
    // We override the values directly on the singleton
    (envConfig as any).RATE_LIMIT_MAX_REQUESTS = 2;
    (envConfig as any).RATE_LIMIT_WINDOW_MS = 1000;

    // Initialize the app (registers plugins)
    await app.initialize();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should enforce rate limits', async () => {
    // Request 1: OK
    const response1 = await app.server.inject({
      method: 'GET',
      url: '/health',
    });
    expect(response1.statusCode).toBe(200);

    // Request 2: OK
    const response2 = await app.server.inject({
      method: 'GET',
      url: '/health',
    });
    expect(response2.statusCode).toBe(200);

    // Request 3: Rate Limited
    const response3 = await app.server.inject({
      method: 'GET',
      url: '/health',
    });
    expect(response3.statusCode).toBe(429);

    const body = JSON.parse(response3.payload);
    expect(body.success).toBe(false);
    expect(body.error).toBeDefined();
    expect(body.error.code).toBe('RATE_LIMIT_EXCEEDED');
    expect(body.error.message).toContain('Rate limit exceeded');
  });
});
