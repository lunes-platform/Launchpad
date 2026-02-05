import { app } from '../app';
import { envConfig } from '../config/env.config';

// Mock routes to avoid DB connections
jest.mock('../modules/auth/auth.routes', () => ({
  authRoutes: async (fastify: any) => {},
}));
jest.mock('../modules/users/user.routes', () => ({
  userRoutes: async (fastify: any) => {},
}));
jest.mock('../modules/projects/project.routes', () => ({
  projectRoutes: async (fastify: any) => {},
}));
jest.mock('../modules/analytics/analytics.routes', () => ({
  analyticsRoutes: async (fastify: any) => {},
}));
jest.mock('../modules/ama/ama.routes', () => ({
  amaRoutes: async (fastify: any) => {},
}));

describe('Rate Limiting Security Check', () => {
  beforeAll(async () => {
    // Initialize the app (middlewares + routes)
    await app.initialize();

    // Ensure we have a limit set for testing
    // Note: The limit is mocked in jest.setup.js or env.config via process.env
    // but here we rely on what the app loaded.
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should enforce rate limits on endpoints', async () => {
    const limit = envConfig.RATE_LIMIT_MAX_REQUESTS;
    const requests = [];

    // Send 'limit' requests which should succeed
    for (let i = 0; i < limit; i++) {
      requests.push(
        app.server.inject({
          method: 'GET',
          url: '/health',
        })
      );
    }

    const responses = await Promise.all(requests);

    // Check that all initial requests succeeded (200 OK)
    responses.forEach((res, index) => {
      expect(res.statusCode).toBe(200);
    });

    // The next request should fail with 429
    const blockedResponse = await app.server.inject({
      method: 'GET',
      url: '/health',
    });

    // This is the assertion that will fail initially (when rate limit is disabled)
    // When disabled, it will return 200.
    // When enabled, it should return 429.
    expect(blockedResponse.statusCode).toBe(429);

    const body = JSON.parse(blockedResponse.payload);
    // The global error handler wraps the error in an 'error' object
    expect(body.success).toBe(false);
    expect(body.error.code).toBe(429);
    expect(body.error.message).toContain('Muitas tentativas');
  });
});
