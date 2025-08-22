/**
 * Pacote de configuração do Launchpad Lunes
 * Exporta todas as configurações de ambiente e tipos
 */

// Re-exporta tudo do diretório environments
export * from "../environments";

// Exportações específicas para facilitar o uso
export {
  getCurrentEnvironment,
  getEnvironmentConfig,
  currentConfig,
  isDevelopment,
  isStaging,
  isProduction,
  isTestEnvironment,
  shouldEnableDevTools,
} from "../environments";

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
} from "../environments/types";
