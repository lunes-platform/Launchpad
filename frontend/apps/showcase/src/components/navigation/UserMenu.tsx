import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  Shield,
  Crown,
  FileText,
  Bell,
  ChevronDown,
  Wallet,
  History,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/auth";

/**
 * Interface para definir um item do menu do usuário
 */
interface UserMenuItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: () => void;
  roles: UserRole[];
  requiresVerification?: boolean;
  vipOnly?: boolean;
  divider?: boolean;
}

/**
 * Configuração do menu do usuário baseado no papel
 */
const USER_MENU_ITEMS: UserMenuItem[] = [
  {
    name: "Meu Perfil",
    href: "/profile",
    icon: User,
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
    name: "Carteira",
    href: "/wallet",
    icon: Wallet,
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
  },
  {
    name: "Notificações",
    href: "/notifications",
    icon: Bell,
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
    name: "Histórico de Raffles",
    href: "/raffle-history",
    icon: History,
    roles: [
      UserRole.ADMIN,
      UserRole.PROJECT_ISSUER,
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
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
    name: "Área VIP",
    href: "/vip",
    icon: Crown,
    roles: [UserRole.INVESTOR_VIP, UserRole.ADMIN],
    vipOnly: true,
    divider: true,
  },
  {
    name: "Painel Admin",
    href: "/admin",
    icon: Shield,
    roles: [UserRole.ADMIN],
    divider: true,
  },
  {
    name: "Documentos KYC",
    href: "/kyc",
    icon: FileText,
    roles: [
      UserRole.INVESTOR_VIP,
      UserRole.INVESTOR_VERIFIED,
      UserRole.INVESTOR_STANDARD,
    ],
    requiresVerification: false, // Mostra mesmo se não verificado para permitir upload
  },
];

/**
 * Componente de menu do usuário
 * Exibe avatar, nome e menu dropdown com opções contextuais
 */
export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, isVip, isVerified, logout } = useAuth();

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return null;
  }

  // Filtrar itens do menu baseado no papel do usuário
  const availableItems = USER_MENU_ITEMS.filter((item) => {
    if (!item.roles.includes(user.role)) return false;
    if (item.requiresVerification && !isVerified) return false;
    if (item.vipOnly && !isVip) return false;
    return true;
  });

  // Função para lidar com logout
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Obter iniciais do nome para avatar
  const getInitials = (userData: any) => {
    if (userData?.profile?.displayName) {
      return userData.profile.displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }

    if (userData?.walletAddress) {
      return userData.walletAddress.slice(2, 4).toUpperCase();
    }

    return "U";
  };

  // Obter nome de exibição
  const getDisplayName = (userData: any) => {
    if (userData?.profile?.displayName) {
      return userData.profile.displayName;
    }

    if (userData?.walletAddress) {
      return `${userData.walletAddress.slice(0, 6)}...${userData.walletAddress.slice(-4)}`;
    }

    return "Usuário";
  };

  // Obter cor do badge baseado no papel
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-red-100 text-red-800";
      case UserRole.PROJECT_ISSUER:
        return "bg-blue-100 text-blue-800";
      case UserRole.INVESTOR_VIP:
        return "bg-yellow-100 text-yellow-800";
      case UserRole.INVESTOR_VERIFIED:
        return "bg-green-100 text-green-800";
      case UserRole.INVESTOR_STANDARD:
        return "bg-gray-100 dark:bg-grafite-700 text-gray-800 dark:text-grafite-200";
      case UserRole.PRICE_ORACLE:
        return "bg-purple-100 text-purple-800";
      case UserRole.USER_BANNED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 dark:bg-grafite-700 text-gray-800 dark:text-grafite-200";
    }
  };

  // Obter nome amigável do papel
  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "Admin";
      case UserRole.PROJECT_ISSUER:
        return "Emissor";
      case UserRole.INVESTOR_VIP:
        return "VIP";
      case UserRole.INVESTOR_VERIFIED:
        return "Verificado";
      case UserRole.INVESTOR_STANDARD:
        return "Padrão";
      case UserRole.PRICE_ORACLE:
        return "Oracle";
      case UserRole.USER_BANNED:
        return "Banido";
      default:
        return "Usuário";
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Botão do menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-grafite-700 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-roxo text-white rounded-full flex items-center justify-center text-sm font-medium">
          {getInitials(user)}
        </div>

        {/* Nome e papel (desktop) */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-grafite-100">
            {getDisplayName(user)}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}
            >
              {getRoleDisplayName(user.role)}
            </span>
            {isVip && <Crown className="w-3 h-3 text-yellow-500" />}
            {isVerified && <Shield className="w-3 h-3 text-green-500" />}
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-grafite-800 rounded-lg shadow-lg border border-gray-200 dark:border-grafite-600 py-2 z-50">
          {/* Cabeçalho do menu (mobile) */}
          <div className="md:hidden px-4 py-2 border-b border-gray-100 dark:border-grafite-600">
            <div className="text-sm font-medium text-gray-900 dark:text-grafite-100">
              {getDisplayName(user)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}
              >
                {getRoleDisplayName(user.role)}
              </span>
              {isVip && <Crown className="w-3 h-3 text-yellow-500" />}
              {isVerified && <Shield className="w-3 h-3 text-green-500" />}
            </div>
          </div>

          {/* Itens do menu */}
          {availableItems.map((item, index) => {
            const Icon = item.icon;
            const showDivider = item.divider && index > 0;

            return (
              <div key={item.name}>
                {showDivider && (
                  <div className="border-t border-gray-100 dark:border-grafite-600 my-1" />
                )}

                {item.href ? (
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-grafite-200 hover:bg-gray-50 dark:hover:bg-grafite-700 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-grafite-200 hover:bg-gray-50 dark:hover:bg-grafite-700 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </button>
                )}
              </div>
            );
          })}

          {/* Logout */}
          <div className="border-t border-gray-100 dark:border-grafite-600 mt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
