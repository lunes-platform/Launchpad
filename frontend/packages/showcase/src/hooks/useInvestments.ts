// ========================================
// INVESTMENTS HOOKS - Launchpad Lunes Frontend
// ========================================

import { useCallback, useMemo } from 'react'
import { useApi, usePaginated, useMutation } from './useApi'
import { api } from '@/lib/api'
import { 
  Investment,
  InvestmentDetails,
  InvestmentFilters,
  ClaimRequest,
  UserStats
} from '@/types/api'
import toast from 'react-hot-toast'

// ===== USER INVESTMENTS HOOK =====
export function useInvestments(filters: InvestmentFilters = {}) {
  const investmentsQuery = usePaginated<InvestmentDetails>(
    '/investments',
    {
      ...filters,
      sortBy: filters.sortBy || 'date',
      sortOrder: filters.sortOrder || 'desc',
    },
    {
      refreshInterval: 60000, // Refresh every minute
    }
  )

  const updateFilters = useCallback((newFilters: Partial<InvestmentFilters>) => {
    return investmentsQuery.updateParams(newFilters)
  }, [investmentsQuery])

  // Computed values
  const activeInvestments = useMemo(() => 
    investmentsQuery.data.filter(inv => inv.status === 'confirmed' && inv.tokensVesting > 0),
    [investmentsQuery.data]
  )

  const completedInvestments = useMemo(() => 
    investmentsQuery.data.filter(inv => inv.status === 'completed'),
    [investmentsQuery.data]
  )

  const pendingInvestments = useMemo(() => 
    investmentsQuery.data.filter(inv => inv.status === 'pending'),
    [investmentsQuery.data]
  )

  const totalInvested = useMemo(() => 
    investmentsQuery.data.reduce((sum, inv) => sum + inv.amount, 0),
    [investmentsQuery.data]
  )

  const totalCurrentValue = useMemo(() => 
    investmentsQuery.data.reduce((sum, inv) => sum + (inv.currentValue || 0), 0),
    [investmentsQuery.data]
  )

  const totalGains = useMemo(() => 
    totalCurrentValue - totalInvested,
    [totalCurrentValue, totalInvested]
  )

  const gainsPercentage = useMemo(() => 
    totalInvested > 0 ? ((totalGains / totalInvested) * 100) : 0,
    [totalGains, totalInvested]
  )

  return {
    ...investmentsQuery,
    updateFilters,
    activeInvestments,
    completedInvestments,
    pendingInvestments,
    totalInvested,
    totalCurrentValue,
    totalGains,
    gainsPercentage,
  }
}

// ===== SINGLE INVESTMENT HOOK =====
export function useInvestment(investmentId: string | undefined) {
  const investmentQuery = useApi<InvestmentDetails>(
    investmentId ? `/investments/${investmentId}` : '',
    {
      immediate: !!investmentId,
      refreshInterval: 60000, // Refresh every minute
    }
  )

  // Get next vesting date
  const nextVesting = useMemo(() => {
    if (!investmentQuery.data?.vestingSchedule) return null
    
    const now = new Date()
    const nextUnlock = investmentQuery.data.vestingSchedule
      .filter(v => v.status === 'locked' && new Date(v.unlockDate) > now)
      .sort((a, b) => new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime())[0]
    
    return nextUnlock ? new Date(nextUnlock.unlockDate) : null
  }, [investmentQuery.data])

  // Calculate vesting progress
  const vestingProgress = useMemo(() => {
    if (!investmentQuery.data?.vestingSchedule) return 0
    
    const totalSchedule = investmentQuery.data.vestingSchedule.length
    const completedSchedule = investmentQuery.data.vestingSchedule.filter(v => v.status === 'claimed').length
    
    return totalSchedule > 0 ? Math.round((completedSchedule / totalSchedule) * 100) : 0
  }, [investmentQuery.data])

  // Get claimable amount
  const claimableAmount = useMemo(() => {
    if (!investmentQuery.data?.vestingSchedule) return 0
    
    const now = new Date()
    return investmentQuery.data.vestingSchedule
      .filter(v => v.status === 'unlocked' && new Date(v.unlockDate) <= now)
      .reduce((sum, v) => sum + (v.percentage / 100) * investmentQuery.data!.tokensAllocated, 0)
  }, [investmentQuery.data])

  return {
    ...investmentQuery,
    investment: investmentQuery.data,
    nextVesting,
    vestingProgress,
    claimableAmount,
  }
}

