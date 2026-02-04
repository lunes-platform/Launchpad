import { config } from 'dotenv';

// Carrega variáveis de ambiente
config();

interface EnvConfig {
  // Servidor
  NODE_ENV: string;
  PORT: number;
  HOST: string;

  // Database
  DATABASE_URL: string;

  // Redis
  REDIS_URL: string;
  REDIS_PASSWORD?: string;

  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;

  // Blockchain
  LUNES_RPC_URL: string;
  LUNES_HTTP_URL: string;
  CONTRACT_ADDRESS: string;
  PRIVATE_KEY: string;
  MNEMONIC?: string;

  // Email
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER: string;
  SMTP_PASS: string;
  FROM_EMAIL: string;
  FROM_NAME: string;

  // AWS S3
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_BUCKET_NAME: string;
  AWS_REGION: string;

  // APIs Externas
  KYC_API_KEY: string;
  KYC_API_URL: string;
  PRICE_ORACLE_API: string;
  PRICE_ORACLE_URL: string;

  // Segurança
  BCRYPT_ROUNDS: number;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  CORS_ORIGIN: string;

  // Monitoramento
  LOG_LEVEL: string;
  ENABLE_SWAGGER: boolean;
  ENABLE_METRICS: boolean;

  // Filas
  QUEUE_REDIS_URL: string;
  QUEUE_CONCURRENCY: number;

  // Blockchain Monitoring
  BLOCK_CONFIRMATION_COUNT: number;
  EVENT_SYNC_BATCH_SIZE: number;
  SYNC_INTERVAL_MS: number;

  // AMA
  AMA_DEFAULT_PRICE_USD: number;
  AMA_LUNES_QUESTION_COST: number;
  AMA_LUNES_VOTE_COST: number;

  // Taxas da Plataforma
  PLATFORM_FEE_PERCENT: number;
  LISTING_FEE_LUNES: number;
  STAKING_REWARD_RATE: number;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Variável de ambiente ${key} é obrigatória`);
  }
  return value;
};

const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Variável de ambiente ${key} é obrigatória`);
  }
  return value ? parseInt(value, 10) : defaultValue!;
};

