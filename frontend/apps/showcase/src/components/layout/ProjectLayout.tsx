import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Rocket,
  Users,
  DollarSign,
  BarChart3,
  Calendar,
  Settings,
  FileText,
  Bell,
  LogOut,
  TrendingUp,
} from "lucide-react";
import type { UserProfile, UserPermissions } from "../../types/user";
import { UserBadge } from "../ui/UserBadge";

interface ProjectLayoutProps {
  userProfile: UserProfile;
  permissions: UserPermissions;
  children: React.ReactNode;
}

/**
 * Layout específico para projetos/emissores
 * Contém navegação focada em gestão de projetos e captação
 */
export function ProjectLayout({
  userProfile,
  permissions,
  children,
}: ProjectLayoutProps) {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/project/dashboard",
      icon: LayoutDashboard,
      description: "Visão geral do projeto",
    },
    {
      name: "Meu Projeto",
      href: "/project/details",
      icon: Rocket,
      description: "Detalhes e configurações",
    },
    {
      name: "Fases",
      href: "/project/phases",
      icon: Calendar,
      description: "Cronograma de captação",
    },
    {
      name: "Investidores",
      href: "/project/investors",
      icon: Users,
      description: "Lista de investidores",
    },
    {
      name: "Financeiro",
      href: "/project/financial",
      icon: DollarSign,
      description: "Receitas e transações",
    },
    {
      name: "Analytics",
      href: "/project/analytics",
      icon: BarChart3,
      description: "Métricas de performance",
    },
    {
      name: "Documentos",
      href: "/project/documents",
      icon: FileText,
      description: "Whitepaper e materiais",
    },
    {
      name: "Configurações",
      href: "/project/settings",
      icon: Settings,
      description: "Configurações do projeto",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-grafite text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-grafite-800">
          <Link to="/project" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-verde rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Project Panel</h1>
              <p className="text-xs text-grafite-300">Lunes Launchpad</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-verde text-white"
                      : "text-grafite-300 hover:text-white hover:bg-grafite-800"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-grafite-800">
          <div className="flex items-center space-x-3 mb-4">
            <UserBadge
              role="project"
              isVip={false}
              isVerified={userProfile.kycVerified}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Projeto</p>
              <p className="text-xs text-grafite-300 truncate">
                {userProfile.address.slice(0, 8)}...
                {userProfile.address.slice(-6)}
              </p>
            </div>
          </div>

          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-grafite-300 hover:text-white hover:bg-grafite-800 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-grafite">
                Painel do Projeto
              </h2>
              <p className="text-sm text-gray-600">
                Gerencie seu projeto e acompanhe a captação de recursos
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-grafite transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-verde rounded-full"></span>
              </button>

              {/* Quick Stats */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-grafite">₺2.5M</div>
                  <div className="text-gray-500">Captado</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-grafite">1,234</div>
                  <div className="text-gray-500">Investidores</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-verde flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    85%
                  </div>
                  <div className="text-gray-500">Meta</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
