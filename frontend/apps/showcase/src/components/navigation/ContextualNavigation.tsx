import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Rocket,
  BarChart3,
  Users,
  Settings,
  Shield,
  Crown,
  FileText,
  DollarSign,
  Calendar,
  Gift,
  TrendingUp,
  Zap,
  Dice6,
  Code,
  User,
  Wallet,
  PieChart,
  FolderOpen,
  Coins,
  Vote,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/auth";

// Removidos os wrappers problemáticos - usando componentes diretamente

/**
 * Interface para definir um item de navegação
 */
interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  roles: UserRole[];
  requiresVerification?: boolean;
  vipOnly?: boolean;
}

/**
 * Configuração de navegação para o header (apenas itens principais)
 * Não inclui subitens do dashboard
 */
const HEADER_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: "Início",
    href: "/",
    icon: Home,
    description: "Página inicial",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
      UserRole.PRICE_ORACLE,
      UserRole.USER_BANNED,
    ],
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    description: "Painel personalizado",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
      UserRole.PRICE_ORACLE,
    ],
  },
  {
    name: "Projetos",
    href: "/projetos",
    icon: FolderOpen,
    description: "Listagem e acesso a projetos",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
      UserRole.PRICE_ORACLE,
    ],
  },
  {
    name: "Launchpool",
    href: "/launchpool",
    icon: Zap,
    description: "Pools de staking",
    roles: [
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
      UserRole.ADMIN,
    ],
  },
  {
    name: "Raffles",
    href: "/raffles",
    icon: Dice6,
    description: "Sorteios e promoções",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
  },
];

/**
 * Configuração completa de navegação para a sidebar
 * Inclui todos os itens, incluindo subitens do dashboard
 */
const SIDEBAR_NAVIGATION_ITEMS: NavigationItem[] = [
  // Itens principais
  {
    name: "Início",
    href: "/",
    icon: Home,
    description: "Página inicial",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
      UserRole.PRICE_ORACLE,
      UserRole.USER_BANNED,
    ],
  },
  {
    name: "Meus Projetos",
    href: "/listar-projeto",
    icon: User,
    description: "Gerencie seus projetos no launchpad",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
  },
  {
    name: "Criar Projeto",
    href: "/criar-projeto",
    icon: Rocket,
    description: "Cadastre um novo projeto no launchpad",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
    ],
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    description: "Painel personalizado",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
      UserRole.PRICE_ORACLE,
    ],
  },
  {
    name: "Carteiras",
    href: "/wallet",
    icon: Wallet,
    description: "Dados de carteiras e saldos",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
  },
  {
    name: "Configuração",
    href: "/settings",
    icon: Settings,
    description: "Configurações da conta",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
  },
  {
    name: "Investimentos",
    href: "/dashboard/investimentos",
    icon: PieChart,
    description: "Dados básicos de investimentos",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
  },
  {
    name: "Projetos",
    href: "/projetos",
    icon: FolderOpen,
    description: "Listagem e acesso a projetos",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
      UserRole.PRICE_ORACLE,
    ],
  },
  {
    name: "Launchpool",
    href: "/launchpool",
    icon: Zap,
    description: "Pools de staking",
    roles: [
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
      UserRole.ADMIN,
    ],
  },
  {
    name: "Staking",
    href: "/staking",
    icon: Coins,
    description: "Dashboard de staking e recompensas",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
  },
  {
    name: "Raffles",
    href: "/raffles",
    icon: Dice6,
    description: "Sorteios e promoções",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
  },
  {
    name: "Cronograma de Recompensas",
    href: "/rewards-schedule",
    icon: Calendar,
    description: "Cronograma de distribuições de recompensas",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
  },
  {
    name: "Ranking de Investidores",
    href: "/investor-ranking",
    icon: TrendingUp,
    description: "Ranking de investidores por engajamento",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
  },
  {
    name: "Airdrop",
    href: "/airdrop",
    icon: Gift,
    description: "Tokens gratuitos de projetos",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
  },
  {
    name: "Governança",
    href: "/governanca",
    icon: Vote,
    description: "Participação em decisões da plataforma",
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
  },

  // Navegação administrativa removida - agora está no AdminDropdown


];

