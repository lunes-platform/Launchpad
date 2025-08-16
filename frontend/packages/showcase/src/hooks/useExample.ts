// ========================================
// EXAMPLE HOOK - Demonstração de Uso Completo
// ========================================

import { useEffect, useCallback } from 'react'
import { 
  useAuth, 
  useProjects, 
  useInvestments, 
  useStaking, 
  useNotifications,
  useWebSocket,
  useLocalStorage,
  useDebounce,
  useCountdown
} from '@/hooks'
import { ProjectFilters } from '@/types/api'
import toast from 'react-hot-toast'

/**
 * Hook de exemplo que demonstra o uso completo da arquitetura de API
 * 
 * Este hook combina múltiplas funcionalidades:
 * - Autenticação do usuário
 * - Listagem de projetos com filtros
 * - Investimentos do usuário
 * - Staking pools
 * - Notificações em tempo real
 * - WebSocket para updates em tempo real
 * - Persistência local de filtros
 * - Debounce para busca
 * - Countdown para próxima fase
 */
export function useExample() {
  // ===== AUTHENTICATION =====
  const { user, isAuthenticated, login, logout } = useAuth()

  // ===== LOCAL STORAGE =====
  const [savedFilters, setSavedFilters] = useLocalStorage<ProjectFilters>('project-filters', {
    category: undefined,
    status: 'active',
    sortBy: 'created',
    sortOrder: 'desc',
  })

  const [searchTerm, setSearchTerm] = useLocalStorage('search-term', '')

  // ===== DEBOUNCED SEARCH =====
  const debouncedSearch = useDebounce(searchTerm, 500)

  // ===== PROJECTS =====
  const { 
    data: projects,
    loading: projectsLoading,
    activeProjects,
    upcomingProjects,
    updateFilters
  } = useProjects({
    ...savedFilters,
    search: debouncedSearch || undefined,
  })

  // ===== INVESTMENTS =====
  const {
    data: investments,
    loading: investmentsLoading,
    activeInvestments,
    totalInvested,
    totalGains,
    gainsPercentage
  } = useInvestments()

  // ===== STAKING =====
  const {
    pools: stakingPools,
    loading: stakingLoading
  } = useStaking()

  const {
    activeStaking,
    totalStaked,
    totalRewards
  } = useUserStaking()

  // ===== NOTIFICATIONS =====
  const {
    unreadCount,
    urgentNotifications
  } = useNotifications()

  const {
    addNotification: addInAppNotification
  } = useInAppNotifications()

  // ===== WEBSOCKET =====
  const { 
    isConnected: wsConnected, 
    subscribe, 
    unsubscribe 
  } = useWebSocket({ 
    autoConnect: isAuthenticated 
  })

  // ===== COUNTDOWN =====
  const nextProject = upcomingProjects[0]
  const countdown = useCountdown(
    nextProject?.phases[0]?.startDate || new Date()
  )

  // ===== CALLBACKS =====
  const handleFilterChange = useCallback((newFilters: Partial<ProjectFilters>) => {
    const updatedFilters = { ...savedFilters, ...newFilters }
    setSavedFilters(updatedFilters)
    updateFilters(newFilters)
  }, [savedFilters, setSavedFilters, updateFilters])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [setSearchTerm])

  const handleLogin = useCallback(async (credentials: any) => {
    try {
      await login(credentials)
      toast.success('Login realizado com sucesso!')
    } catch (error) {
      toast.error('Erro no login')
    }
  }, [login])

  const handleLogout = useCallback(() => {
    logout()
    toast.success('Logout realizado com sucesso!')
  }, [logout])

  // ===== WEBSOCKET SUBSCRIPTIONS =====
  useEffect(() => {
    if (!wsConnected || !isAuthenticated) return

    // Subscription para atualizações de preços
    const priceSubscription = subscribe('price_update', (data) => {
      console.log('Preço atualizado:', data)
      addInAppNotification({
        type: 'info',
        title: 'Preço Atualizado',
        message: `${data.token}: $${data.price}`,
        duration: 3000,
      })
    })

    // Subscription para atualizações de investimentos
    const investmentSubscription = subscribe('investment_update', (data) => {
      console.log('Investimento atualizado:', data)
      
      if (data.type === 'new_investment') {
        addInAppNotification({
          type: 'success',
          title: 'Novo Investimento',
          message: `Investimento de ${data.amount} ${data.currency} realizado!`,
          duration: 5000,
        })
      } else if (data.type === 'tokens_claimed') {
        addInAppNotification({
          type: 'success',
          title: 'Tokens Reivindicados',
          message: `${data.amount} tokens reivindicados com sucesso!`,
          duration: 5000,
        })
      }
    })

    // Subscription para notificações
    const notificationSubscription = subscribe('notification', (notification) => {
      console.log('Nova notificação:', notification)
      
      addInAppNotification({
        type: notification.priority === 'urgent' ? 'error' : 'info',
        title: notification.title,
        message: notification.message,
        duration: notification.priority === 'urgent' ? 8000 : 4000,
      })
    })

    // Subscription para atualizações de fases
    const phaseSubscription = subscribe('phase_update', (data) => {
      console.log('Fase atualizada:', data)
      
      if (data.type === 'phase_started') {
        addInAppNotification({
          type: 'success',
          title: 'Nova Fase Iniciada',
          message: `${data.projectName}: ${data.phaseName} começou!`,
          duration: 6000,
          action: {
            label: 'Ver Projeto',
            onClick: () => window.open(`/projetos/${data.projectId}`, '_blank'),
          },
        })
      }
    })

    return () => {
      unsubscribe(priceSubscription)
      unsubscribe(investmentSubscription)
      unsubscribe(notificationSubscription)
      unsubscribe(phaseSubscription)
    }
  }, [wsConnected, isAuthenticated, subscribe, unsubscribe, addInAppNotification])

  // ===== COMPUTED VALUES =====
  const isLoading = projectsLoading || investmentsLoading || stakingLoading

  const portfolioValue = totalInvested + totalGains
  const stakingValue = totalStaked + totalRewards

  const totalValue = portfolioValue + stakingValue

  const stats = {
    totalProjects: projects.length,
    activeProjectsCount: activeProjects.length,
    upcomingProjectsCount: upcomingProjects.length,
    activeInvestmentsCount: activeInvestments.length,
    activeStakingCount: activeStaking.length,
    portfolioValue,
    stakingValue,
    totalValue,
    totalGains,
    gainsPercentage,
    unreadNotifications: unreadCount,
    urgentNotifications: urgentNotifications.length,
  }

  // ===== RETURN =====
  return {
    // Authentication
    user,
    isAuthenticated,
    handleLogin,
    handleLogout,

    // Data
    projects,
    investments,
    stakingPools,
    activeInvestments,
    activeStaking,

    // Loading states
    isLoading,
    projectsLoading,
    investmentsLoading,
    stakingLoading,

    // Filters and search
    filters: savedFilters,
    searchTerm,
    handleFilterChange,
    handleSearch,

    // Stats
    stats,

    // Real-time
    wsConnected,
    countdown,
    nextProject,

    // Notifications
    unreadCount,
    urgentNotifications,

    // Utils
    debouncedSearch,
  }
}

