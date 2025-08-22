import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserInvestments } from './useApi';
import type { UserInvestment } from '../types';

/**
 * Interface para dados de elegibilidade de airdrop
 */
export interface AirdropEligibility {
  isEligible: boolean;
  eligibilityDate: Date | null;
  daysUntilEligible: number;
  investmentAmount: number;
  projectId: string;
  projectName: string;
  fundraisingEndDate: Date;
}

/**
 * Interface para configuração de airdrop
 */
export interface AirdropConfig {
  airdropId: string;
  projectId: string;
  projectName: string;
  tokenSymbol: string;
  totalTokens: number;
  eligibilityPeriodMonths: number; // Padrão: 3 meses
  minimumInvestment?: number;
  fundraisingEndDate: Date;
  airdropStartDate: Date;
  airdropEndDate: Date;
}

/**
 * Hook para verificar elegibilidade de airdrops
 * Implementa a regra de negócio: usuário elegível 3 meses após término da captação
 */
export function useAirdropEligibility(airdropConfigs: AirdropConfig[]) {
  const { user } = useAuth();
  const { data: investments } = useUserInvestments(user?.walletAddress || '');

  const eligibilityData = useMemo(() => {
    if (!user || !investments || !airdropConfigs.length) {
      return [];
    }

    return airdropConfigs.map((config): AirdropEligibility => {
      // Encontrar investimento do usuário no projeto
      const userInvestment = investments.find(
        (inv: UserInvestment) => inv.projectId === config.projectId
      );

      if (!userInvestment) {
        return {
          isEligible: false,
          eligibilityDate: null,
          daysUntilEligible: -1,
          investmentAmount: 0,
          projectId: config.projectId,
          projectName: config.projectName,
          fundraisingEndDate: config.fundraisingEndDate,
        };
      }

      // Calcular data de elegibilidade (3 meses após término da captação)
      const eligibilityDate = new Date(config.fundraisingEndDate);
      eligibilityDate.setMonth(eligibilityDate.getMonth() + config.eligibilityPeriodMonths);

      const now = new Date();
      const isEligible = now >= eligibilityDate && 
                        now >= config.airdropStartDate && 
                        now <= config.airdropEndDate &&
                        (!config.minimumInvestment || userInvestment.totalInvested >= config.minimumInvestment);

      // Calcular dias até elegibilidade
      const daysUntilEligible = isEligible 
        ? 0 
        : Math.ceil((eligibilityDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        isEligible,
        eligibilityDate,
        daysUntilEligible,
        investmentAmount: userInvestment.totalInvested,
        projectId: config.projectId,
        projectName: config.projectName,
        fundraisingEndDate: config.fundraisingEndDate,
      };
    });
  }, [user, investments, airdropConfigs]);

  // Estatísticas agregadas
  const stats = useMemo(() => {
    const eligible = eligibilityData.filter(item => item.isEligible);
    const pending = eligibilityData.filter(item => !item.isEligible && item.daysUntilEligible > 0);
    const totalInvestment = eligibilityData.reduce((sum, item) => sum + item.investmentAmount, 0);

    return {
      totalAirdrops: eligibilityData.length,
      eligibleAirdrops: eligible.length,
      pendingAirdrops: pending.length,
      totalInvestmentAmount: totalInvestment,
      nextEligibilityDate: pending.length > 0 
        ? pending.reduce((earliest, current) => 
            current.eligibilityDate && (!earliest || current.eligibilityDate < earliest)
              ? current.eligibilityDate
              : earliest
          , null as Date | null)
        : null,
    };
  }, [eligibilityData]);

  return {
    eligibilityData,
    stats,
    isLoading: !user || !investments,
  };
}

/**
 * Hook para verificar elegibilidade de um airdrop específico
 */
export function useSpecificAirdropEligibility(airdropConfig: AirdropConfig | null) {
  const { eligibilityData } = useAirdropEligibility(airdropConfig ? [airdropConfig] : []);
  
  return {
    eligibility: eligibilityData[0] || null,
    isLoading: !airdropConfig,
  };
}

/**
 * Utilitário para calcular tempo restante até elegibilidade
 */
export function calculateTimeUntilEligible(eligibilityDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  isEligible: boolean;
} {
  const now = new Date();
  const diff = eligibilityDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isEligible: true };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, isEligible: false };
}

/**
 * Utilitário para formatar período de elegibilidade
 */
export function formatEligibilityPeriod(months: number): string {
  if (months === 1) return '1 mês';
  if (months < 12) return `${months} meses`;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return years === 1 ? '1 ano' : `${years} anos`;
  }
  
  return `${years} ano${years > 1 ? 's' : ''} e ${remainingMonths} mês${remainingMonths > 1 ? 'es' : ''}`;
}