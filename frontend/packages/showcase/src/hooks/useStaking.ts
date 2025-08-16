// ========================================
// STAKING HOOKS - Launchpad Lunes Frontend
// ========================================

import { useCallback, useMemo } from 'react'
import { useApi, usePaginated, useMutation } from './useApi'
import { api } from '@/lib/api'
import { 
  StakingPool,
  UserStaking,
  LaunchpoolProject,
  UserLaunchpoolStaking,
  StakingRequest
} from '@/types/api'
import toast from 'react-hot-toast'

// ===== STAKING POOLS HOOK =====
export function useStakingPools() {
  const poolsQuery = useApi<StakingPool[]>(
    '/staking/pools',
    {
      refreshInterval: 60000, // Refresh every minute
    }
  )

  // Computed values
  const activePools = useMemo(() => 
    (poolsQuery.data || []).filter(pool => pool.status === 'active'),
    [poolsQuery.data]
  )

  const inactivePools = useMemo(() => 
    (poolsQuery.data || []).filter(pool => pool.status === 'inactive'),
    [poolsQuery.data]
  )

  const completedPools = useMemo(() => 
    (poolsQuery.data || []).filter(pool => pool.status === 'completed'),
    [poolsQuery.data]
  )

  const getPoolById = useCallback((poolId: string) => {
    return poolsQuery.data?.find(pool => pool.id === poolId)
  }, [poolsQuery.data])

  return {
    ...poolsQuery,
    pools: poolsQuery.data || [],
    activePools,
    inactivePools,
    completedPools,
    getPoolById,
  }
}

// ===== SINGLE STAKING POOL HOOK =====
export function useStakingPool(poolId: string | undefined) {
  const poolQuery = useApi<StakingPool & {
    userStaking?: UserStaking
    availableToStake: number
    estimatedRewards: number
    participants: number
  }>(
    poolId ? `/staking/pools/${poolId}` : '',
    {
      immediate: !!poolId,
      refreshInterval: 60000, // Refresh every minute
    }
  )

  return {
    ...poolQuery,
    pool: poolQuery.data,
  }
}

// ===== USER STAKING HOOK =====
export function useUserStaking() {
  const stakingQuery = usePaginated<UserStaking & {
    pool: StakingPool
    estimatedRewards: number
    canUnstake: boolean
    remainingLockTime: number
  }>(
    '/staking/user',
    { sortBy: 'startDate', sortOrder: 'desc' },
    {
      refreshInterval: 60000, // Refresh every minute
    }
  )

  // Computed values
  const activeStaking = useMemo(() => 
    stakingQuery.data.filter(stake => stake.status === 'active'),
    [stakingQuery.data]
  )

  const completedStaking = useMemo(() => 
    stakingQuery.data.filter(stake => stake.status === 'completed'),
    [stakingQuery.data]
  )

  const totalStaked = useMemo(() => 
    activeStaking.reduce((sum, stake) => sum + stake.amount, 0),
    [activeStaking]
  )

  const totalRewards = useMemo(() => 
    stakingQuery.data.reduce((sum, stake) => sum + stake.rewards, 0),
    [stakingQuery.data]
  )

  const estimatedDailyRewards = useMemo(() => 
    activeStaking.reduce((sum, stake) => sum + (stake.estimatedRewards || 0), 0),
    [activeStaking]
  )

  return {
    ...stakingQuery,
    activeStaking,
    completedStaking,
    totalStaked,
    totalRewards,
    estimatedDailyRewards,
  }
}

// ===== STAKING ACTIONS HOOK =====
export function useStakingActions() {
  const stakeMutation = useMutation<
    { txHash: string; stakingId: string; message: string },
    StakingRequest
  >(
    (data) => api.post('/staking/stake', data),
    {
      onSuccess: (result) => {
        toast.success(`${result.message} - Staking realizado com sucesso!`)
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao realizar staking')
      }
    }
  )

  const unstakeMutation = useMutation<
    { txHash: string; amount: number; rewards: number; message: string },
    { stakingId: string; walletAddress: string; signature: string }
  >(
    (data) => api.post('/staking/unstake', data),
    {
      onSuccess: (result) => {
        toast.success(`Unstaking realizado! ${result.amount} + ${result.rewards} rewards`)
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao realizar unstaking')
      }
    }
  )

  const claimRewardsMutation = useMutation<
    { txHash: string; amount: number; message: string },
    { stakingId: string; walletAddress: string; signature: string }
  >(
    (data) => api.post('/staking/claim-rewards', data),
    {
      onSuccess: (result) => {
        toast.success(`${result.amount} rewards reivindicados com sucesso!`)
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao reivindicar rewards')
      }
    }
  )

  const stake = useCallback(async (data: StakingRequest) => {
    return stakeMutation.mutate(data)
  }, [stakeMutation])

  const unstake = useCallback(async (stakingId: string, walletAddress: string, signature: string) => {
    return unstakeMutation.mutate({ stakingId, walletAddress, signature })
  }, [unstakeMutation])

  const claimRewards = useCallback(async (stakingId: string, walletAddress: string, signature: string) => {
    return claimRewardsMutation.mutate({ stakingId, walletAddress, signature })
  }, [claimRewardsMutation])

  return {
    stake,
    unstake,
    claimRewards,
    staking: stakeMutation.loading,
    unstaking: unstakeMutation.loading,
    claiming: claimRewardsMutation.loading,
    stakeResult: stakeMutation.data,
    unstakeResult: unstakeMutation.data,
    claimResult: claimRewardsMutation.data,
    error: stakeMutation.error || unstakeMutation.error || claimRewardsMutation.error,
  }
}

