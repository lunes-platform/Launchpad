/**
 * Sistema de Autenticação e Autorização - Launchpad Lunes
 *
 * Define os tipos TypeScript unificados para o sistema de autenticação baseado nos 7 papéis
 * de usuários identificados na análise completa. Consolidação das abordagens auth.ts e user.ts.
 *
 * @version 2.0.0
 * @author Arquiteto Frontend Sênior
 */

// ===== ENUMS E CONSTANTES =====

/**
 * Papéis de usuário no sistema - Versão unificada
 * Consolidação entre as duas abordagens existentes
 */
export const UserRole = {
  ADMIN: "ADMIN",
  PROJECT_ISSUER: "PROJECT_ISSUER",
  INVESTOR_VIP: "INVESTOR_VIP",
  INVESTOR_VERIFIED: "INVESTOR_VERIFIED",
  INVESTOR_STANDARD: "INVESTOR_STANDARD",
  USER_BANNED: "USER_BANNED",
  PRICE_ORACLE: "PRICE_ORACLE",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * Mapeamento de compatibilidade com a versão anterior (user.ts)
 * @deprecated Use UserRole diretamente
 */
export const LegacyUserRole = {
  admin: UserRole.ADMIN,
  project: UserRole.PROJECT_ISSUER,
  vip_investor: UserRole.INVESTOR_VIP,
  verified_investor: UserRole.INVESTOR_VERIFIED,
  standard_investor: UserRole.INVESTOR_STANDARD,
  banned_user: UserRole.USER_BANNED,
  price_oracle: UserRole.PRICE_ORACLE,
} as const;

/**
 * Status de verificação KYC
 */
export const KYCStatus = {
  NOT_STARTED: "NOT_STARTED",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
} as const;

export type KYCStatus = (typeof KYCStatus)[keyof typeof KYCStatus];

/**
 * Status do usuário no sistema
 */
export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BANNED: "BANNED",
  SUSPENDED: "SUSPENDED",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

/**
 * Permissões granulares do sistema - Versão expandida
 * Baseado na análise completa dos 7 papéis de usuários
 */
export const Permission = {
  // === ADMINISTRAÇÃO ===
  MANAGE_USERS: "MANAGE_USERS",
  MANAGE_PROJECTS: "MANAGE_PROJECTS",
  MANAGE_SYSTEM: "MANAGE_SYSTEM",
  MANAGE_REWARDS: "MANAGE_REWARDS",
  MANAGE_KYC: "MANAGE_KYC",
  MANAGE_PHASES: "MANAGE_PHASES",
  MANAGE_FEES: "MANAGE_FEES",
  MANAGE_LIMITS: "MANAGE_LIMITS",
  AUDIT_SYSTEM: "AUDIT_SYSTEM",

  // === ANALYTICS E RELATÓRIOS ===
  VIEW_ANALYTICS: "VIEW_ANALYTICS",
  VIEW_ADMIN_ANALYTICS: "VIEW_ADMIN_ANALYTICS",
  VIEW_PROJECT_ANALYTICS: "VIEW_PROJECT_ANALYTICS",
  VIEW_USER_ANALYTICS: "VIEW_USER_ANALYTICS",
  EXPORT_DATA: "EXPORT_DATA",

  // === GESTÃO DE PROJETOS ===
  CREATE_PROJECT: "CREATE_PROJECT",
  EDIT_PROJECT: "EDIT_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
  PUBLISH_PROJECT: "PUBLISH_PROJECT",
  MANAGE_PROJECT_PHASES: "MANAGE_PROJECT_PHASES",
  MANAGE_INVESTORS: "MANAGE_INVESTORS",
  CONFIGURE_PROJECT_LIMITS: "CONFIGURE_PROJECT_LIMITS",

  // === INVESTIMENTOS ===
  INVEST_IN_PROJECTS: "INVEST_IN_PROJECTS",
  INVEST_PRESALE: "INVEST_PRESALE",
  INVEST_WHITELIST: "INVEST_WHITELIST",
  INVEST_PUBLIC: "INVEST_PUBLIC",
  INVEST_LUNES: "INVEST_LUNES",
  INVEST_LUSDT: "INVEST_LUSDT",

  // === STAKING E RECOMPENSAS ===
  STAKE_TOKENS: "STAKE_TOKENS",
  UNSTAKE_TOKENS: "UNSTAKE_TOKENS",
  CLAIM_STAKING_REWARDS: "CLAIM_STAKING_REWARDS",
  PARTICIPATE_RAFFLE: "PARTICIPATE_RAFFLE",
  CLAIM_TOKENS: "CLAIM_TOKENS",
  CLAIM_REWARDS: "CLAIM_REWARDS",

  // === PRIVILÉGIOS VIP ===
  PRIORITY_ACCESS: "PRIORITY_ACCESS",
  REDUCED_FEES: "REDUCED_FEES",
  HIGHER_LIMITS: "HIGHER_LIMITS",
  PREMIUM_SUPPORT: "PREMIUM_SUPPORT",
  VIP_FEATURES: "VIP_FEATURES",
  EARLY_ACCESS: "EARLY_ACCESS",

  // === KYC E VERIFICAÇÃO ===
  ACCESS_KYC_PHASES: "ACCESS_KYC_PHASES",
  SUBMIT_KYC: "SUBMIT_KYC",
  APPROVE_KYC: "APPROVE_KYC",
  REJECT_KYC: "REJECT_KYC",

  // === SISTEMA E ORÁCULOS ===
  UPDATE_PRICES: "UPDATE_PRICES",
  SYSTEM_MAINTENANCE: "SYSTEM_MAINTENANCE",
  EMERGENCY_STOP: "EMERGENCY_STOP",

  // === SEGURANÇA ===
  BAN_USER: "BAN_USER",
  UNBAN_USER: "UNBAN_USER",
  SUSPEND_USER: "SUSPEND_USER",
  SECURITY_AUDIT: "SECURITY_AUDIT",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

/**
 * Categorias de permissões para organização
 */
export const PermissionCategory = {
  ADMIN: "ADMIN",
  ANALYTICS: "ANALYTICS",
  PROJECTS: "PROJECTS",
  INVESTMENTS: "INVESTMENTS",
  STAKING: "STAKING",
  VIP: "VIP",
  KYC: "KYC",
  SYSTEM: "SYSTEM",
  SECURITY: "SECURITY",
} as const;

export type PermissionCategory =
  (typeof PermissionCategory)[keyof typeof PermissionCategory];

// ===== INTERFACES PRINCIPAIS =====

/**
 * Interface principal do usuário autenticado
 */
export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  role: UserRole;
  status: UserStatus;
  kycStatus: KYCStatus;
  createdAt: Date;
  updatedAt: Date;

  // Dados do perfil
  profile: UserProfile;

  // Limites e configurações
  limits: UserLimits;

  // Histórico e métricas
  metrics: UserMetrics;
}

/**
 * Perfil do usuário
 */
export interface UserProfile {
  displayName?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  social?: {
    twitter?: string;
    telegram?: string;
    discord?: string;
  };

  // Dados KYC (apenas para usuários verificados)
  kyc?: {
    fullName?: string;
    document?: string;
    country?: string;
    verifiedAt?: Date;
    expiresAt?: Date;
  };
}

/**
 * Limites expandidos e específicos para cada usuário
 * Inclui novos campos para maior granularidade
 */
export interface UserLimits {
  // Limites de investimento básicos
  maxInvestmentPerProject: number;
  maxTotalInvestment: number;
  maxDailyInvestment: number;
  maxStakingAmount: number;
  maxRaffleParticipation: number;

  // Limites específicos por moeda
  maxLunesInvestment: number;
  maxLusdtInvestment: number;

  // Limites de tempo
  minStakingPeriod: number; // dias
  maxStakingPeriod: number; // dias

  // Taxas e descontos
  investmentFeePercentage: number;
  stakingFeePercentage: number;
  transactionFeeDiscount: number; // percentual de desconto
  stakingBonusMultiplier: number; // multiplicador de bônus

  // Privilégios e acesso
  priorityAccess: boolean;
  premiumFeatures: boolean;
  earlyAccess: boolean;

  // Limites mensais e anuais
  monthlyTransactionLimit: number;
  annualInvestmentLimit?: number;

  // Configurações específicas
  canParticipateInPresale: boolean;
  canAccessKycPhases: boolean;
  requiresKycForInvestment: boolean;
}

/**
 * Métricas e estatísticas do usuário
 */
export interface UserMetrics {
  totalInvested: number;
  totalStaked: number;
  totalRewardsClaimed: number;
  projectsInvested: number;
  rafflesParticipated: number;
  rafflesWon: number;

  // Métricas VIP
  vipLevel?: number;
  vipPoints?: number;

  // Histórico de atividades
  lastLoginAt?: Date;
  lastInvestmentAt?: Date;
  lastStakingAt?: Date;
}

/**
 * Contexto de autenticação
 */
export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];

  // Métodos de autenticação
  login: (walletAddress: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;

  // Verificações de permissão
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  canAccessFeature: (feature: string) => boolean;
}

