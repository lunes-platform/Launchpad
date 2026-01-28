import 'reflect-metadata';
import { config } from 'dotenv';

// Carregar variáveis de ambiente primeiro
config();

import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { envConfig } from './config/env.config';
import { logger } from './shared/logger';
import { errorHandler, setupGlobalErrorHandlers } from './shared/middleware/error.middleware';
import { loggingMiddleware } from './shared/middleware/logging.middleware';
import { setupCors } from './shared/middleware/cors.middleware';

// Importar rotas
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/users/user.routes';
import { projectRoutes } from './modules/projects/project.routes';
import { analyticsRoutes } from './modules/analytics/analytics.routes';
import { amaRoutes } from './modules/ama/ama.routes';

class App {
  public server: FastifyInstance;

  constructor() {
    this.server = Fastify({
      logger: false, // Usamos Winston ao invés do logger do Fastify
      trustProxy: true,
      bodyLimit: 10 * 1024 * 1024, // 10MB
    });

    this.setupErrorHandling();
  }

  public async initialize(): Promise<void> {
    await this.setupMiddlewares();
    await this.setupRoutes();
  }

  private async setupMiddlewares(): Promise<void> {
    // CORS
    await this.server.register(cors, {
      origin: envConfig.CORS_ORIGIN.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    });

    // Helmet para segurança
    await this.server.register(helmet, {
      contentSecurityPolicy: false, // Desabilitado para desenvolvimento
    });

    // JWT
    await this.server.register(jwt, {
      secret: envConfig.JWT_SECRET,
      sign: {
        expiresIn: envConfig.JWT_EXPIRES_IN,
      },
    });

    // Rate Limiting
    await this.server.register(rateLimit, {
      max: envConfig.RATE_LIMIT_MAX_REQUESTS,
      timeWindow: envConfig.RATE_LIMIT_WINDOW_MS,
    });

    // Swagger Documentation
    if (envConfig.ENABLE_SWAGGER) {
      await this.server.register(swagger, {
        swagger: {
          info: {
            title: 'Lunes Launchpad API',
            description: 'API completa para o Launchpad da rede Lunes',
            version: '1.0.0',
          },
          host: `localhost:${envConfig.PORT}`,
          schemes: ['http', 'https'],
          consumes: ['application/json'],
          produces: ['application/json'],
          securityDefinitions: {
            Bearer: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header',
              description: 'JWT token. Formato: Bearer {token}',
            },
          },
        },
      });

      await this.server.register(swaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
          docExpansion: 'list',
          deepLinking: false,
        },
      });
    }

    // Middleware de logging
    loggingMiddleware(this.server);

    // Health check
    this.server.get('/health', async (request, reply) => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: envConfig.NODE_ENV,
        version: '1.0.0',
      };
    });
  }

  private async setupRoutes(): Promise<void> {
    // Registra todas as rotas com prefixo /api/v1
    await this.server.register(authRoutes, { prefix: '/api/v1/auth' });
    await this.server.register(userRoutes, { prefix: '/api/v1/users' });
    await this.server.register(projectRoutes, { prefix: '/api/v1/projects' });
    await this.server.register(analyticsRoutes, { prefix: '/api/v1/analytics' });
    await this.server.register(amaRoutes, { prefix: '/api/v1/ama' });

    // Rota 404
    this.server.setNotFoundHandler(async (request, reply) => {
      reply.code(404).send({
        error: 'Not Found',
        message: `Rota ${request.method} ${request.url} não encontrada`,
        statusCode: 404,
      });
    });
  }

  private setupErrorHandling(): void {
    errorHandler(this.server);

    // Captura erros não tratados
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', { promise, reason });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  }

  public async start(): Promise<void> {
    try {
      await this.initialize();
      
      const address = await this.server.listen({
        port: envConfig.PORT,
        host: envConfig.HOST,
      });

      logger.info(`🚀 Servidor rodando em ${address}`);
      
      if (envConfig.ENABLE_SWAGGER) {
        logger.info(`📚 Documentação disponível em ${address}/docs`);
      }

      logger.info(`🌍 Ambiente: ${envConfig.NODE_ENV}`);
      logger.info(`🔗 CORS habilitado para: ${envConfig.CORS_ORIGIN}`);

    } catch (error) {
      logger.error('Erro ao iniciar servidor:', error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    try {
      await this.server.close();
      logger.info('🛑 Servidor encerrado com sucesso');
    } catch (error) {
      logger.error('Erro ao encerrar servidor:', error);
    }
  }
}

// Inicialização
const app = new App();

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`📡 Recebido sinal ${signal}. Encerrando servidor...`);
  await app.stop();
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Inicia o servidor
if (require.main === module) {
  app.start();
}

export { app };