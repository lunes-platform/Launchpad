import { app } from '../app';

// Mock envConfig BEFORE importing app to set low limits for testing
jest.mock('../config/env.config', () => {
  const originalModule = jest.requireActual('../config/env.config');
  return {
    __esModule: true,
    ...originalModule,
    envConfig: {
      ...originalModule.envConfig,
      // Override specific values for testing
      RATE_LIMIT_MAX_REQUESTS: 2,
      RATE_LIMIT_WINDOW_MS: 5000,

      // Ensure other critical values are present (though requireActual should provide them if setup is correct)
      PORT: 3000,
      HOST: '0.0.0.0',
      NODE_ENV: 'test',
      CORS_ORIGIN: '*',
      JWT_SECRET: 'test-secret-key-must-be-long-enough',
      ENABLE_SWAGGER: false,
    },
  };
});

describe('Rate Limiting Security', () => {
  beforeAll(async () => {
    // Initialize the app (register middlewares)
    await app.initialize();
  });

  afterAll(async () => {
    await app.server.close();
  });

  it('should allow requests within the limit', async () => {
    // Request 1
    const response1 = await app.server.inject({
      method: 'GET',
      url: '/health',
    });
    expect(response1.statusCode).toBe(200);

    // Request 2
    const response2 = await app.server.inject({
      method: 'GET',
      url: '/health',
    });
    expect(response2.statusCode).toBe(200);
  });

  it('should block requests exceeding the limit', async () => {
    // Request 3 (Limit is 2)
    const response = await app.server.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(429);
    const body = JSON.parse(response.payload);

    if (body.success === false && body.error) {
         expect(body.error.code).toBe('RATE_LIMIT_EXCEEDED');
    } else {
         // Direct response
         expect(body.code).toBe('RATE_LIMIT_EXCEEDED');
    }
  });
});