/**
 * Dados de login/registro
 */
export interface LoginRequest {
  walletAddress: string;
  signature: string;
  message: string;
  timestamp: number;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: number;
}

// ===== MAPEAMENTO DE PERMISSÕES POR PAPEL =====

/**
 * Mapeamento completo de permissões por papel de usuário
 * Baseado na análise detalhada dos 7 tipos de usuários
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Administração completa
    Permission.MANAGE_USERS,
    Permission.MANAGE_PROJECTS,
    Permission.MANAGE_SYSTEM,
    Permission.MANAGE_REWARDS,
    Permission.MANAGE_KYC,
    Permission.MANAGE_PHASES,
    Permission.MANAGE_FEES,
    Permission.MANAGE_LIMITS,
    Permission.AUDIT_SYSTEM,

    // Analytics completas
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_ADMIN_ANALYTICS,
    Permission.VIEW_PROJECT_ANALYTICS,
    Permission.VIEW_USER_ANALYTICS,
    Permission.EXPORT_DATA,

    // Gestão de projetos
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.DELETE_PROJECT,
    Permission.PUBLISH_PROJECT,
    Permission.MANAGE_PROJECT_PHASES,
    Permission.MANAGE_INVESTORS,
    Permission.CONFIGURE_PROJECT_LIMITS,

    // Investimentos (acesso total)
    Permission.INVEST_IN_PROJECTS,
    Permission.INVEST_PRESALE,
    Permission.INVEST_WHITELIST,
    Permission.INVEST_PUBLIC,
    Permission.INVEST_LUNES,
    Permission.INVEST_LUSDT,

    // Staking e recompensas
    Permission.STAKE_TOKENS,
    Permission.UNSTAKE_TOKENS,
    Permission.CLAIM_STAKING_REWARDS,
    Permission.PARTICIPATE_RAFFLE,
    Permission.CLAIM_TOKENS,
    Permission.CLAIM_REWARDS,

    // Privilégios VIP
    Permission.PRIORITY_ACCESS,
    Permission.REDUCED_FEES,
    Permission.HIGHER_LIMITS,
    Permission.PREMIUM_SUPPORT,
    Permission.VIP_FEATURES,
    Permission.EARLY_ACCESS,

    // KYC e verificação
    Permission.ACCESS_KYC_PHASES,
    Permission.SUBMIT_KYC,
    Permission.APPROVE_KYC,
    Permission.REJECT_KYC,

    // Sistema e oráculos
    Permission.UPDATE_PRICES,
    Permission.SYSTEM_MAINTENANCE,
    Permission.EMERGENCY_STOP,

    // Segurança
    Permission.BAN_USER,
    Permission.UNBAN_USER,
    Permission.SUSPEND_USER,
    Permission.SECURITY_AUDIT,
  ],

  [UserRole.PROJECT_ISSUER]: [
    // Gestão de projetos próprios
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.PUBLISH_PROJECT,
    Permission.MANAGE_PROJECT_PHASES,
    Permission.MANAGE_INVESTORS,
    Permission.CONFIGURE_PROJECT_LIMITS,

    // Analytics de projetos
    Permission.VIEW_PROJECT_ANALYTICS,
    Permission.EXPORT_DATA,

    // Investimentos (como investidor também)
    Permission.INVEST_IN_PROJECTS,
    Permission.INVEST_PRESALE,
    Permission.INVEST_WHITELIST,
    Permission.INVEST_PUBLIC,
    Permission.INVEST_LUNES,
    Permission.INVEST_LUSDT,

    // Staking e recompensas
    Permission.STAKE_TOKENS,
    Permission.UNSTAKE_TOKENS,
    Permission.CLAIM_STAKING_REWARDS,
    Permission.PARTICIPATE_RAFFLE,
    Permission.CLAIM_TOKENS,
    Permission.CLAIM_REWARDS,

    // KYC
    Permission.ACCESS_KYC_PHASES,
    Permission.SUBMIT_KYC,
  ],

  [UserRole.INVESTOR_VIP]: [
    // Gestão de projetos
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.PUBLISH_PROJECT,

    // Investimentos com privilégios
    Permission.INVEST_IN_PROJECTS,
    Permission.INVEST_PRESALE,
    Permission.INVEST_WHITELIST,
    Permission.INVEST_PUBLIC,
    Permission.INVEST_LUNES,
    Permission.INVEST_LUSDT,

    // Staking e recompensas
    Permission.STAKE_TOKENS,
    Permission.UNSTAKE_TOKENS,
    Permission.CLAIM_STAKING_REWARDS,
    Permission.PARTICIPATE_RAFFLE,
    Permission.CLAIM_TOKENS,
    Permission.CLAIM_REWARDS,

    // Privilégios VIP exclusivos
    Permission.PRIORITY_ACCESS,
    Permission.REDUCED_FEES,
    Permission.HIGHER_LIMITS,
    Permission.PREMIUM_SUPPORT,
    Permission.VIP_FEATURES,
    Permission.EARLY_ACCESS,

    // Analytics pessoais
    Permission.VIEW_USER_ANALYTICS,

    // KYC
    Permission.ACCESS_KYC_PHASES,
    Permission.SUBMIT_KYC,
  ],

  [UserRole.INVESTOR_VERIFIED]: [
    // Gestão de projetos
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.PUBLISH_PROJECT,

    // Investimentos com KYC
    Permission.INVEST_IN_PROJECTS,
    Permission.INVEST_PRESALE,
    Permission.INVEST_WHITELIST,
    Permission.INVEST_PUBLIC,
    Permission.INVEST_LUNES,
    Permission.INVEST_LUSDT,

    // Staking e recompensas
    Permission.STAKE_TOKENS,
    Permission.UNSTAKE_TOKENS,
    Permission.CLAIM_STAKING_REWARDS,
    Permission.PARTICIPATE_RAFFLE,
    Permission.CLAIM_TOKENS,
    Permission.CLAIM_REWARDS,

    // Acesso a fases KYC
    Permission.ACCESS_KYC_PHASES,
    Permission.SUBMIT_KYC,

    // Analytics pessoais
    Permission.VIEW_USER_ANALYTICS,
  ],

  [UserRole.INVESTOR_STANDARD]: [
    // Gestão de projetos
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.PUBLISH_PROJECT,

    // Investimentos básicos (sem fases KYC)
    Permission.INVEST_IN_PROJECTS,
    Permission.INVEST_PUBLIC,
    Permission.INVEST_LUNES,
    Permission.INVEST_LUSDT,

    // Staking e recompensas
    Permission.STAKE_TOKENS,
    Permission.UNSTAKE_TOKENS,
    Permission.CLAIM_STAKING_REWARDS,
    Permission.PARTICIPATE_RAFFLE,
    Permission.CLAIM_TOKENS,
    Permission.CLAIM_REWARDS,

    // KYC básico
    Permission.SUBMIT_KYC,
  ],

  [UserRole.USER_BANNED]: [
    // Apenas claims de tokens já adquiridos
    Permission.CLAIM_TOKENS,
  ],

  [UserRole.PRICE_ORACLE]: [
    // Gestão de projetos
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.PUBLISH_PROJECT,

    // Função específica de oráculo
    Permission.UPDATE_PRICES,
  ],
};

/**
 * Limites padrão completos para cada papel de usuário
 * Implementação da nova interface UserLimits expandida
 */
