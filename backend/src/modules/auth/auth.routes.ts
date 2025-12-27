import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';

export async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController();

  // Registrar schemas para documentação
  fastify.addSchema({
    $id: 'loginRequest',
    type: 'object',
    required: ['walletAddress', 'signature', 'message'],
    properties: {
      walletAddress: { type: 'string', description: 'Endereço da carteira' },
      signature: { type: 'string', description: 'Assinatura da mensagem' },
      message: { type: 'string', description: 'Mensagem assinada' },
    },
  });

  fastify.addSchema({
    $id: 'refreshTokenRequest',
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: { type: 'string', description: 'Refresh token' },
    },
  });

  fastify.addSchema({
    $id: 'authResponse',
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              walletAddress: { type: 'string' },
              username: { type: 'string' },
              displayName: { type: 'string' },
              avatar: { type: 'string' },
              isVerified: { type: 'boolean' },
              kycStatus: { type: 'string' },
            },
          },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          expiresIn: { type: 'number' },
        },
      },
      message: { type: 'string' },
    },
  });

  // GET /auth/nonce/:walletAddress - Obter nonce para assinatura
  fastify.get('/nonce/:walletAddress', {
    schema: {
      description: 'Obter nonce para assinatura Web3',
      tags: ['auth'],
      params: {
        type: 'object',
        properties: {
          walletAddress: { type: 'string', description: 'Endereço da carteira' },
        },
        required: ['walletAddress'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            nonce: { type: 'string' },
            timestamp: { type: 'number' },
            message: { type: 'string' },
          },
        },
      },
    },
  }, authController.getNonce.bind(authController));

  // POST /auth/login - Login com Web3
  fastify.post('/login', {
    schema: {
      description: 'Login com assinatura Web3',
      tags: ['auth'],
      body: { $ref: 'loginRequest#' },
      response: {
        200: { $ref: 'authResponse#' },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            errors: { type: 'array' },
          },
        },
        401: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
    },
  }, authController.login.bind(authController));

  // POST /auth/refresh - Renovar token
  fastify.post('/refresh', {
    schema: {
      description: 'Renovar access token',
      tags: ['auth'],
      body: { $ref: 'refreshTokenRequest#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                expiresIn: { type: 'number' },
              },
            },
            message: { type: 'string' },
          },
        },
      },
    },
  }, authController.refreshToken.bind(authController));

  // POST /auth/verify - Verificar token
  fastify.post('/verify', {
    schema: {
      description: 'Verificar validade do token',
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                userId: { type: 'string' },
                walletAddress: { type: 'string' },
                type: { type: 'string' },
                iat: { type: 'number' },
                exp: { type: 'number' },
              },
            },
            message: { type: 'string' },
          },
        },
      },
    },
  }, authController.verifyToken.bind(authController));

  // POST /auth/logout - Logout
  fastify.post('/logout', {
    schema: {
      description: 'Realizar logout',
      tags: ['auth'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
    },
  }, authController.logout.bind(authController));

  // GET /auth/me - Obter perfil do usuário autenticado
  fastify.get('/me', {
    schema: {
      description: 'Obter perfil do usuário autenticado',
      tags: ['auth'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                walletAddress: { type: 'string' },
                email: { type: 'string' },
                username: { type: 'string' },
                displayName: { type: 'string' },
                avatar: { type: 'string' },
                bio: { type: 'string' },
                isVerified: { type: 'boolean' },
                kycStatus: { type: 'string' },
                totalStaked: { type: 'string' },
                totalRewards: { type: 'string' },
                referralCode: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
            message: { type: 'string' },
          },
        },
      },
    },
    preHandler: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }],
  }, authController.getProfile.bind(authController));

  // 2FA Routes
  const twoFactorSchema = {
    tags: ['auth'],
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object', additionalProperties: true },
          message: { type: 'string' },
          valid: { type: 'boolean' }
        }
      }
    }
  };

  const authHook = async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  };

  fastify.post('/2fa/generate', {
    schema: { ...twoFactorSchema, description: 'Gerar segredo 2FA' },
    preHandler: [authHook]
  }, authController.generateTwoFactor.bind(authController));

  fastify.post('/2fa/verify', {
    schema: {
      ...twoFactorSchema,
      description: 'Verificar e habilitar 2FA',
      body: {
        type: 'object',
        required: ['token'],
        properties: { token: { type: 'string' } }
      }
    },
    preHandler: [authHook]
  }, authController.verifyTwoFactor.bind(authController));

  fastify.post('/2fa/validate', {
    schema: {
      ...twoFactorSchema,
      description: 'Validar código 2FA',
      body: {
        type: 'object',
        required: ['token'],
        properties: { token: { type: 'string' } }
      }
    },
    preHandler: [authHook]
  }, authController.validateTwoFactor.bind(authController));
}