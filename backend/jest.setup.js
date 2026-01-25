// Set env vars before any imports
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-at-least-32-chars-long-123456';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.LUNES_RPC_URL = 'https://rpc.lunes.io';
process.env.CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';
process.env.PRIVATE_KEY = '0x1234567890123456789012345678901234567890123456789012345678901234';

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
    auth: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  }
}));

// Mock Redis
// We need to mock ioredis as well because it might be instantiated
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    on: jest.fn(),
    quit: jest.fn(),
  }));
});

jest.mock('./src/shared/redis', () => ({
  redisService: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
  }
}));

// Mock Prisma
jest.mock('./src/shared/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  }
}));
