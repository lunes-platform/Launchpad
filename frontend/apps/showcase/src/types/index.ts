// Tipos básicos da aplicação Launchpad Lunes

/**
 * Fases de um projeto IDO
 */
export type ProjectPhase =
  | "upcoming"
  | "whitelist"
  | "sale"
  | "distribution"
  | "completed";

/**
 * Informações de um projeto IDO
 */
export interface Project {
  id: string;
  name: string;
  symbol: string;
  description: string;
  logo: string;
  banner?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;

  // Informações financeiras
  totalSupply: string;
  tokenPrice: string;
  hardCap: string;
  softCap: string;
  minInvestment: string;
  maxInvestment: string;

  // Cronograma
  phase: ProjectPhase;
  startDate: Date;
  endDate: Date;
  distributionDate?: Date;

  // Progresso
  raised: string;
  participants: number;
  progress: number; // 0-100

  // Configurações
  isKycRequired: boolean;
  isWhitelistOnly: boolean;
  acceptedTokens: string[]; // ['LUNES', 'USDT']
}

/**
 * Informações de investimento do usuário
 */
export interface UserInvestment {
  id: string;
  projectId: string;
  projectName: string;
  amount: string;
  token: string;
  tokenSymbol: string;
  totalTokens: string;
  claimableAmount: string;
  timestamp: Date;
  status: "pending" | "confirmed" | "failed";
  txHash?: string;
  vestingSchedule?: VestingScheduleItem[];
}

/**
 * Item do cronograma de vesting
 */
export interface VestingScheduleItem {
  date: Date;
  amount: string;
  percentage: number;
  claimed: boolean;
  claimable: boolean;
}

/**
 * Pool de staking/launchpool
 */
export interface StakingPool {
  id: string;
  name: string;
  token: string;
  apy: number;
  totalStaked: string;
  userStaked?: string;
  rewards?: string;
  lockPeriod: number; // em dias
  isActive: boolean;
}

/**
 * Configurações da aplicação
 */
export interface AppConfig {
  rpcEndpoint: string;
  chainId: number;
  explorerUrl: string;
  supportedWallets: string[];
  defaultSlippage: number;
}

/**
 * Estados de loading da aplicação
 */
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Evento de auditoria de segurança
 */
export interface SecurityAuditEvent {
  /** ID único do evento */
  id: string;
  /** Timestamp do evento */
  timestamp: Date;
  /** Tipo de evento */
  eventType:
    | "login"
    | "logout"
    | "transaction"
    | "permission_change"
    | "security_violation"
    | "password_change"
    | "kyc_update";
  /** Nível de severidade */
  severity: "low" | "medium" | "high" | "critical";
  /** ID do usuário que executou a ação */
  userId: string;
  /** Papel do usuário */
  userRole: string;
  /** Endereço IP (simulado) */
  ipAddress: string;
  /** User Agent (simulado) */
  userAgent: string;
  /** Descrição da ação */
  description: string;
  /** Dados adicionais do evento */
  metadata?: Record<string, any>;
  /** Se a ação foi bem-sucedida */
  success: boolean;
  /** Mensagem de erro (se houver) */
  errorMessage?: string;
}
