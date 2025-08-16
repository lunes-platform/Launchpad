// ========================================
// HOOKS INDEX - Launchpad Lunes Frontend
// ========================================

// Re-export all hooks for easy importing

// Base API hooks
export { 
  useApi, 
  useMutation, 
  usePaginated, 
  useInfinite, 
  useApiWithCache,
  type UseApiState,
  type UseApiOptions,
  type UseMutationState,
  type UseMutationOptions,
  type UsePaginatedState,
  type UseInfiniteState
} from './useApi'

// Authentication hooks
export { 
  useAuth, 
  AuthProvider, 
  useKycStatus, 
  usePasswordManager, 
  use2FA, 
  useSession 
} from './useAuth'

// Project hooks
export { 
  useProjects, 
  useProject, 
  useProjectInvestment, 
  useProjectWhitelist, 
  useProjectCategories, 
  useProjectStats, 
  useFeaturedProjects, 
  useProjectSearch, 
  useProjectPrices, 
  useProjectAnalytics, 
  useProjectNotifications, 
  useTrendingProjects 
} from './useProjects'

// Investment hooks
export { 
  useInvestments, 
  useInvestment, 
  useTokenClaiming, 
  useClaimableTokens, 
  useInvestmentStats, 
  useInvestmentHistory, 
  useROITracking, 
  useInvestmentAlerts, 
  usePortfolioDiversification, 
  useInvestmentComparison 
} from './useInvestments'

// Staking hooks
export { 
  useStakingPools, 
  useStakingPool, 
  useUserStaking, 
  useStakingActions, 
  useLaunchpoolProjects, 
  useLaunchpoolProject, 
  useUserLaunchpool, 
  useLaunchpoolActions, 
  useStakingCalculator, 
  useStakingAnalytics, 
  useStakingNotifications 
} from './useStaking'

// Notification hooks
export { 
  useNotifications, 
  useNotificationActions, 
  useNotificationPreferences, 
  usePushNotifications, 
  useNotificationTemplates, 
  useInAppNotifications 
} from './useNotifications'

// Wallet hook (external)
export { useWallet } from '@/contexts/WalletContext'

// Common hook patterns for easy access
export type {
  // API types
  ApiResponse,
  PaginatedResponse,
  ApiError,
  
  // Entity types
  User,
  Project,
  Investment,
  InvestmentDetails,
  StakingPool,
  UserStaking,
  LaunchpoolProject,
  UserLaunchpoolStaking,
  Notification,
  
  // Request types
  LoginRequest,
  RegisterRequest,
  InvestmentRequest,
  ClaimRequest,
  StakingRequest,
  
  // Filter types
  ProjectFilters,
  InvestmentFilters,
  TransactionFilters,
} from '@/types/api'
