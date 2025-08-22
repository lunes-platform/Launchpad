import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import {
  UserRole,
  UserStatus,
  KYCStatus,
  Permission,
  ROLE_PERMISSIONS,
  DEFAULT_LIMITS,
  hasPermission,
  getUserLimits,
  isVipUser,
  isAdminUser,
  isVerifiedUser,
} from "../types/auth";
import type {
  User,
  UserProfile,
  UserLimits,
  UserMetrics,
  AuthContext as AuthContextInterface,
} from "../types/auth";
import { useWallet } from "./WalletContext";

/**
 * Interface do contexto de autenticação modernizada
 * Integra com os novos tipos definidos em auth.ts
 */
interface AuthContextType extends Omit<AuthContextInterface, "login"> {
  // Dados do usuário
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Permissões e verificações
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  canAccessFeature: (feature: string) => boolean;

  // Métodos de autenticação
  login: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;

  // Verificações específicas
  isVip: boolean;
  isVerified: boolean;
  isBanned: boolean;
  isAdmin: boolean;

  // Limites do usuário
  userLimits: UserLimits | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider de autenticação modernizado
 * Gerencia o estado completo do usuário autenticado
 * Integra com o WalletContext para obter informações da carteira
 * Determina automaticamente o papel, permissões e limites do usuário
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { isReady, selectedAccount } = useWallet();

  // Estados principais
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados derivados
  const permissions = user ? ROLE_PERMISSIONS[user.role] : [];
  const userLimits = user ? getUserLimits(user) : null;
  const isVip = isVipUser(user);
  const isVerified = isVerifiedUser(user);
  const isBanned = user?.status === UserStatus.BANNED;
  const isAdmin = isAdminUser(user);

  /**
   * Simula busca do usuário completo no smart contract
   * Em produção, isso faria uma chamada real para o contrato
   */
  const fetchUser = async (walletAddress: string): Promise<User> => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Determinar papel baseado no endereço (simulação)
    let role = UserRole.INVESTOR_STANDARD as UserRole;
    let status = UserStatus.ACTIVE as UserStatus;
    let kycStatus = KYCStatus.PENDING as KYCStatus;

    // Lógica de determinação de papel baseada no endereço
    if (walletAddress.includes("admin")) {
      role = UserRole.ADMIN;
      kycStatus = KYCStatus.APPROVED;
    } else if (
      walletAddress.includes("project") ||
      walletAddress.includes("issuer") ||
      walletAddress.includes("creator") ||
      walletAddress.includes("manager")
    ) {
      role = UserRole.PROJECT_ISSUER;
      kycStatus = KYCStatus.APPROVED;
    } else if (walletAddress.includes("vip")) {
      role = UserRole.INVESTOR_VIP;
      kycStatus = KYCStatus.APPROVED;
    } else if (
      walletAddress.includes("verified") ||
      walletAddress.includes("kyc")
    ) {
      role = UserRole.INVESTOR_VERIFIED;
      kycStatus = KYCStatus.APPROVED;
    } else if (walletAddress.includes("banned")) {
      role = UserRole.USER_BANNED;
      status = UserStatus.BANNED;
    } else if (
      walletAddress.includes("oracle") ||
      walletAddress.includes("price")
    ) {
      role = UserRole.PRICE_ORACLE;
      status = UserStatus.SUSPENDED;
    }

