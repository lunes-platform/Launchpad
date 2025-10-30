import { FastifyInstance } from 'fastify';
import { UserController } from './user.controller';

/**
 * Rotas para gerenciamento de usuários
 * 
 * Endpoints:
 * - GET /users - Listar usuários (admin only)
 * - GET /users/:id - Obter usuário por ID
 * - PUT /users/:id - Atualizar perfil do usuário
 * - GET /users/:id/stats - Obter estatísticas do usuário
 * - PUT /users/:id/kyc - Atualizar status KYC (admin only)
 */
export const userRoutes = async (server: FastifyInstance) => {
  const userController = new UserController();

  // Registrar schemas para documentação
  server.addSchema({
    $id: 'userResponse',
    type: 'object',
    properties: {
      id: { type: 'string' },
      walletAddress: { type: 'string' },
      username: { type: 'string' },
      displayName: { type: 'string' },
      email: { type: 'string' },
      avatar: { type: 'string' },
      bio: { type: 'string' },
      isVerified: { type: 'boolean' },
      isActive: { type: 'boolean' },
      kycStatus: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'] },
      totalStaked: { type: 'string' },
      totalRewards: { type: 'string' },
      referralCode: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' }
    }
  });

  server.addSchema({
    $id: 'userUpdateRequest',
    type: 'object',
    properties: {
      username: { type: 'string', minLength: 3, maxLength: 50 },
      displayName: { type: 'string', minLength: 1, maxLength: 100 },
      bio: { type: 'string', maxLength: 500 },
      avatar: { type: 'string', format: 'uri' }
    }
  });

  server.addSchema({
    $id: 'kycUpdateRequest',
    type: 'object',
    required: ['kycStatus'],
    properties: {
      kycStatus: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'] },
      kycData: { type: 'object' }
    }
  });

  // GET /users - Listar usuários (admin only)
  server.get('/', {
    schema: {
      tags: ['Users'],
      summary: 'Listar usuários',
      description: 'Lista todos os usuários com filtros e paginação (apenas administradores)',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          search: { type: 'string', description: 'Buscar por username, email ou wallet' },
          kycStatus: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'] },
          isVerified: { type: 'boolean' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: { $ref: 'userResponse#' }
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' }
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
  }, userController.getUsers.bind(userController));

  // GET /users/:id - Obter usuário por ID
  server.get('/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Obter usuário por ID',
      description: 'Obtém detalhes de um usuário específico',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: 'userResponse#' }
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
  }, userController.getUserById.bind(userController));

  // PUT /users/:id - Atualizar perfil do usuário
  server.put('/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Atualizar perfil do usuário',
      description: 'Atualiza dados do perfil do usuário',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: { $ref: 'userUpdateRequest#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: 'userResponse#' },
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
  }, userController.updateUser.bind(userController));

  // GET /users/:id/stats - Obter estatísticas do usuário
  server.get('/:id/stats', {
    schema: {
      tags: ['Users'],
      summary: 'Obter estatísticas do usuário',
      description: 'Obtém estatísticas detalhadas de um usuário',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                totalInvestments: { type: 'integer' },
                totalStaked: { type: 'string' },
                totalRewards: { type: 'string' },
                projectsParticipated: { type: 'integer' },
                referralsCount: { type: 'integer' },
                kycStatus: { type: 'string' },
                memberSince: { type: 'string' }
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
  }, userController.getUserStats.bind(userController));

  // PUT /users/:id/kyc - Atualizar status KYC (admin only)
  server.put('/:id/kyc', {
    schema: {
      tags: ['Users'],
      summary: 'Atualizar status KYC',
      description: 'Atualiza o status KYC de um usuário (apenas administradores)',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: { $ref: 'kycUpdateRequest#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: 'userResponse#' },
            message: { type: 'string' }
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
  }, userController.updateKycStatus.bind(userController));

  await server.register(async function (server) {
  }, { prefix: '/users' });
};