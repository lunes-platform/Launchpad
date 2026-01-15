process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-must-be-at-least-32-chars-long-for-security';
process.env.LOG_LEVEL = 'warn';
process.env.PORT = '0'; // Random port
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'; // Mock DB URL

// Set low rate limit for testing
process.env.RATE_LIMIT_MAX_REQUESTS = '5';
process.env.RATE_LIMIT_WINDOW_MS = '10000'; // 10 seconds

// Mocking Redis manually
jest.mock('ioredis', () => {
  return class RedisMock {
    constructor() {}
    async get() { return null; }
    async set() { return 'OK'; }
    async del() { return 1; }
    on() {}
    async quit() {}
  };
});

// Mocking logger correctly exporting both logger instance and Logger class
jest.mock('./src/shared/logger', () => {
  const loggerMock = {
    info: jest.fn(),
    error: console.error, // Keep error visible
    warn: console.warn,
    debug: jest.fn(),
    http: jest.fn(),
  };

  class LoggerMock {
    static info(msg, meta) { loggerMock.info(msg, meta); }
    static error(msg, meta) { loggerMock.error(msg, meta); }
    static warn(msg, meta) { loggerMock.warn(msg, meta); }
    static debug(msg, meta) { loggerMock.debug(msg, meta); }
    static http(msg, meta) { loggerMock.http(msg, meta); }
    static blockchain(msg, meta) { loggerMock.info(`[BLOCKCHAIN] ${msg}`, meta); }
    static database(msg, meta) { loggerMock.info(`[DATABASE] ${msg}`, meta); }
    static api(msg, meta) { loggerMock.info(`[API] ${msg}`, meta); }
    static auth(msg, meta) { loggerMock.info(`[AUTH] ${msg}`, meta); }
    static security(msg, meta) { loggerMock.warn(`[SECURITY] ${msg}`, meta); }
    static performance(msg, dur, meta) { loggerMock.info(`[PERF] ${msg}`, meta); }
    static audit(act, uid, meta) { loggerMock.info(`[AUDIT] ${act}`, meta); }
  }

  return {
    logger: loggerMock,
    Logger: LoggerMock,
    logStream: { write: jest.fn() }
  };
});
