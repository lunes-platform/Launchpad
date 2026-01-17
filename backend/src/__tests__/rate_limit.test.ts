import { app } from '../app';

describe('Rate Limiting', () => {
  beforeAll(async () => {
    // Initialize app (registers middlewares and routes)
    // We access the public initialize method we added
    await app.initialize();
    await app.server.ready();
  });

  afterAll(async () => {
    await app.server.close();
  });

  it('should enforce rate limits', async () => {
    const maxRequests = 5; // As set in jest.setup.js

    // Send maxRequests allowed requests
    for (let i = 0; i < maxRequests; i++) {
      const response = await app.server.inject({
        method: 'GET',
        url: '/health',
      });

      if (response.statusCode !== 200) {
        console.error('Request failed with status:', response.statusCode, response.payload);
      }
      expect(response.statusCode).toBe(200);
    }

    // The next request should be blocked
    const blockedResponse = await app.server.inject({
      method: 'GET',
      url: '/health',
    });

    expect(blockedResponse.statusCode).toBe(429);
    const body = blockedResponse.json();
    expect(body.success).toBe(false);
    expect(body.error).toHaveProperty('code', 429);
    expect(body.error.message).toContain('Muitas tentativas');
  });
});
