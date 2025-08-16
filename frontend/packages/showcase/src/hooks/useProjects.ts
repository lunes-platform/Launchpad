// ========================================
// PROJECTS HOOKS - Launchpad Lunes Frontend
// ========================================

import { useCallback, useMemo } from 'react'
import { useApi, usePaginated, useMutation } from './useApi'
import { api } from '@/lib/api'
import { 
  Project, 
  ProjectFilters,
  InvestmentRequest,
  Investment
} from '@/types/api'
import toast from 'react-hot-toast'

// ===== PROJECT LIST HOOK =====
export function useProjects(filters: ProjectFilters = {}) {
  const projectsQuery = usePaginated<Project>(
    '/projects',
    {
      ...filters,
      sortBy: filters.sortBy || 'created',
      sortOrder: filters.sortOrder || 'desc',
    },
    {
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  )

  const updateFilters = useCallback((newFilters: Partial<ProjectFilters>) => {
    return projectsQuery.updateParams(newFilters)
  }, [projectsQuery])

  // Computed values
  const activeProjects = useMemo(() => 
    projectsQuery.data.filter(p => p.status === 'active'),
    [projectsQuery.data]
  )

  const upcomingProjects = useMemo(() => 
    projectsQuery.data.filter(p => p.status === 'whitelist'),
    [projectsQuery.data]
  )

  const completedProjects = useMemo(() => 
    projectsQuery.data.filter(p => p.status === 'completed'),
    [projectsQuery.data]
  )

  return {
    ...projectsQuery,
    updateFilters,
    activeProjects,
    upcomingProjects,
    completedProjects,
  }
}

// ===== SINGLE PROJECT HOOK =====
export function useProject(projectId: string | undefined) {
  const projectQuery = useApi<Project>(
    projectId ? `/projects/${projectId}` : '',
    {
      immediate: !!projectId,
      refreshInterval: 60000, // Refresh every minute
    }
  )

  // Get current active phase
  const currentPhase = useMemo(() => {
    if (!projectQuery.data?.phases) return null
    
    const now = new Date()
    return projectQuery.data.phases.find(phase => {
      const start = new Date(phase.startDate)
      const end = new Date(phase.endDate)
      return start <= now && now <= end && phase.status === 'active'
    })
  }, [projectQuery.data])

  // Get next phase
  const nextPhase = useMemo(() => {
    if (!projectQuery.data?.phases) return null
    
    const now = new Date()
    return projectQuery.data.phases
      .filter(phase => new Date(phase.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0]
  }, [projectQuery.data])

  // Calculate project progress
  const progress = useMemo(() => {
    if (!projectQuery.data?.phases) return { percentage: 0, totalRaised: 0, totalTarget: 0 }

    const totalTarget = projectQuery.data.phases.reduce((sum, phase) => 
      sum + (phase.totalTokens * phase.tokenPrice), 0
    )
    const totalRaised = projectQuery.data.phases.reduce((sum, phase) => 
      sum + (phase.soldTokens * phase.tokenPrice), 0
    )
    const percentage = totalTarget > 0 ? Math.round((totalRaised / totalTarget) * 100) : 0

    return { percentage, totalRaised, totalTarget }
  }, [projectQuery.data])

  return {
    ...projectQuery,
    project: projectQuery.data,
    currentPhase,
    nextPhase,
    progress,
  }
}

// ===== PROJECT INVESTMENT HOOK =====
export function useProjectInvestment(projectId: string) {
  const investMutation = useMutation<Investment, InvestmentRequest>(
    (data) => api.post('/investments', data),
    {
      onSuccess: (investment) => {
        toast.success(`Investimento de ${investment.amount} realizado com sucesso!`)
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao realizar investimento')
      }
    }
  )

  const invest = useCallback(async (data: Omit<InvestmentRequest, 'projectId'>) => {
    return investMutation.mutate({
      ...data,
      projectId,
    })
  }, [investMutation, projectId])

  return {
    invest,
    investing: investMutation.loading,
    investment: investMutation.data,
    error: investMutation.error,
  }
}

// ===== PROJECT WHITELIST HOOK =====
export function useProjectWhitelist(projectId: string) {
  const whitelistMutation = useMutation<
    { message: string; status: string },
    { projectId: string; walletAddress: string }
  >(
    (data) => api.post('/projects/whitelist', data),
    {
      onSuccess: () => {
        toast.success('Inscrição na whitelist realizada com sucesso!')
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao se inscrever na whitelist')
      }
    }
  )

  const checkWhitelistMutation = useMutation<
    { isWhitelisted: boolean; position?: number },
    { projectId: string; walletAddress: string }
  >(
    (data) => api.post('/projects/whitelist/check', data)
  )

  const joinWhitelist = useCallback(async (walletAddress: string) => {
    return whitelistMutation.mutate({ projectId, walletAddress })
  }, [whitelistMutation, projectId])

  const checkWhitelist = useCallback(async (walletAddress: string) => {
    return checkWhitelistMutation.mutate({ projectId, walletAddress })
  }, [checkWhitelistMutation, projectId])

  return {
    joinWhitelist,
    checkWhitelist,
    joining: whitelistMutation.loading,
    checking: checkWhitelistMutation.loading,
    whitelistStatus: checkWhitelistMutation.data,
    error: whitelistMutation.error || checkWhitelistMutation.error,
  }
}

// ===== PROJECT CATEGORIES HOOK =====
export function useProjectCategories() {
  const categoriesQuery = useApi<{ name: string; count: number; description: string }[]>(
    '/projects/categories',
    {
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  )

  return {
    categories: categoriesQuery.data || [],
    loading: categoriesQuery.loading,
    error: categoriesQuery.error,
    refresh: categoriesQuery.refresh,
  }
}

// ===== PROJECT STATS HOOK =====
export function useProjectStats() {
  const statsQuery = useApi<{
    totalProjects: number
    activeProjects: number
    totalRaised: number
    totalParticipants: number
    averageRoi: number
    topCategory: string
  }>(
    '/projects/stats',
    {
      refreshInterval: 60000, // Refresh every minute
    }
  )

  return {
    stats: statsQuery.data,
    loading: statsQuery.loading,
    error: statsQuery.error,
    refresh: statsQuery.refresh,
  }
}

// ===== FEATURED PROJECTS HOOK =====
export function useFeaturedProjects(limit: number = 6) {
  const featuredQuery = useApi<Project[]>(
    `/projects/featured?limit=${limit}`,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  )

  return {
    projects: featuredQuery.data || [],
    loading: featuredQuery.loading,
    error: featuredQuery.error,
    refresh: featuredQuery.refresh,
  }
}

// ===== PROJECT SEARCH HOOK =====
export function useProjectSearch() {
  const searchMutation = useMutation<Project[], { query: string; filters?: ProjectFilters }>(
    (data) => api.post('/projects/search', data)
  )

  const search = useCallback(async (query: string, filters?: ProjectFilters) => {
    if (!query.trim()) return []
    return searchMutation.mutate({ query, filters })
  }, [searchMutation])

  return {
    search,
    results: searchMutation.data || [],
    searching: searchMutation.loading,
    error: searchMutation.error,
  }
}

// ===== PROJECT PRICE TRACKING HOOK =====
export function useProjectPrices(projectIds: string[]) {
  const pricesQuery = useApi<{ [projectId: string]: { current: number; change24h: number; volume24h: number } }>(
    projectIds.length > 0 ? `/projects/prices?ids=${projectIds.join(',')}` : '',
    {
      immediate: projectIds.length > 0,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  )

  const getProjectPrice = useCallback((projectId: string) => {
    return pricesQuery.data?.[projectId] || { current: 0, change24h: 0, volume24h: 0 }
  }, [pricesQuery.data])

  return {
    prices: pricesQuery.data || {},
    loading: pricesQuery.loading,
    error: pricesQuery.error,
    getProjectPrice,
    refresh: pricesQuery.refresh,
  }
}

// ===== PROJECT ANALYTICS HOOK =====
export function useProjectAnalytics(projectId: string, timeRange: '24h' | '7d' | '30d' | '90d' = '7d') {
  const analyticsQuery = useApi<{
    investments: { date: string; amount: number; count: number }[]
    participants: { date: string; count: number }[]
    roi: { date: string; value: number }[]
    volume: { date: string; volume: number }[]
  }>(
    projectId ? `/projects/${projectId}/analytics?range=${timeRange}` : '',
    {
      immediate: !!projectId,
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  )

  return {
    analytics: analyticsQuery.data,
    loading: analyticsQuery.loading,
    error: analyticsQuery.error,
    refresh: analyticsQuery.refresh,
  }
}

// ===== PROJECT NOTIFICATIONS HOOK =====
export function useProjectNotifications(projectId: string) {
  const subscriptionMutation = useMutation<
    { message: string },
    { projectId: string; types: string[] }
  >(
    (data) => api.post('/projects/notifications/subscribe', data),
    {
      onSuccess: () => {
        toast.success('Notificações ativadas para este projeto!')
      }
    }
  )

  const unsubscribeMutation = useMutation<
    { message: string },
    { projectId: string }
  >(
    (data) => api.post('/projects/notifications/unsubscribe', data),
    {
      onSuccess: () => {
        toast.success('Notificações desativadas para este projeto')
      }
    }
  )

  const subscribe = useCallback(async (types: string[] = ['investment', 'phase_update', 'price_alert']) => {
    return subscriptionMutation.mutate({ projectId, types })
  }, [subscriptionMutation, projectId])

  const unsubscribe = useCallback(async () => {
    return unsubscribeMutation.mutate({ projectId })
  }, [unsubscribeMutation, projectId])

  return {
    subscribe,
    unsubscribe,
    subscribing: subscriptionMutation.loading,
    unsubscribing: unsubscribeMutation.loading,
    error: subscriptionMutation.error || unsubscribeMutation.error,
  }
}

// ===== TRENDING PROJECTS HOOK =====
export function useTrendingProjects(limit: number = 10) {
  const trendingQuery = useApi<Project[]>(
    `/projects/trending?limit=${limit}`,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  )

  return {
    projects: trendingQuery.data || [],
    loading: trendingQuery.loading,
    error: trendingQuery.error,
    refresh: trendingQuery.refresh,
  }
}

export default useProjects
