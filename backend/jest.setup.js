process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.JWT_SECRET = 'test-secret-for-unit-tests-only-must-be-long-enough';
process.env.NODE_ENV = 'test';
process.env.LUNES_RPC_URL = 'http://localhost:9933';
process.env.CONTRACT_ADDRESS = '0x123';
process.env.PRIVATE_KEY = '0xabc';
process.env.REDIS_URL = 'redis://localhost:6379';
