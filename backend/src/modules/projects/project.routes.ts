import { FastifyInstance } from 'fastify';
import { logger } from '../../shared/logger';

/**
 * Rotas para gerenciamento de projetos
 * 
 * Endpoints:
 * - GET /projects - Listar projetos públicos
 * - GET /projects/:id - Obter projeto por ID
 * - POST /projects - Criar novo projeto (autenticado)
 * - PUT /projects/:id - Atualizar projeto (owner/admin)
 * - DELETE /projects/:id - Deletar projeto (owner/admin)
 */
export const projectRoutes = async (server: FastifyInstance) => {
  await server.register(async function (server) {
    
    // GET /projects - Listar projetos públicos (sem autenticação)
    server.get('/', {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'integer', minimum: 1, default: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            status: { type: 'string', enum: ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'] },
            category: { type: 'string' }
          }
        }
      }
    }, async (request, reply) => {
      try {
        const { page = 1, limit = 20, status, category } = request.query as any;
        
        logger.info('Projects list requested', {
          page,
          limit,
          status,
          category
        });

        // Simular lista de projetos
        const mockProjects = Array.from({ length: limit }, (_, i) => ({
          id: `project-${page}-${i + 1}`,
          name: `Projeto ${page}-${i + 1}`,
          description: `Descrição do projeto ${page}-${i + 1}`,
          status: status || 'ACTIVE',
          category: category || 'DeFi',
          totalRaise: Math.floor(Math.random() * 1000000),
          currentRaise: Math.floor(Math.random() * 500000),
          tokenPrice: Math.random() * 10,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        }));

        return {
          success: true,
          data: mockProjects,
          pagination: {
            page,
            limit,
            total: 100,
            totalPages: Math.ceil(100 / limit)
          }
        };
      } catch (error) {
        logger.error('Error fetching projects', { error });
        reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
    });

    // GET /projects/:id - Obter projeto por ID
    server.get('/:id', {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        }
      }
    }, async (request, reply) => {
      try {
        const { id } = request.params as any;
        
        logger.info('Project details requested', { projectId: id });

        // Simular projeto específico
        const mockProject = {
          id,
          name: `Projeto ${id}`,
          description: `Descrição detalhada do projeto ${id}`,
          longDescription: `Descrição longa e detalhada do projeto ${id} com todos os detalhes técnicos e de negócio.`,
          status: 'ACTIVE',
          category: 'DeFi',
          totalRaise: 1000000,
          currentRaise: 750000,
          tokenPrice: 0.5,
          tokenSymbol: 'PRJ',
          tokenSupply: 2000000,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          website: 'https://example.com',
          whitepaper: 'https://example.com/whitepaper.pdf',
          social: {
            twitter: 'https://twitter.com/project',
            telegram: 'https://t.me/project',
            discord: 'https://discord.gg/project'
          },
          team: [
            {
              name: 'João Silva',
              role: 'CEO',
              bio: 'Experiência em blockchain e finanças'
            }
          ],
          roadmap: [
            {
              phase: 'Q1 2024',
              title: 'Desenvolvimento MVP',
              status: 'completed'
            },
            {
              phase: 'Q2 2024',
              title: 'Launch Mainnet',
              status: 'in_progress'
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return {
          success: true,
          data: mockProject
        };
      } catch (error) {
        logger.error('Error fetching project details', { error });
        reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
    });

    // Middleware de autenticação para rotas protegidas
    server.addHook('preHandler', async (request, reply) => {
      // Aplicar apenas para métodos que precisam de autenticação
      if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      }
    });

    // POST /projects - Criar novo projeto
    server.post('/', {
      schema: {
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 3, maxLength: 100 },
            description: { type: 'string', minLength: 10, maxLength: 500 },
            longDescription: { type: 'string', maxLength: 5000 },
            category: { type: 'string' },
            totalRaise: { type: 'number', minimum: 1000 },
            tokenPrice: { type: 'number', minimum: 0.001 },
            tokenSymbol: { type: 'string', minLength: 2, maxLength: 10 },
            tokenSupply: { type: 'number', minimum: 1000 },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            website: { type: 'string', format: 'uri' },
            whitepaper: { type: 'string', format: 'uri' }
          },
          required: ['name', 'description', 'category', 'totalRaise', 'tokenPrice', 'tokenSymbol', 'tokenSupply', 'startDate', 'endDate']
        }
      }
    }, async (request, reply) => {
      try {
        const user = (request as any).user;
        const projectData = request.body as any;
        
        logger.info('Project creation requested', {
          userId: user.id,
          projectName: projectData.name
        });

        // Simular criação de projeto
        const newProject = {
          id: `project-${Date.now()}`,
          ...projectData,
          status: 'DRAFT',
          currentRaise: 0,
          ownerId: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return {
          success: true,
          message: 'Projeto criado com sucesso',
          data: newProject
        };
      } catch (error) {
        logger.error('Error creating project', { error });
        reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
    });

  });
};