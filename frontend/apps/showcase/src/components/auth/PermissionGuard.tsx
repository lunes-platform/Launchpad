import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Permission } from "../../types/auth";

interface PermissionGuardProps {
  /** Permissões necessárias (todas devem ser atendidas) */
  permissions?: Permission[];
  /** Permissões alternativas (pelo menos uma deve ser atendida) */
  anyPermissions?: Permission[];
  /** Componente a ser renderizado quando não há permissão */
  fallback?: React.ReactNode;
  /** Se deve renderizar null quando não há permissão (padrão: false) */
  silent?: boolean;
  /** Filhos a serem renderizados quando há permissão */
  children: React.ReactNode;
}

/**
 * Componente para proteger conteúdo baseado em permissões específicas
 *
 * @example
 * // Requer todas as permissões listadas
 * <PermissionGuard permissions={['MANAGE_USERS', 'VIEW_ANALYTICS']}>
 *   <AdminPanel />
 * </PermissionGuard>
 *
 * @example
 * // Requer pelo menos uma das permissões listadas
 * <PermissionGuard anyPermissions={['INVEST_PRESALE', 'INVEST_WHITELIST']}>
 *   <InvestmentButton />
 * </PermissionGuard>
 *
 * @example
 * // Com fallback customizado
 * <PermissionGuard
 *   permissions={['MANAGE_PROJECTS']}
 *   fallback={<div>Você não tem permissão para gerenciar projetos</div>}
 * >
 *   <ProjectManagement />
 * </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permissions = [],
  anyPermissions = [],
  fallback,
  silent = false,
  children,
}) => {
  const { user, hasPermission } = useAuth();

  // Se não há usuário autenticado, não renderiza nada
  if (!user) {
    return silent
      ? null
      : fallback || (
          <div className="text-center text-gray-500 py-4">
            Você precisa estar logado para acessar este conteúdo.
          </div>
        );
  }

  // Verifica se todas as permissões necessárias são atendidas
  const hasAllPermissions =
    permissions.length === 0 ||
    permissions.every((permission) => hasPermission(permission));

  // Verifica se pelo menos uma das permissões alternativas é atendida
  const hasAnyPermission =
    anyPermissions.length === 0 ||
    anyPermissions.some((permission) => hasPermission(permission));

  // Se não atende aos critérios de permissão
  if (!hasAllPermissions || !hasAnyPermission) {
    if (silent) {
      return null;
    }

    return (
      fallback || (
        <div className="text-center text-gray-500 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Permissão Insuficiente
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Você não tem as permissões necessárias para acessar este
                    conteúdo.
                  </p>
                  {permissions.length > 0 && (
                    <p className="mt-1">
                      <strong>Permissões necessárias:</strong>{" "}
                      {permissions.join(", ")}
                    </p>
                  )}
                  {anyPermissions.length > 0 && (
                    <p className="mt-1">
                      <strong>Pelo menos uma das permissões:</strong>{" "}
                      {anyPermissions.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
