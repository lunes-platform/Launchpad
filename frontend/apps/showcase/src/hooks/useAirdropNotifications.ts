import { useEffect, useRef } from 'react';
import { useAirdrops } from './useAirdrops';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { canClaimAirdrop } from './useAirdrops';

/**
 * Interface para configuração de notificações de airdrop
 */
export interface AirdropNotificationConfig {
  /** Habilitar notificações de novos airdrops disponíveis */
  enableNewAirdropNotifications: boolean;
  /** Habilitar notificações de airdrops próximos ao vencimento */
  enableExpirationNotifications: boolean;
  /** Dias antes do vencimento para notificar (padrão: 7 dias) */
  daysBeforeExpiration: number;
  /** Intervalo de verificação em minutos (padrão: 30 minutos) */
  checkIntervalMinutes: number;
}

/**
 * Configuração padrão para notificações de airdrop
 */
const DEFAULT_CONFIG: AirdropNotificationConfig = {
  enableNewAirdropNotifications: true,
  enableExpirationNotifications: true,
  daysBeforeExpiration: 7,
  checkIntervalMinutes: 30,
};

/**
 * Hook para gerenciar notificações de airdrops
 * 
 * Funcionalidades:
 * - Notifica sobre novos airdrops disponíveis
 * - Alerta sobre airdrops próximos ao vencimento
 * - Persiste estado de notificações já enviadas
 * - Configurável por usuário
 * 
 * @param config Configuração personalizada de notificações
 */
