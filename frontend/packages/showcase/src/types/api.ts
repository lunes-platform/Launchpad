// ========================================
// API TYPES - Launchpad Lunes Frontend
// ========================================

// ===== BASE TYPES =====
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  success: boolean
  message?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  statusCode?: number
}

// ===== USER TYPES =====
export interface User {
  id: string
  email: string
  walletAddress: string
  walletType: 'SubWallet' | 'Polkadot.js' | 'Talisman'
  username?: string
  firstName?: string
  lastName?: string
  avatar?: string
  isVerified: boolean
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_started'
  role: 'user' | 'admin' | 'moderator'
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  language: 'pt' | 'en' | 'es'
  currency: 'USD' | 'BRL'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    profilePublic: boolean
    activityPublic: boolean
  }
}

export interface UserStats {
  totalInvested: number
  totalValue: number
  totalGains: number
  gainsPercentage: number
  activeInvestments: number
  completedInvestments: number
  pendingClaims: number
  totalClaimed: number
}

// ===== PROJECT TYPES =====
export interface Project {
  id: string
  name: string
  symbol: string
  description: string
  longDescription: string
  logo: string
  website: string
  whitepaper: string
  social: {
    twitter?: string
    telegram?: string
    discord?: string
    medium?: string
  }
  category: 'DeFi' | 'Gaming' | 'NFT' | 'Infrastructure' | 'AI' | 'Metaverse'
  network: 'Lunes' | 'Ethereum' | 'BSC' | 'Polygon' | 'Solana'
  status: 'draft' | 'whitelist' | 'active' | 'completed' | 'cancelled'
  phases: ProjectPhase[]
  tokenomics: Tokenomics
  team: TeamMember[]
  roadmap: RoadmapItem[]
  metrics: ProjectMetrics
  createdAt: string
  updatedAt: string
}

export interface ProjectPhase {
  id: string
  name: string
  type: 'whitelist' | 'presale' | 'public' | 'vesting'
  startDate: string
  endDate: string
  tokenPrice: number
  totalTokens: number
  soldTokens: number
  minAllocation: number
  maxAllocation: number
  vestingSchedule?: VestingSchedule[]
  requirements: PhaseRequirements
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
}

export interface VestingSchedule {
  percentage: number
  unlockDate: string
  status: 'locked' | 'unlocked' | 'claimed'
}

export interface PhaseRequirements {
  kycRequired: boolean
  minStaking?: number
  whitelist?: boolean
  previousParticipation?: boolean
}

export interface Tokenomics {
  totalSupply: number
  initialCirculating: number
  distribution: {
    publicSale: number
    privateSale: number
    team: number
    advisors: number
    liquidity: number
    marketing: number
    reserve: number
  }
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  avatar?: string
  linkedin?: string
  twitter?: string
}

export interface RoadmapItem {
  quarter: string
  year: number
  milestones: string[]
  status: 'completed' | 'in_progress' | 'upcoming'
}

export interface ProjectMetrics {
  totalRaised: number
  participantsCount: number
  averageAllocation: number
  socialMetrics: {
    twitterFollowers?: number
    telegramMembers?: number
    discordMembers?: number
  }
}

// ===== INVESTMENT TYPES =====
export interface Investment {
  id: string
  userId: string
  projectId: string
  phaseId: string
  amount: number
  currency: 'USDT' | 'USDC' | 'LUNES'
  tokensAllocated: number
  tokensReceived: number
  tokensVesting: number
  tokensClaimed: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  transactionHash?: string
  vestingSchedule: VestingSchedule[]
  createdAt: string
  updatedAt: string
}

export interface InvestmentDetails extends Investment {
  project: Project
  phase: ProjectPhase
  currentValue: number
  roi: number
  roiPercentage: number
  nextVestingDate?: string
  claimableTokens: number
}