/**
 * Hook de exemplo para uma página de dashboard
 * Demonstra como combinar múltiplos hooks para criar uma interface completa
 */
export function useDashboardExample() {
  const {
    user,
    isAuthenticated,
    stats,
    isLoading,
    activeInvestments,
    activeStaking,
    unreadCount,
    wsConnected,
    nextProject,
    countdown
  } = useExample()

  // ===== DASHBOARD SPECIFIC LOGIC =====
  const dashboardData = {
    user,
    isAuthenticated,
    isLoading,
    
    // Cards de estatísticas
    statCards: [
      {
        title: 'Valor Total',
        value: stats.totalValue,
        change: stats.gainsPercentage,
        type: 'currency' as const,
        icon: 'dollar-sign',
        color: 'primary',
      },
      {
        title: 'Investimentos Ativos',
        value: stats.activeInvestmentsCount,
        change: null,
        type: 'number' as const,
        icon: 'trending-up',
        color: 'success',
      },
      {
        title: 'Staking Ativo',
        value: stats.stakingValue,
        change: null,
        type: 'currency' as const,
        icon: 'coins',
        color: 'warning',
      },
      {
        title: 'Notificações',
        value: unreadCount,
        change: null,
        type: 'number' as const,
        icon: 'bell',
        color: 'info',
      },
    ],

    // Investimentos recentes
    recentInvestments: activeInvestments.slice(0, 5),

    // Staking ativo
    recentStaking: activeStaking.slice(0, 5),

    // Status da conexão
    connectionStatus: {
      api: true, // Assumindo que API está conectada se chegou até aqui
      websocket: wsConnected,
    },

    // Próximo evento
    nextEvent: nextProject ? {
      type: 'project_launch',
      title: `${nextProject.name} - Whitelist`,
      description: 'Nova oportunidade de investimento',
      countdown: countdown.formatted,
      isExpired: countdown.isExpired,
    } : null,
  }

  return dashboardData
}

export default useExample
