import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Rocket,
  Users,
  Settings,
  Gift,
  BarChart3,
  Shield,
  Bell,
  LogOut,
} from "lucide-react";
import { UserProfile, UserPermissions } from "../../types/user";
import { UserBadge } from "../ui/UserBadge";

interface AdminLayoutProps {
  userProfile: UserProfile;
  permissions: UserPermissions;
  children: React.ReactNode;
}

/**
 * Layout específico para administradores
 * Contém navegação completa com todas as seções administrativas
 */
export function AdminLayout({
  userProfile,
  permissions,
  children,
}: AdminLayoutProps) {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      description: "Visão geral da plataforma",
    },
    {
      name: "Projetos",
      href: "/admin/projects",
      icon: Rocket,
      description: "Gestão de projetos e fases",
    },
    {
      name: "Usuários",
      href: "/admin/users",
      icon: Users,
      description: "Gestão de usuários e KYC",
    },
    {
      name: "Configurações",
      href: "/admin/settings",
      icon: Settings,
      description: "Configurações do sistema",
    },
    {
      name: "Recompensas",
      href: "/admin/rewards",
      icon: Gift,
      description: "Gestão de recompensas",
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      description: "Relatórios e métricas",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-grafite text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-grafite-800">
          <Link to="/admin" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-roxo rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
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
                      ? "bg-roxo text-white"
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
            <UserBadge role="admin" isVip={false} isVerified={true} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Administrador
              </p>
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
                Painel Administrativo
              </h2>
              <p className="text-sm text-gray-600">
                Gerencie todos os aspectos da plataforma Lunes Launchpad
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-grafite transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-laranja rounded-full"></span>
              </button>

              {/* Quick Stats */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-grafite">150+</div>
                  <div className="text-gray-500">Projetos</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-grafite">25K+</div>
                  <div className="text-gray-500">Usuários</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-verde">$50M+</div>
                  <div className="text-gray-500">Volume</div>
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
