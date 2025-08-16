import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import {
  Home,
  TrendingUp,
  Gift,
  Wallet,
  History,
  Settings,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Tooltip } from '@/components/ui/Tooltip'
import { useWallet } from '@/contexts/WalletContext'

const sidebarVariants = cva(
  'bg-slate-800/95 backdrop-blur-lg border-r border-slate-600 transition-all duration-300 flex flex-col',
  {
    variants: {
      size: {
        collapsed: 'w-16',
        expanded: 'w-64'
      },
      position: {
        fixed: 'fixed left-0 top-0 bottom-0 z-40',
        relative: 'relative'
      }
    },
    defaultVariants: {
      size: 'expanded',
      position: 'relative'
    }
  }
)

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard',
    badge: null
  },
  {
    id: 'investments',
    label: 'Meus Investimentos',
    icon: TrendingUp,
    path: '/dashboard/meus-investimentos',
    badge: null
  },
  {
    id: 'claims',
    label: 'Tokens a Reivindicar',
    icon: Gift,
    path: '/dashboard/tokens-a-reivindicar',
    badge: '4'
  },
  {
    id: 'wallets',
    label: 'Carteiras',
    icon: Wallet,
    path: '/dashboard/carteiras',
    badge: null
  },
  {
    id: 'history',
    label: 'Histórico',
    icon: History,
    path: '/dashboard/historico',
    badge: null
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    path: '/dashboard/configuracoes',
    badge: null
  }
]

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  isOpen?: boolean
  onClose?: () => void
  showUserInfo?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ 
    className, 
    size, 
    position, 
    isOpen = true, 
    onClose,
    showUserInfo = true,
    ...props 
  }, ref) => {
    const [isCollapsed, setIsCollapsed] = useState(size === 'collapsed')
    const location = useLocation()
    const { selectedAccount, disconnectWallet, balance } = useWallet()

    const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed)
    }

    const isActivePath = (path: string) => {
      if (path === '/dashboard') {
        return location.pathname === '/dashboard' || location.pathname === '/dashboard/'
      }
      return location.pathname.startsWith(path)
    }

    const currentSize = isCollapsed ? 'collapsed' : 'expanded'

    const NavItem = ({ item }: { item: typeof navigationItems[0] }) => {
      const isActive = isActivePath(item.path)
      
      const content = (
        <Link
          to={item.path}
          className={cn(
            'flex items-center space-x-3 px-3 py-3 rounded-card transition-all duration-200 group relative',
            isActive 
              ? 'bg-primary/20 text-primary border border-primary/30' 
              : 'text-slate-200 hover:text-white hover:bg-slate-800/80',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <item.icon className={cn(
            'flex-shrink-0 transition-colors duration-200',
            isActive ? 'text-primary' : 'text-current',
            isCollapsed ? 'w-5 h-5' : 'w-5 h-5'
          )} />
          
          {!isCollapsed && (
            <>
              <span className="font-medium truncate">{item.label}</span>
              {item.badge && (
                <Badge variant="primary" size="sm" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </>
          )}
          
          {isActive && !isCollapsed && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full" />
          )}
        </Link>
      )

      if (isCollapsed) {
        return (
          <Tooltip content={item.label} position="right">
            {content}
          </Tooltip>
        )
      }

      return content
    }

    return (
      <>
        {/* Mobile Overlay */}
        {position === 'fixed' && isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Sidebar */}
        <div
          ref={ref}
          className={cn(
            sidebarVariants({ size: currentSize, position }),
            position === 'fixed' && !isOpen && 'transform -translate-x-full lg:translate-x-0',
            className
          )}
          {...props}
        >
          {/* Header */}
          <div className={cn(
            'flex items-center justify-between p-4 border-b border-slate-600',
            isCollapsed && 'justify-center px-2'
          )}>
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primaryDark rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="font-bold text-lg">Lunes</span>
              </div>
            )}
            
            {position === 'fixed' && onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            )}

            {position === 'relative' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCollapse}
                className={cn(
                  'hidden lg:flex',
                  isCollapsed && 'mx-auto'
                )}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          {/* User Info */}
          {showUserInfo && selectedAccount && (
            <div className={cn(
              'p-4 border-b border-slate-600',
              isCollapsed && 'px-2'
            )}>
              {isCollapsed ? (
                <Tooltip content={selectedAccount.meta.name || 'Usuário'} position="right">
                  <div className="flex justify-center">
                    <Avatar
                      size="sm"
                      name={selectedAccount.meta.name}
                      showStatus
                      status="online"
                    />
                  </div>
                </Tooltip>
              ) : (
                <div className="flex items-center space-x-3">
                  <Avatar
                    size="md"
                    name={selectedAccount.meta.name}
                    showStatus
                    status="online"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {selectedAccount.meta.name || 'Usuário'}
                    </p>
                    <p className="text-xs text-slate-200 truncate">
                      {balance.lunes.toLocaleString()} LUNES
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </nav>

          {/* Footer Actions */}
          <div className={cn(
            'p-4 border-t border-slate-600 space-y-2',
            isCollapsed && 'px-2'
          )}>
            {isCollapsed ? (
              <>
                <Tooltip content="Notificações" position="right">
                  <Link to="/dashboard/historico" className="w-full">
                    <Button variant="ghost" size="icon" className="w-full">
                      <Bell className="w-4 h-4" />
                    </Button>
                  </Link>
                </Tooltip>
                <Tooltip content="Ajuda" position="right">
                  <Link to="/faq" className="w-full">
                    <Button variant="ghost" size="icon" className="w-full">
                      <HelpCircle className="w-4 h-4" />
                    </Button>
                  </Link>
                </Tooltip>
                <Tooltip content="Sair" position="right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-full text-error hover:text-error"
                    onClick={disconnectWallet}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                <Link to="/dashboard/historico" className="w-full">
                  <Button variant="ghost" fullWidth className="justify-start">
                    <Bell className="w-4 h-4 mr-3" />
                    Notificações
                    <Badge variant="primary" size="sm" className="ml-auto">
                      3
                    </Badge>
                  </Button>
                </Link>
                <Link to="/faq" className="w-full">
                  <Button variant="ghost" fullWidth className="justify-start">
                    <HelpCircle className="w-4 h-4 mr-3" />
                    Ajuda & Suporte
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  fullWidth 
                  className="justify-start text-error hover:text-error"
                  onClick={disconnectWallet}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Desconectar
                </Button>
              </>
            )}
          </div>
        </div>
      </>
    )
  }
)

Sidebar.displayName = 'Sidebar'

export { Sidebar, sidebarVariants }
