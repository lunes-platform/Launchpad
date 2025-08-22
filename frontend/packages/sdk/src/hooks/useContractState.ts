import { useState, useEffect, useCallback, useRef } from "react";
import type { Network, PhaseConfig, LaunchpoolConfig } from "../types/mode";

/**
 * Status do raffle
 */
export type RaffleStatusType =
  | "pending"
  | "active"
  | "drawing"
  | "completed"
  | "cancelled";

/**
 * Estado de uma fase de venda
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
  // Estado geral
  isPaused: boolean;
  isInitialized: boolean;
  owner: string;

  // Fases de venda
  currentPhase?: SalePhase;
  phases: SalePhase[];

  // Estatísticas gerais
  totalRaised: string;
  totalInvestors: number;
  totalProjects: number;

  // Configurações
  minInvestment: string;
  maxInvestment: string;
  acceptedCurrencies: string[];

  // Timestamps importantes
  lastUpdated: number;
  nextPhaseStart?: number;
}

/**
 * Estado do contrato de raffle
 */
export interface RaffleContractState {
  // Estado geral
  isActive: boolean;
  isPaused: boolean;

  // Configuração atual
  config?: LaunchpoolConfig;

  // Estatísticas
  totalParticipants: number;
  totalTickets: number;
  prizePool: string;

  // Status do sorteio
  status: RaffleStatusType;
  drawTime?: number;
  winner?: string;

  // Participação do usuário
  userTickets: number;
  userEligible: boolean;

  lastUpdated: number;
}

/**
 * Estado do contrato de launchpool
 */
export interface LaunchpoolContractState {
  // Estado geral
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

  // Estatísticas gerais
  totalValueLocked: string;
  totalRewardsDistributed: string;
  activeStakers: number;

  lastUpdated: number;
}

/**
 * Estado consolidado dos contratos
 */
export interface ContractState {
  launchpad: LaunchpadContractState;
  raffle: RaffleContractState;
  launchpool: LaunchpoolContractState;

  // Estado de carregamento
  loading: {
    launchpad: boolean;
    raffle: boolean;
    launchpool: boolean;
  };

  // Erros
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
 * Configuração do hook
 */
export interface UseContractStateConfig {
  network: Network;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableRealTimeUpdates?: boolean;
}

/**
 * Hook para gerenciar estado dos contratos
 */
export function useContractState(config: UseContractStateConfig) {
  const {
    network,
    autoRefresh = true,
    refreshInterval = 30000,
    enableRealTimeUpdates = false,
  } = config;

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
      status: "pending" as RaffleStatusType,
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
  const refreshIntervalRef = useRef<number>();
  const abortControllerRef = useRef<AbortController>();

  /**
   * Simula busca de dados do contrato de launchpad
   */
  const fetchLaunchpadState =
    useCallback(async (): Promise<LaunchpadContractState> => {
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
        owner: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        currentPhase: phases.find((p) => p.isActive),
        phases,
        totalRaised: "125000",
        totalInvestors: 45,
        totalProjects: 3,
        minInvestment: "50",
        maxInvestment: "10000",
        acceptedCurrencies: ["LUNES", "LUSDT"],
        lastUpdated: now,
        nextPhaseStart: now + 86400000 * 7,
      };
    }, []);

  /**
   * Simula busca de dados do contrato de raffle
   */
  const fetchRaffleState =
    useCallback(async (): Promise<RaffleContractState> => {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const now = Date.now();

      return {
        isActive: true,
        isPaused: false,
        totalParticipants: 234,
        totalTickets: 456,
        prizePool: "5000",
        status: "active" as RaffleStatusType,
        drawTime: now + 86400000 * 4,
        userTickets: 3,
        userEligible: true,
        lastUpdated: now,
      };
    }, []);

  /**
   * Simula busca de dados do contrato de launchpool
   */
  const fetchLaunchpoolState =
    useCallback(async (): Promise<LaunchpoolContractState> => {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const now = Date.now();

      return {
        isActive: true,
        isPaused: false,
        pools: [
          {
            id: "lunes-30d",
            name: "LUNES 30 Days",
            token: "LUNES",
            apy: "12.5",
            totalStaked: "250000",
            userStaked: "1000",
            rewards: "25.5",
            lockPeriod: 86400000 * 30,
            isActive: true,
          },
          {
            id: "lunes-90d",
            name: "LUNES 90 Days",
            token: "LUNES",
            apy: "18.7",
            totalStaked: "180000",
            userStaked: "500",
            rewards: "15.2",
            lockPeriod: 86400000 * 90,
            isActive: true,
          },
          {
            id: "lusdt-flexible",
            name: "LUSDT Flexible",
            token: "LUSDT",
            apy: "8.2",
            totalStaked: "75000",
            userStaked: "0",
            rewards: "0",
            lockPeriod: 0,
            isActive: true,
          },
        ],
        totalValueLocked: "505000",
        totalRewardsDistributed: "12500",
        activeStakers: 1247,
        lastUpdated: now,
      };
    }, []);

