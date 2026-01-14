import { app } from '../app';

// Mock envConfig before importing app (jest.mock is hoisted automatically)
jest.mock('../config/env.config', () => {
  const actual = jest.requireActual('../config/env.config');
  return {
    envConfig: {
      ...actual.envConfig,
      RATE_LIMIT_MAX_REQUESTS: 2,
      RATE_LIMIT_WINDOW_MS: 60000, // 1 minute
      NODE_ENV: 'test',
    },
  };
});

describe('Rate Limiting Security', () => {
  beforeAll(async () => {
    await app.initialize();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should enforce rate limits', async () => {
    // Request 1: Allowed
    const res1 = await app.server.inject({
      method: 'GET',
      url: '/health',
    });
    expect(res1.statusCode).toBe(200);

    // Request 2: Allowed
    const res2 = await app.server.inject({
      method: 'GET',
      url: '/health',
    });
    expect(res2.statusCode).toBe(200);

    // Request 3: Blocked (Limit is 2)
    const res3 = await app.server.inject({
      method: 'GET',
      url: '/health',
    });

    expect(res3.statusCode).toBe(429);
    const body = JSON.parse(res3.body);
    expect(body.error.message).toMatch(/Rate limit exceeded/i);
  });
});
