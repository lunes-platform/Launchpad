import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useAirdropEligibility, type AirdropConfig as EligibilityConfig } from './useAirdropEligibility';

/**
 * Interface para dados de airdrop
 */
export interface AirdropRecord {
  id: string;
  projectName: string;
  projectLogo: string;
  tokenSymbol: string;
  tokenAmount: number;
  estimatedValue: number;
  status: 'pending' | 'available' | 'claimed' | 'not_eligible' | 'upcoming' | 'expired';
  eligibilityDate: Date | null;
  claimDeadline: Date;
  requirements: string[];
  description: string;
  investmentAmount: number;
  daysUntilEligible: number;
}

/**
 * Interface para configuração de airdrop
 */
export interface AirdropConfig {
  airdropId: string;
  projectId: string;
  projectName: string;
  projectLogo: string;
  tokenSymbol: string;
  totalTokens: number;
  tokensPerUser: number;
  fundraisingEndDate: Date;
  airdropStartDate: Date;
  airdropEndDate: Date;
  eligibilityPeriodMonths: number;
  description: string;
  requirements: string[];
}

/**
 * Interface para estatísticas de airdrops
 */
export interface AirdropStats {
  totalAirdrops: number;
  availableAirdrops: number;
  claimedAirdrops: number;
  totalValueClaimed: number;
  totalValueAvailable: number;
}

/**
 * Dados mockados de airdrops para demonstração
 * Em produção, estes dados virão da API/smart contracts
 */
const MOCK_AIRDROP_CONFIGS: AirdropConfig[] = [
  {
    airdropId: 'airdrop-1',
    projectId: '1',
    projectName: 'LunesDAO',
    projectLogo: '/images/projects/lunesdao.png',
    tokenSymbol: 'LDAO',
    totalTokens: 1000000,
    tokensPerUser: 500,
    fundraisingEndDate: new Date('2024-01-15'),
    airdropStartDate: new Date('2024-04-15'),
    airdropEndDate: new Date('2024-07-15'),
    eligibilityPeriodMonths: 3,
    description: 'Airdrop de tokens de governança para investidores iniciais do LunesDAO',
    requirements: [
      'Ter investido no mínimo 100 LUNES',
      'Aguardar 3 meses após o fim da captação',
      'Carteira conectada durante o período do airdrop'
    ]
  },
  {
    airdropId: 'airdrop-2',
    projectId: '2',
    projectName: 'EcoChain',
    projectLogo: '/images/projects/ecochain.png',
    tokenSymbol: 'ECO',
    totalTokens: 2000000,
    tokensPerUser: 1000,
    fundraisingEndDate: new Date('2024-02-20'),
    airdropStartDate: new Date('2024-05-20'),
    airdropEndDate: new Date('2024-08-20'),
    eligibilityPeriodMonths: 3,
    description: 'Tokens de utilidade para a rede EcoChain sustentável',
    requirements: [
      'Ter investido no mínimo 250 LUNES',
      'Aguardar 3 meses após o fim da captação',
      'Participar da votação de governança'
    ]
  },
  {
    airdropId: 'airdrop-3',
    projectId: '3',
    projectName: 'DeFiProtocol',
    projectLogo: '/images/projects/defiprotocol.png',
    tokenSymbol: 'DFP',
    totalTokens: 500000,
    tokensPerUser: 250,
    fundraisingEndDate: new Date('2024-03-10'),
    airdropStartDate: new Date('2024-06-10'),
    airdropEndDate: new Date('2024-09-10'),
    eligibilityPeriodMonths: 3,
    description: 'Tokens de protocolo DeFi para yield farming e staking',
    requirements: [
      'Ter investido no mínimo 500 LUNES',
      'Aguardar 3 meses após o fim da captação',
      'Fazer stake de tokens LUNES por 30 dias'
    ]
  },
  {
    airdropId: 'airdrop-4',
    projectId: '4',
    projectName: 'GameFi Arena',
    projectLogo: '/images/projects/gamefi.png',
    tokenSymbol: 'GFA',
    totalTokens: 3000000,
    tokensPerUser: 750,
    fundraisingEndDate: new Date('2024-04-05'),
    airdropStartDate: new Date('2024-07-05'),
    airdropEndDate: new Date('2024-10-05'),
    eligibilityPeriodMonths: 3,
    description: 'Tokens de jogo para o ecossistema GameFi Arena',
    requirements: [
      'Ter investido no mínimo 200 LUNES',
      'Aguardar 3 meses após o fim da captação',
      'Conectar carteira ao jogo beta'
    ]
  },
  {
    airdropId: 'airdrop-5',
    projectId: '5',
    projectName: 'MetaVerse Land',
    projectLogo: '/images/projects/metaverse.png',
    tokenSymbol: 'MVL',
    totalTokens: 1500000,
    tokensPerUser: 300,
    fundraisingEndDate: new Date('2024-05-01'),
    airdropStartDate: new Date('2024-08-01'),
    airdropEndDate: new Date('2024-11-01'),
    eligibilityPeriodMonths: 3,
    description: 'Tokens de terreno virtual no MetaVerse Land',
    requirements: [
      'Ter investido no mínimo 1000 LUNES',
      'Aguardar 3 meses após o fim da captação',
      'Participar da comunidade Discord'
    ]
  }
];

