import type { UserInvestment, VestingScheduleItem } from '../types';

/**
 * Tipos de notificação disponíveis
 */
export type NotificationType = 
  | 'vesting_upcoming' 
  | 'vesting_available' 
  | 'claim_reminder' 
  | 'investment_update'
  | 'system_alert';

/**
 * Prioridade da notificação
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Status da notificação
 */
export type NotificationStatus = 'unread' | 'read' | 'dismissed' | 'archived';

/**
 * Interface para uma notificação
 */
export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  timestamp: string;
  investmentId?: string;
  vestingItemId?: string;
  actionUrl?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

/**
 * Configurações de notificação do usuário
 */
export interface NotificationSettings {
  enabled: boolean;
  vestingReminders: {
    enabled: boolean;
    daysBefore: number[];
  };
  claimReminders: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  investmentUpdates: {
    enabled: boolean;
    types: string[];
  };
  browserNotifications: boolean;
  emailNotifications: boolean;
}

/**
 * Serviço para gerenciar notificações de vesting e investimentos
 */
export class NotificationService {
  private static notifications: Notification[] = [];
  private static settings: NotificationSettings = {
    enabled: true,
    vestingReminders: {
      enabled: true,
      daysBefore: [7, 3, 1]
    },
    claimReminders: {
      enabled: true,
      frequency: 'weekly'
    },
    investmentUpdates: {
      enabled: true,
      types: ['status_change', 'new_vesting']
    },
    browserNotifications: true,
    emailNotifications: false
  };