export const DEFAULT_LIMITS: Record<UserRole, UserLimits> = {
  [UserRole.ADMIN]: {
    // Limites administrativos - sem restrições práticas
    maxInvestmentPerProject: 10000000, // $10M
    maxTotalInvestment: 100000000, // $100M
    maxDailyInvestment: 10000000, // $10M
    maxStakingAmount: 50000000, // $50M
    maxRaffleParticipation: 10000,

    // Limites específicos por moeda
    maxLunesInvestment: 50000000, // 50M LUNES
    maxLusdtInvestment: 10000000, // $10M LUSDT

    // Limites de tempo
    minStakingPeriod: 0, // Sem mínimo
    maxStakingPeriod: 365 * 5, // 5 anos

    // Taxas e descontos
    investmentFeePercentage: 0, // Sem taxas
    stakingFeePercentage: 0, // Sem taxas
    transactionFeeDiscount: 100, // 100% desconto
    stakingBonusMultiplier: 2.0, // 2x bônus

    // Privilégios e acesso
    priorityAccess: true,
    premiumFeatures: true,
    earlyAccess: true,

    // Limites mensais e anuais
    monthlyTransactionLimit: 100000000, // $100M
    annualInvestmentLimit: 1000000000, // $1B

    // Configurações específicas
    canParticipateInPresale: true,
    canAccessKycPhases: true,
    requiresKycForInvestment: false,
  },

  [UserRole.PROJECT_ISSUER]: {
    // Limites para emissores de projetos
    maxInvestmentPerProject: 1000000, // $1M
    maxTotalInvestment: 5000000, // $5M
    maxDailyInvestment: 500000, // $500K
    maxStakingAmount: 2000000, // $2M
    maxRaffleParticipation: 500,

    // Limites específicos por moeda
    maxLunesInvestment: 5000000, // 5M LUNES
    maxLusdtInvestment: 1000000, // $1M LUSDT

    // Limites de tempo
    minStakingPeriod: 7, // 7 dias mínimo
    maxStakingPeriod: 365 * 2, // 2 anos

    // Taxas e descontos
    investmentFeePercentage: 0.75, // Taxa reduzida
    stakingFeePercentage: 0.5, // Taxa reduzida
    transactionFeeDiscount: 25, // 25% desconto
    stakingBonusMultiplier: 1.2, // 1.2x bônus

    // Privilégios e acesso
    priorityAccess: false,
    premiumFeatures: true,
    earlyAccess: true,

    // Limites mensais e anuais
    monthlyTransactionLimit: 5000000, // $5M
    annualInvestmentLimit: 50000000, // $50M

    // Configurações específicas
    canParticipateInPresale: true,
    canAccessKycPhases: true,
    requiresKycForInvestment: false,
  },

  [UserRole.INVESTOR_VIP]: {
    // Limites VIP - privilégios especiais
    maxInvestmentPerProject: 2000000, // $2M
    maxTotalInvestment: 10000000, // $10M
    maxDailyInvestment: 1000000, // $1M
    maxStakingAmount: 5000000, // $5M
    maxRaffleParticipation: 1000,

    // Limites específicos por moeda
    maxLunesInvestment: 10000000, // 10M LUNES
    maxLusdtInvestment: 2000000, // $2M LUSDT

    // Limites de tempo
    minStakingPeriod: 1, // 1 dia mínimo
    maxStakingPeriod: 365 * 3, // 3 anos

    // Taxas e descontos VIP
    investmentFeePercentage: 0.5, // Taxa VIP reduzida
    stakingFeePercentage: 0.25, // Taxa VIP reduzida
    transactionFeeDiscount: 50, // 50% desconto
    stakingBonusMultiplier: 1.5, // 1.5x bônus

    // Privilégios e acesso
    priorityAccess: true,
    premiumFeatures: true,
    earlyAccess: true,

    // Limites mensais e anuais
    monthlyTransactionLimit: 10000000, // $10M
    annualInvestmentLimit: 100000000, // $100M

    // Configurações específicas
    canParticipateInPresale: true,
    canAccessKycPhases: true,
    requiresKycForInvestment: false,
  },

  [UserRole.INVESTOR_VERIFIED]: {
    // Limites para investidores verificados (KYC)
    maxInvestmentPerProject: 500000, // $500K
    maxTotalInvestment: 2000000, // $2M
    maxDailyInvestment: 200000, // $200K
    maxStakingAmount: 1000000, // $1M
    maxRaffleParticipation: 200,

    // Limites específicos por moeda
    maxLunesInvestment: 2000000, // 2M LUNES
    maxLusdtInvestment: 500000, // $500K LUSDT

    // Limites de tempo
    minStakingPeriod: 7, // 7 dias mínimo
    maxStakingPeriod: 365, // 1 ano

    // Taxas e descontos
    investmentFeePercentage: 1.0, // Taxa padrão
    stakingFeePercentage: 0.5, // Taxa padrão
    transactionFeeDiscount: 10, // 10% desconto
    stakingBonusMultiplier: 1.1, // 1.1x bônus

    // Privilégios e acesso
    priorityAccess: false,
    premiumFeatures: false,
    earlyAccess: false,

    // Limites mensais e anuais
    monthlyTransactionLimit: 2000000, // $2M
    annualInvestmentLimit: 20000000, // $20M

    // Configurações específicas
    canParticipateInPresale: true,
    canAccessKycPhases: true,
    requiresKycForInvestment: true,
  },

  [UserRole.INVESTOR_STANDARD]: {
    // Limites básicos para investidores padrão
    maxInvestmentPerProject: 50000, // $50K
    maxTotalInvestment: 200000, // $200K
    maxDailyInvestment: 25000, // $25K
    maxStakingAmount: 100000, // $100K
    maxRaffleParticipation: 50,

    // Limites específicos por moeda
    maxLunesInvestment: 500000, // 500K LUNES
    maxLusdtInvestment: 50000, // $50K LUSDT

    // Limites de tempo
    minStakingPeriod: 30, // 30 dias mínimo
    maxStakingPeriod: 180, // 6 meses

    // Taxas e descontos
    investmentFeePercentage: 1.5, // Taxa mais alta
    stakingFeePercentage: 1.0, // Taxa mais alta
    transactionFeeDiscount: 0, // Sem desconto
    stakingBonusMultiplier: 1.0, // Sem bônus

    // Privilégios e acesso
    priorityAccess: false,
    premiumFeatures: false,
    earlyAccess: false,

    // Limites mensais e anuais
    monthlyTransactionLimit: 200000, // $200K
    annualInvestmentLimit: 2000000, // $2M

    // Configurações específicas
    canParticipateInPresale: false,
    canAccessKycPhases: false,
    requiresKycForInvestment: false,
  },

  [UserRole.USER_BANNED]: {
    // Usuário banido - apenas claims
    maxInvestmentPerProject: 0,
    maxTotalInvestment: 0,
    maxDailyInvestment: 0,
    maxStakingAmount: 0,
    maxRaffleParticipation: 0,

    // Limites específicos por moeda
    maxLunesInvestment: 0,
    maxLusdtInvestment: 0,

    // Limites de tempo
    minStakingPeriod: 0,
    maxStakingPeriod: 0,

    // Taxas e descontos
    investmentFeePercentage: 0,
    stakingFeePercentage: 0,
    transactionFeeDiscount: 0,
    stakingBonusMultiplier: 0,

    // Privilégios e acesso
    priorityAccess: false,
    premiumFeatures: false,
    earlyAccess: false,

    // Limites mensais e anuais
    monthlyTransactionLimit: 0,
    annualInvestmentLimit: 0,

    // Configurações específicas
    canParticipateInPresale: false,
    canAccessKycPhases: false,
    requiresKycForInvestment: false,
  },

  [UserRole.PRICE_ORACLE]: {
    // Oráculo - sem funcionalidades de investimento
    maxInvestmentPerProject: 0,
    maxTotalInvestment: 0,
    maxDailyInvestment: 0,
    maxStakingAmount: 0,
    maxRaffleParticipation: 0,

    // Limites específicos por moeda
    maxLunesInvestment: 0,
    maxLusdtInvestment: 0,

    // Limites de tempo
    minStakingPeriod: 0,
    maxStakingPeriod: 0,

    // Taxas e descontos
    investmentFeePercentage: 0,
    stakingFeePercentage: 0,
    transactionFeeDiscount: 0,
    stakingBonusMultiplier: 0,

    // Privilégios e acesso
    priorityAccess: false,
    premiumFeatures: false,
    earlyAccess: false,

    // Limites mensais e anuais
    monthlyTransactionLimit: 0,
    annualInvestmentLimit: 0,

    // Configurações específicas
    canParticipateInPresale: false,
    canAccessKycPhases: false,
    requiresKycForInvestment: false,
  },
};

