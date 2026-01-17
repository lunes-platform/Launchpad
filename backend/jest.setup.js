// Set environment variables before any imports
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-must-be-at-least-32-chars-long';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.LUNES_RPC_URL = 'http://localhost:9933';
process.env.CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';
process.env.PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000000';
process.env.RATE_LIMIT_MAX_REQUESTS = '5';
process.env.RATE_LIMIT_WINDOW_MS = '60000';

// Mock IORedis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
      setex: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
      exists: jest.fn().mockResolvedValue(0),
      expire: jest.fn().mockResolvedValue(1),
      ttl: jest.fn().mockResolvedValue(-1),
      hset: jest.fn().mockResolvedValue(1),
      hget: jest.fn().mockResolvedValue(null),
      hgetall: jest.fn().mockResolvedValue(null),
      hdel: jest.fn().mockResolvedValue(1),
      lpush: jest.fn().mockResolvedValue(1),
      rpop: jest.fn().mockResolvedValue(null),
      llen: jest.fn().mockResolvedValue(0),
      publish: jest.fn().mockResolvedValue(1),
      subscribe: jest.fn().mockResolvedValue(undefined),
      ping: jest.fn().mockResolvedValue('PONG'),
      flushdb: jest.fn().mockResolvedValue('OK'),
      keys: jest.fn().mockResolvedValue([]),
    };
  });
});

// Mock logger to suppress logs
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
