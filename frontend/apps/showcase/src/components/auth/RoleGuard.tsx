import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/auth";

interface RoleGuardProps {
  /** Papéis necessários (todos devem ser atendidos) */
  roles?: UserRole[];
  /** Papéis alternativos (pelo menos um deve ser atendido) */
  anyRoles?: UserRole[];
  /** Componente a ser renderizado quando não há o papel necessário */
  fallback?: React.ReactNode;
  /** Se deve renderizar null quando não há o papel (padrão: false) */
  silent?: boolean;
  /** Filhos a serem renderizados quando há o papel correto */
  children: React.ReactNode;
}

/**
 * Componente para proteger conteúdo baseado em papéis específicos de usuário
 *
 * @example
 * // Requer papel específico
 * <RoleGuard roles={['ADMIN']}>
 *   <AdminPanel />
 * </RoleGuard>
 *
 * @example
 * // Requer pelo menos um dos papéis listados
 * <RoleGuard anyRoles={['INVESTOR_VIP', 'INVESTOR_VERIFIED']}>
 *   <PremiumFeatures />
 * </RoleGuard>
 *
 * @example
 * // Com fallback customizado
 * <RoleGuard
 *   roles={['PROJECT_ISSUER']}
 *   fallback={<div>Apenas emissores de projetos podem acessar esta área</div>}
 * >
 *   <ProjectManagement />
 * </RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  roles = [],
  anyRoles = [],
  fallback,
  silent = false,
  children,
}) => {
  const { user, hasRole } = useAuth();

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

  // Verifica se todos os papéis necessários são atendidos
  const hasAllRoles =
    roles.length === 0 || roles.every((role) => hasRole(role));

  // Verifica se pelo menos um dos papéis alternativos é atendido
  const hasAnyRole =
    anyRoles.length === 0 || anyRoles.some((role) => hasRole(role));

  // Se não atende aos critérios de papel
  if (!hasAllRoles || !hasAnyRole) {
    if (silent) {
      return null;
    }

    return (
      fallback || (
        <div className="text-center text-gray-500 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Acesso Restrito
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Você não tem o papel necessário para acessar este conteúdo.
                  </p>
                  <p className="mt-1">
                    <strong>Seu papel atual:</strong>{" "}
                    {getRoleDisplayName(user.role)}
                  </p>
                  {roles.length > 0 && (
                    <p className="mt-1">
                      <strong>Papéis necessários:</strong>{" "}
                      {roles.map(getRoleDisplayName).join(", ")}
                    </p>
                  )}
                  {anyRoles.length > 0 && (
                    <p className="mt-1">
                      <strong>Pelo menos um dos papéis:</strong>{" "}
                      {anyRoles.map(getRoleDisplayName).join(", ")}
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

/**
 * Converte o papel do usuário em um nome amigável para exibição
 */
function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    [UserRole.ADMIN]: "Administrador",
    [UserRole.PROJECT_ISSUER]: "Emissor de Projeto",
    [UserRole.INVESTOR_VIP]: "Investidor VIP",
    [UserRole.INVESTOR_VERIFIED]: "Investidor Verificado",
    [UserRole.INVESTOR_STANDARD]: "Investidor Padrão",
    [UserRole.USER_BANNED]: "Usuário Banido",
    [UserRole.PRICE_ORACLE]: "Oráculo de Preços",
  };

  return roleNames[role] || role;
}

export default RoleGuard;
