import { app } from '../app';
import { envConfig } from '../config/env.config';

describe('Rate Limiting', () => {
  beforeAll(async () => {
    // Override config for testing to use low limits
    (envConfig as any).RATE_LIMIT_MAX_REQUESTS = 3;
    (envConfig as any).RATE_LIMIT_WINDOW_MS = 1000 * 60; // 1 minute

    await app.initialize();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should enforce rate limits', async () => {
    const url = '/health';

    // Make 3 allowed requests
    for (let i = 0; i < 3; i++) {
      const response = await app.server.inject({
        method: 'GET',
        url,
      });
      expect(response.statusCode).toBe(200);
    }

    // The 4th request should fail with 429
    const response = await app.server.inject({
      method: 'GET',
      url,
    });

    expect(response.statusCode).toBe(429);

    const body = JSON.parse(response.payload);

    // Check if the response matches what we defined in app.ts errorResponseBuilder
    // OR if it's intercepted by global error handler.
    // In app.ts:
    // errorResponseBuilder: (request, context) => ({
    //   code: 429,
    //   error: 'Rate Limit Exceeded',
    //   message: ...,
    //   expiresIn: ...
    // })

    // If global handler intercepts, it usually formats as { success: false, error: ... }
    // But fastify-rate-limit might send response before global handler sees it as an exception.
    // Let's check for 429 code first.

    // We expect the message to contain "Muitas tentativas"
    if (body.message) {
        expect(body.message).toContain('Muitas tentativas');
    } else if (body.error && body.error.message) {
        expect(body.error.message).toContain('Muitas tentativas');
    } else {
        // Fail if structure is unexpected
        console.log('Unexpected response body:', body);
        expect(body).toHaveProperty('code', 429); // Fallback check
    }
  });
});
