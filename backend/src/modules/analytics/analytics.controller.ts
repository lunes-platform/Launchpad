import { FastifyRequest, FastifyReply } from 'fastify';
import { AnalyticsService } from './analytics.service';
import { logger } from '../../shared/logger';

/**
 * Controller para Analytics
 * Gerencia endpoints relacionados a métricas e estatísticas da plataforma
 */
export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  /**
   * GET /analytics/dashboard
   * Obtém métricas gerais do dashboard
   */
  async getDashboardMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      
      logger.info('Dashboard metrics requested', {
        userId: user.id,
        userRole: user.role
      });

      const metrics = await this.analyticsService.getDashboardMetrics(user.role);

      return reply.send({
        success: true,
        data: metrics
      });
    } catch (error) {
      logger.error('Error fetching dashboard metrics', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /analytics/projects
   * Obtém métricas de projetos
   */
  async getProjectsMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const { period, projectId } = request.query as any;
      
      logger.info('Projects metrics requested', {
        userId: user.id,
        period,
        projectId
      });

      const metrics = await this.analyticsService.getProjectsMetrics({
        period,
        projectId,
        userRole: user.role
      });

      return reply.send({
        success: true,
        data: metrics
      });
    } catch (error) {
      logger.error('Error fetching projects metrics', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /analytics/users
   * Obtém métricas de usuários (admin only)
   */
  async getUsersMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const { period } = request.query as any;
      
      // Verificar se é admin
      if (user.role !== 'ADMIN') {
        return reply.status(403).send({
          success: false,
          error: 'Acesso negado - apenas administradores'
        });
      }
      
      logger.info('Users metrics requested', {
        adminId: user.id,
        period
      });

      const metrics = await this.analyticsService.getUsersMetrics(period);

      return reply.send({
        success: true,
        data: metrics
      });
    } catch (error) {
      logger.error('Error fetching users metrics', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /analytics/revenue
   * Obtém métricas de receita (admin only)
   */
  async getRevenueMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const { period, currency } = request.query as any;
      
      // Verificar se é admin
      if (user.role !== 'ADMIN') {
        return reply.status(403).send({
          success: false,
          error: 'Acesso negado - apenas administradores'
        });
      }
      
      logger.info('Revenue metrics requested', {
        adminId: user.id,
        period,
        currency
      });

      const metrics = await this.analyticsService.getRevenueMetrics({
        period,
        currency
      });

      return reply.send({
        success: true,
        data: metrics
      });
    } catch (error) {
      logger.error('Error fetching revenue metrics', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /analytics/performance
   * Obtém métricas de performance da plataforma
   */
  async getPerformanceMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const { period } = request.query as any;
      
      logger.info('Performance metrics requested', {
        userId: user.id,
        period
      });

      const metrics = await this.analyticsService.getPerformanceMetrics(period);

      return reply.send({
        success: true,
        data: metrics
      });
    } catch (error) {
      logger.error('Error fetching performance metrics', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /analytics/events
   * Registra evento de analytics
   */
  async trackEvent(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const eventData = request.body as any;
      
      logger.info('Analytics event tracked', {
        userId: user.id,
        eventType: eventData.type,
        eventCategory: eventData.category
      });

      await this.analyticsService.trackEvent({
        userId: user.id,
        ...eventData
      });

      return reply.send({
        success: true,
        message: 'Evento registrado com sucesso'
      });
    } catch (error) {
      logger.error('Error tracking analytics event', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}