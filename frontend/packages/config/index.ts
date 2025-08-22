/**
 * Pacote de configuração do Launchpad
 * Gerencia configurações por ambiente e rede
 */

// Exporta todas as configurações de ambiente
export * from "./environments";

// Exporta utilitários de configuração
export {
  getCurrentEnvironment,
  getEnvironmentConfig,
  currentConfig,
  isDevelopment,
  isStaging,
  isProduction,
  isTestEnvironment,
  shouldEnableDevTools,
} from "./environments";

// Exporta tipos principais
export type {
  Environment,
  Network,
  UserRole,
  OperationalState,
  SaleMode,
  WalletState,
  PaymentCurrency,
  ComplianceStatus,
  ContractConfig,
  TokenConfig,
  NetworkConfig,
  EnvironmentConfig,
  AppState,
  UserLimits,
  PriceInfo,
  PhaseConfig,
  RaffleStatus,
  LaunchpoolConfig,
} from "./environments/types";
