import { logger } from '../../shared/logger';
import { prisma, createPaginationResult, type PaginationOptions } from '../../shared/database';
import { User, KycStatus } from '@prisma/client';

export interface UserUpdateData {
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
}

export interface UserStats {
  totalInvestments: number;
  totalStaked: string;
  totalRewards: string;
  projectsParticipated: number;
  referralsCount: number;
  kycStatus: string;
  memberSince: string;
}

/**
 * Serviço para gerenciamento de usuários
 * 
 * Responsabilidades:
 * - CRUD de usuários
 * - Validações de negócio
 * - Estatísticas de usuários
 * - Gerenciamento de KYC
 */
export class UserService {
  
  /**
   * Lista usuários com paginação e filtros
   */
  async getUsers(options: {
    page: number;
    limit: number;
    search?: string;
    kycStatus?: KycStatus;
    isActive?: boolean;
  }) {
    try {
      const { page, limit, search, kycStatus, isActive } = options;
      
      logger.info('Fetching users list', {
        page,
        limit,
        search,
        kycStatus,
        isActive
      });

      // Construir filtros
      const where: any = {};
      
      if (search) {
        where.OR = [
          { username: { contains: search, mode: 'insensitive' } },
          { displayName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { walletAddress: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      if (kycStatus) where.kycStatus = kycStatus;
      if (isActive !== undefined) where.isActive = isActive;

      // Buscar usuários com paginação
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            walletAddress: true,
            username: true,
            displayName: true,
            email: true,
            kycStatus: true,
            isActive: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
            // Incluir estatísticas calculadas
            _count: {
              select: {
                participations: true,
                stakings: true,
                raffleEntries: true
              }
            }
          }
        }),
        prisma.user.count({ where })
      ]);

      // Calcular estatísticas adicionais para cada usuário
      const usersWithStats = await Promise.all(
        users.map(async (user) => {
          const totalInvested = await prisma.participation.aggregate({
            where: { userId: user.id, status: 'CONFIRMED' },
            _sum: { amount: true }
          });

          return {
            ...user,
            totalInvested: totalInvested._sum.amount || 0,
            projectsParticipated: user._count.participations,
            stakingPositions: user._count.stakings,
            raffleEntries: user._count.raffleEntries
          };
        })
      );

      return createPaginationResult(usersWithStats, total, { page, limit });
    } catch (error) {
      logger.error('Error fetching users', { error, options });
      throw new Error('Erro ao buscar usuários');
    }
  }

  /**
   * Buscar usuário por ID
   */
  async getUserById(userId: string) {
    try {
      logger.info('Fetching user by ID', { userId });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              participations: true,
              stakings: true,
              raffleEntries: true,
              amaQuestions: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Calcular estatísticas detalhadas
      const [totalInvested, totalStaked, totalRewards, recentActivity] = await Promise.all([
        prisma.participation.aggregate({
          where: { userId, status: 'CONFIRMED' },
          _sum: { amount: true }
        }),
        prisma.launchpoolStake.aggregate({
          where: { userId, isActive: true },
          _sum: { amount: true }
        }),
        prisma.launchpoolStake.aggregate({
          where: { userId },
          _sum: { rewardAmount: true }
        }),
        prisma.participation.findMany({
          where: { userId },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            project: {
              select: { name: true, symbol: true }
            }
          }
        })
      ]);

      const userWithStats = {
        ...user,
        totalInvested: totalInvested._sum.amount || 0,
        totalStaked: totalStaked._sum.amount || 0,
        totalRewards: totalRewards._sum.rewardAmount || 0,
        projectsParticipated: user._count.participations,
        stakingPositions: user._count.stakings,
        raffleEntries: user._count.raffleEntries,
        amaQuestions: user._count.amaQuestions,
        recentActivity
      };

      logger.info('User fetched successfully', { userId });
      return userWithStats;
    } catch (error) {
      logger.error('Error fetching user by ID', { error, userId });
      throw new Error('Usuário não encontrado');
    }
  }

  /**
   * Atualizar dados do usuário
   */
  async updateUser(userId: string, data: UserUpdateData) {
    try {
      logger.info('Updating user', { userId, data });

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          username: data.username,
          displayName: data.displayName,
          bio: data.bio,
          avatar: data.avatar,
          updatedAt: new Date()
        },
        select: {
          id: true,
          walletAddress: true,
          username: true,
          displayName: true,
          email: true,
          bio: true,
          avatar: true,
          kycStatus: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true
        }
      });

      logger.info('User updated successfully', { userId });
      return user;
    } catch (error) {
      logger.error('Error updating user', { error, userId, data });
      throw new Error('Erro ao atualizar usuário');
    }
  }

  /**
   * Obter estatísticas do usuário
   */
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      logger.info('Fetching user stats', { userId });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          kycStatus: true,
          createdAt: true,
          totalStaked: true,
          totalRewards: true
        }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Calcular estatísticas
      const [totalInvestments, projectsCount, referralsCount] = await Promise.all([
        prisma.participation.aggregate({
          where: { userId, status: 'CONFIRMED' },
          _sum: { amount: true },
          _count: true
        }),
        prisma.participation.count({
          where: { userId, status: 'CONFIRMED' }
        }),
        prisma.user.count({
          where: { referredBy: userId }
        })
      ]);

      const stats: UserStats = {
        totalInvestments: Number(totalInvestments._sum.amount || 0),
        totalStaked: user.totalStaked.toString(),
        totalRewards: user.totalRewards.toString(),
        projectsParticipated: projectsCount,
        referralsCount,
        kycStatus: user.kycStatus,
        memberSince: user.createdAt.toISOString()
      };

      logger.info('User stats fetched successfully', { userId });
      return stats;
    } catch (error) {
      logger.error('Error fetching user stats', { error, userId });
      throw new Error('Erro ao buscar estatísticas do usuário');
    }
  }

  /**
   * Atualizar status KYC do usuário
   */
  async updateKycStatus(userId: string, kycStatus: KycStatus, kycData?: any) {
    try {
      logger.info('Updating user KYC status', { userId, kycStatus });

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          kycStatus,
          kycData,
          updatedAt: new Date()
        },
        select: {
          id: true,
          walletAddress: true,
          username: true,
          displayName: true,
          kycStatus: true,
          updatedAt: true
        }
      });

      logger.info('User KYC status updated successfully', { userId, kycStatus });
      return user;
    } catch (error) {
      logger.error('Error updating user KYC status', { error, userId, kycStatus });
      throw new Error('Erro ao atualizar status KYC');
    }
  }
}