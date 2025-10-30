import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../logger';

/**
 * Middleware de logging para requisições HTTP
 * 
 * Funcionalidades:
 * - Log de todas as requisições HTTP
 * - Medição de tempo de resposta
 * - Log de informações relevantes (IP, User-Agent, etc.)
 * - Diferentes níveis de log baseado no status da resposta
 */
export const loggingMiddleware = (server: FastifyInstance) => {
  server.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const startTime = Date.now();
    
    // Adicionar timestamp de início à requisição
    (request as any).startTime = startTime;
    
    // Log da requisição recebida
    logger.info('Incoming request', {
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      contentType: request.headers['content-type'],
      timestamp: new Date().toISOString()
    });
  });

  server.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    const startTime = (request as any).startTime || Date.now();
    const responseTime = Date.now() - startTime;
    const statusCode = reply.statusCode;
    
    // Determinar nível de log baseado no status
    const logLevel = statusCode >= 500 ? 'error' : 
                    statusCode >= 400 ? 'warn' : 'info';
    
    // Log da resposta
    logger[logLevel]('Request completed', {
      method: request.method,
      url: request.url,
      statusCode,
      responseTime: `${responseTime}ms`,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      contentLength: reply.getHeader('content-length'),
      timestamp: new Date().toISOString()
    });
  });

  server.addHook('onError', async (request: FastifyRequest, reply: FastifyReply, error: Error) => {
    const startTime = (request as any).startTime || Date.now();
    const responseTime = Date.now() - startTime;
    
    // Log do erro
    logger.error('Request error', {
      method: request.method,
      url: request.url,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      responseTime: `${responseTime}ms`,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      timestamp: new Date().toISOString()
    });
  });
};