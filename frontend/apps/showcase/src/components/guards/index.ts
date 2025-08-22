/**
 * Sistema de Guards de Segurança
 *
 * Este módulo fornece componentes e hooks para proteção de rotas e funcionalidades
 * baseados em autenticação, papéis de usuário e permissões específicas.
 *
 * Componentes principais:
 * - ProtectedRoute: Proteção completa de rotas com múltiplas validações
 * - RoleGuard: Proteção baseada em papéis de usuário
 * - PermissionGuard: Proteção baseada em permissões específicas
 *
 * Hooks utilitários:
 * - useRouteAccess: Verificar acesso a rotas
 * - useRoleCheck: Verificar papéis do usuário
 * - usePermissionCheck: Verificar permissões do usuário
 *
 * Componentes auxiliares:
 * - RoleBasedRender: Renderização condicional por papel
 * - PermissionBasedRender: Renderização condicional por permissão
 * - RoleSwitch/PermissionSwitch: Renderização baseada em múltiplas condições
 * - HybridGuard: Proteção híbrida (papéis + permissões)
 */

// Componentes principais de proteção
export { ProtectedRoute, useRouteAccess } from "./ProtectedRoute";
export {
  RoleGuard,
  useRoleCheck,
  RoleBasedRender,
  RoleSwitch,
} from "./RoleGuard";
export {
  PermissionGuard,
  usePermissionCheck,
  PermissionBasedRender,
  PermissionSwitch,
  HybridGuard,
} from "./PermissionGuard";

// Re-exportar componentes UI relacionados
export {
  LoadingSpinner,
  FullScreenLoader,
  ButtonSpinner,
} from "../ui/LoadingSpinner";
export {
  UnauthorizedAccess,
  CompactUnauthorizedAccess,
} from "../ui/UnauthorizedAccess";

/**
 * Tipos e interfaces para os Guards
 * Os tipos específicos estão definidos nos respectivos arquivos
 * e podem ser importados diretamente se necessário
 */

/**
 * Utilitários e constantes
 */
export const GUARD_REASONS = {
  LOADING: "loading",
  NOT_AUTHENTICATED: "not_authenticated",
  BANNED: "banned",
  KYC_REQUIRED: "kyc_required",
  VIP_REQUIRED: "vip_required",
  INSUFFICIENT_ROLE: "insufficient_role",
  INSUFFICIENT_PERMISSIONS: "insufficient_permissions",
  USER_DATA_ERROR: "user_data_error",
  PUBLIC_ACCESS: "public_access",
  AUTHORIZED: "authorized",
} as const;

export type GuardReason = (typeof GUARD_REASONS)[keyof typeof GUARD_REASONS];

/**
 * Configurações padrão para os Guards
 */
export const GUARD_DEFAULTS = {
  REDIRECT_TO: "/login",
  SUPPORT_LINK: "/support",
  KYC_LINK: "/kyc",
  VIP_UPGRADE_LINK: "/upgrade-vip",
  DASHBOARD_LINK: "/dashboard",
} as const;

/**
 * Mensagens padrão para diferentes cenários
 */
export const GUARD_MESSAGES = {
  LOGIN_REQUIRED: "Faça login para acessar esta funcionalidade.",
  ACCOUNT_SUSPENDED: "Sua conta foi suspensa. Entre em contato com o suporte.",
  KYC_REQUIRED: "Esta funcionalidade requer verificação KYC completa.",
  VIP_REQUIRED: "Esta funcionalidade é exclusiva para usuários VIP.",
  INSUFFICIENT_ROLE:
    "Você não possui o papel necessário para acessar esta funcionalidade.",
  INSUFFICIENT_PERMISSIONS:
    "Você não possui as permissões necessárias para acessar esta funcionalidade.",
  ACCESS_DENIED: "Acesso negado.",
  USER_DATA_ERROR: "Não foi possível carregar os dados do usuário.",
} as const;