/**
 * Limites específicos por moeda para cada papel
 */
export const CURRENCY_LIMITS: Record<
  UserRole,
  { maxLunesInvestment: number; maxLusdtInvestment: number }
> = {
  [UserRole.ADMIN]: {
    maxLunesInvestment: 50000000, // 50M LUNES
    maxLusdtInvestment: 10000000, // $10M LUSDT
  },

  [UserRole.PROJECT_ISSUER]: {
    maxLunesInvestment: 5000000, // 5M LUNES
    maxLusdtInvestment: 1000000, // $1M LUSDT
  },

  [UserRole.INVESTOR_VIP]: {
    maxLunesInvestment: 10000000, // 10M LUNES
    maxLusdtInvestment: 2000000, // $2M LUSDT
  },

  [UserRole.INVESTOR_VERIFIED]: {
    maxLunesInvestment: 2000000, // 2M LUNES
    maxLusdtInvestment: 500000, // $500K LUSDT
  },

  [UserRole.INVESTOR_STANDARD]: {
    maxLunesInvestment: 500000, // 500K LUNES
    maxLusdtInvestment: 50000, // $50K LUSDT
  },

  [UserRole.USER_BANNED]: {
    maxLunesInvestment: 0,
    maxLusdtInvestment: 0,
  },

  [UserRole.PRICE_ORACLE]: {
    maxLunesInvestment: 0,
    maxLusdtInvestment: 0,
  },
};

