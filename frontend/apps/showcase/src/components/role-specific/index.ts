/**
 * Componentes específicos por papel de usuário
 *
 * Este módulo exporta componentes especializados para diferentes papéis
 * de usuário na plataforma, garantindo funcionalidades exclusivas e
 * experiências personalizadas.
 */

// Componente para funcionalidades administrativas
export { default as AdminPanel } from "./AdminPanel";

// Componente para funcionalidades VIP exclusivas
export { default as VipFeatures } from "./VipFeatures";

// Componente para gestão de projetos (emissores)
export { default as ProjectManagement } from "./ProjectManagement";

// Importações para o mapeamento
import AdminPanel from "./AdminPanel";
import VipFeatures from "./VipFeatures";
import ProjectManagement from "./ProjectManagement";

/**
 * Mapeamento de componentes por papel de usuário
 * Facilita a seleção dinâmica de componentes baseada no papel
 */
export const ROLE_COMPONENTS = {
  admin: AdminPanel,
  vip: VipFeatures,
  project: ProjectManagement,
} as const;

/**
 * Tipos de papéis suportados pelos componentes específicos
 */
export type SupportedRole = keyof typeof ROLE_COMPONENTS;

/**
 * Utilitário para obter o componente apropriado baseado no papel
 * @param role - Papel do usuário
 * @returns Componente React correspondente ao papel
 */
export function getRoleComponent(role: SupportedRole) {
  return ROLE_COMPONENTS[role];
}

/**
 * Verifica se um papel possui componente específico
 * @param role - Papel a ser verificado
 * @returns true se o papel possui componente específico
 */
export function hasRoleComponent(role: string): role is SupportedRole {
  return role in ROLE_COMPONENTS;
}
