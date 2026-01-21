import { app } from '../../app';
import { FastifyInstance } from 'fastify';

describe('Security: Rate Limiting', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    // Initialize the app (register middlewares and routes)
    await app.initialize();
    server = app.server;
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should limit requests when exceeding the threshold', async () => {
    const limit = 100; // Default limit in env.config.ts
    const extraRequests = 10;
    const totalRequests = limit + extraRequests;
    const url = '/api/v1/auth/nonce/0x1234567890123456789012345678901234567890';

    // We expect the first 'limit' requests to succeed (200)
    // And the subsequent requests to fail (429) if rate limiting is enabled.

    // Rate limiting is ENABLED, so we expect to hit 429 eventually.

    let rateLimitTriggered = false;

    for (let i = 0; i < totalRequests; i++) {
      const response = await server.inject({
        method: 'GET',
        url,
      });

      if (response.statusCode === 429) {
        rateLimitTriggered = true;
        // Verify response structure - expecting Global Error Handler format
        const body = JSON.parse(response.payload);
        expect(body.success).toBe(false);
        expect(body.error.code).toBe(429);
        expect(body.error.message).toMatch(/Muitas tentativas/);
        break;
      }
    }

    // Assert that rate limit WAS triggered
    expect(rateLimitTriggered).toBe(true);
  });
});
