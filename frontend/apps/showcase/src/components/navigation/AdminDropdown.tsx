import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield,
  BarChart3,
  Users,
  Rocket,
  Gift,
  Settings,
  ChevronDown,
  Code,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/auth";

/**
 * Interface para definir um item do dropdown administrativo
 */
interface AdminMenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  divider?: boolean;
}

/**
 * Configuração dos itens do menu administrativo
 */
const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Shield,
    description: "Painel administrativo principal",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Métricas e relatórios administrativos",
  },
  {
    name: "Usuários",
    href: "/admin/users",
    icon: Users,
    description: "Gerenciar usuários do sistema",
    divider: true,
  },
  {
    name: "Projetos",
    href: "/admin/projects",
    icon: Rocket,
    description: "Gerenciar projetos da plataforma",
  },
  {
    name: "Recompensas",
    href: "/admin/rewards",
    icon: Gift,
    description: "Sistema de recompensas e incentivos",
  },
  {
    name: "Configurações",
    href: "/admin/settings",
    icon: Settings,
    description: "Configurações gerais do sistema",
    divider: true,
  },
  {
    name: "Components",
    href: "/components",
    icon: Code,
    description: "Showcase de componentes UI",
  },
];

/**
 * Componente de dropdown para páginas administrativas
 * Agrupa todas as funcionalidades admin em um menu organizado
 */
export function AdminDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user } = useAuth();

  // Verificar se o usuário é admin
  const isAdmin = user?.role === UserRole.ADMIN;

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Não renderizar se não for admin
  if (!isAdmin) {
    return null;
  }

  // Verificar se alguma página admin está ativa
  const isAdminPageActive = ADMIN_MENU_ITEMS.some(
    (item) => location.pathname === item.href || 
    (item.href !== "/admin" && location.pathname.startsWith(item.href))
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão do dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
          isAdminPageActive
            ? "text-roxo bg-roxo/10 dark:bg-roxo/20"
            : "text-gray-700 dark:text-grafite-200 hover:text-roxo dark:hover:text-roxo-400 hover:bg-gray-100 dark:hover:bg-grafite-700"
        }`}
        title="Menu Administrativo"
      >
        <Shield className="w-4 h-4" />
        <span className="hidden md:inline font-medium">Admin</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-grafite-800 rounded-lg shadow-lg border border-gray-200 dark:border-grafite-600 py-2 z-50">
          {/* Cabeçalho do menu */}
          <div className="px-4 py-2 border-b border-gray-100 dark:border-grafite-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-roxo" />
              <span className="text-sm font-semibold text-gray-900 dark:text-grafite-100">
                Painel Administrativo
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-grafite-400 mt-1">
              Gerenciar sistema e usuários
            </p>
          </div>

          {/* Itens do menu */}
          {ADMIN_MENU_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = 
              location.pathname === item.href ||
              (item.href !== "/admin" && location.pathname.startsWith(item.href));
            const showDivider = item.divider && index > 0;

            return (
              <div key={item.href}>
                {showDivider && (
                  <div className="border-t border-gray-100 dark:border-grafite-600 my-1" />
                )}

                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 ${
                    isActive
                      ? "text-roxo bg-roxo/10 dark:bg-roxo/20 border-r-2 border-roxo"
                      : "text-gray-700 dark:text-grafite-200 hover:text-roxo dark:hover:text-roxo-400 hover:bg-gray-50 dark:hover:bg-grafite-700"
                  }`}
                  title={item.description}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 dark:text-grafite-400 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}