import { app } from '../app';

describe('Rate Limit Middleware', () => {
  beforeAll(async () => {
    // Initialize the app (middlewares + routes)
    // process.env.RATE_LIMIT_MAX_REQUESTS was set to '5' in jest.setup.js
    // process.env.RATE_LIMIT_WINDOW_MS was set to '1000' in jest.setup.js
    await app.initialize();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should enforce rate limits', async () => {
    // Make requests up to the limit (5)
    for (let i = 0; i < 5; i++) {
      const response = await app.server.inject({
        method: 'GET',
        url: '/health',
      });
      expect(response.statusCode).toBe(200);
    }

    // The next request should be rate limited
    const response = await app.server.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(429);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe(429);
    expect(body.error.message).toContain('Muitas tentativas');
  });
});
