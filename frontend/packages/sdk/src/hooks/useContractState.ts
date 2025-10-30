import { useState, useEffect, useCallback, useRef } from "react";
import type { Network, PhaseConfig, LaunchpoolConfig } from "../types/mode";

/**
 * Tipos de status para o sistema de raffle
 */
export type RaffleStatusType =
  | "pending"
  | "active"
  | "drawing"
  | "completed"
  | "cancelled";

/**
 * Interface para fases de venda do launchpad
 */
export interface SalePhase extends PhaseConfig {
  id: string;
  isActive: boolean;
  isUpcoming: boolean;
  isPast: boolean;
  timeRemaining?: number;
  progress: number; // 0-100
}

/**
 * Estado do contrato de launchpad
 */
export interface LaunchpadContractState {
  // Estado básico
  isPaused: boolean;
  isInitialized: boolean;
  owner: string;

  // Fases de venda
  currentPhase?: SalePhase;
  phases: SalePhase[];

  // Métricas gerais
  totalRaised: string;
  totalInvestors: number;
  totalProjects: number;

  // Configurações de investimento
  minInvestment: string;
  maxInvestment: string;
  acceptedCurrencies: string[];

  // Timestamps
  lastUpdated: number;
  nextPhaseStart?: number;
}

/**
 * Estado do contrato de raffle
 */
export interface RaffleContractState {
  // Estado básico
  isActive: boolean;
  isPaused: boolean;

  // Configuração
  config?: LaunchpoolConfig;

  // Métricas do raffle
  totalParticipants: number;
  totalTickets: number;
  prizePool: string;

  // Status do sorteio
  status: RaffleStatusType;
  drawTime?: number;
  winner?: string;

  // Estado do usuário
  userTickets: number;
  userEligible: boolean;

  lastUpdated: number;
}

/**
 * Estado do contrato de launchpool
 */
export interface LaunchpoolContractState {
  // Estado básico
  isActive: boolean;
  isPaused: boolean;

  // Configuração
  config?: LaunchpoolConfig;

  // Pools disponíveis
  pools: Array<{
    id: string;
    name: string;
    token: string;
    apy: string;
    totalStaked: string;
    userStaked: string;
    rewards: string;
    lockPeriod: number;
    isActive: boolean;
  }>;

  // Métricas globais
  totalValueLocked: string;
  totalRewardsDistributed: string;
  activeStakers: number;

  lastUpdated: number;
}

/**
 * Estado consolidado de todos os contratos
 */
export interface ContractState {
  launchpad: LaunchpadContractState;
  raffle: RaffleContractState;
  launchpool: LaunchpoolContractState;

  // Estados de carregamento
  loading: {
    launchpad: boolean;
    raffle: boolean;
    launchpool: boolean;
  };

  // Erros por contrato
  errors: {
    launchpad?: string;
    raffle?: string;
    launchpool?: string;
  };

  // Metadados
  network: Network;
  blockNumber?: number;
  lastSync: number;
}

/**
 * Configuração do hook useContractState
 */
export interface UseContractStateConfig {
  network: Network;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

/**
 * Hook para gerenciar o estado dos contratos
 */
export function useContractState(config: UseContractStateConfig) {
  const { network, autoRefresh = true, refreshInterval = 30000 } = config;

  // Estado principal
  const [state, setState] = useState<ContractState>({
    launchpad: {
      isPaused: false,
      isInitialized: false,
      owner: "",
      phases: [],
      totalRaised: "0",
      totalInvestors: 0,
      totalProjects: 0,
      minInvestment: "0",
      maxInvestment: "0",
      acceptedCurrencies: [],
      lastUpdated: 0,
    },
    raffle: {
      isActive: false,
      isPaused: false,
      totalParticipants: 0,
      totalTickets: 0,
      prizePool: "0",
      status: "pending",
      userTickets: 0,
      userEligible: false,
      lastUpdated: 0,
    },
    launchpool: {
      isActive: false,
      isPaused: false,
      pools: [],
      totalValueLocked: "0",
      totalRewardsDistributed: "0",
      activeStakers: 0,
      lastUpdated: 0,
    },
    loading: {
      launchpad: false,
      raffle: false,
      launchpool: false,
    },
    errors: {},
    network,
    lastSync: 0,
  });

  // Referências para controle de polling
  const refreshIntervalRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController>(new AbortController());

  /**
   * Simula busca de dados do contrato de launchpad
   */
  const fetchLaunchpadState = useCallback(async (): Promise<LaunchpadContractState> => {
    // Simula delay de rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    const now = Date.now();
    const phases: SalePhase[] = [
      {
        id: "presale",
        name: "Pre-Sale",
        startTime: now - 86400000, // 1 dia atrás
        endTime: now + 86400000 * 7, // 7 dias à frente
        minInvestment: "100",
        maxInvestment: "10000",
        totalCap: "500000",
        currentRaised: "125000",
        isActive: true,
        isUpcoming: false,
        isPast: false,
        progress: 25,
        timeRemaining: 86400000 * 7,
      },
      {
        id: "publicsale",
        name: "Public Sale",
        startTime: now + 86400000 * 7,
        endTime: now + 86400000 * 14,
        minInvestment: "50",
        maxInvestment: "5000",
        totalCap: "1000000",
        currentRaised: "0",
        isActive: false,
        isUpcoming: true,
        isPast: false,
        progress: 0,
        timeRemaining: 86400000 * 14,
      },
    ];

    return {
      isPaused: false,
      isInitialized: true,
      owner: "0x1234567890123456789012345678901234567890",
      currentPhase: phases[0],
      phases,
      totalRaised: "125000",
      totalInvestors: 42,
      totalProjects: 3,
      minInvestment: "50",
      maxInvestment: "10000",
      acceptedCurrencies: ["USDT", "USDC", "ETH"],
      lastUpdated: now,
      nextPhaseStart: now + 86400000 * 7,
    };
  }, []);

  /**
   * Simula busca de dados do contrato de raffle
   */
  const fetchRaffleState = useCallback(async (): Promise<RaffleContractState> => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const now = Date.now();
    return {
      isActive: true,
      isPaused: false,
      totalParticipants: 156,
      totalTickets: 1240,
      prizePool: "50000",
      status: "active",
      drawTime: now + 86400000 * 2, // 2 dias
      userTickets: 5,
      userEligible: true,
      lastUpdated: now,
    };
  }, []);

