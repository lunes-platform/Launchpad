// Set critical env vars for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-at-least-32-chars-long-for-security';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/launchpad_test';
process.env.LUNES_RPC_URL = 'http://localhost:9999'; // Mock
process.env.CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
process.env.PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000000';

// Mock IORedis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      publish: jest.fn(),
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      quit: jest.fn(),
      disconnect: jest.fn(),
    };
  });
});

// Mock Logger
const mockLogger = {
  info: console.log,
  error: console.error,
  warn: console.warn,
  debug: console.debug,
  http: console.log,
  blockchain: console.log,
  database: console.log,
  api: console.log,
  auth: console.log,
  security: console.log,
  performance: console.log,
  audit: console.log,
};

jest.mock('./src/shared/logger', () => ({
  logger: mockLogger,
  Logger: mockLogger, // Logger class with static methods mimics the object
}));