/**
 * Componente de navegação contextual
 * Adapta os links de navegação baseado no papel do usuário autenticado
 */
export function ContextualNavigation() {
  const location = useLocation();
  const { user, isVip, isVerified } = useAuth();

  // Se não há usuário autenticado, mostra apenas navegação básica com design profissional
  if (!user) {
    const basicItems = HEADER_NAVIGATION_ITEMS.filter(
      (item: NavigationItem) => item.href === "/" || item.href === "/projetos",
    );

    return (
      <nav className="flex gap-6">
        {basicItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/" && location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                isActive
                  ? "text-roxo-600 dark:text-roxo-400 bg-roxo-50 dark:bg-roxo-900/20 shadow-sm"
                  : "text-grafite-700 dark:text-grafite-300 hover:text-roxo-600 dark:hover:text-roxo-400 hover:bg-gray-50/80 dark:hover:bg-grafite-800/50"
              }`}
              title={item.description}
              data-discover="true"
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-roxo-100 dark:bg-roxo-800/30 text-roxo-600 dark:text-roxo-400"
                  : "bg-gray-100/50 dark:bg-grafite-800/50 group-hover:bg-roxo-100 dark:group-hover:bg-roxo-900/30"
              }`}>
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="hidden lg:inline text-sm font-medium">{item.name}</span>
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-roxo-500/10 to-azul-500/10 pointer-events-none"></div>
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  // Filtrar itens baseado no papel do usuário
  const availableItems = HEADER_NAVIGATION_ITEMS.filter((item: NavigationItem) => {
    // Verificar se o papel do usuário está na lista de papéis permitidos
    if (!item.roles.includes(user.role)) {
      return false;
    }

    // Verificar se requer verificação KYC
    if (item.requiresVerification && !isVerified) {
      return false;
    }

    // Verificar se é apenas para VIP
    if (item.vipOnly && !isVip) {
      return false;
    }

    return true;
  });

  // Remover duplicatas baseado no href
  const uniqueItems = availableItems.filter(
    (item: NavigationItem, index: number, self: NavigationItem[]) =>
      index === self.findIndex((i: NavigationItem) => i.href === item.href),
  );

  return (
    <nav className="flex gap-6">
      {uniqueItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          location.pathname === item.href ||
          (item.href !== "/" && location.pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            to={item.href}
            className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
              isActive
                ? "text-roxo-600 dark:text-roxo-400 bg-roxo-50 dark:bg-roxo-900/20 shadow-sm"
                : "text-grafite-700 dark:text-grafite-300 hover:text-roxo-600 dark:hover:text-roxo-400 hover:bg-gray-50/80 dark:hover:bg-grafite-800/50"
            }`}
            title={item.description}
            data-discover="true"
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-roxo-100 dark:bg-roxo-800/30 text-roxo-600 dark:text-roxo-400"
                : "bg-gray-100/50 dark:bg-grafite-800/50 group-hover:bg-roxo-100 dark:group-hover:bg-roxo-900/30"
            }`}>
              <Icon className="w-4 h-4" aria-hidden="true" />
            </div>
            <span className="hidden lg:inline text-sm font-medium">{item.name}</span>
            {isActive && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-roxo-500/10 to-azul-500/10 pointer-events-none"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Hook para obter os itens de navegação disponíveis para o usuário atual (sidebar)
 */
export function useNavigationItems() {
  const { user, isVip, isVerified } = useAuth();

  if (!user) {
    return SIDEBAR_NAVIGATION_ITEMS.filter(
      (item: NavigationItem) => item.href === "/" || item.href === "/projetos",
    );
  }

  return SIDEBAR_NAVIGATION_ITEMS.filter((item: NavigationItem) => {
    if (!item.roles.includes(user.role)) return false;
    if (item.requiresVerification && !isVerified) return false;
    if (item.vipOnly && !isVip) return false;
    return true;
  }).filter(
    (item: NavigationItem, index: number, self: NavigationItem[]) =>
      index === self.findIndex((i: NavigationItem) => i.href === item.href),
  );
}
