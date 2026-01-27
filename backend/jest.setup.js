// Mock Environment Variables BEFORE importing anything else
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.HOST = '0.0.0.0';
process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/testdb';
process.env.JWT_SECRET = 'test-secret-must-be-long-enough-for-logic-32chars';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.LUNES_RPC_URL = 'http://localhost:9999';
process.env.LUNES_HTTP_URL = 'http://localhost:9999';
process.env.CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';
process.env.PRIVATE_KEY = '0xabc';
process.env.RATE_LIMIT_MAX_REQUESTS = '5';
process.env.RATE_LIMIT_WINDOW_MS = '1000';
process.env.REDIS_URL = 'redis://localhost:6379';

// Mock Redis
jest.mock('ioredis', () => {
  return class RedisMock {
    constructor() {}
    on() { return this; }
    async get() { return null; }
    async set() { return 'OK'; }
    async del() { return 1; }
    async quit() {}
    status = 'ready';
  };
});

// Mock Logger
jest.mock('./src/shared/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
    log: jest.fn(),
    add: jest.fn(),
  },
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
    blockchain: jest.fn(),
    database: jest.fn(),
    api: jest.fn(),
    auth: jest.fn(),
    security: jest.fn(),
    performance: jest.fn(),
    audit: jest.fn(),
  },
  logStream: {
    write: jest.fn()
  }
}));