// ===== UTILITÁRIOS =====

/**
 * Funções utilitárias expandidas para verificação de permissões e validações
 */
export function hasPermission(
  user: User | null,
  permission: Permission,
): boolean {
  if (!user) return false;
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  return rolePermissions.includes(permission);
}

/**
 * Verifica se um usuário tem um papel específico
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  if (!user) return false;
  return user.role === role;
}

/**
 * Verifica se um usuário pode acessar uma funcionalidade
 */
export function canAccessFeature(user: User | null, feature: string): boolean {
  if (!user) return false;

  // Usuários banidos só podem fazer claim
  if (user.status === UserStatus.BANNED) {
    return feature === "claim-tokens";
  }

  // Usuários inativos não podem acessar nada
  if (user.status === UserStatus.INACTIVE) {
    return false;
  }

  return true;
}

/**
 * Obtém os limites completos de um usuário baseado no seu papel
 */
export function getUserLimits(user: User): UserLimits {
  const defaultLimits =
    DEFAULT_LIMITS[user.role] || DEFAULT_LIMITS[UserRole.INVESTOR_STANDARD];

  // Override com limites customizados do usuário se existirem
  return {
    ...defaultLimits,
    ...user.limits,
  };
}

/**
 * Verifica se um usuário pode investir em um projeto específico
 */