// ===== TRANSACTION TYPES =====
export interface Transaction {
  id: string
  userId: string
  type: 'investment' | 'claim' | 'staking' | 'unstaking' | 'referral'
  amount: number
  currency: string
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled'
  transactionHash?: string
  blockNumber?: number
  gasUsed?: number
  gasPrice?: number
  fee?: number
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

// ===== STAKING TYPES =====
export interface StakingPool {
  id: string
  name: string
  token: string
  apy: number
  totalStaked: number
  totalRewards: number
  minStaking: number
  maxStaking?: number
  lockPeriod: number // em dias
  status: 'active' | 'inactive' | 'completed'
  startDate: string
  endDate?: string
}

export interface UserStaking {
  id: string
  userId: string
  poolId: string
  amount: number
  rewards: number
  unclaimedRewards: number
  startDate: string
  endDate: string
  status: 'active' | 'completed' | 'withdrawn'
}

// ===== AIRDROP TYPES =====
export interface Airdrop {
  id: string
  name: string
  description: string
  project: string
  token: string
  totalAmount: number
  distributedAmount: number
  participantsCount: number
  requirements: AirdropRequirements
  startDate: string
  endDate: string
  claimStartDate: string
  claimEndDate: string
  status: 'upcoming' | 'active' | 'claiming' | 'completed'
}

export interface AirdropRequirements {
  minHolding?: number
  token?: string
  socialTasks?: {
    followTwitter?: boolean
    joinTelegram?: boolean
    sharePost?: boolean
  }
  participationHistory?: boolean
}

export interface UserAirdrop {
  id: string
  userId: string
  airdropId: string
  allocation: number
  claimed: number
  claimableAmount: number
  eligibilityChecked: boolean
  isEligible: boolean
  claimTransactionHash?: string
  claimedAt?: string
}

// ===== LAUNCHPOOL TYPES =====
export interface LaunchpoolProject {
  id: string
  name: string
  symbol: string
  description: string
  logo: string
  stakingToken: string
  rewardToken: string
  totalRewards: number
  distributedRewards: number
  totalStaked: number
  apy: number
  startDate: string
  endDate: string
  status: 'upcoming' | 'active' | 'completed'
}

export interface UserLaunchpoolStaking {
  id: string
  userId: string
  projectId: string
  stakedAmount: number
  earnedRewards: number
  claimedRewards: number
  claimableRewards: number
  lastClaimDate?: string
  status: 'active' | 'completed'
}

// ===== NOTIFICATION TYPES =====
export interface Notification {
  id: string
  userId: string
  type: 'investment' | 'claim' | 'airdrop' | 'announcement' | 'security'
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  readAt?: string
}

// ===== ADMIN TYPES =====
export interface AdminStats {
  totalUsers: number
  totalProjects: number
  totalInvestments: number
  totalVolume: number
  activeProjects: number
  pendingKyc: number
  recentSignups: number
  platformFees: number
}

export interface AdminUser extends User {
  permissions: string[]
  lastLogin?: string
  loginCount: number
  investmentStats: UserStats
}

// ===== WALLET TYPES =====
export interface Wallet {
  address: string
  name: string
  type: 'SubWallet' | 'Polkadot.js' | 'Talisman'
  isConnected: boolean
  balances: {
    [token: string]: number
  }
}

export interface TokenBalance {
  token: string
  symbol: string
  balance: number
  valueUsd: number
  logo?: string
}

// ===== REQUEST/RESPONSE TYPES =====
export interface LoginRequest {
  walletAddress: string
  signature: string
  message: string
}

export interface RegisterRequest {
  walletAddress: string
  walletType: string
  signature: string
  message: string
  email?: string
  username?: string
}

export interface InvestmentRequest {
  projectId: string
  phaseId: string
  amount: number
  currency: string
  walletAddress: string
  signature: string
}

export interface ClaimRequest {
  investmentId: string
  amount: number
  walletAddress: string
  signature: string
}

export interface StakingRequest {
  poolId: string
  amount: number
  walletAddress: string
  signature: string
}

// ===== QUERY TYPES =====
export interface ProjectFilters {
  category?: string
  status?: string
  network?: string
  search?: string
  sortBy?: 'name' | 'created' | 'funded' | 'participants'
  sortOrder?: 'asc' | 'desc'
}

export interface InvestmentFilters {
  status?: string
  project?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'date' | 'amount' | 'roi'
  sortOrder?: 'asc' | 'desc'
}

export interface TransactionFilters {
  type?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'date' | 'amount'
  sortOrder?: 'asc' | 'desc'
}

// ===== WEBSOCKET TYPES =====
export interface WebSocketMessage {
  type: 'price_update' | 'investment_update' | 'notification' | 'phase_update'
  data: any
  timestamp: string
}

export interface PriceUpdate {
  token: string
  price: number
  change24h: number
  volume24h: number
}

// ===== EXPORT ALL =====
export type {
  // Core
  ApiResponse,
  PaginatedResponse,
  ApiError,
  
  // User
  User,
  UserPreferences,
  UserStats,
  
  // Project
  Project,
  ProjectPhase,
  VestingSchedule,
  PhaseRequirements,
  Tokenomics,
  TeamMember,
  RoadmapItem,
  ProjectMetrics,
  
  // Investment
  Investment,
  InvestmentDetails,
  
  // Transaction
  Transaction,
  
  // Staking
  StakingPool,
  UserStaking,
  
  // Airdrop
  Airdrop,
  AirdropRequirements,
  UserAirdrop,
  
  // Launchpool
  LaunchpoolProject,
  UserLaunchpoolStaking,
  
  // Notification
  Notification,
  
  // Admin
  AdminStats,
  AdminUser,
  
  // Wallet
  Wallet,
  TokenBalance,
  
  // Requests
  LoginRequest,
  RegisterRequest,
  InvestmentRequest,
  ClaimRequest,
  StakingRequest,
  
  // Filters
  ProjectFilters,
  InvestmentFilters,
  TransactionFilters,
  
  // WebSocket
  WebSocketMessage,
  PriceUpdate
}