// ===== TOKEN CLAIMING HOOK =====
export function useTokenClaiming() {
  const claimMutation = useMutation<
    { txHash: string; amount: number; message: string },
    ClaimRequest
  >(
    (data) => api.post('/investments/claim', data),
    {
      onSuccess: (result) => {
        toast.success(`${result.amount} tokens reivindicados com sucesso!`)
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao reivindicar tokens')
      }
    }
  )

  const claimTokens = useCallback(async (data: ClaimRequest) => {
    return claimMutation.mutate(data)
  }, [claimMutation])

  return {
    claimTokens,
    claiming: claimMutation.loading,
    claimResult: claimMutation.data,
    error: claimMutation.error,
  }
}

// ===== CLAIMABLE TOKENS HOOK =====
export function useClaimableTokens() {
  const claimableQuery = useApi<{
    totalClaimable: number
    investments: Array<{
      investmentId: string
      projectName: string
      projectSymbol: string
      amount: number
      nextUnlockDate?: string
    }>
  }>(
    '/investments/claimable',
    {
      refreshInterval: 60000, // Refresh every minute
    }
  )

  const claimAllMutation = useMutation<
    { txHashes: string[]; totalAmount: number; message: string },
    { walletAddress: string; signature: string }
  >(
    (data) => api.post('/investments/claim-all', data),
    {
      onSuccess: (result) => {
        toast.success(`${result.totalAmount} tokens reivindicados com sucesso!`)
        claimableQuery.refresh()
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao reivindicar todos os tokens')
      }
    }
  )

  const claimAll = useCallback(async (walletAddress: string, signature: string) => {
    return claimAllMutation.mutate({ walletAddress, signature })
  }, [claimAllMutation])

  return {
    ...claimableQuery,
    claimable: claimableQuery.data,
    claimAll,
    claimingAll: claimAllMutation.loading,
    claimAllResult: claimAllMutation.data,
    claimAllError: claimAllMutation.error,
  }
}