const getEnvBoolean = (key: string, defaultValue = false): boolean => {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

const getEnvFloat = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Variável de ambiente ${key} é obrigatória`);
  }
  return value ? parseFloat(value) : defaultValue!;
};

const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export const envConfig: EnvConfig = {
  // Servidor
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: getEnvNumber('PORT', 3000),
  HOST: getEnvVar('HOST', '0.0.0.0'),

  // Database - opcional em desenvolvimento
  DATABASE_URL: isDevelopment 
    ? getEnvVar('DATABASE_URL', 'postgresql://user:password@localhost:5432/launchpad_dev')
    : getEnvVar('DATABASE_URL'),

  // Redis
  REDIS_URL: getEnvVar('REDIS_URL', 'redis://localhost:6379'),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // JWT
  JWT_SECRET: getEnvVar('JWT_SECRET', 'dev-jwt-secret-change-in-production'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '24h'),
  JWT_REFRESH_EXPIRES_IN: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),

  // Blockchain - valores padrão para desenvolvimento
  LUNES_RPC_URL: getEnvVar('LUNES_RPC_URL', 'https://rpc.lunes.io'),
  LUNES_HTTP_URL: getEnvVar('LUNES_HTTP_URL', 'https://api.lunes.io'),
  CONTRACT_ADDRESS: getEnvVar('CONTRACT_ADDRESS', '0x1234567890123456789012345678901234567890'),
  PRIVATE_KEY: getEnvVar('PRIVATE_KEY', 'dev-private-key'),
  MNEMONIC: process.env.MNEMONIC,

  // Email - valores padrão para desenvolvimento
  SMTP_HOST: getEnvVar('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: getEnvNumber('SMTP_PORT', 587),
  SMTP_SECURE: getEnvBoolean('SMTP_SECURE', false),
  SMTP_USER: getEnvVar('SMTP_USER', 'dev@example.com'),
  SMTP_PASS: getEnvVar('SMTP_PASS', 'dev-password'),
  FROM_EMAIL: getEnvVar('FROM_EMAIL', 'noreply@launchpad.com'),
  FROM_NAME: getEnvVar('FROM_NAME', 'Lunes Launchpad'),

  // AWS - valores padrão para desenvolvimento
  AWS_ACCESS_KEY_ID: getEnvVar('AWS_ACCESS_KEY_ID', 'dev-access-key'),
  AWS_SECRET_ACCESS_KEY: getEnvVar('AWS_SECRET_ACCESS_KEY', 'dev-secret-key'),
  AWS_BUCKET_NAME: getEnvVar('AWS_BUCKET_NAME', 'launchpad-uploads-dev'),
  AWS_REGION: getEnvVar('AWS_REGION', 'us-east-1'),

  // APIs Externas - valores padrão para desenvolvimento
  KYC_API_KEY: getEnvVar('KYC_API_KEY', 'dev-kyc-key'),
  KYC_API_URL: getEnvVar('KYC_API_URL', 'https://api.kyc-provider.com'),
  PRICE_ORACLE_API: getEnvVar('PRICE_ORACLE_API', 'dev-oracle-key'),
  PRICE_ORACLE_URL: getEnvVar('PRICE_ORACLE_URL', 'https://api.coingecko.com/api/v3'),

  // Configurações
  BCRYPT_ROUNDS: getEnvNumber('BCRYPT_ROUNDS', 12),
  RATE_LIMIT_WINDOW_MS: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000),
  RATE_LIMIT_MAX_REQUESTS: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
  CORS_ORIGIN: getEnvVar('CORS_ORIGIN', 'http://localhost:3000,http://localhost:5173'),

  // Logs e Debug
  LOG_LEVEL: getEnvVar('LOG_LEVEL', 'info'),
  ENABLE_SWAGGER: getEnvBoolean('ENABLE_SWAGGER', true),
  ENABLE_METRICS: getEnvBoolean('ENABLE_METRICS', true),

  // Queue
  QUEUE_REDIS_URL: getEnvVar('QUEUE_REDIS_URL', 'redis://localhost:6379'),
  QUEUE_CONCURRENCY: getEnvNumber('QUEUE_CONCURRENCY', 5),

  // Blockchain Sync
  BLOCK_CONFIRMATION_COUNT: getEnvNumber('BLOCK_CONFIRMATION_COUNT', 3),
  EVENT_SYNC_BATCH_SIZE: getEnvNumber('EVENT_SYNC_BATCH_SIZE', 100),
  SYNC_INTERVAL_MS: getEnvNumber('SYNC_INTERVAL_MS', 5000),

  // AMA
  AMA_DEFAULT_PRICE_USD: getEnvNumber('AMA_DEFAULT_PRICE_USD', 200),
  AMA_LUNES_QUESTION_COST: getEnvFloat('AMA_LUNES_QUESTION_COST', 0.5),
  AMA_LUNES_VOTE_COST: getEnvFloat('AMA_LUNES_VOTE_COST', 0.5),

  // Fees
  PLATFORM_FEE_PERCENT: getEnvFloat('PLATFORM_FEE_PERCENT', 2.5),
  LISTING_FEE_LUNES: getEnvNumber('LISTING_FEE_LUNES', 1000),
  STAKING_REWARD_RATE: getEnvFloat('STAKING_REWARD_RATE', 0.12),
};

// Validação adicional para ambiente de produção
if (envConfig.NODE_ENV === 'production') {
  const requiredProdVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'LUNES_RPC_URL',
    'CONTRACT_ADDRESS',
    'PRIVATE_KEY',
    // Security: Prevent using dev defaults in production
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'SMTP_USER',
    'SMTP_PASS',
    'KYC_API_KEY',
  ];

  for (const varName of requiredProdVars) {
    if (!process.env[varName]) {
      throw new Error(`Variável ${varName} é obrigatória em produção`);
    }
  }

  // Validações de segurança
  if (envConfig.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET deve ter pelo menos 32 caracteres em produção');
  }

  if (envConfig.BCRYPT_ROUNDS < 10) {
    throw new Error('BCRYPT_ROUNDS deve ser pelo menos 10 em produção');
  }
}