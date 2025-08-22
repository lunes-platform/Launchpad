import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  Bell as BellIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  User as UserIcon,
  Crown as CrownIcon,
  Shield as ShieldIcon,
  Zap as ZapIcon,
  BarChart3 as BarChart3Icon,
  FolderOpen as FolderOpenIcon,
  Wallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigationItems } from './ContextualNavigation';
import { UserRole } from '../../types/auth';

// React 19 compatibility wrappers
const ChevronLeft: React.FC<any> = (props) => {
  const Component = ChevronLeftIcon as any;
  return <Component {...props} />;
};
const ChevronRight: React.FC<any> = (props) => {
  const Component = ChevronRightIcon as any;
  return <Component {...props} />;
};
const Search: React.FC<any> = (props) => {
  const Component = SearchIcon as any;
  return <Component {...props} />;
};
const Bell: React.FC<any> = (props) => {
  const Component = BellIcon as any;
  return <Component {...props} />;
};
const Settings: React.FC<any> = (props) => {
  const Component = SettingsIcon as any;
  return <Component {...props} />;
};
const LogOut: React.FC<any> = (props) => {
  const Component = LogOutIcon as any;
  return <Component {...props} />;
};
const User: React.FC<any> = (props) => {
  const Component = UserIcon as any;
  return <Component {...props} />;
};
const Crown: React.FC<any> = (props) => {
  const Component = CrownIcon as any;
  return <Component {...props} />;
};
const Shield: React.FC<any> = (props) => {
  const Component = ShieldIcon as any;
  return <Component {...props} />;
};
const Zap: React.FC<any> = (props) => {
  const Component = ZapIcon as any;
  return <Component {...props} />;
};
const BarChart3: React.FC<any> = (props) => {
  const Component = BarChart3Icon as any;
  return <Component {...props} />;
};
const FolderOpen: React.FC<any> = (props) => {
  const Component = FolderOpenIcon as any;
  return <Component {...props} />;
};
const Wallet: React.FC<any> = (props) => {
  const Component = WalletIcon as any;
  return <Component {...props} />;
};
const TrendingUp: React.FC<any> = (props) => {
  const Component = TrendingUpIcon as any;
  return <Component {...props} />;
};
const Link: React.FC<any> = (props) => {
  const Component = RouterLink as any;
  return <Component {...props} />;
};

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

/**
 * Sidebar moderna e responsiva com navegação contextual
 * Adapta-se ao papel do usuário e oferece uma experiência de navegação fluida
 */
