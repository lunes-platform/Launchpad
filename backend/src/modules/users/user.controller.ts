import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from './user.service';
import { logger } from '../../shared/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Listar todos os usuários (admin only)
   */
  async getUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as {
        page?: number;
        limit?: number;
        search?: string;
        kycStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
        isVerified?: boolean;
      };

      const { page = 1, limit = 20, search, kycStatus, isVerified } = query;

      logger.info('Users list requested', {
        page,
        limit,
        search,
        kycStatus,
        isVerified,
        requestedBy: (request as any).user?.id
      });

      const result = await this.userService.getUsers({
        page,
        limit,
        search,
        kycStatus: kycStatus as any,
        isActive: isVerified
      });

      return reply.send({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error fetching users', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Obter usuário por ID
   */
  async getUserById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const currentUser = (request as any).user;

      logger.info('User details requested', { 
        userId: id,
        requestedBy: currentUser?.id 
      });

      // Verificar se o usuário pode acessar este perfil
      if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
        return reply.status(403).send({
          success: false,
          error: 'Acesso negado'
        });
      }

      const user = await this.userService.getUserById(id);

      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      return reply.send({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Error fetching user', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Atualizar perfil do usuário
   */
  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const updateData = request.body as {
        username?: string;
        displayName?: string;
        bio?: string;
        avatar?: string;
      };
      const currentUser = (request as any).user;

      logger.info('User update requested', { 
        userId: id,
        updateData,
        requestedBy: currentUser?.id 
      });

      // Verificar se o usuário pode atualizar este perfil
      if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
        return reply.status(403).send({
          success: false,
          error: 'Acesso negado'
        });
      }

      const updatedUser = await this.userService.updateUser(id, updateData);

      if (!updatedUser) {
        return reply.status(404).send({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      return reply.send({
        success: true,
        data: updatedUser,
        message: 'Perfil atualizado com sucesso'
      });
    } catch (error) {
      logger.error('Error updating user', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Obter estatísticas do usuário
   */
  async getUserStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const currentUser = (request as any).user;

      logger.info('User stats requested', { 
        userId: id,
        requestedBy: currentUser?.id 
      });

      // Verificar se o usuário pode acessar estas estatísticas
      if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
        return reply.status(403).send({
          success: false,
          error: 'Acesso negado'
        });
      }

      const stats = await this.userService.getUserStats(id);

      return reply.send({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Error fetching user stats', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Atualizar status KYC (admin only)
   */
  async updateKycStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { kycStatus, kycData } = request.body as {
        kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
        kycData?: any;
      };
      const currentUser = (request as any).user;

      logger.info('KYC status update requested', { 
        userId: id,
        kycStatus,
        requestedBy: currentUser?.id 
      });

      // Apenas admins podem atualizar status KYC
      if (currentUser.role !== 'ADMIN') {
        return reply.status(403).send({
          success: false,
          error: 'Acesso negado - apenas administradores'
        });
      }

      const updatedUser = await this.userService.updateKycStatus(id, kycStatus, kycData);

      if (!updatedUser) {
        return reply.status(404).send({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      return reply.send({
        success: true,
        data: updatedUser,
        message: 'Status KYC atualizado com sucesso'
      });
    } catch (error) {
      logger.error('Error updating KYC status', { error });
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}