import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type {
  ModeState,
  ModeContextType,
  ModeProviderConfig,
  ModeEvent,
  ModeEventListener,
  UserInvestment,
  Network,
  PaymentCurrency,
} from "../types/mode";

/**
 * Ações do reducer de modo
 */
type ModeAction =
  | {
      type: "SET_LOADING";
      payload: { type: keyof ModeState["loading"]; loading: boolean };
    }
  | {
      type: "SET_ERROR";
      payload: { type: keyof ModeState["errors"]; error?: string };
    }
  | {
      type: "SET_WALLET_STATE";
      payload: { address?: string; connected: boolean };
    }
  | { type: "SET_NETWORK"; payload: Network }
  | {
      type: "SET_CONTRACT_STATE";
      payload: Partial<ModeState["contractStates"]>;
    }
  | { type: "SET_USER_INFO"; payload: Partial<ModeState["userInfo"]> }
  | { type: "SET_PRICING"; payload: Partial<ModeState["pricing"]> }
  | { type: "SET_FEATURES"; payload: Partial<ModeState["features"]> }
  | { type: "SET_CURRENCY"; payload: PaymentCurrency }
  | { type: "RESET_STATE" };

/**
 * Estado inicial do modo
 */
const initialState: ModeState = {
  // Estado base da aplicação
  environment: "dev",
  network: "local",
  userRole: "investor",
  walletState: "disconnected",
  operationalState: "normal",
  compliance: {
    kycRequired: false,
    kycCompleted: false,
    whitelistRequired: false,
    whitelisted: false,
  },
  selectedCurrency: "LUNES",
  connectedAccount: undefined,

  // Estados de contrato
  contractStates: {
    launchpadPaused: false,
  },

  // Informações do usuário
  userInfo: {
    investments: [],
  },

  // Preços
  pricing: {
    lunesUsd: "0",
    lusdtUsd: "1",
    lastUpdated: 0,
  },

  // Flags de funcionalidades
  features: {
    canInvest: false,
    canWithdraw: false,
    canStake: false,
    canParticipateRaffle: false,
    canClaimRewards: false,
    canSwitchCurrency: true,
    showKycWarning: false,
    showWhitelistWarning: false,
  },

  // Estados de carregamento
  loading: {
    wallet: false,
    contract: false,
    user: false,
    prices: false,
  },

  // Erros
  errors: {},
};

/**
 * Reducer para gerenciar o estado do modo
 */
function modeReducer(state: ModeState, action: ModeAction): ModeState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.loading,
        },
      };

    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.type]: action.payload.error,
        },
      };

    case "SET_WALLET_STATE":
      return {
        ...state,
        connectedAccount: action.payload.address,
        walletState: action.payload.connected ? "signed" : "disconnected",
      };

    case "SET_NETWORK":
      return {
        ...state,
        network: action.payload,
      };

    case "SET_CONTRACT_STATE":
      return {
        ...state,
        contractStates: {
          ...state.contractStates,
          ...action.payload,
        },
      };

    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload,
        },
      };

    case "SET_PRICING":
      return {
        ...state,
        pricing: {
          ...state.pricing,
          ...action.payload,
        },
      };

    case "SET_FEATURES":
      return {
        ...state,
        features: {
          ...state.features,
          ...action.payload,
        },
      };

    case "SET_CURRENCY":
      return {
        ...state,
        selectedCurrency: action.payload,
      };

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
}

/**
 * Contexto do modo
 */
const ModeContext = createContext<ModeContextType | undefined>(undefined);

/**
 * Props do provider
 */
interface ModeProviderProps {
  children: ReactNode;
  config?: Partial<ModeProviderConfig>;
}

/**
 * Configuração padrão do provider
 */
const defaultConfig: ModeProviderConfig = {
  polling: {
    contractState: 30000, // 30 segundos
    userData: 60000, // 1 minuto
    prices: 120000, // 2 minutos
  },
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutos
  },
  retry: {
    attempts: 3,
    delay: 1000,
    backoff: 2,
  },
};

/**
 * Provider do sistema de modos
 */
