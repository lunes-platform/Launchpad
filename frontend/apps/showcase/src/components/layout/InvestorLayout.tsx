import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Rocket,
  Wallet,
  Coins,
  Dice6,
  Gift,
  User as UserIcon,
  BarChart3,
  Crown,
  Shield,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import type { User, Permission } from "../../types/auth";
import { UserBadge } from "../ui/UserBadge";

interface InvestorLayoutProps {
  userProfile: User;
  permissions: Permission[];
  isVip: boolean;
  isVerified: boolean;
  children: React.ReactNode;
}

/**
 * Layout específico para investidores (padrão, verificado e VIP)
 * Adapta-se baseado no nível do investidor
 */
export function InvestorLayout({
  userProfile,
  permissions,
  isVip,
  isVerified,
  children,
}: InvestorLayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      description: "Visão geral",
    },
    {
      name: "Projetos",
      href: "/projects",
      icon: Rocket,
      description: "Projetos disponíveis",
    },
    {
      name: "Meus Investimentos",
      href: "/investments",
      icon: Wallet,
      description: "Portfólio",
    },
    {
      name: "Staking",
      href: "/staking",
      icon: Coins,
      description: "Launchpool",
      enabled: permissions.includes("STAKE_TOKENS" as Permission),
    },
    {
      name: "Raffle",
      href: "/raffle",
      icon: Dice6,
      description: "Loteria",
      enabled: permissions.includes("PARTICIPATE_RAFFLE" as Permission),
    },
    {
      name: "Recompensas",
      href: "/rewards",
      icon: Gift,
      description: "Meus prêmios",
      enabled: permissions.includes("CLAIM_REWARDS" as Permission),
    },
    {
      name: "Perfil",
      href: "/profile",
      icon: UserIcon,
      description: "Configurações",
    },
  ];

  // Adicionar analytics para VIP
  if (isVip && permissions.includes("VIEW_USER_ANALYTICS" as Permission)) {
    navigationItems.splice(-1, 0, {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      description: "Relatórios VIP",
    });
  }

  const filteredNavigation = navigationItems.filter(
    (item) => item.enabled !== false,
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-grafite-900 transition-colors duration-200">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white dark:bg-grafite-800 rounded-lg shadow-lg text-grafite dark:text-grafite-200 hover:bg-gray-50 dark:hover:bg-grafite-700 transition-colors duration-200"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-grafite-800 border-r border-gray-200 dark:border-grafite-700 transform transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-grafite-700">
          <Link to="/" className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isVip ? "bg-gradient-to-r from-roxo to-laranja" : "bg-roxo"
              }`}
            >
              {isVip ? (
                <Crown className="w-5 h-5 text-white" />
              ) : (
                <Rocket className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold text-grafite dark:text-grafite-50">
                {isVip ? "VIP Portal" : "Lunes Launchpad"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-grafite-400">
                {isVip ? "Acesso Premium" : "Plataforma de Investimentos"}
              </p>
            </div>
          </Link>
        </div>

        {/* User Status */}
        {isVip && (
          <div className="p-4 bg-gradient-to-r from-roxo-50 to-laranja-50 dark:from-roxo-900/30 dark:to-laranja-900/30 border-b border-gray-200 dark:border-grafite-700">
            <div className="flex items-center space-x-3">
              <Crown className="w-5 h-5 text-roxo dark:text-roxo-400" />
              <div>
                <p className="text-sm font-medium text-grafite dark:text-grafite-50">
                  Status VIP Ativo
                </p>
                <p className="text-xs text-gray-600 dark:text-grafite-300">
                  Benefícios exclusivos disponíveis
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group
                  ${
                    isActive
                      ? isVip
                        ? "bg-gradient-to-r from-roxo to-laranja text-white"
                        : "bg-roxo text-white"
                      : "text-gray-700 hover:text-grafite hover:bg-gray-100"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div
                    className={`text-xs ${isActive ? "text-white/75" : "text-gray-500"}`}
                  >
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <UserBadge
              role={isVip ? "vip" : isVerified ? "verified" : "standard"}
              isVip={isVip}
              isVerified={isVerified}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-grafite truncate">
                {isVip
                  ? "Investidor VIP"
                  : isVerified
                    ? "Investidor Verificado"
                    : "Investidor"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userProfile.walletAddress?.slice(0, 8)}...
                {userProfile.walletAddress?.slice(-6)}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-semibold text-grafite">
                {userProfile.metrics?.totalInvested
                  ? `${Number(userProfile.metrics.totalInvested) / 1e12}`
                  : "0"}{" "}
                LUNES
              </div>
              <div className="text-gray-500">Investido</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-semibold text-verde">
                {userProfile.metrics?.projectsInvested || 0}
              </div>
              <div className="text-gray-500">Projetos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h2 className="text-xl font-semibold text-grafite">
                {isVip ? "💎 Portal VIP" : "🚀 Lunes Launchpad"}
              </h2>
              <p className="text-sm text-gray-600">
                {isVip
                  ? "Acesso exclusivo a oportunidades premium"
                  : "Descubra e invista em projetos inovadores"}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-grafite transition-colors">
                <Bell className="w-5 h-5" />
                {isVip && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-laranja rounded-full"></span>
                )}
              </button>

              {/* KYC Status */}
              {isVerified && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-verde-50 text-verde-700 rounded-full text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Verificado</span>
                </div>
              )}

              {/* VIP Badge */}
              {isVip && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-roxo-50 to-laranja-50 text-roxo rounded-full text-sm">
                  <Crown className="w-4 h-4" />
                  <span>VIP</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
