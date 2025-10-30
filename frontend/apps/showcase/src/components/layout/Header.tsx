import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { WalletConnector } from "../WalletConnector";
import {
  ContextualNavigation,
  useNavigationItems,
} from "../navigation/ContextualNavigation";
import { AdminDropdown } from "../navigation/AdminDropdown";
import { UserMenu } from "../navigation/UserMenu";
import { NotificationCenter } from "../NotificationCenter";
import { useUserInvestments } from "../../hooks/useApi";

import { Breadcrumb } from "../navigation/Breadcrumb";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Header principal da aplicação
 * Design profissional com navegação contextual baseada no papel do usuário
 * Mantém funcionalidade completa de conectar carteira
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigationItems = useNavigationItems();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  // Hook para buscar investimentos do usuário para notificações
  const { data: investments } = useUserInvestments(user?.walletAddress || '');

  return (
    <header className="bg-white/95 dark:bg-grafite-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-grafite-700/30 transition-all duration-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center group transition-transform duration-200 hover:scale-105"
            >
              <img 
                src="/Lunes.svg" 
                alt="Lunes Launchpad" 
                className="w-20 h-20 transition-all duration-200 group-hover:drop-shadow-lg"
              />
            </Link>
          </div>

          {/* Navegação Desktop - Aprimorada */}
          <div className="hidden lg:flex items-center gap-2">
            <nav className="flex items-center space-x-1">
              <ContextualNavigation />
            </nav>
            <div className="ml-4 pl-4 border-l border-gray-200 dark:border-grafite-700">
              <AdminDropdown />
            </div>
          </div>

          {/* Actions Section - Refinada */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <NotificationCenter 
                  investments={investments || []} 
                  className="hidden sm:block" 
                />
                <UserMenu />
              </>
            ) : (
              <WalletConnector size="md" variant="primary" />
            )}

            {/* Menu Mobile - Melhorado */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2.5 rounded-xl text-grafite-600 dark:text-grafite-300 hover:text-roxo-600 dark:hover:text-roxo-400 hover:bg-gray-100/80 dark:hover:bg-grafite-800/80 focus:outline-none focus:ring-2 focus:ring-roxo-500/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-grafite-900 transition-all duration-200 backdrop-blur-sm"
                aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                <div className="relative w-6 h-6">
                  <Menu className={`absolute inset-0 transition-all duration-200 ${isMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
                  <X className={`absolute inset-0 transition-all duration-200 ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Menu Mobile - Design Aprimorado */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-grafite-900/95 backdrop-blur-md border-t border-gray-200/20 dark:border-grafite-700/30 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl text-grafite-700 dark:text-grafite-200 hover:text-roxo-600 dark:hover:text-roxo-400 hover:bg-gray-50/80 dark:hover:bg-grafite-800/50 transition-all duration-200 font-medium"
                      title={item.description}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100/50 dark:bg-grafite-800/50 group-hover:bg-roxo-100 dark:group-hover:bg-roxo-900/30 transition-colors duration-200">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="flex-1">{item.name}</span>
                      <div className="w-2 h-2 rounded-full bg-roxo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </Link>
                  );
                })}
              </nav>
              
              {/* Divider e Admin no Mobile */}
              <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-grafite-700/50">
                <AdminDropdown />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
