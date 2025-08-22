import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { UserRole, Permission } from "../../types/auth";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { UnauthorizedAccess } from "../ui/UnauthorizedAccess";

/**
 * Props para o componente ProtectedRoute
 */
interface ProtectedRouteProps {
  children: ReactNode;
  /** Papéis permitidos para acessar a rota */
  allowedRoles?: UserRole[];
  /** Permissões específicas necessárias */
  requiredPermissions?: Permission[];
  /** Se verdadeiro, requer que o usuário esteja autenticado */
  requireAuth?: boolean;
  /** Se verdadeiro, requer verificação KYC */
  requireKyc?: boolean;
  /** Se verdadeiro, requer status VIP */
  requireVip?: boolean;
  /** Rota de redirecionamento para usuários não autenticados */
  redirectTo?: string;
  /** Componente customizado para exibir quando não autorizado */
  fallbackComponent?: ReactNode;
}

/**
 * Componente de proteção de rotas com validações de segurança robustas
 *
 * Funcionalidades:
 * - Validação de autenticação
 * - Verificação de papéis de usuário
 * - Validação de permissões específicas
 * - Verificação de status KYC e VIP
 * - Redirecionamento seguro
 * - Fallbacks customizáveis
 *
 * @example
 * ```tsx
 * // Proteger rota apenas para administradores
 * <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
 *   <AdminDashboard />
 * </ProtectedRoute>
 *
 * // Proteger com permissões específicas
 * <ProtectedRoute requiredPermissions={['canManageUsers', 'canViewAnalytics']}>
 *   <UserManagement />
 * </ProtectedRoute>
 *
 * // Proteger com múltiplas validações
 * <ProtectedRoute
 *   allowedRoles={[UserRole.VIP_INVESTOR]}
 *   requireKyc={true}
 *   requireVip={true}
 * >
 *   <VipFeatures />
 * </ProtectedRoute>
 * ```
 */
export const ProtectedRoute = ({
  children,
  allowedRoles,
  requiredPermissions,
  requireAuth = true,
  requireKyc = false,
  requireVip = false,
  redirectTo = "/login",
  fallbackComponent,
}: ProtectedRouteProps) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    hasPermission,
    isVerified,
    isVip,
    isBanned,
  } = useAuth();
  const location = useLocation();

  // Exibir loading enquanto carrega dados de autenticação
  if (isLoading) {
    return <LoadingSpinner message="Verificando permissões..." />;
  }

  // Verificar se usuário está banido
  if (user && isBanned) {
    return (
      <UnauthorizedAccess
        title="Acesso Suspenso"
        message="Sua conta foi suspensa. Entre em contato com o suporte."
        showContactSupport={true}
      />
    );
  }

  // Verificar autenticação se necessária
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  // Se não requer autenticação e usuário não está logado, permitir acesso
  if (!requireAuth && !isAuthenticated) {
    return <>{children}</>;
  }

  // A partir daqui, usuário está autenticado
  if (!user) {
    return (
      <UnauthorizedAccess
        title="Erro de Autenticação"
        message="Não foi possível carregar os dados do usuário."
      />
    );
  }

  // Verificar KYC se necessário
  if (requireKyc && !isVerified) {
    return (
      fallbackComponent || (
        <UnauthorizedAccess
          title="Verificação KYC Necessária"
          message="Esta funcionalidade requer verificação KYC completa."
          actionButton={{
            text: "Completar KYC",
            href: "/kyc",
          }}
        />
      )
    );
  }

  // Verificar status VIP se necessário
  if (requireVip && !isVip) {
    return (
      fallbackComponent || (
        <UnauthorizedAccess
          title="Acesso VIP Necessário"
          message="Esta funcionalidade é exclusiva para usuários VIP."
          actionButton={{
            text: "Tornar-se VIP",
            href: "/upgrade-vip",
          }}
        />
      )
    );
  }

  // Verificar papéis permitidos
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some((role) => hasRole(role));
    if (!hasAllowedRole) {
      return (
        fallbackComponent || (
          <UnauthorizedAccess
            title="Acesso Negado"
            message="Você não possui o papel necessário para acessar esta funcionalidade."
          />
        )
      );
    }
  }

  // Verificar permissões específicas
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((permission) =>
      hasPermission(permission),
    );
    if (!hasAllPermissions) {
      return (
        fallbackComponent || (
          <UnauthorizedAccess
            title="Permissões Insuficientes"
            message="Você não possui as permissões necessárias para acessar esta funcionalidade."
          />
        )
      );
    }
  }

  // Todas as validações passaram, renderizar conteúdo protegido
  return <>{children}</>;
};

/**
 * Hook para verificar se o usuário atual pode acessar uma rota
 * Útil para renderização condicional de elementos da UI
 */
export const useRouteAccess = ({
  allowedRoles,
  requiredPermissions,
  requireAuth = true,
  requireKyc = false,
  requireVip = false,
}: Omit<
  ProtectedRouteProps,
  "children" | "redirectTo" | "fallbackComponent"
>) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    hasPermission,
    isVerified,
    isVip,
    isBanned,
  } = useAuth();

  // Se ainda está carregando, não permitir acesso
  if (isLoading) {
    return { canAccess: false, isLoading: true, reason: "loading" };
  }

  // Usuário banido nunca tem acesso
  if (user && isBanned) {
    return { canAccess: false, isLoading: false, reason: "banned" };
  }

  // Verificar autenticação
  if (requireAuth && !isAuthenticated) {
    return { canAccess: false, isLoading: false, reason: "not_authenticated" };
  }

  // Se não requer autenticação e usuário não está logado
  if (!requireAuth && !isAuthenticated) {
    return { canAccess: true, isLoading: false, reason: "public_access" };
  }

  // A partir daqui, usuário deve estar autenticado
  if (!user) {
    return { canAccess: false, isLoading: false, reason: "user_data_error" };
  }

  // Verificar KYC
  if (requireKyc && !isVerified) {
    return { canAccess: false, isLoading: false, reason: "kyc_required" };
  }

  // Verificar VIP
  if (requireVip && !isVip) {
    return { canAccess: false, isLoading: false, reason: "vip_required" };
  }

  // Verificar papéis
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some((role) => hasRole(role));
    if (!hasAllowedRole) {
      return {
        canAccess: false,
        isLoading: false,
        reason: "insufficient_role",
      };
    }
  }

  // Verificar permissões
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((permission) =>
      hasPermission(permission),
    );
    if (!hasAllPermissions) {
      return {
        canAccess: false,
        isLoading: false,
        reason: "insufficient_permissions",
      };
    }
  }

  return { canAccess: true, isLoading: false, reason: "authorized" };
};
