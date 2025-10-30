import { FastifyRequest, FastifyReply } from 'fastify';
import { AmaService } from './ama.service';
import { logger } from '../../shared/logger';

/**
 * Controller para AMA (Ask Me Anything)
 * 
 * Gerencia sessões de perguntas e respostas entre usuários e proprietários de projetos
 */
export class AmaController {
  private amaService: AmaService;

  constructor() {
    this.amaService = new AmaService();
  }

  /**
   * Lista todas as sessões AMA
   */
  async getAmaSessions(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any;
      const user = (request as any).user;

      logger.info('Listing AMA sessions', {
        userId: user.id,
        query
      });

      const sessions = await this.amaService.getAmaSessions({
        page: parseInt(query.page) || 1,
        limit: parseInt(query.limit) || 20,
        status: query.status,
        projectId: query.projectId,
        userId: user.id
      });

      return reply.send({
        success: true,
        data: sessions
      });
    } catch (error) {
      logger.error('Error listing AMA sessions', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Obtém uma sessão AMA específica
   */
  async getAmaSession(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const user = (request as any).user;

      logger.info('Getting AMA session', {
        sessionId: id,
        userId: user.id
      });

      const session = await this.amaService.getAmaSessionById(id);

      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Sessão AMA não encontrada'
        });
      }

      return reply.send({
        success: true,
        data: session
      });
    } catch (error) {
      logger.error('Error getting AMA session', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Cria uma nova sessão AMA (apenas proprietários de projeto)
   */
  async createAmaSession(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      const user = (request as any).user;

      logger.info('Creating AMA session', {
        userId: user.id,
        projectId: body.projectId
      });

      // Verificar se o usuário é proprietário do projeto
      const canCreate = await this.amaService.canUserCreateAma(user.id, body.projectId);
      if (!canCreate) {
        return reply.status(403).send({
          success: false,
          error: 'Apenas proprietários do projeto podem criar sessões AMA'
        });
      }

      const session = await this.amaService.createAmaSession({
        ...body,
        hostId: user.id
      });

      return reply.status(201).send({
        success: true,
        data: session,
        message: 'Sessão AMA criada com sucesso'
      });
    } catch (error) {
      logger.error('Error creating AMA session', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Atualiza uma sessão AMA (apenas host)
   */
  async updateAmaSession(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const body = request.body as any;
      const user = (request as any).user;

      logger.info('Updating AMA session', {
        sessionId: id,
        userId: user.id
      });

      // Verificar se o usuário é o host da sessão
      const session = await this.amaService.getAmaSessionById(id);
      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Sessão AMA não encontrada'
        });
      }

      // Como não temos hostId no schema, vamos permitir apenas ADMINs atualizarem
      if (user.role !== 'ADMIN') {
        return reply.status(403).send({
          success: false,
          error: 'Apenas administradores podem atualizar sessões AMA'
        });
      }

      const updatedSession = await this.amaService.updateAmaSession(id, body);

      return reply.send({
        success: true,
        data: updatedSession,
        message: 'Sessão AMA atualizada com sucesso'
      });
    } catch (error) {
      logger.error('Error updating AMA session', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Lista perguntas de uma sessão AMA
   */
  async getAmaQuestions(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { sessionId } = request.params as any;
      const query = request.query as any;
      const user = (request as any).user;

      logger.info('Getting AMA questions', {
        sessionId,
        userId: user.id
      });

      const questions = await this.amaService.getAmaQuestions(sessionId, {
        page: parseInt(query.page) || 1,
        limit: parseInt(query.limit) || 20,
        status: query.status,
        sortBy: query.sortBy || 'votes'
      });

      return reply.send({
        success: true,
        data: questions
      });
    } catch (error) {
      logger.error('Error getting AMA questions', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Cria uma nova pergunta em uma sessão AMA
   */
  async createAmaQuestion(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { sessionId } = request.params as any;
      const body = request.body as any;
      const user = (request as any).user;

      logger.info('Creating AMA question', {
        sessionId,
        userId: user.id
      });

      // Verificar se a sessão existe e está ativa
      const session = await this.amaService.getAmaSessionById(sessionId);
      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Sessão AMA não encontrada'
        });
      }

      if (session.status !== 'ACTIVE') {
        return reply.status(400).send({
          success: false,
          error: 'Sessão AMA não está ativa para perguntas'
        });
      }

      const question = await this.amaService.createAmaQuestion({
        ...body,
        sessionId,
        authorId: user.id
      });

      return reply.status(201).send({
        success: true,
        data: question,
        message: 'Pergunta criada com sucesso'
      });
    } catch (error) {
      logger.error('Error creating AMA question', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Responde a uma pergunta AMA (apenas host)
   */
  async answerAmaQuestion(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { questionId } = request.params as any;
      const body = request.body as any;
      const user = (request as any).user;

      logger.info('Answering AMA question', {
        questionId,
        userId: user.id
      });

      // Verificar se o usuário pode responder (host da sessão)
      const canAnswer = await this.amaService.canUserAnswerQuestion(user.id, questionId);
      if (!canAnswer) {
        return reply.status(403).send({
          success: false,
          error: 'Apenas o host da sessão pode responder perguntas'
        });
      }

      const answer = await this.amaService.answerAmaQuestion(questionId, {
        answer: body.answer,
        answeredBy: user.id
      });

      return reply.send({
        success: true,
        data: answer,
        message: 'Pergunta respondida com sucesso'
      });
    } catch (error) {
      logger.error('Error answering AMA question', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Vota em uma pergunta AMA
   */
  async voteAmaQuestion(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { questionId } = request.params as any;
      const body = request.body as any;
      const user = (request as any).user;

      logger.info('Voting on AMA question', {
        questionId,
        userId: user.id,
        voteType: body.voteType
      });

      const result = await this.amaService.voteAmaQuestion(questionId, user.id, body.voteType);

      return reply.send({
        success: true,
        data: result,
        message: 'Voto registrado com sucesso'
      });
    } catch (error) {
      logger.error('Error voting on AMA question', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Obtém estatísticas de uma sessão AMA
   */
  async getAmaStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { sessionId } = request.params as any;
      const user = (request as any).user;

      logger.info('Getting AMA stats', {
        sessionId,
        userId: user.id
      });

      const stats = await this.amaService.getAmaStats(sessionId);

      return reply.send({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Error getting AMA stats', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}