// ===== INVESTMENT STATS HOOK =====
export function useInvestmentStats() {
  const statsQuery = useApi<UserStats>(
    '/investments/stats',
    {
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  )

  return {
    stats: statsQuery.data,
    loading: statsQuery.loading,
    error: statsQuery.error,
    refresh: statsQuery.refresh,
  }
}

// ===== INVESTMENT HISTORY HOOK =====
export function useInvestmentHistory(timeRange: '24h' | '7d' | '30d' | '90d' | 'all' = '30d') {
  const historyQuery = useApi<{
    investments: Array<{
      date: string
      amount: number
      currency: string
      project: string
      type: 'investment' | 'claim' | 'refund'
    }>
    totalVolume: number
    totalTransactions: number
    averageInvestment: number
  }>(
    `/investments/history?range=${timeRange}`,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  )

  const updateTimeRange = useCallback((newRange: typeof timeRange) => {
    return historyQuery.execute(`/investments/history?range=${newRange}`)
  }, [historyQuery])

  return {
    ...historyQuery,
    history: historyQuery.data,
    updateTimeRange,
  }
}

// ===== ROI TRACKING HOOK =====
export function useROITracking() {
  const roiQuery = useApi<{
    overall: {
      totalInvested: number
      currentValue: number
      realizedGains: number
      unrealizedGains: number
      roi: number
    }
    byProject: Array<{
      projectId: string
      projectName: string
      invested: number
      currentValue: number
      roi: number
      status: string
    }>
    historical: Array<{
      date: string
      portfolioValue: number
      roi: number
    }>
  }>(
    '/investments/roi',
    {
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  )

  const getBestPerformer = useMemo(() => {
    if (!roiQuery.data?.byProject) return null
    return roiQuery.data.byProject.reduce((best, current) => 
      current.roi > best.roi ? current : best
    )
  }, [roiQuery.data])

  const getWorstPerformer = useMemo(() => {
    if (!roiQuery.data?.byProject) return null
    return roiQuery.data.byProject.reduce((worst, current) => 
      current.roi < worst.roi ? current : worst
    )
  }, [roiQuery.data])

  return {
    ...roiQuery,
    roi: roiQuery.data,
    bestPerformer: getBestPerformer,
    worstPerformer: getWorstPerformer,
  }
}

// ===== INVESTMENT ALERTS HOOK =====
export function useInvestmentAlerts() {
  const alertsQuery = useApi<Array<{
    id: string
    type: 'price_target' | 'roi_target' | 'vesting_unlock' | 'phase_change'
    projectId: string
    projectName: string
    condition: any
    isActive: boolean
    createdAt: string
  }>>(
    '/investments/alerts',
    {
      refreshInterval: 60000, // Refresh every minute
    }
  )

  const createAlertMutation = useMutation<
    { id: string; message: string },
    {
      type: string
      projectId: string
      condition: any
    }
  >(
    (data) => api.post('/investments/alerts', data),
    {
      onSuccess: () => {
        toast.success('Alerta criado com sucesso!')
        alertsQuery.refresh()
      }
    }
  )

  const deleteAlertMutation = useMutation<
    { message: string },
    { alertId: string }
  >(
    (data) => api.delete(`/investments/alerts/${data.alertId}`),
    {
      onSuccess: () => {
        toast.success('Alerta removido')
        alertsQuery.refresh()
      }
    }
  )

  const createAlert = useCallback(async (data: {
    type: string
    projectId: string
    condition: any
  }) => {
    return createAlertMutation.mutate(data)
  }, [createAlertMutation])

  const deleteAlert = useCallback(async (alertId: string) => {
    return deleteAlertMutation.mutate({ alertId })
  }, [deleteAlertMutation])

  return {
    ...alertsQuery,
    alerts: alertsQuery.data || [],
    createAlert,
    deleteAlert,
    creatingAlert: createAlertMutation.loading,
    deletingAlert: deleteAlertMutation.loading,
  }
}

// ===== PORTFOLIO DIVERSIFICATION HOOK =====
export function usePortfolioDiversification() {
  const diversificationQuery = useApi<{
    byCategory: Array<{
      category: string
      value: number
      percentage: number
      count: number
    }>
    byNetwork: Array<{
      network: string
      value: number
      percentage: number
      count: number
    }>
    byRiskLevel: Array<{
      level: 'low' | 'medium' | 'high'
      value: number
      percentage: number
      count: number
    }>
    diversificationScore: number
    recommendations: string[]
  }>(
    '/investments/diversification',
    {
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  )

  return {
    ...diversificationQuery,
    diversification: diversificationQuery.data,
  }
}

// ===== INVESTMENT COMPARISON HOOK =====
export function useInvestmentComparison(investmentIds: string[]) {
  const comparisonQuery = useApi<{
    investments: Array<{
      id: string
      projectName: string
      invested: number
      currentValue: number
      roi: number
      timeHeld: number
      risk: string
      status: string
    }>
    metrics: {
      totalInvested: number
      averageRoi: number
      bestPerformer: string
      worstPerformer: string
    }
  }>(
    investmentIds.length > 0 ? `/investments/compare?ids=${investmentIds.join(',')}` : '',
    {
      immediate: investmentIds.length > 0,
    }
  )

  return {
    ...comparisonQuery,
    comparison: comparisonQuery.data,
  }
}

export default useInvestments