/**
 * Hook para buscar configurações de airdrops
 * Em produção, faria uma chamada para a API/smart contracts
 */
export function useAirdropConfigs() {
  return useQuery({
    queryKey: ['airdrop-configs'],
    queryFn: async (): Promise<AirdropConfig[]> => {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_AIRDROP_CONFIGS;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook principal para gerenciar airdrops
 * Combina configurações de airdrops com dados de elegibilidade do usuário
 */
export function useAirdrops() {
  const { user } = useAuth();
  const { data: airdropConfigs, isLoading: isLoadingConfigs } = useAirdropConfigs();
  
  // Converter AirdropConfig para EligibilityConfig
  const eligibilityConfigs: EligibilityConfig[] = (airdropConfigs || []).map(config => ({
    airdropId: config.airdropId,
    projectId: config.projectId,
    projectName: config.projectName,
    tokenSymbol: config.tokenSymbol,
    totalTokens: config.totalTokens,
    fundraisingEndDate: config.fundraisingEndDate,
    airdropStartDate: config.airdropStartDate,
    airdropEndDate: config.airdropEndDate,
    eligibilityPeriodMonths: config.eligibilityPeriodMonths,
  }));
  
  const { eligibilityData } = useAirdropEligibility(eligibilityConfigs);

  // Converter dados de elegibilidade para formato AirdropRecord
  const airdrops: AirdropRecord[] = eligibilityData.map(eligibility => {
    const config = airdropConfigs?.find(c => c.projectId === eligibility.projectId);
    if (!config) {
      throw new Error(`Configuração não encontrada para projeto ${eligibility.projectId}`);
    }

    const now = new Date();
    let status: AirdropRecord['status'];
    
    if (!eligibility.isEligible) {
      status = 'not_eligible';
    } else if (now < config.airdropStartDate) {
      status = 'upcoming';
    } else if (now > config.airdropEndDate) {
      status = 'expired';
    } else {
      // Aqui verificaríamos se o usuário já fez claim
      // Por enquanto, assumimos que está disponível
      status = 'available';
    }

    return {
      id: config.projectId,
      projectName: config.projectName,
      projectLogo: config.projectLogo,
      tokenSymbol: config.tokenSymbol,
      tokenAmount: config.tokensPerUser,
      estimatedValue: config.tokensPerUser * 0.1, // Valor estimado mockado
      status,
      eligibilityDate: eligibility.eligibilityDate,
      claimDeadline: config.airdropEndDate,
      requirements: config.requirements,
      description: config.description,
      investmentAmount: eligibility.investmentAmount,
      daysUntilEligible: eligibility.daysUntilEligible,
    };
  });

  return {
    airdrops,
    isLoading: isLoadingConfigs,
    error: null,
  };
}

/**
 * Hook para calcular estatísticas de airdrops
 */
export function useAirdropStats(): AirdropStats {
  const { airdrops } = useAirdrops();

  const stats: AirdropStats = {
    totalAirdrops: airdrops.length,
    availableAirdrops: airdrops.filter(a => a.status === 'available').length,
    claimedAirdrops: airdrops.filter(a => a.status === 'claimed').length,
    totalValueClaimed: airdrops
      .filter(a => a.status === 'claimed')
      .reduce((sum, a) => sum + a.estimatedValue, 0),
    totalValueAvailable: airdrops
      .filter(a => a.status === 'available')
      .reduce((sum, a) => sum + a.estimatedValue, 0),
  };

  return stats;
}

/**
 * Hook para filtrar airdrops por status
 */
export function useFilteredAirdrops(statusFilter: string, searchTerm: string) {
  const { airdrops, isLoading, error } = useAirdrops();

  const filteredAirdrops = airdrops.filter(airdrop => {
    const matchesStatus = statusFilter === 'all' || airdrop.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      airdrop.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airdrop.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return {
    airdrops: filteredAirdrops,
    isLoading,
    error,
  };
}

/**
 * Utilitário para verificar se um airdrop pode ser reivindicado
 */
export function canClaimAirdrop(airdrop: AirdropRecord): boolean {
  return airdrop.status === 'available' && 
         airdrop.eligibilityDate !== null && 
         new Date() >= airdrop.eligibilityDate &&
         new Date() <= airdrop.claimDeadline;
}

/**
 * Utilitário para calcular tempo restante para claim
 */
export function getTimeUntilDeadline(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  
  if (diff <= 0) {
    return 'Expirado';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else {
    return `${hours}h`;
  }
}