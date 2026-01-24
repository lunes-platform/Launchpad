// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-must-be-long-enough-for-security';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.RATE_LIMIT_MAX_REQUESTS = '5'; // Low limit for testing
process.env.RATE_LIMIT_WINDOW_MS = '60000'; // 1 minute

// Mock Redis to prevent connection errors
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    publish: jest.fn(),
    subscribe: jest.fn(),
  }));
});

// Mock logger to avoid noise
jest.mock('./src/shared/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    auth: jest.fn(),
  },
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    auth: jest.fn(),
  }
}));