export function canInvestInProject(
  user: User | null,
  projectPhase: string,
  amount: number,
  currency: "LUNES" | "LUSDT" = "LUSDT",
): { canInvest: boolean; reason?: string } {
  if (!user) {
    return { canInvest: false, reason: "Usuário não autenticado" };
  }

  if (user.status === UserStatus.BANNED) {
    return { canInvest: false, reason: "Usuário banido" };
  }

  if (user.status !== UserStatus.ACTIVE) {
    return { canInvest: false, reason: "Usuário inativo" };
  }

  // Verificar permissões baseadas na fase
  if (
    projectPhase === "whitelist" &&
    !hasPermission(user, Permission.INVEST_WHITELIST)
  ) {
    return { canInvest: false, reason: "Acesso à whitelist requer KYC" };
  }

  if (
    projectPhase === "presale" &&
    !hasPermission(user, Permission.INVEST_PRESALE)
  ) {
    return { canInvest: false, reason: "Acesso à pré-venda requer KYC" };
  }

  if (!hasPermission(user, Permission.INVEST_IN_PROJECTS)) {
    return { canInvest: false, reason: "Sem permissão para investir" };
  }

  // Verificar limites
  const limits = getUserLimits(user);

  if (amount > limits.maxInvestmentPerProject) {
    return {
      canInvest: false,
      reason: `Valor excede limite por projeto (${limits.maxInvestmentPerProject})`,
    };
  }

  // Verificar limite específico por moeda
  if (currency === "LUNES" && amount > limits.maxLunesInvestment) {
    return {
      canInvest: false,
      reason: `Valor excede limite para LUNES (${limits.maxLunesInvestment})`,
    };
  }

  if (currency === "LUSDT" && amount > limits.maxLusdtInvestment) {
    return {
      canInvest: false,
      reason: `Valor excede limite para LUSDT (${limits.maxLusdtInvestment})`,
    };
  }

  return { canInvest: true };
}

