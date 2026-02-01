import { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../logger';

/**
 * Interface para erros customizados da aplicação
 */
export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

/**
 * Middleware de tratamento de erros global
 * 
 * Funcionalidades:
 * - Captura e trata todos os erros da aplicação
 * - Log estruturado de erros
 * - Resposta padronizada para o cliente
 * - Ocultação de detalhes sensíveis em produção
 */
export const errorHandler = (server: FastifyInstance) => {
  server.setErrorHandler(async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    
    // Log do erro com contexto da requisição
    logger.error('Request error', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        statusCode: error.statusCode,
        code: error.code
      },
      request: {
        method,
        url,
        ip,
        userAgent,
        headers: process.env.NODE_ENV === 'development' ? headers : undefined
      }
    });

    // Determinar status code
    let statusCode = 500;
    if (error.statusCode) {
      statusCode = error.statusCode;
    } else if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
      statusCode = 401;
    } else if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
      statusCode = 401;
    } else if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
      statusCode = 401;
    } else if (error.validation) {
      statusCode = 400;
    } else if ((error.code as any) === 429) {
      statusCode = 429;
    }

    // Preparar resposta de erro
    const errorResponse: any = {
      success: false,
      error: {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        message: getErrorMessage(error, statusCode),
        timestamp: new Date().toISOString(),
        path: url,
        method
      }
    };

    // Adicionar detalhes em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.details = {
        stack: error.stack,
        validation: error.validation
      };
    }

    // Adicionar detalhes de validação se existirem
    if (error.validation) {
      errorResponse.error.validation = error.validation;
    }

    reply.status(statusCode).send(errorResponse);
  });
};

/**
 * Obter mensagem de erro apropriada baseada no tipo e ambiente
 */
function getErrorMessage(error: FastifyError, statusCode: number): string {
  // Mensagens específicas para códigos conhecidos
  if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
    return 'Token de autorização não fornecido';
  }
  
  if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
    return 'Token de autorização expirado';
  }
  
  if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
    return 'Token de autorização inválido';
  }

  if (error.validation) {
    return 'Dados de entrada inválidos';
  }

  // Em produção, usar mensagens genéricas para erros internos
  if (process.env.NODE_ENV === 'production' && statusCode >= 500) {
    return 'Erro interno do servidor';
  }

  // Retornar mensagem original em outros casos
  return error.message || 'Erro desconhecido';
}

/**
 * Criar erro customizado da aplicação
 */
export function createAppError(
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
}

/**
 * Middleware para capturar erros não tratados
 */
export const setupGlobalErrorHandlers = () => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
    
    // Graceful shutdown
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection', {
      reason: reason?.message || reason,
      stack: reason?.stack,
      promise: promise.toString()
    });
  });
};