export function useAirdropNotifications(config: Partial<AirdropNotificationConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const { airdrops, isLoading } = useAirdrops();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showWarning, showInfo } = useNotifications();
  
  // Refs para controlar estado das notificações
  const notifiedAirdrops = useRef<Set<string>>(new Set());
  const expirationNotifications = useRef<Set<string>>(new Set());
  const lastCheckTime = useRef<Date>(new Date());

  /**
   * Verifica se um airdrop está próximo ao vencimento
   */
  const isNearExpiration = (claimDeadline: Date): boolean => {
    const now = new Date();
    const daysUntilExpiration = Math.ceil(
      (claimDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiration <= finalConfig.daysBeforeExpiration && daysUntilExpiration > 0;
  };

  /**
   * Processa notificações de novos airdrops disponíveis
   */
  const processNewAirdropNotifications = () => {
    if (!finalConfig.enableNewAirdropNotifications) return;

    const availableAirdrops = airdrops.filter(airdrop => 
      canClaimAirdrop(airdrop) && !notifiedAirdrops.current.has(airdrop.id)
    );

    availableAirdrops.forEach(airdrop => {
      showSuccess(
        '🎁 Novo Airdrop Disponível!',
        `${airdrop.projectName} (${airdrop.tokenSymbol}) está disponível para claim`,
        {
          duration: 8000,
          action: {
            label: 'Ver Detalhes',
            onClick: () => {
              // Navegar para a página de airdrops ou abrir modal
              window.location.href = '/airdrop';
            }
          }
        }
      );
      
      notifiedAirdrops.current.add(airdrop.id);
      
      console.log('📢 Notificação de novo airdrop enviada:', {
        airdropId: airdrop.id,
        projectName: airdrop.projectName,
        tokenAmount: airdrop.tokenAmount,
        tokenSymbol: airdrop.tokenSymbol
      });
    });
  };

  /**
   * Processa notificações de airdrops próximos ao vencimento
   */
  const processExpirationNotifications = () => {
    if (!finalConfig.enableExpirationNotifications) return;

    const nearExpirationAirdrops = airdrops.filter(airdrop => 
      canClaimAirdrop(airdrop) && 
      isNearExpiration(airdrop.claimDeadline) &&
      !expirationNotifications.current.has(airdrop.id)
    );

    nearExpirationAirdrops.forEach(airdrop => {
      const daysLeft = Math.ceil(
        (airdrop.claimDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      
      showWarning(
        '⏰ Airdrop Expirando em Breve!',
        `${airdrop.projectName} expira em ${daysLeft} dia${daysLeft !== 1 ? 's' : ''}`,
        {
          duration: 10000,
          action: {
            label: 'Fazer Claim',
            onClick: () => {
              window.location.href = '/airdrop';
            }
          }
        }
      );
      
      expirationNotifications.current.add(airdrop.id);
      
      console.log('⚠️ Notificação de expiração enviada:', {
        airdropId: airdrop.id,
        projectName: airdrop.projectName,
        daysLeft,
        claimDeadline: airdrop.claimDeadline
      });
    });
  };

  /**
   * Função principal de verificação de notificações
   */
  const checkForNotifications = () => {
    if (!isAuthenticated || isLoading || airdrops.length === 0) {
      return;
    }

    const now = new Date();
    const timeSinceLastCheck = now.getTime() - lastCheckTime.current.getTime();
    const checkIntervalMs = finalConfig.checkIntervalMinutes * 60 * 1000;

    // Só verifica se passou o intervalo configurado
    if (timeSinceLastCheck < checkIntervalMs) {
      return;
    }

    console.log('🔍 Verificando notificações de airdrop...', {
      totalAirdrops: airdrops.length,
      lastCheck: lastCheckTime.current,
      currentTime: now
    });

    processNewAirdropNotifications();
    processExpirationNotifications();
    
    lastCheckTime.current = now;
  };

  /**
   * Limpa notificações para airdrops que não estão mais disponíveis
   */
  const cleanupNotifications = () => {
    const currentAirdropIds = new Set(airdrops.map(a => a.id));
    
    // Remove notificações de airdrops que não existem mais
    notifiedAirdrops.current.forEach(id => {
      if (!currentAirdropIds.has(id)) {
        notifiedAirdrops.current.delete(id);
      }
    });
    
    expirationNotifications.current.forEach(id => {
      if (!currentAirdropIds.has(id)) {
        expirationNotifications.current.delete(id);
      }
    });
  };

  /**
   * Força uma verificação imediata de notificações
   */
  const forceCheck = () => {
    lastCheckTime.current = new Date(0); // Reset do último check
    checkForNotifications();
  };

  /**
   * Limpa todas as notificações pendentes
   */
  const clearAllNotifications = () => {
    notifiedAirdrops.current.clear();
    expirationNotifications.current.clear();
    showInfo('🔕 Notificações de airdrop foram limpas', 'Todas as notificações pendentes foram removidas');
  };

  // Effect para verificação automática
  useEffect(() => {
    if (!isAuthenticated) {
      // Limpa notificações quando usuário não está autenticado
      notifiedAirdrops.current.clear();
      expirationNotifications.current.clear();
      return;
    }

    // Verificação inicial
    const initialTimer = setTimeout(() => {
      checkForNotifications();
    }, 2000); // Aguarda 2 segundos após carregar

    // Verificação periódica
    const interval = setInterval(() => {
      checkForNotifications();
    }, finalConfig.checkIntervalMinutes * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isAuthenticated, airdrops, finalConfig.checkIntervalMinutes]);

  // Effect para limpeza de notificações
  useEffect(() => {
    cleanupNotifications();
  }, [airdrops]);

  return {
    /** Configuração atual das notificações */
    config: finalConfig,
    /** Força uma verificação imediata */
    forceCheck,
    /** Limpa todas as notificações */
    clearAllNotifications,
    /** Estatísticas das notificações */
    stats: {
      notifiedAirdrops: notifiedAirdrops.current.size,
      expirationNotifications: expirationNotifications.current.size,
      lastCheckTime: lastCheckTime.current,
    }
  };
}

/**
 * Hook simplificado para usar notificações com configuração padrão
 */
export function useDefaultAirdropNotifications() {
  return useAirdropNotifications();
}