import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
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
import { authApiService, handleAuthApiError } from "../services/authApi.service";

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
 * Implementa fluxo Web3 real com nonce, assinatura criptográfica e verificação no backend
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { isReady, selectedAccount, injector } = useWallet();

  // Estados principais
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref para evitar múltiplas tentativas de login simultâneas
  const loginAttemptRef = useRef(false);
  // Ref para marcar se auto-login já foi tentado nesta sessão
  const autoLoginAttemptedRef = useRef(false);

  // Estados derivados
  const permissions = user ? ROLE_PERMISSIONS[user.role] : [];
  const userLimits = user ? getUserLimits(user) : null;
  const isVip = isVipUser(user);
  const isVerified = isVerifiedUser(user);
  const isBanned = user?.status === UserStatus.BANNED;
  const isAdmin = isAdminUser(user);

  /**
   * Assina uma mensagem usando a extensão da carteira
   */
  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!selectedAccount || !injector?.signer?.signRaw) {
      throw new Error("Carteira não conectada ou signer não disponível");
    }

    try {
      // Converte a mensagem para hex string
      const messageHex = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
      
      // Assina a mensagem usando signRaw
      const signature = await injector.signer.signRaw({
        address: selectedAccount.address,
        data: messageHex,
        type: 'bytes'
      });

      return signature.signature;
    } catch (error) {
      console.error('Erro ao assinar mensagem:', error);
      throw new Error('Falha ao assinar mensagem');
    }
  }, [selectedAccount, injector]);

  /**
   * Converte dados do backend para o formato User local
   */
  const convertBackendUserToLocal = useCallback((backendUser: any): User => {
    // Determinar papel baseado no endereço (simulação para desenvolvimento)
    let role = UserRole.INVESTOR_STANDARD as UserRole;
    let status = UserStatus.ACTIVE as UserStatus;
    let kycStatus = KYCStatus.PENDING as KYCStatus;

    const walletAddress = backendUser.walletAddress;

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
      displayName: backendUser.displayName || `User ${walletAddress.slice(-6)}`,
      avatar: backendUser.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${walletAddress}`,
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
    const localUser: User = {
      id: backendUser.id || `user_${walletAddress.slice(-8)}`,
      walletAddress,
      role,
      status,
      kycStatus,
      createdAt: new Date(backendUser.createdAt || Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(backendUser.updatedAt || Date.now()),
      profile,
      limits: DEFAULT_LIMITS[role as UserRole],
      metrics,
    };

    return localUser;
  }, []);

  /**
   * Função de login que implementa o fluxo Web3 real
   */
  const login = useCallback(async () => {
    // Evitar múltiplas tentativas simultâneas
    if (loginAttemptRef.current) {
      console.log('⏳ Login já em andamento, ignorando nova tentativa');
      return;
    }
    
    console.log('🔐 Login Web3 iniciado:', { selectedAccount: selectedAccount?.address });
    
    if (!selectedAccount) {
      console.log('❌ Login falhou: Nenhuma conta selecionada');
      setError("Nenhuma conta selecionada");
      return;
    }

    loginAttemptRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // 1. Gerar nonce no backend
      console.log('🎲 Gerando nonce...');
      const nonceResponse = await authApiService.generateNonce(selectedAccount.address);
      console.log('✅ Nonce gerado:', nonceResponse.nonce);

      // 2. Criar mensagem para assinatura
      const message = `Lunes Launchpad Login\nNonce: ${nonceResponse.nonce}\nTimestamp: ${nonceResponse.timestamp}`;
      console.log('📝 Mensagem para assinatura:', message);

      // 3. Assinar mensagem com a carteira
      console.log('✍️ Assinando mensagem...');
      const signature = await signMessage(message);
      console.log('✅ Mensagem assinada:', signature.slice(0, 20) + '...');

      // 4. Enviar para o backend para verificação
      console.log('🔍 Verificando assinatura no backend...');
      const loginResponse = await authApiService.login({
        walletAddress: selectedAccount.address,
        signature,
        message,
        timestamp: nonceResponse.timestamp
      });

      console.log('✅ Resposta de login recebida:', loginResponse);

      // Validar resposta
      if (!loginResponse || !loginResponse.user) {
        throw new Error('Resposta de login inválida: dados do usuário ausentes');
      }

      // 5. Armazenar tokens
      authApiService.tokenManager.saveTokens(
        loginResponse.accessToken,
        loginResponse.refreshToken
      );

      // 6. Converter dados do backend para formato local
      const userData = convertBackendUserToLocal(loginResponse.user);
      console.log('✅ Usuário autenticado:', { 
        address: userData.walletAddress, 
        role: userData.role,
        status: userData.status 
      });

      setUser(userData);
      setIsAuthenticated(true);
      console.log('✅ Login completamente bem-sucedido! User:', userData.walletAddress, '| isAuthenticated:', true);
    } catch (err) {
      const errorMessage = handleAuthApiError(err);
      console.log('❌ Erro no login Web3:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      loginAttemptRef.current = false;
    }
  }, [selectedAccount, signMessage, convertBackendUserToLocal]);

  /**
   * Função de logout
   */
  const logout = useCallback(async () => {
    try {
      // Logout no backend se autenticado
      if (isAuthenticated) {
        await authApiService.logout();
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar estado local sempre
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      authApiService.tokenManager.clearTokens();
      console.log('🔌 Logout realizado');
    }
  }, [isAuthenticated]);

  /**
   * Atualizar dados do usuário
   */
  const refreshUser = useCallback(async () => {
    if (!selectedAccount || !isAuthenticated) return;

    setIsLoading(true);
    try {
      const userProfile = await authApiService.getProfile();
      const userData = convertBackendUserToLocal(userProfile);
      setUser(userData);
    } catch (err) {
      setError(handleAuthApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [selectedAccount, isAuthenticated, convertBackendUserToLocal]);

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

  // Auto-login quando carteira está pronta e conta selecionada (apenas UMA vez por sessão)
  useEffect(() => {
    // Condições para auto-login:
    // 1. Carteira pronta e conta selecionada
    // 2. Injector disponível (necessário para assinar)
    // 3. Não está autenticado
    // 4. Não está carregando
    // 5. Não está tentando login no momento
    // 6. Nunca tentou auto-login nesta sessão
    if (
      isReady && 
      selectedAccount && 
      injector &&  // ← IMPORTANTE: Garantir que injector está disponível
      injector.signer &&
      injector.signer.signRaw &&
      !isAuthenticated && 
      !isLoading && 
      !loginAttemptRef.current &&
      !autoLoginAttemptedRef.current
    ) {
      console.log('🔄 Tentando auto-login (primeira vez)...', {
        address: selectedAccount.address,
        hasInjector: !!injector,
        hasSigner: !!injector?.signer,
        hasSignRaw: !!injector?.signer?.signRaw,
        isAuthenticated,
        isLoading
      });
      autoLoginAttemptedRef.current = true; // Marca que já tentou
      login();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, selectedAccount, injector]);

  // Logout quando carteira é desconectada
  useEffect(() => {
    if (!isReady || !selectedAccount) {
      autoLoginAttemptedRef.current = false; // Reseta flag para permitir novo auto-login
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
