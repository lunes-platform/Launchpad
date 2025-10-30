import winston from 'winston';

// Configuração do logger
const logLevel = process.env.LOG_LEVEL || 'info';
const nodeEnv = process.env.NODE_ENV || 'development';

// Formato customizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    // Adiciona stack trace para erros
    if (stack) {
      log += `\n${stack}`;
    }
    
    // Adiciona metadados se existirem
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Formato JSON para produção
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Transports
const transports: winston.transport[] = [];

// Console transport (sempre ativo)
transports.push(
  new winston.transports.Console({
    format: nodeEnv === 'production' ? jsonFormat : logFormat,
  })
);

// File transports (apenas em produção ou quando especificado)
if (nodeEnv === 'production' || process.env.ENABLE_FILE_LOGS === 'true') {
  // Log de erros
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: jsonFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  // Log combinado
  transports.push(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: jsonFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  // Log de acesso HTTP
  transports.push(
    new winston.transports.File({
      filename: 'logs/access.log',
      level: 'http',
      format: jsonFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    })
  );
}

// Criação do logger
export const logger = winston.createLogger({
  level: logLevel,
  format: jsonFormat,
  defaultMeta: { 
    service: 'launchpad-backend',
    environment: nodeEnv,
    timestamp: new Date().toISOString(),
  },
  transports,
  // Não sair do processo em caso de erro
  exitOnError: false,
});

// Métodos de conveniência
export class Logger {
  static info(message: string, meta?: any): void {
    logger.info(message, meta);
  }

  static error(message: string, error?: Error | any): void {
    if (error instanceof Error) {
      logger.error(message, { 
        error: error.message, 
        stack: error.stack,
        name: error.name,
      });
    } else {
      logger.error(message, { error });
    }
  }

  static warn(message: string, meta?: any): void {
    logger.warn(message, meta);
  }

  static debug(message: string, meta?: any): void {
    logger.debug(message, meta);
  }

  static http(message: string, meta?: any): void {
    logger.http(message, meta);
  }

  // Log específico para blockchain
  static blockchain(message: string, meta?: any): void {
    logger.info(`[BLOCKCHAIN] ${message}`, meta);
  }

  // Log específico para database
  static database(message: string, meta?: any): void {
    logger.info(`[DATABASE] ${message}`, meta);
  }

  // Log específico para API
  static api(message: string, meta?: any): void {
    logger.info(`[API] ${message}`, meta);
  }

  // Log específico para autenticação
  static auth(message: string, meta?: any): void {
    logger.info(`[AUTH] ${message}`, meta);
  }

  // Log específico para segurança
  static security(message: string, meta?: any): void {
    logger.warn(`[SECURITY] ${message}`, meta);
  }

  // Log de performance
  static performance(message: string, duration: number, meta?: any): void {
    logger.info(`[PERFORMANCE] ${message}`, { 
      duration: `${duration}ms`,
      ...meta 
    });
  }

  // Log de auditoria
  static audit(action: string, userId: string, meta?: any): void {
    logger.info(`[AUDIT] ${action}`, {
      userId,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }
}

// Stream para integração com outros middlewares (ex: morgan)
export const logStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Configuração para desenvolvimento
if (nodeEnv === 'development') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    })
  );
}

// Log de inicialização
logger.info('Logger inicializado', {
  level: logLevel,
  environment: nodeEnv,
  transports: transports.length,
});

export default logger;