import 'reflect-metadata';
import { App } from '../app';

// Mock database and redis to avoid connection attempts during app initialization
jest.mock('../shared/database', () => ({
  database: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    prisma: {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    }
  },
  prisma: {
    user: {
      findUnique: jest.fn(),
    }
  }
}));

jest.mock('../shared/redis', () => ({
  redisService: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  },
  initializeRedis: jest.fn(),
  closeRedis: jest.fn(),
}));

describe('Rate Limiting Integration Test', () => {
  let app: App;

  beforeAll(async () => {
    // Instantiate app
    app = new App();
    // Initialize (register plugins)
    await app.initialize();

    // Ensure Fastify is ready
    await app.server.ready();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should return 429 when rate limit is exceeded', async () => {
    const limit = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5');

    // Make requests up to the limit
    for (let i = 0; i < limit; i++) {
      const response = await app.server.inject({
        method: 'GET',
        url: '/health'
      });
      expect(response.statusCode).toBe(200);
    }

    // The next request should be blocked
    const response = await app.server.inject({
      method: 'GET',
      url: '/health'
    });

    expect(response.statusCode).toBe(429);

    const body = JSON.parse(response.payload);
    // The error handler wraps the response in { success: false, error: { ... } }
    expect(body.error.code).toBe(429);
    // The message might be "Rate Limit Exceeded" or the custom message
    // app.ts sets error: 'Rate Limit Exceeded' in errorResponseBuilder, but errorHandler puts it in body.error.message?
    // app.ts: message: `Muitas tentativas...`
    // errorHandler: message: error.message
    // If rate-limit throws the object from builder, error.message is likely the message from builder.
    expect(body.error.message).toContain('Muitas tentativas');
  });
});