export function ModeProvider({
  children,
  config: userConfig,
}: ModeProviderProps) {
  const [state, dispatch] = useReducer(modeReducer, initialState);
  const config = { ...defaultConfig, ...userConfig };

  // Lista de listeners de eventos
  const eventListeners = React.useRef<ModeEventListener[]>([]);

  /**
   * Emite um evento para todos os listeners
   */
  const emitEvent = useCallback((event: ModeEvent) => {
    eventListeners.current.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("Erro no listener de evento:", error);
      }
    });
  }, []);

  /**
   * Conecta a carteira
   */
  const connectWallet = useCallback(async () => {
    dispatch({
      type: "SET_LOADING",
      payload: { type: "wallet", loading: true },
    });
    dispatch({
      type: "SET_ERROR",
      payload: { type: "wallet", error: undefined },
    });

    try {
      // Simula conexão com carteira
      // Em implementação real, usaria @polkadot/extension-dapp
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockAddress = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";

      dispatch({
        type: "SET_WALLET_STATE",
        payload: { address: mockAddress, connected: true },
      });

      emitEvent({
        type: "WALLET_CONNECTED",
        payload: { address: mockAddress },
      });

      // Atualiza funcionalidades baseadas na conexão
      dispatch({
        type: "SET_FEATURES",
        payload: {
          canInvest: true,
          canWithdraw: true,
          canStake: true,
          canParticipateRaffle: true,
          canClaimRewards: true,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao conectar carteira";
      dispatch({
        type: "SET_ERROR",
        payload: { type: "wallet", error: errorMessage },
      });
      emitEvent({
        type: "ERROR_OCCURRED",
        payload: { type: "wallet", message: errorMessage },
      });
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "wallet", loading: false },
      });
    }
  }, [emitEvent]);

  /**
   * Desconecta a carteira
   */
  const disconnectWallet = useCallback(() => {
    dispatch({ type: "SET_WALLET_STATE", payload: { connected: false } });
    dispatch({
      type: "SET_FEATURES",
      payload: {
        canInvest: false,
        canWithdraw: false,
        canStake: false,
        canParticipateRaffle: false,
        canClaimRewards: false,
      },
    });
    emitEvent({ type: "WALLET_DISCONNECTED" });
  }, [emitEvent]);

  /**
   * Troca de conta
   */
  const switchAccount = useCallback(
    async (address: string) => {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "wallet", loading: true },
      });

      try {
        // Simula troca de conta
        await new Promise((resolve) => setTimeout(resolve, 500));

        dispatch({
          type: "SET_WALLET_STATE",
          payload: { address, connected: true },
        });

        emitEvent({
          type: "WALLET_CONNECTED",
          payload: { address },
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao trocar conta";
        dispatch({
          type: "SET_ERROR",
          payload: { type: "wallet", error: errorMessage },
        });
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { type: "wallet", loading: false },
        });
      }
    },
    [emitEvent],
  );

  /**
   * Troca de rede
   */
  const switchNetwork = useCallback(
    async (network: Network) => {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "contract", loading: true },
      });

      try {
        // Simula troca de rede
        await new Promise((resolve) => setTimeout(resolve, 1000));

        dispatch({ type: "SET_NETWORK", payload: network });
        emitEvent({ type: "NETWORK_CHANGED", payload: { network } });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao trocar rede";
        dispatch({
          type: "SET_ERROR",
          payload: { type: "network", error: errorMessage },
        });
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { type: "contract", loading: false },
        });
      }
    },
    [emitEvent],
  );

  /**
   * Troca de moeda
   */
  const switchCurrency = useCallback((currency: PaymentCurrency) => {
    dispatch({ type: "SET_CURRENCY", payload: currency });
  }, []);

  /**
   * Atualiza estado do contrato
   */
  const refreshContractState = useCallback(async () => {
    dispatch({
      type: "SET_LOADING",
      payload: { type: "contract", loading: true },
    });

    try {
      // Simula busca de dados do contrato
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockContractState = {
        launchpadPaused: false,
        currentPhase: {
          name: "Pre-Sale",
          startTime: Date.now() - 86400000,
          endTime: Date.now() + 86400000 * 7,
          minInvestment: "100",
          maxInvestment: "10000",
          totalCap: "1000000",
          currentRaised: "250000",
        },
      };

      dispatch({ type: "SET_CONTRACT_STATE", payload: mockContractState });
      emitEvent({ type: "CONTRACT_STATE_UPDATED", payload: mockContractState });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao atualizar estado do contrato";
      dispatch({
        type: "SET_ERROR",
        payload: { type: "contract", error: errorMessage },
      });
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "contract", loading: false },
      });
    }
  }, [emitEvent]);

  /**
   * Atualiza dados do usuário
   */
  const refreshUserData = useCallback(async () => {
    if (!state.connectedAccount) return;

    dispatch({ type: "SET_LOADING", payload: { type: "user", loading: true } });

    try {
      // Simula busca de dados do usuário
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUserData = {
        address: state.connectedAccount,
        balance: {
          lunes: "1000.5",
          lusdt: "500.25",
        },
        limits: {
          minInvestment: "100",
          maxInvestment: "10000",
          dailyLimit: "5000",
          cooldownPeriod: 3600,
        },
        investments: [
          {
            projectId: "project-1",
            amount: "500",
            currency: "LUNES" as PaymentCurrency,
            phase: "Pre-Sale",
            timestamp: Date.now() - 86400000,
            status: "confirmed" as const,
            txHash: "0x123...",
          },
        ] as UserInvestment[],
      };

      dispatch({ type: "SET_USER_INFO", payload: mockUserData });
      emitEvent({ type: "USER_DATA_UPDATED", payload: mockUserData });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao atualizar dados do usuário";
      dispatch({
        type: "SET_ERROR",
        payload: { type: "user", error: errorMessage },
      });
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "user", loading: false },
      });
    }
  }, [state.connectedAccount, emitEvent]);

  /**
   * Atualiza preços
   */
  const refreshPrices = useCallback(async () => {
    dispatch({
      type: "SET_LOADING",
      payload: { type: "prices", loading: true },
    });

    try {
      // Simula busca de preços
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockPrices = {
        lunesUsd: "0.15",
        lusdtUsd: "1.00",
        lastUpdated: Date.now(),
      };

      dispatch({ type: "SET_PRICING", payload: mockPrices });
      emitEvent({ type: "PRICES_UPDATED", payload: mockPrices });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar preços";
      dispatch({
        type: "SET_ERROR",
        payload: { type: "user", error: errorMessage },
      });
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "prices", loading: false },
      });
    }
  }, [emitEvent]);

  /**
   * Atualiza status de KYC
   */
  const updateKycStatus = useCallback((completed: boolean) => {
    dispatch({
      type: "SET_FEATURES",
      payload: {
        showKycWarning: !completed,
      },
    });
  }, []);

  /**
   * Atualiza status de whitelist
   */
  const updateWhitelistStatus = useCallback((whitelisted: boolean) => {
    dispatch({
      type: "SET_FEATURES",
      payload: {
        showWhitelistWarning: !whitelisted,
      },
    });
  }, []);

  // Utilitários
  const isWalletConnected = useCallback(
    () => state.walletState === "signed",
    [state.walletState],
  );
  const isNetworkSupported = useCallback(
    () => ["local", "testnet", "mainnet"].includes(state.network),
    [state.network],
  );
  const canPerformAction = useCallback(
    (action: string) => {
      const featureKey =
        `can${action.charAt(0).toUpperCase()}${action.slice(1)}` as keyof ModeState["features"];
      return state.features[featureKey] === true;
    },
    [state.features],
  );

  const formatBalance = useCallback(
    (amount: string, currency: PaymentCurrency) => {
      const num = parseFloat(amount);
      if (isNaN(num)) return "0";
      return `${num.toLocaleString()} ${currency}`;
    },
    [],
  );

  const formatPrice = useCallback((amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "$0.00";
    return `$${num.toFixed(2)}`;
  }, []);

  const validateInvestmentAmount = useCallback(
    (amount: string) => {
      const num = parseFloat(amount);
      if (isNaN(num) || num <= 0) {
        return { valid: false, error: "Valor inválido" };
      }

      const limits = state.userInfo.limits;
      if (limits) {
        const min = parseFloat(limits.minInvestment);
        const max = parseFloat(limits.maxInvestment);

        if (num < min) {
          return { valid: false, error: `Valor mínimo: ${min}` };
        }

        if (num > max) {
          return { valid: false, error: `Valor máximo: ${max}` };
        }
      }

      return { valid: true };
    },
    [state.userInfo.limits],
  );

  const validateWithdrawalAmount = useCallback(
    (amount: string) => {
      const num = parseFloat(amount);
      if (isNaN(num) || num <= 0) {
        return { valid: false, error: "Valor inválido" };
      }

      const balance = state.userInfo.balance;
      if (balance) {
        const availableBalance = parseFloat(
          balance[state.selectedCurrency.toLowerCase() as keyof typeof balance],
        );
        if (num > availableBalance) {
          return { valid: false, error: "Saldo insuficiente" };
        }
      }

      return { valid: true };
    },
    [state.userInfo.balance, state.selectedCurrency],
  );

  // Efeitos para polling de dados
  useEffect(() => {
    const interval = setInterval(
      refreshContractState,
      config.polling.contractState,
    );
    return () => clearInterval(interval);
  }, [refreshContractState, config.polling.contractState]);

  useEffect(() => {
    if (state.connectedAccount) {
      const interval = setInterval(refreshUserData, config.polling.userData);
      return () => clearInterval(interval);
    }
  }, [refreshUserData, config.polling.userData, state.connectedAccount]);

  useEffect(() => {
    const interval = setInterval(refreshPrices, config.polling.prices);
    return () => clearInterval(interval);
  }, [refreshPrices, config.polling.prices]);

  // Carregamento inicial
  useEffect(() => {
    refreshContractState();
    refreshPrices();
  }, [refreshContractState, refreshPrices]);

  const contextValue: ModeContextType = {
    state,
    actions: {
      connectWallet,
      disconnectWallet,
      switchAccount,
      switchNetwork,
      switchCurrency,
      refreshContractState,
      refreshUserData,
      refreshPrices,
      updateKycStatus,
      updateWhitelistStatus,
    },
    utils: {
      isWalletConnected,
      isNetworkSupported,
      canPerformAction,
      formatBalance,
      formatPrice,
      validateInvestmentAmount,
      validateWithdrawalAmount,
    },
  };

  return (
    <ModeContext.Provider value={contextValue}>{children}</ModeContext.Provider>
  );
}

/**
 * Hook para usar o contexto de modo
 */
export function useMode(): ModeContextType {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode deve ser usado dentro de um ModeProvider");
  }
  return context;
}
