/**
 * Tipos de configuração para diferentes ambientes do Launchpad
 * Baseado nos contratos inteligentes em smart-contracts/contracts/launchpad/
 */

export type Environment = "dev" | "staging" | "prod";
export type Network = "local" | "testnet" | "mainnet";
export type UserRole = "investor" | "developer" | "admin";

/**
 * Estados operacionais do sistema
 */
export type OperationalState = "normal" | "paused" | "maintenance";

/**
 * Modos de venda/fase disponíveis
 */
export type SaleMode =
  | "whitelist"
  | "presale"
  | "publicsale"
  | "launchpool"
  | "raffle";

/**
 * Estados de carteira
 */
export type WalletState = "readonly" | "signed" | "disconnected";

/**
 * Moedas de pagamento suportadas
 */
export type PaymentCurrency = "LUNES" | "LUSDT";

/**
 * Status de compliance
 */
export interface ComplianceStatus {
  kycRequired: boolean;
  kycCompleted: boolean;
  whitelistRequired: boolean;
  whitelisted: boolean;
}

/**
 * Configuração de contrato para cada ambiente
 */
export interface ContractConfig {
  address: string;
  abi?: any; // ABI do contrato se necessário
}

/**
 * Configuração de token
 */
export interface TokenConfig {
  symbol: string;
  decimals: number;
  address?: string; // Para tokens PSP22 como LUSDT
  icon?: string;
}

/**
 * Configuração de rede
 */
export interface NetworkConfig {
  name: string;
  rpcEndpoint: string;
  wsEndpoint: string;
  explorerUrl: string;
  chainId?: number;
  contracts: {
    launchpad: ContractConfig;
    lusdt?: ContractConfig; // Token PSP22
  };
  tokens: {
    native: TokenConfig; // LUNES
    lusdt?: TokenConfig;
  };
}

/**
 * Configuração completa do ambiente
 */
export interface EnvironmentConfig {
  environment: Environment;
  networks: Record<Network, NetworkConfig>;
  defaultNetwork: Network;
  features: {
    realTimeEvents: boolean;
    autoDistribution: boolean;
    launchpool: boolean;
    raffle: boolean;
    multiCurrency: boolean;
  };
  ui: {
    theme: "light" | "dark" | "auto";
    showTestnetWarning: boolean;
    enableDevTools: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
}

/**
 * Estado global da aplicação
 */
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

/**
 * Configuração de limites do usuário
 */
export interface UserLimits {
  dailyLimit: string; // Em wei/unidades mínimas
  projectLimit: string;
  totalLimit: string;
  cooldownPeriod: number; // Em blocos
  lastInvestmentBlock?: number;
}

/**
 * Informações de preços
 */
export interface PriceInfo {
  lunesUsd: string;
  lusdtUsd: string;
  lastUpdated: number;
}

/**
 * Configuração de fase de projeto
 */
export interface PhaseConfig {
  id: number;
  name: string;
  startTime: number;
  endTime: number;
  price: string;
  discount?: number;
  maxAllocation: string;
  requiresWhitelist: boolean;
  requiresKyc: boolean;
  saleMode: SaleMode;
}

/**
 * Status de raffle
 */
export type RaffleStatus = "open" | "closed" | "drawn" | "cancelled";

/**
 * Configuração de launchpool
 */
export interface LaunchpoolConfig {
  enabled: boolean;
  minStakeAmount: string;
  rewardRate: string;
  duration: number;
  totalRewards: string;
}
