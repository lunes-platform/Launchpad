process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/test_db';
process.env.JWT_SECRET = 'test-jwt-secret-at-least-32-chars-long-for-safety';
process.env.LUNES_RPC_URL = 'http://localhost:8545';
process.env.CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
process.env.PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000000';

// Mock Redis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      on: jest.fn(),
      quit: jest.fn(),
    };
  });
});

// Mock Logger
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
    debug: jest.fn(),
    auth: jest.fn(),
  }
}));
