process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-at-least-32-chars-long-12345';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
// Add other required vars to prevent env.config.ts from throwing
process.env.LUNES_RPC_URL = 'http://localhost:9933';
process.env.CONTRACT_ADDRESS = '0x123';
process.env.PRIVATE_KEY = '0x123';
process.env.AWS_ACCESS_KEY_ID = 'test';
process.env.AWS_SECRET_ACCESS_KEY = 'test';
process.env.AWS_BUCKET_NAME = 'test';
process.env.AWS_REGION = 'us-east-1';
process.env.SMTP_USER = 'test';
process.env.SMTP_PASS = 'test';
process.env.KYC_API_KEY = 'test';
process.env.PRICE_ORACLE_API = 'test';
process.env.REDIS_PASSWORD = 'test';

// Rate limit settings for testing
process.env.RATE_LIMIT_WINDOW_MS = '1000'; // 1 second
process.env.RATE_LIMIT_MAX_REQUESTS = '5'; // 5 requests
