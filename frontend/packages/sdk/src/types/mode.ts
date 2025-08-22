// Tipos básicos para o sistema de modos
export type Environment = "dev" | "staging" | "prod";
export type Network = "local" | "testnet" | "mainnet";
export type UserRole = "investor" | "developer" | "admin";
export type OperationalState = "normal" | "paused" | "maintenance";
export type SaleMode =
  | "whitelist"
  | "presale"
  | "public"
  | "launchpool"
  | "raffle";
export type WalletState = "disconnected" | "connecting" | "readonly" | "signed";
export type PaymentCurrency = "LUNES" | "LUSDT";

export interface ComplianceStatus {
  kycRequired: boolean;
  kycCompleted: boolean;
  whitelistRequired: boolean;
  whitelisted: boolean;
}

export interface AppState {
  environment: Environment;
  network: Network;
  userRole: UserRole;
  walletState: WalletState;
  operationalState: OperationalState;
  compliance: ComplianceStatus;
  selectedCurrency: PaymentCurrency;
  connectedAccount?: string;
}

export interface UserLimits {
  minInvestment: string;
  maxInvestment: string;
  dailyLimit: string;
  cooldownPeriod: number;
}

export interface PriceInfo {
  lunesUsd: string;
  lusdtUsd: string;
  lastUpdated: number;
}

export interface PhaseConfig {
  name: string;
  startTime: number;
  endTime: number;
  minInvestment: string;
  maxInvestment: string;
  totalCap: string;
  currentRaised: string;
}

export interface RaffleStatus {
  active: boolean;
  participants: number;
  maxParticipants: number;
  entryFee: string;
  prizePool: string;
  endTime: number;
}

export interface LaunchpoolConfig {
  active: boolean;
  stakingToken: string;
  rewardToken: string;
  apy: string;
  totalStaked: string;
  userStaked: string;
  pendingRewards: string;
}

/**
 * Estado completo do modo operacional da aplicação
 */
export interface ModeState extends AppState {
  // Estados de contrato
  contractStates: {
    launchpadPaused: boolean;
    currentPhase?: PhaseConfig;
    raffleStatus?: RaffleStatus;
    launchpoolConfig?: LaunchpoolConfig;
  };

  // Informações do usuário
  userInfo: {
    address?: string;
    balance?: {
      lunes: string;
      lusdt: string;
    };
    limits?: UserLimits;
    investments?: UserInvestment[];
  };

  // Preços e taxas
  pricing: PriceInfo;

  // Flags de funcionalidades
  features: {
    canInvest: boolean;
    canWithdraw: boolean;
    canStake: boolean;
    canParticipateRaffle: boolean;
    canClaimRewards: boolean;
    canSwitchCurrency: boolean;
    showKycWarning: boolean;
    showWhitelistWarning: boolean;
  };

  // Estado de carregamento
  loading: {
    wallet: boolean;
    contract: boolean;
    user: boolean;
    prices: boolean;
  };

  // Erros
  errors: {
    wallet?: string;
    contract?: string;
    user?: string;
    network?: string;
  };
}

/**
 * Informações de investimento do usuário
 */
export interface UserInvestment {
  projectId: string;
  amount: string;
  currency: PaymentCurrency;
  phase: string;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
  txHash?: string;
}

/**
 * Configuração de limites por papel de usuário
 */
export interface RoleLimits {
  investor: UserLimits;
  developer: UserLimits;
  admin: UserLimits;
}

/**
 * Configuração de funcionalidades por ambiente
 */
export interface EnvironmentFeatures {
  dev: FeatureFlags;
  staging: FeatureFlags;
  prod: FeatureFlags;
}

/**
 * Flags de funcionalidades
 */
export interface FeatureFlags {
  realTimeEvents: boolean;
  autoDistribution: boolean;
  launchpool: boolean;
  raffle: boolean;
  multiCurrency: boolean;
  devTools: boolean;
  testnetWarning: boolean;
}

/**
 * Contexto do provedor de modo
 */
export interface ModeContextType {
  // Estado atual
  state: ModeState;

  // Ações
  actions: {
    // Carteira
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    switchAccount: (address: string) => Promise<void>;

    // Rede
    switchNetwork: (network: Network) => Promise<void>;

    // Moeda
    switchCurrency: (currency: PaymentCurrency) => void;

    // Atualização de dados
    refreshContractState: () => Promise<void>;
    refreshUserData: () => Promise<void>;
    refreshPrices: () => Promise<void>;

    // Compliance
    updateKycStatus: (completed: boolean) => void;
    updateWhitelistStatus: (whitelisted: boolean) => void;
  };

  // Utilitários
  utils: {
    // Verificações de estado
    isWalletConnected: () => boolean;
    isNetworkSupported: () => boolean;
    canPerformAction: (action: string) => boolean;

    // Formatação
    formatBalance: (amount: string, currency: PaymentCurrency) => string;
    formatPrice: (amount: string) => string;

    // Validação
    validateInvestmentAmount: (amount: string) => {
      valid: boolean;
      error?: string;
    };
    validateWithdrawalAmount: (amount: string) => {
      valid: boolean;
      error?: string;
    };
  };
}

/**
 * Configuração do provedor de modo
 */
export interface ModeProviderConfig {
  // Configuração de ambiente
  environment?: Environment;
  network?: Network;

  // Configuração de polling
  polling: {
    contractState: number; // Intervalo em ms
    userData: number;
    prices: number;
  };

  // Configuração de cache
  cache: {
    enabled: boolean;
    ttl: number; // TTL em ms
  };

  // Configuração de retry
  retry: {
    attempts: number;
    delay: number; // Delay inicial em ms
    backoff: number; // Multiplicador de backoff
  };
}

/**
 * Eventos do sistema de modo
 */
export type ModeEvent =
  | { type: "WALLET_CONNECTED"; payload: { address: string } }
  | { type: "WALLET_DISCONNECTED" }
  | { type: "NETWORK_CHANGED"; payload: { network: Network } }
  | {
      type: "CONTRACT_STATE_UPDATED";
      payload: Partial<ModeState["contractStates"]>;
    }
  | { type: "USER_DATA_UPDATED"; payload: Partial<ModeState["userInfo"]> }
  | { type: "PRICES_UPDATED"; payload: PriceInfo }
  | { type: "ERROR_OCCURRED"; payload: { type: string; message: string } }
  | { type: "LOADING_CHANGED"; payload: { type: string; loading: boolean } };

/**
 * Listener de eventos
 */
export type ModeEventListener = (event: ModeEvent) => void;
