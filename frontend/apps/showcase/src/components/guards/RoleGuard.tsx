import type { ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { UserRole } from "../../types/auth";
import { CompactUnauthorizedAccess } from "../ui/UnauthorizedAccess";

/**
 * Props para o componente RoleGuard
 */
interface RoleGuardProps {
  children: ReactNode;
  /** Papéis permitidos */
  allowedRoles: UserRole[];
  /** Componente de fallback customizado */
  fallback?: ReactNode;
  /** Se verdadeiro, renderiza null em vez do fallback quando não autorizado */
  hideOnUnauthorized?: boolean;
  /** Modo de verificação: 'any' permite qualquer papel da lista, 'all' requer todos */
  mode?: "any" | "all";
}

/**
 * Componente para proteção baseada em papéis de usuário
 * Mais leve que ProtectedRoute, ideal para renderização condicional
 *
 * Funcionalidades:
 * - Verificação de papéis múltiplos
 * - Modos de verificação flexíveis
 * - Fallbacks customizáveis
 * - Renderização condicional
 *
 * @example
 * ```tsx
 * // Permitir apenas administradores
 * <RoleGuard allowedRoles={[UserRole.ADMIN]}>
 *   <AdminPanel />
 * </RoleGuard>
 *
 * // Permitir múltiplos papéis
 * <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_ISSUER]}>
 *   <ProjectManagement />
 * </RoleGuard>
 *
 * // Ocultar completamente se não autorizado
 * <RoleGuard
 *   allowedRoles={[UserRole.VIP_INVESTOR]}
 *   hideOnUnauthorized={true}
 * >
 *   <VipFeatures />
 * </RoleGuard>
 *
 * // Fallback customizado
 * <RoleGuard
 *   allowedRoles={[UserRole.ADMIN]}
 *   fallback={<div>Acesso restrito a administradores</div>}
 * >
 *   <AdminSettings />
 * </RoleGuard>
 * ```
 */
export const RoleGuard = ({
  children,
  allowedRoles,
  fallback,
  hideOnUnauthorized = false,
  mode = "any",
}: RoleGuardProps) => {
  const { user, isAuthenticated, isLoading, hasRole, isBanned } = useAuth();

  // Ainda carregando
  if (isLoading) {
    return null;
  }

  // Usuário não autenticado
  if (!isAuthenticated || !user) {
    if (hideOnUnauthorized) {
      return null;
    }
    return (
      fallback || (
        <CompactUnauthorizedAccess
          title="Login Necessário"
          message="Faça login para acessar esta funcionalidade."
          actionButton={{
            text: "Fazer Login",
            href: "/login",
          }}
        />
      )
    );
  }

  // Usuário banido
  if (isBanned) {
    if (hideOnUnauthorized) {
      return null;
    }
    return (
      fallback || (
        <CompactUnauthorizedAccess
          title="Conta Suspensa"
          message="Sua conta foi suspensa. Entre em contato com o suporte."
        />
      )
    );
  }

  // Verificar papéis baseado no modo
  const hasRequiredRole =
    mode === "all"
      ? allowedRoles.every((role) => hasRole(role))
      : allowedRoles.some((role) => hasRole(role));

  if (!hasRequiredRole) {
    if (hideOnUnauthorized) {
      return null;
    }
    return (
      fallback || (
        <CompactUnauthorizedAccess
          title="Acesso Restrito"
          message={`Esta funcionalidade é restrita a: ${allowedRoles.join(", ")}`}
        />
      )
    );
  }

  // Usuário autorizado
  return <>{children}</>;
};

/**
 * Hook para verificar se o usuário atual possui determinados papéis
 * Útil para renderização condicional mais granular
 */
export const useRoleCheck = (
  roles: UserRole[],
  mode: "any" | "all" = "any",
) => {
  const { hasRole, isAuthenticated, isLoading, isBanned } = useAuth();

  if (isLoading || !isAuthenticated || isBanned) {
    return {
      hasRole: false,
      isLoading,
      isAuthenticated,
      isBanned,
    };
  }

  const hasRequiredRole =
    mode === "all"
      ? roles.every((role) => hasRole(role))
      : roles.some((role) => hasRole(role));

  return {
    hasRole: hasRequiredRole,
    isLoading: false,
    isAuthenticated: true,
    isBanned: false,
  };
};

/**
 * Componente para renderização condicional baseada em papel
 * Alternativa mais simples ao RoleGuard para casos básicos
 */
export const RoleBasedRender = ({
  roles,
  children,
  mode = "any",
}: {
  roles: UserRole[];
  children: ReactNode;
  mode?: "any" | "all";
}) => {
  const { hasRole: hasRequiredRole } = useRoleCheck(roles, mode);

  return hasRequiredRole ? <>{children}</> : null;
};

/**
 * Componente para exibir conteúdo diferente baseado no papel do usuário
 */
export const RoleSwitch = ({
  cases,
  defaultCase,
}: {
  cases: Array<{
    roles: UserRole[];
    component: ReactNode;
    mode?: "any" | "all";
  }>;
  defaultCase?: ReactNode;
}) => {
  const { hasRole, isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return defaultCase || null;
  }

  // Encontrar o primeiro caso que corresponde aos papéis do usuário
  for (const { roles, component, mode = "any" } of cases) {
    const hasRequiredRole =
      mode === "all"
        ? roles.every((role) => hasRole(role))
        : roles.some((role) => hasRole(role));

    if (hasRequiredRole) {
      return <>{component}</>;
    }
  }

  return defaultCase || null;
};
