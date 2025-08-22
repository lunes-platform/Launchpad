import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Permission, UserRole } from "../../types/auth";
import { Card } from "@launchpad/shared-ui";
import { AlertTriangle, Lock } from "lucide-react";

interface ProtectedRouteProps {
  /** Permissão específica necessária para acessar a rota */
  permission?: Permission;
  /** Papel de usuário necessário para acessar a rota */
  requiredRole?: UserRole;
  /** Lista de papéis permitidos */
  allowedRoles?: UserRole[];
  /** Se true, permite acesso apenas para usuários verificados (KYC) */
  requiresKyc?: boolean;
  /** Se true, permite acesso apenas para usuários não banidos */
  requiresNotBanned?: boolean;
  /** Rota para redirecionamento em caso de acesso negado */
  redirectTo?: string;
  /** Componente customizado para exibir quando acesso é negado */
  fallback?: React.ReactNode;
}

/**
 * Componente de proteção de rotas que valida permissões, papéis e status do usuário
 *
 * @example
 * ```tsx
 * // Proteger rota por permissão específica
 * <Route element={<ProtectedRoute permission={Permission.MANAGE_PROJECTS} />}>
 *   <Route path="/admin/projects" element={<AdminProjectsPage />} />
 * </Route>
 *
 * // Proteger rota por papel de usuário
 * <Route element={<ProtectedRoute requiredRole={UserRole.ADMIN} />}>
 *    <Route path="/admin" element={<AdminDashboard />} />
 * </Route>
 *
 * // Proteger rota por múltiplos papéis
 * <Route element={<ProtectedRoute allowedRoles={[UserRole.VIP_INVESTOR, UserRole.VERIFIED_INVESTOR]} />}>
 *   <Route path="/premium" element={<PremiumFeatures />} />
 * </Route>
 *
 * // Proteger rota que requer KYC
 * <Route element={<ProtectedRoute requiresKyc />}>
 *   <Route path="/invest" element={<InvestmentPage />} />
 * </Route>
 * ```
 */
export function ProtectedRoute({
  permission,
  requiredRole,
  allowedRoles,
  requiresKyc = false,
  requiresNotBanned = true,
  redirectTo,
  fallback,
}: ProtectedRouteProps) {
  // IMPORTANTE: Todos os hooks devem ser chamados antes de qualquer return condicional
  const { user, isAuthenticated, hasPermission, isLoading } = useAuth();
  const location = useLocation();

  // Aguarda carregamento da autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-azul"></div>
      </div>
    );
  }

  // Usuário não autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificação de banimento
  if (requiresNotBanned && user.status === "BANNED") {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md p-6 text-center border-l-4 border-l-red-500">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-grafite mb-2">
              Acesso Negado
            </h2>
            <p className="text-gray-600 mb-4">
              Sua conta foi suspensa. Entre em contato com o suporte para mais
              informações.
            </p>
          </Card>
        </div>
      )
    );
  }

  // Verificação de KYC
  if (requiresKyc && user.kycStatus !== "APPROVED") {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md p-6 text-center border-l-4 border-l-laranja">
            <div className="w-16 h-16 bg-laranja-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-laranja" />
            </div>
            <h2 className="text-xl font-bold text-grafite mb-2">
              Verificação Necessária
            </h2>
            <p className="text-gray-600 mb-4">
              Esta funcionalidade requer verificação KYC. Complete seu processo
              de verificação para continuar.
            </p>
            <Navigate to="/kyc" state={{ from: location }} replace />
          </Card>
        </div>
      )
    );
  }

  // Verificação de permissão específica
  if (permission && !hasPermission(permission)) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md p-6 text-center border-l-4 border-l-red-500">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-grafite mb-2">
              Permissão Insuficiente
            </h2>
            <p className="text-gray-600 mb-4">
              Você não possui permissão para acessar esta funcionalidade.
            </p>
          </Card>
        </div>
      )
    );
  }

  // Verificação de papel específico
  if (requiredRole && user.role !== requiredRole) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md p-6 text-center border-l-4 border-l-red-500">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-grafite mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 mb-4">
              Esta área é restrita para usuários com papel específico.
            </p>
          </Card>
        </div>
      )
    );
  }

  // Verificação de papéis permitidos
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md p-6 text-center border-l-4 border-l-red-500">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-grafite mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 mb-4">
              Esta funcionalidade não está disponível para seu tipo de conta.
            </p>
          </Card>
        </div>
      )
    );
  }

  // Todas as verificações passaram, renderizar conteúdo protegido
  return <Outlet />;
}

export default ProtectedRoute;
