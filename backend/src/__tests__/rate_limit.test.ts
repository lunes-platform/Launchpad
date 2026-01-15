import { app } from '../app';
import { envConfig } from '../config/env.config';

describe('Rate Limiting', () => {
  beforeAll(async () => {
    // Start the app to initialize routes and middlewares
    // We mocked PORT=0 so it should pick a random port and not conflict
    await app.start();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should enforce rate limits', async () => {
    const limit = envConfig.RATE_LIMIT_MAX_REQUESTS;
    console.log(`Testing rate limit with max requests: ${limit}`);

    // Make 'limit' requests
    const promises = [];
    for (let i = 0; i < limit; i++) {
        const p = app.server.inject({
            method: 'GET',
            url: '/health'
        });
        promises.push(p);
    }

    const results = await Promise.all(promises);

    // Verify all initial requests were successful
    results.forEach((res, index) => {
        if (res.statusCode !== 200) {
            console.error(`Request ${index} failed with ${res.statusCode}: ${res.payload}`);
        }
        expect(res.statusCode).toBe(200);
    });

    // The next one should fail with 429
    const response = await app.server.inject({
        method: 'GET',
        url: '/health'
    });

    console.log(`Last request status: ${response.statusCode}`);
    expect(response.statusCode).toBe(429);
  }, 10000);
});
