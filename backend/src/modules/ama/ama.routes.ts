import { FastifyInstance } from 'fastify';
import { AmaController } from './ama.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

/**
 * Rotas para AMA (Ask Me Anything)
 * 
 * Endpoints:
 * - GET /ama/sessions - Listar sessões AMA
 * - GET /ama/sessions/:id - Obter sessão AMA específica
 * - POST /ama/sessions - Criar nova sessão AMA (project owner)
 * - PUT /ama/sessions/:id - Atualizar sessão AMA (host only)
 * - GET /ama/sessions/:sessionId/questions - Listar perguntas de uma sessão
 * - POST /ama/sessions/:sessionId/questions - Criar pergunta em uma sessão
 * - PUT /ama/questions/:questionId/answer - Responder pergunta (host only)
 * - POST /ama/questions/:questionId/vote - Votar em pergunta
 * - GET /ama/sessions/:sessionId/stats - Estatísticas da sessão
 */
export const amaRoutes = async (server: FastifyInstance) => {
  const amaController = new AmaController();

  // Registrar schemas para documentação
  server.addSchema({
    $id: 'amaSessionResponse',
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          projectId: { type: 'string' },
          projectName: { type: 'string' },
          hostId: { type: 'string' },
          hostName: { type: 'string' },
          status: { type: 'string', enum: ['SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED'] },
          scheduledAt: { type: 'string', format: 'date-time' },
          duration: { type: 'integer' },
          totalQuestions: { type: 'integer' },
          answeredQuestions: { type: 'integer' },
          totalParticipants: { type: 'integer' },
          isLive: { type: 'boolean' },
          tags: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  });

  server.addSchema({
    $id: 'amaSessionRequest',
    type: 'object',
    required: ['title', 'description', 'projectId', 'scheduledAt', 'duration'],
    properties: {
      title: { type: 'string', minLength: 5, maxLength: 200 },
      description: { type: 'string', minLength: 10, maxLength: 1000 },
      projectId: { type: 'string' },
      scheduledAt: { type: 'string', format: 'date-time' },
      duration: { type: 'integer', minimum: 30, maximum: 180 },
      maxQuestions: { type: 'integer', minimum: 10, maximum: 100, default: 50 },
      allowAnonymous: { type: 'boolean', default: false },
      moderationEnabled: { type: 'boolean', default: true },
      tags: { type: 'array', items: { type: 'string' }, maxItems: 5 }
    }
  });

  server.addSchema({
    $id: 'amaQuestionRequest',
    type: 'object',
    required: ['question'],
    properties: {
      question: { type: 'string', minLength: 10, maxLength: 500 },
      isAnonymous: { type: 'boolean', default: false },
      tags: { type: 'array', items: { type: 'string' }, maxItems: 3 }
    }
  });

  server.addSchema({
    $id: 'amaAnswerRequest',
    type: 'object',
    required: ['answer'],
    properties: {
      answer: { type: 'string', minLength: 10, maxLength: 2000 }
    }
  });

  server.addSchema({
    $id: 'amaVoteRequest',
    type: 'object',
    required: ['voteType'],
    properties: {
      voteType: { type: 'string', enum: ['up', 'down'] }
    }
  });

  // GET /ama/sessions - Listar sessões AMA
  server.get('/sessions', {
    schema: {
      tags: ['AMA'],
      summary: 'Listar sessões AMA',
      description: 'Lista todas as sessões AMA com paginação e filtros',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
          status: { 
            type: 'string', 
            enum: ['SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
            description: 'Filtrar por status da sessão'
          },
          projectId: { 
            type: 'string',
            description: 'Filtrar por ID do projeto'
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
                sessions: { type: 'array', items: { $ref: 'amaSessionResponse#/properties/data' } },
                pagination: { type: 'object' },
                stats: { type: 'object' }
              }
            }
          }
        }
      }
    },
    preHandler: [authenticate]
  }, amaController.getAmaSessions.bind(amaController));

  // GET /ama/sessions/:id - Obter sessão AMA específica
  server.get('/sessions/:id', {
    schema: {
      tags: ['AMA'],
      summary: 'Obter sessão AMA',
      description: 'Obtém detalhes de uma sessão AMA específica',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID da sessão AMA' }
        }
      },
      response: {
        200: { $ref: 'amaSessionResponse#' }
      }
    },
    preHandler: [authenticate]
  }, amaController.getAmaSession.bind(amaController));

  // POST /ama/sessions - Criar nova sessão AMA
  server.post('/sessions', {
    schema: {
      tags: ['AMA'],
      summary: 'Criar sessão AMA',
      description: 'Cria uma nova sessão AMA (apenas proprietários de projeto)',
      security: [{ Bearer: [] }],
      body: { $ref: 'amaSessionRequest#' },
      response: {
        201: { $ref: 'amaSessionResponse#' }
      }
    },
    preHandler: [authenticate]
  }, amaController.createAmaSession.bind(amaController));

  // PUT /ama/sessions/:id - Atualizar sessão AMA
  server.put('/sessions/:id', {
    schema: {
      tags: ['AMA'],
      summary: 'Atualizar sessão AMA',
      description: 'Atualiza uma sessão AMA (apenas host da sessão)',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID da sessão AMA' }
        }
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 5, maxLength: 200 },
          description: { type: 'string', minLength: 10, maxLength: 1000 },
          scheduledAt: { type: 'string', format: 'date-time' },
          duration: { type: 'integer', minimum: 30, maximum: 180 },
          status: { type: 'string', enum: ['SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED'] },
          maxQuestions: { type: 'integer', minimum: 10, maximum: 100 },
          allowAnonymous: { type: 'boolean' },
          moderationEnabled: { type: 'boolean' },
          tags: { type: 'array', items: { type: 'string' }, maxItems: 5 }
        }
      },
      response: {
        200: { $ref: 'amaSessionResponse#' }
      }
    },
    preHandler: [authenticate]
  }, amaController.updateAmaSession.bind(amaController));

  // GET /ama/sessions/:sessionId/questions - Listar perguntas de uma sessão
  server.get('/sessions/:sessionId/questions', {
    schema: {
      tags: ['AMA'],
      summary: 'Listar perguntas AMA',
      description: 'Lista perguntas de uma sessão AMA com paginação e filtros',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['sessionId'],
        properties: {
          sessionId: { type: 'string', description: 'ID da sessão AMA' }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
          status: { 
            type: 'string', 
            enum: ['PENDING', 'APPROVED', 'ANSWERED', 'REJECTED'],
            description: 'Filtrar por status da pergunta'
          },
          sortBy: {
            type: 'string',
            enum: ['votes', 'recent', 'oldest'],
            default: 'votes',
            description: 'Ordenar por votos, mais recente ou mais antigo'
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
                questions: { type: 'array' },
                pagination: { type: 'object' }
              }
            }
          }
        }
      }
    },
    preHandler: [authenticate]
  }, amaController.getAmaQuestions.bind(amaController));

  // POST /ama/sessions/:sessionId/questions - Criar pergunta em uma sessão
  server.post('/sessions/:sessionId/questions', {
    schema: {
      tags: ['AMA'],
      summary: 'Criar pergunta AMA',
      description: 'Cria uma nova pergunta em uma sessão AMA',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['sessionId'],
        properties: {
          sessionId: { type: 'string', description: 'ID da sessão AMA' }
        }
      },
      body: { $ref: 'amaQuestionRequest#' },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [authenticate]
  }, amaController.createAmaQuestion.bind(amaController));

  // PUT /ama/questions/:questionId/answer - Responder pergunta
  server.put('/questions/:questionId/answer', {
    schema: {
      tags: ['AMA'],
      summary: 'Responder pergunta AMA',
      description: 'Responde uma pergunta AMA (apenas host da sessão)',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['questionId'],
        properties: {
          questionId: { type: 'string', description: 'ID da pergunta' }
        }
      },
      body: { $ref: 'amaAnswerRequest#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [authenticate]
  }, amaController.answerAmaQuestion.bind(amaController));

  // POST /ama/questions/:questionId/vote - Votar em pergunta
  server.post('/questions/:questionId/vote', {
    schema: {
      tags: ['AMA'],
      summary: 'Votar em pergunta AMA',
      description: 'Vota em uma pergunta AMA (upvote ou downvote)',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['questionId'],
        properties: {
          questionId: { type: 'string', description: 'ID da pergunta' }
        }
      },
      body: { $ref: 'amaVoteRequest#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [authenticate]
  }, amaController.voteAmaQuestion.bind(amaController));

  // GET /ama/sessions/:sessionId/stats - Estatísticas da sessão
  server.get('/sessions/:sessionId/stats', {
    schema: {
      tags: ['AMA'],
      summary: 'Estatísticas da sessão AMA',
      description: 'Obtém estatísticas detalhadas de uma sessão AMA',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['sessionId'],
        properties: {
          sessionId: { type: 'string', description: 'ID da sessão AMA' }
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
                overview: { type: 'object' },
                questionStats: { type: 'object' },
                participantStats: { type: 'object' },
                timelineStats: { type: 'object' }
              }
            }
          }
        }
      }
    },
    preHandler: [authenticate]
  }, amaController.getAmaStats.bind(amaController));
};