  /**
   * Gera notificações para próximos vencimentos de vesting
   */
  static generateVestingNotifications(investments: UserInvestment[]): Notification[] {
    const notifications: Notification[] = [];
    const now = new Date();

    investments.forEach(investment => {
      if (!investment.vestingSchedule) return;

      investment.vestingSchedule.forEach((item, index) => {
        if (item.claimed) return;

        const vestingDate = new Date(item.date);
        const daysDiff = Math.ceil((vestingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Notificações para dias específicos antes do vencimento
        this.settings.vestingReminders.daysBefore.forEach(daysBefore => {
          if (daysDiff === daysBefore) {
            notifications.push({
              id: `vesting_${investment.id}_${index}_${daysBefore}d`,
              type: 'vesting_upcoming',
              priority: daysBefore <= 1 ? 'high' : 'medium',
              status: 'unread',
              title: `Vesting em ${daysBefore} ${daysBefore === 1 ? 'dia' : 'dias'}`,
              message: `${this.formatTokenAmount(item.amount, investment.tokenSymbol)} de ${investment.projectName} será desbloqueado em ${daysBefore} ${daysBefore === 1 ? 'dia' : 'dias'}.`,
              timestamp: now.toISOString(),
              investmentId: investment.id,
              vestingItemId: `${index}`,
              actionUrl: `/investments/${investment.id}`,
              expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              metadata: {
                vestingDate: item.date,
                amount: item.amount,
                tokenSymbol: investment.tokenSymbol
              }
            });
          }
        });

        // Notificação quando o vesting está disponível para resgate
        if (daysDiff <= 0 && daysDiff >= -7) {
          notifications.push({
            id: `vesting_available_${investment.id}_${index}`,
            type: 'vesting_available',
            priority: 'high',
            status: 'unread',
            title: 'Tokens disponíveis para resgate',
            message: `${this.formatTokenAmount(item.amount, investment.tokenSymbol)} de ${investment.projectName} está disponível para resgate.`,
            timestamp: now.toISOString(),
            investmentId: investment.id,
            vestingItemId: `${index}`,
            actionUrl: `/investments/${investment.id}?action=claim`,
            expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            metadata: {
              vestingDate: item.date,
              amount: item.amount,
              tokenSymbol: investment.tokenSymbol,
              claimable: true
            }
          });
        }
      });
    });

    return notifications;
  }

  /**
   * Gera lembretes de resgate para tokens não resgatados
   */
  static generateClaimReminders(investments: UserInvestment[]): Notification[] {
    const notifications: Notification[] = [];
    const now = new Date();

    investments.forEach(investment => {
      if (investment.claimableAmount && Number(investment.claimableAmount) > 0) {
        notifications.push({
          id: `claim_reminder_${investment.id}`,
          type: 'claim_reminder',
          priority: 'medium',
          status: 'unread',
          title: 'Lembrete de resgate',
          message: `Você tem ${this.formatTokenAmount(Number(investment.claimableAmount), investment.tokenSymbol)} disponível para resgate em ${investment.projectName}.`,
          timestamp: now.toISOString(),
          investmentId: investment.id,
          actionUrl: `/investments/${investment.id}?action=claim`,
          expiresAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: {
            claimableAmount: investment.claimableAmount,
            tokenSymbol: investment.tokenSymbol
          }
        });
      }
    });

    return notifications;
  }

  /**
   * Obtém todas as notificações
   */
  static getAllNotifications(): Notification[] {
    return [...this.notifications].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Obtém notificações não lidas
   */
  static getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => n.status === 'unread');
  }

  /**
   * Obtém notificações por prioridade
   */
  static getNotificationsByPriority(priority: NotificationPriority): Notification[] {
    return this.notifications.filter(n => n.priority === priority);
  }

  /**
   * Marca uma notificação como lida
   */
  static markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.status = 'read';
      return true;
    }
    return false;
  }

  /**
   * Marca todas as notificações como lidas
   */
  static markAllAsRead(): void {
    this.notifications.forEach(n => {
      if (n.status === 'unread') {
        n.status = 'read';
      }
    });
  }

  /**
   * Descarta uma notificação
   */
  static dismissNotification(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.status = 'dismissed';
      return true;
    }
    return false;
  }

  /**
   * Remove notificações expiradas
   */
  static cleanupExpiredNotifications(): void {
    const now = new Date();
    this.notifications = this.notifications.filter(n => {
      if (!n.expiresAt) return true;
      return new Date(n.expiresAt) > now;
    });
  }

  /**
   * Atualiza as configurações de notificação
   */
  static updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Obtém as configurações atuais
   */
  static getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  /**
   * Inicializa o serviço com investimentos
   */
  static initialize(investments: UserInvestment[]): void {
    this.cleanupExpiredNotifications();
    
    if (this.settings.enabled) {
      if (this.settings.vestingReminders.enabled) {
        const vestingNotifications = this.generateVestingNotifications(investments);
        this.addNotifications(vestingNotifications);
      }

      if (this.settings.claimReminders.enabled) {
        const claimNotifications = this.generateClaimReminders(investments);
        this.addNotifications(claimNotifications);
      }
    }
  }

  /**
   * Adiciona notificações ao sistema
   */
  private static addNotifications(newNotifications: Notification[]): void {
    newNotifications.forEach(notification => {
      // Evita duplicatas
      const exists = this.notifications.some(n => n.id === notification.id);
      if (!exists) {
        this.notifications.push(notification);
      }
    });
  }

  /**
   * Formata quantidade de tokens
   */
  private static formatTokenAmount(amount: number, symbol: string): string {
    return `${amount.toLocaleString('pt-BR', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 4 
    })} ${symbol}`;
  }

  /**
   * Obtém informações de ícone e cor para tipos de notificação
   */
  static getNotificationTypeInfo(type: NotificationType): {
    icon: string;
    color: string;
    bgColor: string;
  } {
    const typeMap = {
      vesting_upcoming: {
        icon: '⏰',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      vesting_available: {
        icon: '🎉',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      claim_reminder: {
        icon: '💰',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      },
      investment_update: {
        icon: '📈',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      system_alert: {
        icon: '⚠️',
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      }
    };

    return typeMap[type] || typeMap.system_alert;
  }

  /**
   * Obtém informações de prioridade
   */
  static getPriorityInfo(priority: NotificationPriority): {
    label: string;
    color: string;
    weight: number;
  } {
    const priorityMap = {
      low: {
        label: 'Baixa',
        color: 'text-gray-500',
        weight: 1
      },
      medium: {
        label: 'Média',
        color: 'text-blue-500',
        weight: 2
      },
      high: {
        label: 'Alta',
        color: 'text-orange-500',
        weight: 3
      },
      urgent: {
        label: 'Urgente',
        color: 'text-red-500',
        weight: 4
      }
    };

    return priorityMap[priority] || priorityMap.medium;
  }

  /**
   * Solicita permissão para notificações do navegador
   */
  static async requestBrowserNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações.');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  /**
   * Envia notificação do navegador
   */
  static async sendBrowserNotification(notification: Notification): Promise<void> {
    if (!this.settings.browserNotifications) return;
    
    const hasPermission = await this.requestBrowserNotificationPermission();
    if (!hasPermission) return;

    const typeInfo = this.getNotificationTypeInfo(notification.type);
    
    new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.priority === 'urgent',
      silent: notification.priority === 'low'
    });
  }
}