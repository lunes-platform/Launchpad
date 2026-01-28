
// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-at-least-32-chars-long-123456';
process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.LUNES_RPC_URL = 'https://rpc.lunes.io';
process.env.CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';
process.env.PRIVATE_KEY = '0x1234567890123456789012345678901234567890123456789012345678901234';

// Mock ioredis
jest.mock('ioredis', () => {
  return class Redis {
    constructor() {}
    async get() { return null; }
    async set() { return 'OK'; }
    async del() { return 1; }
    async exists() { return 0; }
    on() {}
    duplicate() { return this; }
  };
});

// Mock console to reduce noise
global.console = {
  ...console,
  // log: jest.fn(),
  // error: jest.fn(),
};