export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user, isVip, isVerified, logout } = useAuth();
  const navigationItems = useNavigationItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Filtrar itens de navegação baseado na busca
  const filteredItems = navigationItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Agrupar itens por categoria
  const groupedItems = {
    main: filteredItems.filter(item => 
      ['/'].includes(item.href)
    ),
    dashboard: filteredItems.filter(item => 
      ['/dashboard'].includes(item.href) || (item.href.startsWith('/dashboard/') && item.href !== '/dashboard')
    ),
    projects: filteredItems.filter(item => 
      ['/projetos', '/listar-projeto', '/launchpool', '/raffles', '/staking'].includes(item.href)
    ),
    analytics: filteredItems.filter(item => 
      ['/rewards-schedule', '/investor-ranking', '/airdrop', '/governanca'].includes(item.href)
    ),
  };

  const getUserBadge = () => {
    if (!user) return null;
    
    if (user.role === UserRole.ADMIN) {
      return <Shield className="w-4 h-4 text-red-500" />;
    }
    if (isVip) {
      return <Crown className="w-4 h-4 text-yellow-500" />;
    }
    if (isVerified) {
      return <Shield className="w-4 h-4 text-green-500" />;
    }
    return null;
  };

  const renderNavGroup = (title: string, items: typeof navigationItems, icon?: React.ReactNode) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-3 mb-3">
            {icon}
            <h3 className="text-xs font-semibold text-grafite-500 dark:text-grafite-400 uppercase tracking-wider">
              {title}
            </h3>
          </div>
        )}
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] ${
                  isActive
                    ? 'text-roxo-600 dark:text-roxo-400 bg-gradient-to-r from-roxo-50 to-azul-50 dark:from-roxo-900/20 dark:to-azul-900/20 shadow-sm border border-roxo-200/50 dark:border-roxo-700/50'
                    : 'text-grafite-700 dark:text-grafite-300 hover:text-roxo-600 dark:hover:text-roxo-400 hover:bg-gray-50/80 dark:hover:bg-grafite-800/50'
                }`}
                title={isCollapsed ? item.name : item.description}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-roxo-100 dark:bg-roxo-800/30 text-roxo-600 dark:text-roxo-400 shadow-sm'
                    : 'bg-gray-100/50 dark:bg-grafite-800/50 group-hover:bg-roxo-100 dark:group-hover:bg-roxo-900/30'
                }`}>
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between flex-1 min-w-0"
                    >
                      <span className="text-sm font-medium truncate">{item.name}</span>
                      {item.vipOnly && <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                      {item.requiresVerification && <Shield className="w-3 h-3 text-green-500 flex-shrink-0" />}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-roxo-500/5 to-azul-500/5 pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col pt-20 bg-white dark:bg-grafite-900 border-r border-gray-200 dark:border-grafite-700 shadow-sm"
    >
      {/* Header da Sidebar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-grafite-700">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-roxo-500 to-azul-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-grafite-900 dark:text-white">Launchpad</h1>
                <p className="text-xs text-grafite-500 dark:text-grafite-400">Dashboard</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-grafite-800 transition-colors"
          title={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-grafite-600 dark:text-grafite-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-grafite-600 dark:text-grafite-400" />
          )}
        </button>
      </div>

      {/* Barra de Busca */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 border-b border-gray-200 dark:border-grafite-700"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-grafite-400" />
              <input
                type="text"
                placeholder="Buscar navegação..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-grafite-800 border border-gray-200 dark:border-grafite-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-roxo-500 focus:border-transparent transition-colors"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navegação Principal */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {renderNavGroup('Principal', groupedItems.main)}
        {renderNavGroup('Dashboard', groupedItems.dashboard, <BarChart3 className="w-4 h-4 text-roxo-500" />)}
        {renderNavGroup('Projetos', groupedItems.projects, <FolderOpen className="w-4 h-4 text-azul-500" />)}
        {renderNavGroup('Bonus', groupedItems.analytics, <TrendingUp className="w-4 h-4 text-green-500" />)}
      </div>

      {/* Footer da Sidebar - Perfil do Usuário */}
      {user && (
        <div className="p-4 border-t border-gray-200 dark:border-grafite-700">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-grafite-800 ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-roxo-500 to-azul-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              {getUserBadge() && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-grafite-900 rounded-full flex items-center justify-center">
                  {getUserBadge()}
                </div>
              )}
            </div>
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-grafite-900 dark:text-white truncate">
                    {user.profile?.displayName || user.email}
                  </p>
                  <p className="text-xs text-grafite-500 dark:text-grafite-400 truncate">
                    {user.role.replace('_', ' ').toLowerCase()}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
          
          {/* Links de Ação do Usuário */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="mt-3 pt-3 border-t border-gray-200 dark:border-grafite-600 space-y-2"
              >
                {/* Links principais em linha */}
                <div className="flex justify-between gap-1">
                  <Link
                    to="/profile"
                    className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-grafite-700 transition-colors text-xs text-grafite-600 dark:text-grafite-400"
                    title="Perfil"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-[10px]">Perfil</span>
                  </Link>
                  <Link
                    to="/wallet"
                    className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-grafite-700 transition-colors text-xs text-grafite-600 dark:text-grafite-400"
                    title="Carteira"
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="text-[10px]">Carteira</span>
                  </Link>
                  <Link
                    to="/notifications"
                    className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-grafite-700 transition-colors text-xs text-grafite-600 dark:text-grafite-400"
                    title="Notificações"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="text-[10px]">Notif.</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-grafite-700 transition-colors text-xs text-grafite-600 dark:text-grafite-400"
                    title="Configurações"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-[10px]">Config.</span>
                  </Link>
                </div>
                
                {/* Botão de Logout separado */}
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-xs text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Versão colapsada - apenas ícones */}
          <AnimatePresence>
            {isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 pt-3 border-t border-gray-200 dark:border-grafite-600 flex flex-col gap-2"
              >
                <Link
                  to="/profile"
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-grafite-700 transition-colors flex justify-center"
                  title="Perfil"
                >
                  <User className="w-4 h-4 text-grafite-600 dark:text-grafite-400" />
                </Link>
                <Link
                  to="/wallet"
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-grafite-700 transition-colors flex justify-center"
                  title="Carteira"
                >
                  <Wallet className="w-4 h-4 text-grafite-600 dark:text-grafite-400" />
                </Link>
                <Link
                  to="/notifications"
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-grafite-700 transition-colors flex justify-center"
                  title="Notificações"
                >
                  <Bell className="w-4 h-4 text-grafite-600 dark:text-grafite-400" />
                </Link>
                <Link
                  to="/settings"
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-grafite-700 transition-colors flex justify-center"
                  title="Configurações"
                >
                  <Settings className="w-4 h-4 text-grafite-600 dark:text-grafite-400" />
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex justify-center"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.aside>
  );
}

/**
 * Hook para controlar o estado da sidebar
 */
export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const toggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
    }
  };

  return { isCollapsed, toggle };
}