// ===== LAUNCHPOOL PROJECTS HOOK =====
export function useLaunchpoolProjects() {
  const projectsQuery = useApi<LaunchpoolProject[]>(
    '/launchpool/projects',
    {
      refreshInterval: 60000, // Refresh every minute
    }
  )

  // Computed values
  const activeProjects = useMemo(() => 
    (projectsQuery.data || []).filter(project => project.status === 'active'),
    [projectsQuery.data]
  )

  const upcomingProjects = useMemo(() => 
    (projectsQuery.data || []).filter(project => project.status === 'upcoming'),
    [projectsQuery.data]
  )

  const completedProjects = useMemo(() => 
    (projectsQuery.data || []).filter(project => project.status === 'completed'),
    [projectsQuery.data]
  )

  return {
    ...projectsQuery,
    projects: projectsQuery.data || [],
    activeProjects,
    upcomingProjects,
    completedProjects,
  }
}

// ===== SINGLE LAUNCHPOOL PROJECT HOOK =====
export function useLaunchpoolProject(projectId: string | undefined) {
  const projectQuery = useApi<LaunchpoolProject & {
    userStaking?: UserLaunchpoolStaking
    stakingProgress: number
    rewardRate: number
    timeRemaining: number
    participants: number
  }>(
    projectId ? `/launchpool/projects/${projectId}` : '',
    {
      immediate: !!projectId,
      refreshInterval: 60000, // Refresh every minute
    }
  )

  return {
    ...projectQuery,
    project: projectQuery.data,
  }
}

// ===== USER LAUNCHPOOL STAKING HOOK =====
export function useUserLaunchpool() {
  const stakingQuery = usePaginated<UserLaunchpoolStaking & {
    project: LaunchpoolProject
    rewardRate: number
    estimatedDailyRewards: number
  }>(
    '/launchpool/user',
    { sortBy: 'createdAt', sortOrder: 'desc' },
    {
      refreshInterval: 60000, // Refresh every minute
    }
  )

  // Computed values
  const activeStaking = useMemo(() => 
    stakingQuery.data.filter(stake => stake.status === 'active'),
    [stakingQuery.data]
  )

  const completedStaking = useMemo(() => 
    stakingQuery.data.filter(stake => stake.status === 'completed'),
    [stakingQuery.data]
  )

  const totalStaked = useMemo(() => 
    activeStaking.reduce((sum, stake) => sum + stake.stakedAmount, 0),
    [activeStaking]
  )

  const totalRewards = useMemo(() => 
    stakingQuery.data.reduce((sum, stake) => sum + stake.earnedRewards, 0),
    [stakingQuery.data]
  )

  const totalClaimable = useMemo(() => 
    stakingQuery.data.reduce((sum, stake) => sum + stake.claimableRewards, 0),
    [stakingQuery.data]
  )

  return {
    ...stakingQuery,
    activeStaking,
    completedStaking,
    totalStaked,
    totalRewards,
    totalClaimable,
  }
}

// ===== LAUNCHPOOL ACTIONS HOOK =====
export function useLaunchpoolActions() {
  const stakeMutation = useMutation<
    { txHash: string; stakingId: string; message: string },
    { projectId: string; amount: number; walletAddress: string; signature: string }
  >(
    (data) => api.post('/launchpool/stake', data),
    {
      onSuccess: (result) => {
        toast.success('Staking no Launchpool realizado com sucesso!')
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao realizar staking no Launchpool')
      }
    }
  )

  const unstakeMutation = useMutation<
    { txHash: string; amount: number; message: string },
    { stakingId: string; walletAddress: string; signature: string }
  >(
    (data) => api.post('/launchpool/unstake', data),
    {
      onSuccess: (result) => {
        toast.success(`Unstaking realizado! ${result.amount} LUNES retirados`)
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao realizar unstaking')
      }
    }
  )

  const claimRewardsMutation = useMutation<
    { txHash: string; amount: number; token: string; message: string },
    { stakingId: string; walletAddress: string; signature: string }
  >(
    (data) => api.post('/launchpool/claim', data),
    {
      onSuccess: (result) => {
        toast.success(`${result.amount} ${result.token} reivindicados com sucesso!`)
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao reivindicar rewards')
      }
    }
  )

  const stake = useCallback(async (projectId: string, amount: number, walletAddress: string, signature: string) => {
    return stakeMutation.mutate({ projectId, amount, walletAddress, signature })
  }, [stakeMutation])

  const unstake = useCallback(async (stakingId: string, walletAddress: string, signature: string) => {
    return unstakeMutation.mutate({ stakingId, walletAddress, signature })
  }, [unstakeMutation])

  const claimRewards = useCallback(async (stakingId: string, walletAddress: string, signature: string) => {
    return claimRewardsMutation.mutate({ stakingId, walletAddress, signature })
  }, [claimRewardsMutation])

  return {
    stake,
    unstake,
    claimRewards,
    staking: stakeMutation.loading,
    unstaking: unstakeMutation.loading,
    claiming: claimRewardsMutation.loading,
    stakeResult: stakeMutation.data,
    unstakeResult: unstakeMutation.data,
    claimResult: claimRewardsMutation.data,
    error: stakeMutation.error || unstakeMutation.error || claimRewardsMutation.error,
  }
}