/**
 * Verifica se o usuário pode participar de staking
 */
export function canStake(
  user: User | null,
  stakingAmount: number,
  stakingPeriod: number,
): { canStake: boolean; reason?: string } {
  if (!user) {
    return { canStake: false, reason: "Usuário não autenticado" };
  }

  if (user.status === UserStatus.BANNED) {
    return { canStake: false, reason: "Usuário banido" };
  }

  if (!hasPermission(user, Permission.STAKE_TOKENS)) {
    return { canStake: false, reason: "Sem permissão para staking" };
  }

  const limits = getUserLimits(user);

  if (stakingAmount > limits.maxStakingAmount) {
    return {
      canStake: false,
      reason: `Valor excede limite de staking (${limits.maxStakingAmount})`,
    };
  }

  if (stakingPeriod < limits.minStakingPeriod) {
    return {
      canStake: false,
      reason: `Período mínimo de staking é ${limits.minStakingPeriod} dias`,
    };
  }

  if (stakingPeriod > limits.maxStakingPeriod) {
    return {
      canStake: false,
      reason: `Período máximo de staking é ${limits.maxStakingPeriod} dias`,
    };
  }

  return { canStake: true };
}

/**
 * Verifica se o usuário pode participar de rifas
 */
export function canParticipateInRaffle(
  user: User | null,
  currentParticipations: number,
): { canParticipate: boolean; reason?: string } {
  if (!user) {
    return { canParticipate: false, reason: "Usuário não autenticado" };
  }

  if (user.status === UserStatus.BANNED) {
    return { canParticipate: false, reason: "Usuário banido" };
  }

  if (!hasPermission(user, Permission.PARTICIPATE_RAFFLE)) {
    return {
      canParticipate: false,
      reason: "Sem permissão para participar de rifas",
    };
  }

  const limits = getUserLimits(user);

  if (currentParticipations >= limits.maxRaffleParticipation) {
    return {
      canParticipate: false,
      reason: `Limite de participações em rifas atingido (${limits.maxRaffleParticipation})`,
    };
  }

  return { canParticipate: true };
}

