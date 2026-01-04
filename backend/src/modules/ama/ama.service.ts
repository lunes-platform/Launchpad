import { logger } from '../../shared/logger';
import { prisma } from '../../shared/database';

/**
 * Service para AMA (Ask Me Anything)
 * 
 * Contém a lógica de negócio para gerenciar sessões de perguntas e respostas
 */
export class AmaService {

  /**
   * Lista sessões AMA com paginação e filtros
   */
  async getAmaSessions(params: {
    page: number;
    limit: number;
    status?: string;
    projectId?: string;
    userId: string;
  }) {
    try {
      logger.info('Fetching AMA sessions', params);

      const where: any = {};
      
      if (params.projectId) {
        where.projectId = params.projectId;
      }

      // Filtro por status baseado no campo isActive
      if (params.status) {
        if (params.status === 'ACTIVE') {
          where.isActive = true;
          where.startDate = { lte: new Date() };
          where.endDate = { gte: new Date() };
        } else if (params.status === 'SCHEDULED') {
          where.startDate = { gt: new Date() };
        } else if (params.status === 'COMPLETED') {
          where.endDate = { lt: new Date() };
        }
      }

      const [sessions, totalCount] = await Promise.all([
        prisma.ama.findMany({
          where,
          skip: (params.page - 1) * params.limit,
          take: params.limit,
          include: {
            project: {
              select: {
                id: true,
                name: true,
                symbol: true
              }
            },
            questions: {
              select: {
                id: true,
                isAnswered: true
              }
            },
            _count: {
              select: {
                questions: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.ama.count({ where })
      ]);

      // Calcular estatísticas manualmente
      const allSessions = await prisma.ama.findMany({
        select: {
          isActive: true,
          startDate: true,
          endDate: true
        }
      });

      const now = new Date();
      const activeSessions = allSessions.filter(s => 
        s.isActive && s.startDate <= now && s.endDate >= now
      ).length;
      
      const scheduledSessions = allSessions.filter(s => 
        s.startDate > now
      ).length;
      
      const completedSessions = allSessions.filter(s => 
        s.endDate < now
      ).length;

      const formattedSessions = sessions.map(session => {
        const now = new Date();
        let status = 'SCHEDULED';
        
        if (session.startDate <= now && session.endDate >= now && session.isActive) {
          status = 'ACTIVE';
        } else if (session.endDate < now) {
          status = 'COMPLETED';
        }

        return {
          id: session.id,
          title: session.title,
          description: session.description,
          projectId: session.projectId,
          projectName: session.project.name,
          projectSymbol: session.project.symbol,
          status,
          scheduledAt: session.startDate.toISOString(),
          startedAt: session.startDate.toISOString(),
          endedAt: session.endDate.toISOString(),
          duration: Math.round((session.endDate.getTime() - session.startDate.getTime()) / (1000 * 60)), // em minutos
          maxQuestions: session.maxQuestions,
          totalQuestions: session._count.questions,
          answeredQuestions: session.questions.filter(q => q.isAnswered).length,
          isLive: status === 'ACTIVE',
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.updatedAt.toISOString()
        };
      });

      return {
        sessions: formattedSessions,
        pagination: {
          page: params.page,
          limit: params.limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / params.limit)
        },
        stats: {
          totalSessions: totalCount,
          activeSessions,
          scheduledSessions,
          completedSessions
        }
      };
    } catch (error) {
      logger.error('Error fetching AMA sessions', { error });
      throw new Error('Erro ao buscar sessões AMA');
    }
  }

  /**
   * Obtém uma sessão AMA por ID
   */
  async getAmaSessionById(sessionId: string) {
    try {
      logger.info('Fetching AMA session by ID', { sessionId });

      const session = await prisma.ama.findUnique({
        where: { id: sessionId },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              symbol: true,
              description: true,
              logo: true
            }
          },
          questions: {
            select: {
              id: true,
              isAnswered: true,
              votes: true
            }
          },
          _count: {
            select: {
              questions: true
            }
          }
        }
      });

      if (!session) {
        throw new Error('Sessão AMA não encontrada');
      }

      const now = new Date();
      let status = 'SCHEDULED';
      
      if (session.startDate <= now && session.endDate >= now && session.isActive) {
        status = 'ACTIVE';
      } else if (session.endDate < now) {
        status = 'COMPLETED';
      }

      return {
        id: session.id,
        title: session.title,
        description: session.description,
        projectId: session.projectId,
        projectName: session.project.name,
        projectLogo: session.project.logo || `https://api.dicebear.com/7.x/shapes/svg?seed=${session.project.symbol}`,
        status,
        scheduledAt: session.startDate.toISOString(),
        startedAt: session.startDate.toISOString(),
        endedAt: session.endDate.toISOString(),
        duration: Math.round((session.endDate.getTime() - session.startDate.getTime()) / (1000 * 60)),
        maxQuestions: session.maxQuestions,
        totalQuestions: session._count.questions,
        answeredQuestions: session.questions.filter((q: any) => q.isAnswered).length,
        totalVotes: session.questions.reduce((sum: number, q: any) => sum + q.votes, 0),
        isLive: status === 'ACTIVE',
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString()
      };
    } catch (error) {
      logger.error('Error fetching AMA session', { error, sessionId });
      throw new Error('Erro ao buscar sessão AMA');
    }
  }

  /**
   * Verifica se um usuário pode criar AMA para um projeto
   */
  async canUserCreateAma(userId: string, projectId: string): Promise<boolean> {
    try {
      logger.info('Checking if user can create AMA', { userId, projectId });

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { creatorId: true },
      });

      if (!project) return false;

      return project.creatorId === userId;
    } catch (error) {
      logger.error('Error checking AMA creation permission', { error });
      return false;
    }
  }

  /**
   * Cria uma nova sessão AMA
   */
  async createAmaSession(data: {
    title: string;
    description: string;
    projectId: string;
    hostId: string;
    scheduledAt: string;
    duration: number;
    maxQuestions?: number;
    allowAnonymous?: boolean;
    moderationEnabled?: boolean;
    tags?: string[];
  }) {
    try {
      logger.info('Creating AMA session', { data });

      const newSession = {
        id: `ama-session-${Date.now()}`,
        ...data,
        status: 'SCHEDULED',
        startedAt: null,
        endedAt: null,
        totalQuestions: 0,
        answeredQuestions: 0,
        totalParticipants: 0,
        currentViewers: 0,
        isLive: false,
        maxQuestions: data.maxQuestions || 50,
        allowAnonymous: data.allowAnonymous || false,
        moderationEnabled: data.moderationEnabled || true,
        tags: data.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return newSession;
    } catch (error) {
      logger.error('Error creating AMA session', { error });
      throw new Error('Erro ao criar sessão AMA');
    }
  }

  /**
   * Atualiza uma sessão AMA
   */
  async updateAmaSession(sessionId: string, data: any) {
    try {
      logger.info('Updating AMA session', { sessionId, data });

      // Simular atualização
      const updatedSession = {
        id: sessionId,
        ...data,
        updatedAt: new Date().toISOString()
      };

      return updatedSession;
    } catch (error) {
      logger.error('Error updating AMA session', { error });
      throw new Error('Erro ao atualizar sessão AMA');
    }
  }

  /**
   * Lista perguntas de uma sessão AMA
   */
  async getAmaQuestions(sessionId: string, params: {
    page: number;
    limit: number;
    status?: string;
    sortBy: string;
  }) {
    try {
      logger.info('Fetching AMA questions', { sessionId, params });

      const where: any = { amaId: sessionId };
      
      if (params.status) {
        if (params.status === 'ANSWERED') {
          where.isAnswered = true;
        } else if (params.status === 'PENDING') {
          where.isAnswered = false;
        }
      }

      let orderBy: any = { createdAt: 'desc' };
      
      if (params.sortBy === 'votes') {
        orderBy = { votes: 'desc' };
      } else if (params.sortBy === 'recent') {
        orderBy = { createdAt: 'desc' };
      }

      const [questions, totalCount] = await Promise.all([
        prisma.amaQuestion.findMany({
          where,
          skip: (params.page - 1) * params.limit,
          take: params.limit,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true
              }
            }
          },
          orderBy
        }),
        prisma.amaQuestion.count({ where })
      ]);

      const formattedQuestions = questions.map(question => ({
        id: question.id,
        sessionId: question.amaId,
        question: question.question,
        authorId: question.userId,
        authorName: question.user.displayName || question.user.username,
        status: question.isAnswered ? 'ANSWERED' : 'PENDING',
        answer: question.answer,
        answeredAt: question.updatedAt.toISOString(),
        votes: question.votes,
        isAnswered: question.isAnswered,
        createdAt: question.createdAt.toISOString(),
        updatedAt: question.updatedAt.toISOString()
      }));

      return {
        questions: formattedQuestions,
        pagination: {
          page: params.page,
          limit: params.limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / params.limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching AMA questions', { error });
      throw new Error('Erro ao buscar perguntas AMA');
    }
  }

  /**
   * Cria uma nova pergunta AMA
   */
  async createAmaQuestion(data: {
    sessionId: string;
    question: string;
    authorId: string;
    isAnonymous?: boolean;
    tags?: string[];
  }) {
    try {
      logger.info('Creating AMA question', data);

      // Verificar se a sessão AMA existe e está ativa
      const session = await prisma.ama.findUnique({
        where: { id: data.sessionId }
      });

      if (!session) {
        throw new Error('Sessão AMA não encontrada');
      }

      const now = new Date();
      if (session.endDate < now) {
        throw new Error('Sessão AMA já foi encerrada');
      }

      if (session.startDate > now) {
        throw new Error('Sessão AMA ainda não começou');
      }

      // Verificar limite de perguntas se definido
      if (session.maxQuestions) {
        const questionCount = await prisma.amaQuestion.count({
          where: { amaId: data.sessionId }
        });

        if (questionCount >= session.maxQuestions) {
          throw new Error('Limite máximo de perguntas atingido');
        }
      }

      const newQuestion = await prisma.amaQuestion.create({
        data: {
          amaId: data.sessionId,
          userId: data.authorId,
          question: data.question,
          isAnswered: false,
          votes: 0
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true
            }
          }
        }
      });

      return {
        id: newQuestion.id,
        sessionId: newQuestion.amaId,
        question: newQuestion.question,
        authorId: newQuestion.userId,
        authorName: newQuestion.user.displayName || newQuestion.user.username,
        status: 'PENDING',
        answer: null,
        votes: newQuestion.votes,
        isAnswered: false,
        createdAt: newQuestion.createdAt.toISOString(),
        updatedAt: newQuestion.updatedAt.toISOString()
      };
    } catch (error) {
      logger.error('Error creating AMA question', { error });
      throw error;
    }
  }

  /**
   * Verifica se um usuário pode responder uma pergunta
   */
  async canUserAnswerQuestion(userId: string, questionId: string): Promise<boolean> {
    try {
      logger.info('Checking if user can answer question', { userId, questionId });

      const question = await prisma.amaQuestion.findUnique({
        where: { id: questionId },
        select: {
          ama: {
            select: {
              project: {
                select: {
                  creatorId: true,
                },
              },
            },
          },
        },
      });

      if (!question || !question.ama || !question.ama.project) {
        return false;
      }

      return question.ama.project.creatorId === userId;
    } catch (error) {
      logger.error('Error checking answer permission', { error });
      return false;
    }
  }

  /**
   * Responde uma pergunta AMA
   */
  async answerAmaQuestion(questionId: string, data: {
    answer: string;
    answeredBy: string;
  }) {
    try {
      logger.info('Answering AMA question', { questionId, data });

      // Verificar se a pergunta existe
      const question = await prisma.amaQuestion.findUnique({
        where: { id: questionId },
        include: {
          ama: true
        }
      });

      if (!question) {
        throw new Error('Pergunta não encontrada');
      }

      if (question.isAnswered) {
        throw new Error('Pergunta já foi respondida');
      }

      // Verificar se a sessão ainda está ativa
      const now = new Date();
      if (question.ama.endDate < now) {
        throw new Error('Sessão AMA já foi encerrada');
      }

      // Atualizar a pergunta com a resposta
      const updatedQuestion = await prisma.amaQuestion.update({
        where: { id: questionId },
        data: {
          answer: data.answer,
          isAnswered: true
        }
      });

      return {
        id: updatedQuestion.id,
        answer: updatedQuestion.answer,
        answeredBy: data.answeredBy, // Retornamos o valor passado
        isAnswered: updatedQuestion.isAnswered,
        updatedAt: updatedQuestion.updatedAt.toISOString()
      };
    } catch (error) {
      logger.error('Error answering AMA question', { error });
      throw error;
    }
  }

  /**
   * Vota em uma pergunta AMA
   */
  async voteAmaQuestion(questionId: string, userId: string, voteType: 'up' | 'down') {
    try {
      logger.info('Voting on AMA question', { questionId, userId, voteType });

      // Verificar se a pergunta existe
      const question = await prisma.amaQuestion.findUnique({
        where: { id: questionId }
      });

      if (!question) {
        throw new Error('Pergunta não encontrada');
      }

      // Atualizar votos (incrementar ou decrementar)
      const voteIncrement = voteType === 'up' ? 1 : -1;
      
      const updatedQuestion = await prisma.amaQuestion.update({
        where: { id: questionId },
        data: {
          votes: {
            increment: voteIncrement
          }
        }
      });

      return {
        questionId,
        userId,
        voteType,
        newVoteCount: updatedQuestion.votes,
        votedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error voting on AMA question', { error });
      throw error;
    }
  }

  /**
   * Obtém estatísticas de uma sessão AMA
   */
  async getAmaStats(sessionId: string) {
    try {
      logger.info('Fetching AMA stats', { sessionId });

      // Verificar se a sessão existe
      const session = await prisma.ama.findUnique({
        where: { id: sessionId }
      });

      if (!session) {
        throw new Error('Sessão AMA não encontrada');
      }

      // Buscar estatísticas das perguntas
      const [
        totalQuestions,
        answeredQuestions,
        questionsByVotes
      ] = await Promise.all([
        prisma.amaQuestion.count({
          where: { amaId: sessionId }
        }),
        prisma.amaQuestion.count({
          where: { 
            amaId: sessionId,
            isAnswered: true
          }
        }),
        prisma.amaQuestion.findMany({
          where: { amaId: sessionId },
          select: { votes: true }
        })
      ]);

      const pendingQuestions = totalQuestions - answeredQuestions;

      // Categorizar perguntas por votos
      const highlyVoted = questionsByVotes.filter(q => q.votes > 20).length;
      const moderatelyVoted = questionsByVotes.filter(q => q.votes >= 5 && q.votes <= 20).length;
      const lowVoted = questionsByVotes.filter(q => q.votes < 5).length;

      // Calcular estatísticas
      const engagementRate = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

      return {
        sessionId,
        overview: {
          totalQuestions,
          answeredQuestions,
          pendingQuestions,
          totalParticipants: totalQuestions, // Aproximação baseada no número de perguntas
          engagementRate: Math.round(engagementRate * 10) / 10
        },
        questionStats: {
          byStatus: {
            answered: answeredQuestions,
            pending: pendingQuestions
          },
          byVotes: {
            highlyVoted,
            moderatelyVoted,
            lowVoted
          }
        },
        session: {
          title: session.title,
          description: session.description,
          startDate: session.startDate.toISOString(),
          endDate: session.endDate.toISOString(),
          isActive: session.isActive,
          maxQuestions: session.maxQuestions
        }
      };
    } catch (error) {
      logger.error('Error fetching AMA stats', { error });
      throw error;
    }
  }
}