import 'reflect-metadata';
import { FastifyInstance } from 'fastify';

// Mock envConfig before importing app
jest.mock('../config/env.config', () => {
  const original = jest.requireActual('../config/env.config');
  return {
    envConfig: {
      ...original.envConfig,
      RATE_LIMIT_MAX_REQUESTS: 2, // Low limit for testing
      RATE_LIMIT_WINDOW_MS: 1000,
      NODE_ENV: 'test',
      CORS_ORIGIN: '*',
      JWT_SECRET: 'test-secret',
      JWT_EXPIRES_IN: '1h',
      ENABLE_SWAGGER: false,
      PORT: 3000,
      HOST: 'localhost'
    }
  };
});

import { app } from '../app';

describe('Rate Limiting', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    // Mock server.listen to prevent actual port binding
    jest.spyOn(app.server, 'listen').mockImplementation(async () => {
        return 'http://localhost:3000';
    });

    // Initialize the app (register plugins/routes)
    await app.start();
    server = app.server;
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should enforce rate limits', async () => {
    // Make request 1 - should pass
    const response1 = await server.inject({
      method: 'GET',
      url: '/health'
    });
    expect(response1.statusCode).toBe(200);

    // Make request 2 - should pass
    const response2 = await server.inject({
      method: 'GET',
      url: '/health'
    });
    expect(response2.statusCode).toBe(200);

    // Make request 3 - should fail with 429
    const response3 = await server.inject({
      method: 'GET',
      url: '/health'
    });
    expect(response3.statusCode).toBe(429);

    // Verify error message structure if possible
    const body = JSON.parse(response3.body);
    expect(body.error.code).toBe(429);
    expect(body.error.message).toContain('Muitas tentativas');
  });
});
