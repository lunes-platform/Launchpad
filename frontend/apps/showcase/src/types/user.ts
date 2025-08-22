/**
 * Tipos de usuários e suas permissões no sistema Launchpad Lunes
 * Baseado na análise completa dos papéis dos usuários
 */

export type UserRole =
  | "admin"
  | "project"
  | "vip_investor"
  | "verified_investor"
  | "standard_investor"
  | "banned_user"
  | "price_oracle";

export const UserRole = {
  ADMIN: "admin" as const,
  PROJECT: "project" as const,
  VIP_INVESTOR: "vip_investor" as const,
  VERIFIED_INVESTOR: "verified_investor" as const,
  STANDARD_INVESTOR: "standard_investor" as const,
  BANNED_USER: "banned_user" as const,
  PRICE_ORACLE: "price_oracle" as const,
} as const;

export interface UserProfile {
  address: string;
  role: UserRole;
  dailyLimit: bigint;
  projectLimit: bigint;
  isVip: boolean;
  kycVerified: boolean;
  isBanned: boolean;
  lastInvestment: number;
  dailySpent: bigint;
  dailyResetBlock: number;
  tier?: 1 | 2 | 3 | 4; // Bronze, Silver, Gold, Platinum
  participationScore?: number;
  totalInvested?: bigint;
  projectsParticipated?: number;
}

export interface UserPermissions {
  canConfigurePhases: boolean;
  canInvestLunes: boolean;
  canInvestLusdt: boolean;
  canAccessKycPhases: boolean;
  canStake: boolean;
  canParticipateRaffle: boolean;
  canClaimTokens: boolean;
  canClaimRewards: boolean;
  canManageUsers: boolean;
  canUpdatePrices: boolean;
  canViewAnalytics: boolean;
  canAccessVipFeatures: boolean;
}

export interface UserAnalytics {
  stakedAmount: bigint;
  stakingTimestamp: number;
  pendingStakingRewards: bigint;
  participationScore: number;
  totalInvested: bigint;
  projectsParticipated: number;
  tier: 1 | 2 | 3 | 4;
  isKycVerified: boolean;
  isVip: boolean;
  isBanned: boolean;
  dailySpentCurrent: bigint;
  lastInvestmentBlock: number;
}

/**
 * Função para determinar permissões baseadas no papel do usuário
 */
export function getUserPermissions(
  role: UserRole,
  profile: UserProfile,
): UserPermissions {
  const basePermissions: UserPermissions = {
    canConfigurePhases: false,
    canInvestLunes: false,
    canInvestLusdt: false,
    canAccessKycPhases: false,
    canStake: false,
    canParticipateRaffle: false,
    canClaimTokens: false,
    canClaimRewards: false,
    canManageUsers: false,
    canUpdatePrices: false,
    canViewAnalytics: false,
    canAccessVipFeatures: false,
  };

  // Se usuário está banido, só pode fazer claims
  if (profile.isBanned) {
    return {
      ...basePermissions,
      canClaimTokens: true,
      canClaimRewards: true,
    };
  }

  switch (role) {
    case UserRole.ADMIN:
      return {
        canConfigurePhases: true,
        canInvestLunes: true,
        canInvestLusdt: true,
        canAccessKycPhases: true,
        canStake: true,
        canParticipateRaffle: true,
        canClaimTokens: true,
        canClaimRewards: true,
        canManageUsers: true,
        canUpdatePrices: true,
        canViewAnalytics: true,
        canAccessVipFeatures: true,
      };

    case UserRole.PROJECT:
      return {
        ...basePermissions,
        canInvestLunes: true,
        canInvestLusdt: true,
        canAccessKycPhases: true,
        canStake: true,
        canParticipateRaffle: true,
        canClaimTokens: true,
        canClaimRewards: true,
        canViewAnalytics: true,
      };

    case UserRole.VIP_INVESTOR:
      return {
        ...basePermissions,
        canInvestLunes: true,
        canInvestLusdt: true,
        canAccessKycPhases: true,
        canStake: true,
        canParticipateRaffle: true,
        canClaimTokens: true,
        canClaimRewards: true,
        canViewAnalytics: true,
        canAccessVipFeatures: true,
      };

    case UserRole.VERIFIED_INVESTOR:
      return {
        ...basePermissions,
        canInvestLunes: true,
        canInvestLusdt: true,
        canAccessKycPhases: true,
        canStake: true,
        canParticipateRaffle: true,
        canClaimTokens: true,
        canClaimRewards: true,
      };

    case UserRole.STANDARD_INVESTOR:
      return {
        ...basePermissions,
        canInvestLunes: true,
        canInvestLusdt: true,
        canAccessKycPhases: profile.kycVerified,
        canStake: true,
        canParticipateRaffle: true,
        canClaimTokens: true,
        canClaimRewards: true,
      };

    case UserRole.PRICE_ORACLE:
      return {
        ...basePermissions,
        canUpdatePrices: true,
      };

    default:
      return basePermissions;
  }
}

/**
 * Função para determinar o papel do usuário baseado no perfil
 */
export function determineUserRole(
  profile: UserProfile,
  isAdmin: boolean,
  isOracle: boolean,
): UserRole {
  if (profile.isBanned) return UserRole.BANNED_USER;
  if (isAdmin) return UserRole.ADMIN;
  if (isOracle) return UserRole.PRICE_ORACLE;
  if (profile.isVip) return UserRole.VIP_INVESTOR;
  if (profile.kycVerified) return UserRole.VERIFIED_INVESTOR;
  return UserRole.STANDARD_INVESTOR;
}
