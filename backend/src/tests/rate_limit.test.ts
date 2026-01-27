import { app } from '../app';
import { envConfig } from '../config/env.config';

describe('Rate Limit Security Test', () => {
  // Before running tests, we initialize the app
  beforeAll(async () => {
    // We must manually initialize because we are not calling start()
    await app.initialize();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should demonstrate that rate limiting is currently disabled', async () => {
    console.log('Configured Limit:', envConfig.RATE_LIMIT_MAX_REQUESTS);
    const limit = envConfig.RATE_LIMIT_MAX_REQUESTS;
    const statusCodes = [];

    // Send requests sequentially to be deterministic
    for (let i = 0; i < limit + 5; i++) {
      const response = await app.server.inject({
        method: 'GET',
        url: '/health'
      });
      statusCodes.push(response.statusCode);
    }

    const rateLimited = statusCodes.filter(code => code === 429);

    console.log('Status codes received:', statusCodes);

    expect(rateLimited.length).toBeGreaterThan(0);
    // The first 'limit' requests should be 200
    // Note: rate limit might be strictly > limit or >= limit depending on implementation
    // Usually, if limit is 5, 5 requests pass, 6th fails.
    expect(statusCodes.slice(0, limit).every(code => code === 200)).toBe(true);
    // The rest should be 429
    expect(statusCodes.slice(limit).every(code => code === 429)).toBe(true);
  });
});
