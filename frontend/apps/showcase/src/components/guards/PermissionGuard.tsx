import type { ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { Permission } from "../../types/auth";
import { CompactUnauthorizedAccess } from "../ui/UnauthorizedAccess";

/**
 * Props para o componente PermissionGuard
 */
interface PermissionGuardProps {
  children: ReactNode;
  /** Permissões necessárias */
  permissions: Permission[];
  /** Componente de fallback customizado */
  fallback?: ReactNode;
  /** Se verdadeiro, renderiza null em vez do fallback quando não autorizado */
  hideOnUnauthorized?: boolean;
  /** Modo de verificação: 'any' permite qualquer permissão da lista, 'all' requer todas */
  mode?: "any" | "all";
  /** Contexto adicional para a verificação de permissão */
  context?: Record<string, any>;
}

/**
 * Componente para proteção baseada em permissões específicas
 * Mais granular que RoleGuard, ideal para funcionalidades específicas
 *
 * Funcionalidades:
 * - Verificação de permissões múltiplas
 * - Modos de verificação flexíveis
 * - Contexto adicional para validações
 * - Fallbacks customizáveis
 *
 * @example
 * ```tsx
 * // Verificar permissão única
 * <PermissionGuard permissions={['canManageUsers']}>
 *   <UserManagement />
 * </PermissionGuard>
 *
 * // Verificar múltiplas permissões (qualquer uma)
 * <PermissionGuard
 *   permissions={['canViewAnalytics', 'canExportData']}
 *   mode="any"
 * >
 *   <AnalyticsDashboard />
 * </PermissionGuard>
 *
 * // Verificar múltiplas permissões (todas necessárias)
 * <PermissionGuard
 *   permissions={['canManageProjects', 'canApproveProjects']}
 *   mode="all"
 * >
 *   <ProjectApproval />
 * </PermissionGuard>
 *
 * // Ocultar se não autorizado
 * <PermissionGuard
 *   permissions={['canAccessVipFeatures']}
 *   hideOnUnauthorized={true}
 * >
 *   <VipOnlyButton />
 * </PermissionGuard>
 * ```
 */
export const PermissionGuard = ({
  children,
  permissions,
  fallback,
  hideOnUnauthorized = false,
  mode = "all",
}: PermissionGuardProps) => {
  const { user, isAuthenticated, isLoading, hasPermission, isBanned } =
    useAuth();

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

  // Verificar permissões baseado no modo
  const hasRequiredPermissions =
    mode === "all"
      ? permissions.every((permission) => hasPermission(permission))
      : permissions.some((permission) => hasPermission(permission));

  if (!hasRequiredPermissions) {
    if (hideOnUnauthorized) {
      return null;
    }
    return (
      fallback || (
        <CompactUnauthorizedAccess
          title="Permissões Insuficientes"
          message={`Esta funcionalidade requer as seguintes permissões: ${permissions.join(", ")}`}
        />
      )
    );
  }

  // Usuário autorizado
  return <>{children}</>;
};

/**
 * Hook para verificar se o usuário atual possui determinadas permissões
 * Útil para renderização condicional mais granular
 */
export const usePermissionCheck = (
  permissions: Permission[],
  mode: "any" | "all" = "all",
) => {
  const { hasPermission, isAuthenticated, isLoading, isBanned } = useAuth();

  if (isLoading || !isAuthenticated || isBanned) {
    return {
      hasPermission: false,
      isLoading,
      isAuthenticated,
      isBanned,
    };
  }

  const hasRequiredPermissions =
    mode === "all"
      ? permissions.every((permission) => hasPermission(permission))
      : permissions.some((permission) => hasPermission(permission));

  return {
    hasPermission: hasRequiredPermissions,
    isLoading: false,
    isAuthenticated: true,
    isBanned: false,
  };
};

/**
 * Componente para renderização condicional baseada em permissões
 * Alternativa mais simples ao PermissionGuard para casos básicos
 */
export const PermissionBasedRender = ({
  permissions,
  children,
  mode = "all",
  context,
}: {
  permissions: Permission[];
  children: ReactNode;
  mode?: "any" | "all";
  context?: Record<string, any>;
}) => {
  const { hasPermission: hasRequiredPermissions } = usePermissionCheck(
    permissions,
    mode,
  );

  return hasRequiredPermissions ? <>{children}</> : null;
};

/**
 * Componente para exibir conteúdo diferente baseado nas permissões do usuário
 */
export const PermissionSwitch = ({
  cases,
  defaultCase,
}: {
  cases: Array<{
    permissions: Permission[];
    component: ReactNode;
    mode?: "any" | "all";
    context?: Record<string, any>;
  }>;
  defaultCase?: ReactNode;
}) => {
  const { hasPermission, isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return defaultCase || null;
  }

  // Encontrar o primeiro caso que corresponde às permissões do usuário
  for (const { permissions, component, mode = "all" } of cases) {
    const hasRequiredPermissions =
      mode === "all"
        ? permissions.every((permission) => hasPermission(permission))
        : permissions.some((permission) => hasPermission(permission));

    if (hasRequiredPermissions) {
      return <>{component}</>;
    }
  }

  return defaultCase || null;
};

/**
 * Componente híbrido que combina verificação de papéis e permissões
 */
export const HybridGuard = ({
  children,
  roles,
  permissions,
  roleMode = "any",
  permissionMode = "all",
  requireBoth = false,
  fallback,
  hideOnUnauthorized = false,
}: {
  children: ReactNode;
  roles?: string[];
  permissions?: Permission[];
  roleMode?: "any" | "all";
  permissionMode?: "any" | "all";
  requireBoth?: boolean;
  fallback?: ReactNode;
  hideOnUnauthorized?: boolean;
}) => {
  const { hasRole, hasPermission, isAuthenticated, isLoading, isBanned } =
    useAuth();

  if (isLoading || !isAuthenticated || isBanned) {
    return hideOnUnauthorized ? null : fallback || null;
  }

  let hasRoleAccess = true;
  let hasPermissionAccess = true;

  // Verificar papéis se fornecidos
  if (roles && roles.length > 0) {
    hasRoleAccess =
      roleMode === "all"
        ? roles.every((role) => hasRole(role as any))
        : roles.some((role) => hasRole(role as any));
  }

  // Verificar permissões se fornecidas
  if (permissions && permissions.length > 0) {
    hasPermissionAccess =
      permissionMode === "all"
        ? permissions.every((permission) => hasPermission(permission))
        : permissions.some((permission) => hasPermission(permission));
  }

  // Determinar acesso baseado no modo
  const hasAccess = requireBoth
    ? hasRoleAccess && hasPermissionAccess
    : hasRoleAccess || hasPermissionAccess;

  if (!hasAccess) {
    if (hideOnUnauthorized) {
      return null;
    }
    return (
      fallback || (
        <CompactUnauthorizedAccess
          title="Acesso Negado"
          message="Você não possui as credenciais necessárias para esta funcionalidade."
        />
      )
    );
  }

  return <>{children}</>;
};
