// Global setup for Jest tests
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/launchpad_test';
process.env.JWT_SECRET = 'test-secret-min-32-chars-length-required-for-production';
process.env.LUNES_RPC_URL = 'http://localhost:9944';
process.env.CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
process.env.PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000000';

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  auth: jest.fn(),
};

jest.mock('./src/shared/logger', () => ({
  logger: mockLogger,
  Logger: mockLogger,
}));