  /**
   * Atualiza estado do launchpad
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
   * Atualiza estado do raffle
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
        error instanceof Error
          ? error.message
          : "Erro ao buscar estado do raffle";
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, raffle: false },
        errors: { ...prev.errors, raffle: errorMessage },
      }));
    }
  }, [fetchRaffleState]);

  /**
   * Atualiza estado do launchpool
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
  const refreshAllStates = useCallback(async () => {
    await Promise.all([
      refreshLaunchpadState(),
      refreshRaffleState(),
      refreshLaunchpoolState(),
    ]);
  }, [refreshLaunchpadState, refreshRaffleState, refreshLaunchpoolState]);

  /**
   * Verifica se algum contrato está pausado
   */
  const isAnyContractPaused = useCallback(() => {
    return (
      state.launchpad.isPaused ||
      state.raffle.isPaused ||
      state.launchpool.isPaused
    );
  }, [
    state.launchpad.isPaused,
    state.raffle.isPaused,
    state.launchpool.isPaused,
  ]);

  /**
   * Obtém a fase ativa atual
   */
  const getCurrentPhase = useCallback(() => {
    return state.launchpad.currentPhase;
  }, [state.launchpad.currentPhase]);

  /**
   * Obtém a próxima fase
   */
  const getNextPhase = useCallback(() => {
    return state.launchpad.phases.find((phase) => phase.isUpcoming);
  }, [state.launchpad.phases]);

  /**
   * Verifica se o usuário pode investir
   */
  const canInvest = useCallback(
    (amount: string) => {
      const currentPhase = getCurrentPhase();
      if (!currentPhase || !currentPhase.isActive) {
        return { canInvest: false, reason: "Nenhuma fase ativa" };
      }

      const numAmount = parseFloat(amount);
      const minInvestment = parseFloat(currentPhase.minInvestment);
      const maxInvestment = parseFloat(currentPhase.maxInvestment);

      if (numAmount < minInvestment) {
        return {
          canInvest: false,
          reason: `Investimento mínimo: ${minInvestment}`,
        };
      }

      if (numAmount > maxInvestment) {
        return {
          canInvest: false,
          reason: `Investimento máximo: ${maxInvestment}`,
        };
      }

      const totalCap = parseFloat(currentPhase.totalCap);
      const currentRaised = parseFloat(currentPhase.currentRaised);

      if (currentRaised + numAmount > totalCap) {
        return { canInvest: false, reason: "Limite da fase excedido" };
      }

      return { canInvest: true };
    },
    [getCurrentPhase],
  );

  /**
   * Obtém estatísticas consolidadas
   */
  const getStats = useCallback(() => {
    return {
      totalRaised: state.launchpad.totalRaised,
      totalInvestors: state.launchpad.totalInvestors,
      totalValueLocked: state.launchpool.totalValueLocked,
      activeRaffleParticipants: state.raffle.totalParticipants,
      isSystemHealthy: !isAnyContractPaused(),
    };
  }, [state, isAnyContractPaused]);

  // Efeito para carregamento inicial
  useEffect(() => {
    refreshAllStates();
  }, [refreshAllStates]);

  // Efeito para auto-refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(
        refreshAllStates,
        refreshInterval,
      );
      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, refreshAllStates]);

  // Efeito para mudança de rede
  useEffect(() => {
    setState((prev) => ({ ...prev, network }));
    refreshAllStates();
  }, [network, refreshAllStates]);

  // Cleanup
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
    // Estado
    ...state,

    // Ações
    refreshLaunchpadState,
    refreshRaffleState,
    refreshLaunchpoolState,
    refreshAllStates,

    // Utilitários
    isAnyContractPaused,
    getCurrentPhase,
    getNextPhase,
    canInvest,
    getStats,

    // Estados computados
    isLoading: Object.values(state.loading).some((loading) => loading),
    hasErrors: Object.values(state.errors).some((error) => error !== undefined),
    isHealthy:
      !isAnyContractPaused() &&
      !Object.values(state.errors).some((error) => error !== undefined),
  };
}
