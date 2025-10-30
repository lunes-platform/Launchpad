import { FastifyInstance } from 'fastify';
import { AnalyticsController } from './analytics.controller';

/**
 * Rotas para Analytics
 * 
 * Endpoints:
 * - GET /analytics/dashboard - Métricas gerais do dashboard
 * - GET /analytics/projects - Métricas de projetos
 * - GET /analytics/users - Métricas de usuários (admin only)
 * - GET /analytics/revenue - Métricas de receita (admin only)
 * - GET /analytics/performance - Métricas de performance
 * - POST /analytics/events - Registrar evento de analytics
 */
export const analyticsRoutes = async (server: FastifyInstance) => {
  const analyticsController = new AnalyticsController();

  // Registrar schemas para documentação
  server.addSchema({
    $id: 'dashboardMetricsResponse',
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'object',
        properties: {
          totalUsers: { type: 'integer' },
          activeUsers: { type: 'integer' },
          totalProjects: { type: 'integer' },
          activeProjects: { type: 'integer' },
          totalVolume: { type: 'string' },
          totalStaked: { type: 'string' },
          platformFees: { type: 'string' },
          successRate: { type: 'number' },
          growthMetrics: { type: 'object' },
          recentActivity: { type: 'array' }
        }
      }
    }
  });

  server.addSchema({
    $id: 'analyticsEventRequest',
    type: 'object',
    required: ['type', 'category'],
    properties: {
      type: { type: 'string', description: 'Tipo do evento (ex: click, view, purchase)' },
      category: { type: 'string', description: 'Categoria do evento (ex: project, user, transaction)' },
      action: { type: 'string', description: 'Ação específica' },
      label: { type: 'string', description: 'Label adicional' },
      value: { type: 'number', description: 'Valor numérico associado' },
      metadata: { type: 'object', description: 'Dados adicionais' }
    }
  });

  // GET /analytics/dashboard - Métricas gerais do dashboard
  server.get('/dashboard', {
    schema: {
      tags: ['Analytics'],
      summary: 'Métricas do dashboard',
      description: 'Obtém métricas gerais da plataforma para o dashboard',
      security: [{ Bearer: [] }],
      response: {
        200: { $ref: 'dashboardMetricsResponse#' }
      }
    },
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({
          success: false,
          error: 'Token de autorização inválido'
        });
      }
    }
  }, analyticsController.getDashboardMetrics.bind(analyticsController));

  // GET /analytics/projects - Métricas de projetos
  server.get('/projects', {
    schema: {
      tags: ['Analytics'],
      summary: 'Métricas de projetos',
      description: 'Obtém métricas e estatísticas de projetos',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          period: { 
            type: 'string', 
            enum: ['7d', '30d', '90d', '1y'], 
            default: '30d',
            description: 'Período para análise'
          },
          projectId: { 
            type: 'string',
            description: 'ID específico do projeto para métricas detalhadas'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
          }
        }
      }
    },
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({
          success: false,
          error: 'Token de autorização inválido'
        });
      }
    }
  }, analyticsController.getProjectsMetrics.bind(analyticsController));

  // GET /analytics/users - Métricas de usuários (admin only)
  server.get('/users', {
    schema: {
      tags: ['Analytics'],
      summary: 'Métricas de usuários',
      description: 'Obtém métricas e estatísticas de usuários (apenas administradores)',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          period: { 
            type: 'string', 
            enum: ['7d', '30d', '90d', '1y'], 
            default: '30d',
            description: 'Período para análise'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                totalUsers: { type: 'integer' },
                activeUsers: { type: 'integer' },
                newUsers: { type: 'integer' },
                verifiedUsers: { type: 'integer' },
                kycStats: { type: 'object' },
                userGrowth: { type: 'array' },
                demographics: { type: 'object' },
                engagement: { type: 'object' }
              }
            }
          }
        }
      }
    },
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
        const user = (request as any).user;
        
        // Verificar se é admin
        if (user.role !== 'ADMIN') {
          return reply.status(403).send({
            success: false,
            error: 'Acesso negado - apenas administradores'
          });
        }
      } catch (err) {
        return reply.status(401).send({
          success: false,
          error: 'Token de autorização inválido'
        });
      }
    }
  }, analyticsController.getUsersMetrics.bind(analyticsController));

  // GET /analytics/revenue - Métricas de receita (admin only)
  server.get('/revenue', {
    schema: {
      tags: ['Analytics'],
      summary: 'Métricas de receita',
      description: 'Obtém métricas financeiras e de receita (apenas administradores)',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          period: { 
            type: 'string', 
            enum: ['7d', '30d', '90d', '1y'], 
            default: '30d',
            description: 'Período para análise'
          },
          currency: {
            type: 'string',
            enum: ['USD', 'BRL', 'ETH', 'BTC'],
            default: 'USD',
            description: 'Moeda para exibição'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                totalRevenue: { type: 'string' },
                monthlyRevenue: { type: 'string' },
                platformFees: { type: 'string' },
                stakingRewards: { type: 'string' },
                revenueGrowth: { type: 'number' },
                revenueStreams: { type: 'object' },
                monthlyTrends: { type: 'array' },
                topProjects: { type: 'array' },
                projections: { type: 'object' }
              }
            }
          }
        }
      }
    },
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
        const user = (request as any).user;
        
        // Verificar se é admin
        if (user.role !== 'ADMIN') {
          return reply.status(403).send({
            success: false,
            error: 'Acesso negado - apenas administradores'
          });
        }
      } catch (err) {
        return reply.status(401).send({
          success: false,
          error: 'Token de autorização inválido'
        });
      }
    }
  }, analyticsController.getRevenueMetrics.bind(analyticsController));

  // GET /analytics/performance - Métricas de performance
  server.get('/performance', {
    schema: {
      tags: ['Analytics'],
      summary: 'Métricas de performance',
      description: 'Obtém métricas de performance da plataforma',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          period: { 
            type: 'string', 
            enum: ['1h', '24h', '7d', '30d'], 
            default: '24h',
            description: 'Período para análise'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                systemHealth: { type: 'object' },
                apiMetrics: { type: 'object' },
                databaseMetrics: { type: 'object' },
                blockchainMetrics: { type: 'object' },
                alerts: { type: 'array' },
                trends: { type: 'array' }
              }
            }
          }
        }
      }
    },
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({
          success: false,
          error: 'Token de autorização inválido'
        });
      }
    }
  }, analyticsController.getPerformanceMetrics.bind(analyticsController));

  // POST /analytics/events - Registrar evento de analytics
  server.post('/events', {
    schema: {
      tags: ['Analytics'],
      summary: 'Registrar evento',
      description: 'Registra um evento de analytics para tracking',
      security: [{ Bearer: [] }],
      body: { $ref: 'analyticsEventRequest#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({
          success: false,
          error: 'Token de autorização inválido'
        });
      }
    }
  }, analyticsController.trackEvent.bind(analyticsController));

  await server.register(async function (server) {}, { prefix: '/analytics' });
};