    // Criar perfil do usuário
    const profile: UserProfile = {
      displayName: `User ${walletAddress.slice(-6)}`,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${walletAddress}`,
      bio: "Usuário do Launchpad Lunes",

      // Dados KYC para usuários verificados
      ...(kycStatus === KYCStatus.APPROVED && {
        kyc: {
          fullName: `Nome Completo ${walletAddress.slice(-4)}`,
          country: "BR",
          verifiedAt: new Date(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
        },
      }),
    };

    // Métricas simuladas
    const metrics: UserMetrics = {
      totalInvested: Math.floor(Math.random() * 100000),
      totalStaked: Math.floor(Math.random() * 50000),
      totalRewardsClaimed: Math.floor(Math.random() * 10000),
      projectsInvested: Math.floor(Math.random() * 20),
      rafflesParticipated: Math.floor(Math.random() * 50),
      rafflesWon: Math.floor(Math.random() * 5),
      lastLoginAt: new Date(),

      // Métricas VIP
      ...(role === UserRole.INVESTOR_VIP && {
        vipLevel: Math.floor(Math.random() * 5) + 1,
        vipPoints: Math.floor(Math.random() * 10000),
      }),
    };

    // Criar usuário completo
    const mockUser: User = {
      id: `user_${walletAddress.slice(-8)}`,
      walletAddress,
      role,
      status,
      kycStatus,
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
      ),
      updatedAt: new Date(),
      profile,
      limits: DEFAULT_LIMITS[role as UserRole],
      metrics,
    };

    return mockUser;
  };

  /**
   * Função de login que busca o usuário completo
   */
  const login = useCallback(async () => {
    console.log('🔐 Login iniciado:', { selectedAccount: selectedAccount?.address });
    
    if (!selectedAccount) {
      console.log('❌ Login falhou: Nenhuma conta selecionada');
      setError("Nenhuma conta selecionada");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Buscando dados do usuário para:', selectedAccount.address);
      const userData = await fetchUser(selectedAccount.address);
      console.log('✅ Usuário autenticado:', { 
        address: userData.walletAddress, 
        role: userData.role,
        status: userData.status 
      });

      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login";
      console.log('❌ Erro no login:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedAccount]);

  /**
   * Função de logout
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  /**
   * Atualizar dados do usuário
   */
  const refreshUser = async () => {
    if (!selectedAccount || !isAuthenticated) return;

    setIsLoading(true);
    try {
      const userData = await fetchUser(selectedAccount.address);
      setUser(userData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar usuário",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Atualizar perfil do usuário
   * Em um cenário real, isso chamaria uma API. Aqui, apenas atualiza o estado local.
   */
  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    console.log("Atualizando perfil com:", profileData);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular delay

    setUser((currentUser) => {
      if (!currentUser) return null;

      const updatedUser: User = {
        ...currentUser,
        profile: {
          ...currentUser.profile,
          ...profileData,
        },
        updatedAt: new Date(),
      };

      console.log("Novo estado do usuário:", updatedUser);
      return updatedUser;
    });
  };

  /**
   * Verificar se o usuário tem uma permissão específica
   */
  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      return hasPermission(user, permission);
    },
    [user],
  );

  /**
   * Verificar se o usuário tem um papel específico
   */
  const checkRole = useCallback(
    (role: UserRole): boolean => {
      return user?.role === role;
    },
    [user],
  );

  /**
   * Verificar se o usuário pode acessar uma funcionalidade
   */
  const canAccessFeatureCheck = useCallback(
    (feature: string): boolean => {
      if (!user || user.status === UserStatus.BANNED) return false;

      // Mapeamento de funcionalidades para permissões
      const featurePermissions: Record<string, Permission> = {
        invest: Permission.INVEST_IN_PROJECTS,
        stake: Permission.STAKE_TOKENS,
        raffle: Permission.PARTICIPATE_RAFFLE,
        "create-project": Permission.CREATE_PROJECT,
        "admin-panel": Permission.MANAGE_USERS,
        analytics: Permission.VIEW_ANALYTICS,
        "kyc-management": Permission.MANAGE_KYC,
      };

      const requiredPermission = featurePermissions[feature];
      return requiredPermission ? checkPermission(requiredPermission) : false;
    },
    [user, checkPermission],
  );

  // Auto-login quando carteira está pronta e conta selecionada
  useEffect(() => {
    if (isReady && selectedAccount && !isAuthenticated && !isLoading) {
      login();
    }
  }, [isReady, selectedAccount, isAuthenticated, isLoading, login]);

  // Logout quando carteira é desconectada
  useEffect(() => {
    if (!isReady || !selectedAccount) {
      logout();
    }
  }, [isReady, selectedAccount]);

  const value: AuthContextType = {
    // Dados do usuário
    user,
    isAuthenticated,
    isLoading,
    error,

    // Permissões e verificações
    permissions,
    hasPermission: checkPermission,
    hasRole: checkRole,
    canAccessFeature: canAccessFeatureCheck,

    // Métodos de autenticação
    login,
    logout,
    refreshUser,
    updateUserProfile,

    // Verificações específicas
    isVip,
    isVerified,
    isBanned,
    isAdmin,

    // Limites do usuário
    userLimits,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook principal para usar o contexto de autenticação
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Hook para verificar se o usuário tem uma permissão específica
 */
export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

/**
 * Hook para verificar se o usuário tem um papel específico
 */
export function useRole(role: UserRole): boolean {
  const { hasRole } = useAuth();
  return hasRole(role);
}

/**
 * Hook para verificar se o usuário é VIP
 */
export function useIsVip(): boolean {
  const { isVip } = useAuth();
  return isVip;
}

/**
 * Hook para verificar se o usuário é verificado (KYC)
 */
export function useIsVerified(): boolean {
  const { isVerified } = useAuth();
  return isVerified;
}

/**
 * Hook para verificar se o usuário está banido
 */
export function useIsBanned(): boolean {
  const { isBanned } = useAuth();
  return isBanned;
}

/**
 * Hook para verificar se o usuário é admin
 */
export function useIsAdmin(): boolean {
  const { isAdmin } = useAuth();
  return isAdmin;
}

/**
 * Hook para obter os limites do usuário
 */
export function useUserLimits(): UserLimits | null {
  const { userLimits } = useAuth();
  return userLimits;
}

/**
 * Hook para verificar se o usuário pode acessar uma funcionalidade
 */
export function useCanAccess(feature: string): boolean {
  const { canAccessFeature } = useAuth();
  return canAccessFeature(feature);
}