// ===== STAKING CALCULATOR HOOK =====
export function useStakingCalculator() {
  const calculateRewards = useCallback((
    amount: number,
    apy: number,
    lockPeriod: number, // in days
    compoundFrequency: 'daily' | 'weekly' | 'monthly' = 'daily'
  ) => {
    if (amount <= 0 || apy <= 0 || lockPeriod <= 0) {
      return {
        totalRewards: 0,
        finalAmount: amount,
        dailyRewards: 0,
        monthlyRewards: 0,
        apy: 0,
      }
    }

    const dailyRate = apy / 365 / 100
    const periods = lockPeriod
    
    let compoundPeriods: number
    let periodRate: number

    switch (compoundFrequency) {
      case 'daily':
        compoundPeriods = periods
        periodRate = dailyRate
        break
      case 'weekly':
        compoundPeriods = periods / 7
        periodRate = dailyRate * 7
        break
      case 'monthly':
        compoundPeriods = periods / 30
        periodRate = dailyRate * 30
        break
      default:
        compoundPeriods = periods
        periodRate = dailyRate
    }

    const finalAmount = amount * Math.pow(1 + periodRate, compoundPeriods)
    const totalRewards = finalAmount - amount
    const dailyRewards = totalRewards / periods
    const monthlyRewards = dailyRewards * 30

    return {
      totalRewards,
      finalAmount,
      dailyRewards,
      monthlyRewards,
      apy,
    }
  }, [])

  return {
    calculateRewards,
  }
}

// ===== STAKING ANALYTICS HOOK =====
export function useStakingAnalytics(timeRange: '24h' | '7d' | '30d' | '90d' = '30d') {
  const analyticsQuery = useApi<{
    totalStaked: number
    totalRewards: number
    averageApy: number
    totalParticipants: number
    stakingHistory: Array<{
      date: string
      totalStaked: number
      totalRewards: number
      participants: number
    }>
    topPools: Array<{
      poolId: string
      name: string
      totalStaked: number
      apy: number
      participants: number
    }>
  }>(
    `/staking/analytics?range=${timeRange}`,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  )

  const updateTimeRange = useCallback((newRange: typeof timeRange) => {
    return analyticsQuery.execute(`/staking/analytics?range=${newRange}`)
  }, [analyticsQuery])

  return {
    ...analyticsQuery,
    analytics: analyticsQuery.data,
    updateTimeRange,
  }
}

// ===== STAKING NOTIFICATIONS HOOK =====
export function useStakingNotifications() {
  const notificationsQuery = useApi<Array<{
    id: string
    type: 'unlock_reminder' | 'reward_available' | 'pool_ending' | 'new_pool'
    message: string
    data: any
    read: boolean
    createdAt: string
  }>>(
    '/staking/notifications',
    {
      refreshInterval: 60000, // Refresh every minute
    }
  )

  const markAsReadMutation = useMutation<
    { message: string },
    { notificationId: string }
  >(
    (data) => api.patch(`/staking/notifications/${data.notificationId}/read`),
    {
      onSuccess: () => {
        notificationsQuery.refresh()
      }
    }
  )

  const markAllAsReadMutation = useMutation<
    { message: string },
    void
  >(
    () => api.patch('/staking/notifications/read-all'),
    {
      onSuccess: () => {
        notificationsQuery.refresh()
      }
    }
  )

  const markAsRead = useCallback(async (notificationId: string) => {
    return markAsReadMutation.mutate({ notificationId })
  }, [markAsReadMutation])

  const markAllAsRead = useCallback(async () => {
    return markAllAsReadMutation.mutate()
  }, [markAllAsReadMutation])

  const unreadCount = useMemo(() => {
    return (notificationsQuery.data || []).filter(n => !n.read).length
  }, [notificationsQuery.data])

  return {
    ...notificationsQuery,
    notifications: notificationsQuery.data || [],
    markAsRead,
    markAllAsRead,
    unreadCount,
    markingAsRead: markAsReadMutation.loading,
    markingAllAsRead: markAllAsReadMutation.loading,
  }
}

export default useStakingPools
