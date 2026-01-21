process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'test-secret-at-least-32-chars-long-should-be-here';
process.env.LUNES_RPC_URL = 'http://localhost:9933';
process.env.CONTRACT_ADDRESS = '0x123';
process.env.PRIVATE_KEY = '0xabc';
process.env.AWS_ACCESS_KEY_ID = 'test';
process.env.AWS_SECRET_ACCESS_KEY = 'test';
process.env.AWS_BUCKET_NAME = 'test';
process.env.AWS_REGION = 'us-east-1';

// Mock Redis to prevent connection errors
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

// Mock logger to avoid noise
jest.mock('./src/shared/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    auth: jest.fn(),
  }
}));