  /**
   * Simula busca de dados do contrato de launchpool
   */
  const fetchLaunchpoolState = useCallback(async (): Promise<LaunchpoolContractState> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const now = Date.now();
    return {
      isActive: true,
      isPaused: false,
      pools: [
        {
          id: "pool-1",
          name: "USDT Pool",
          token: "USDT",
          apy: "12.5",
          totalStaked: "2500000",
          userStaked: "1000",
          rewards: "125",
          lockPeriod: 30,
          isActive: true,
        },
        {
          id: "pool-2",
          name: "ETH Pool",
          token: "ETH",
          apy: "8.2",
          totalStaked: "850",
          userStaked: "0.5",
          rewards: "0.041",
          lockPeriod: 60,
          isActive: true,
        },
      ],
      totalValueLocked: "5750000",
      totalRewardsDistributed: "125000",
      activeStakers: 234,
      lastUpdated: now,
    };
  }, []);

  /**
   * Atualiza o estado do launchpad
   */
  const refreshLaunchpadState = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, launchpad: true },
      errors: { ...prev.errors, launchpad: undefined },
    }));

    try {
      const launchpadState = await fetchLaunchpadState();
      setState((prev) => ({
        ...prev,
        launchpad: launchpadState,
        loading: { ...prev.loading, launchpad: false },
        lastSync: Date.now(),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao buscar estado do launchpad";
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, launchpad: false },
        errors: { ...prev.errors, launchpad: errorMessage },
      }));
    }
  }, [fetchLaunchpadState]);

  /**
   * Atualiza o estado do raffle
   */
  const refreshRaffleState = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, raffle: true },
      errors: { ...prev.errors, raffle: undefined },
    }));

    try {
      const raffleState = await fetchRaffleState();
      setState((prev) => ({
        ...prev,
        raffle: raffleState,
        loading: { ...prev.loading, raffle: false },
        lastSync: Date.now(),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar estado do raffle";
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, raffle: false },
        errors: { ...prev.errors, raffle: errorMessage },
      }));
    }
  }, [fetchRaffleState]);

  /**
   * Atualiza o estado do launchpool
   */
  const refreshLaunchpoolState = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, launchpool: true },
      errors: { ...prev.errors, launchpool: undefined },
    }));

    try {
      const launchpoolState = await fetchLaunchpoolState();
      setState((prev) => ({
        ...prev,
        launchpool: launchpoolState,
        loading: { ...prev.loading, launchpool: false },
        lastSync: Date.now(),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao buscar estado do launchpool";
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, launchpool: false },
        errors: { ...prev.errors, launchpool: errorMessage },
      }));
    }
  }, [fetchLaunchpoolState]);

  /**
   * Atualiza todos os estados
   */
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshLaunchpadState(),
      refreshRaffleState(),
      refreshLaunchpoolState(),
    ]);
  }, [refreshLaunchpadState, refreshRaffleState, refreshLaunchpoolState]);

  // Carregamento inicial
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    refreshIntervalRef.current = window.setInterval(() => {
      refreshAll();
    }, refreshInterval);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, refreshAll]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    refresh: {
      all: refreshAll,
      launchpad: refreshLaunchpadState,
      raffle: refreshRaffleState,
      launchpool: refreshLaunchpoolState,
    },
  };
}