/**
 * Calcula a taxa de investimento para o usuário
 */
export function calculateInvestmentFee(
  user: User | null,
  investmentAmount: number,
): number {
  if (!user) return 0;

  const limits = getUserLimits(user);
  const baseFee = (investmentAmount * limits.investmentFeePercentage) / 100;
  const discount = (baseFee * limits.transactionFeeDiscount) / 100;

  return Math.max(0, baseFee - discount);
}

/**
 * Calcula o bônus de staking para o usuário
 */
export function calculateStakingBonus(
  user: User | null,
  baseReward: number,
): number {
  if (!user) return baseReward;

  const limits = getUserLimits(user);
  return baseReward * limits.stakingBonusMultiplier;
}

/**
 * Verifica se o usuário tem acesso antecipado
 */
export function hasEarlyAccess(user: User | null): boolean {
  if (!user || user.status === UserStatus.BANNED) return false;

  const limits = getUserLimits(user);
  return limits.earlyAccess;
}

/**
 * Verifica se o usuário pode acessar fases que requerem KYC
 */
export function canAccessKycPhases(user: User | null): boolean {
  if (!user || user.status === UserStatus.BANNED) return false;

  const limits = getUserLimits(user);

  // Se o papel permite acesso a fases KYC
  if (!limits.canAccessKycPhases) return false;

  // Se requer KYC para investimento, verifica se o usuário está verificado
  if (limits.requiresKycForInvestment) {
    return user.kycStatus === KYCStatus.APPROVED;
  }

  return true;
}

/**
 * Verifica se o usuário pode participar de pré-vendas
 */
export function canParticipateInPresale(user: User | null): boolean {
  if (!user || user.status === UserStatus.BANNED) return false;

  const limits = getUserLimits(user);
  return limits.canParticipateInPresale;
}

/**
 * Verifica se o usuário é VIP
 */
export function isVipUser(user: User | null): boolean {
  return hasRole(user, UserRole.INVESTOR_VIP);
}

/**
 * Verifica se o usuário é administrador
 */
export function isAdminUser(user: User | null): boolean {
  return hasRole(user, UserRole.ADMIN);
}

/**
 * Verifica se o usuário é um emissor de projeto
 */
export function isProjectIssuer(user: User | null): boolean {
  return hasRole(user, UserRole.PROJECT_ISSUER);
}

/**
 * Verifica se o usuário está verificado (KYC aprovado)
 */
export function isVerifiedUser(user: User | null): boolean {
  if (!user) return false;
  return user.kycStatus === KYCStatus.APPROVED;
}
