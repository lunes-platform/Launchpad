// ========================================
// MOCK DATA - Dados Realistas para Testes
// ========================================

import { 
  Project, 
  Investment, 
  InvestmentDetails, 
  User, 
  StakingPool, 
  UserStaking,
  LaunchpoolProject,
  Notification,
  Transaction 
} from '@/types/api'

// ===== USUÁRIO MOCK =====
export const mockUser: User = {
  id: 'user-123',
  email: 'investor@luneslaunchpad.com',
  walletAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKUtQY',
  walletType: 'SubWallet',
  username: 'CryptoInvestor2024',
  firstName: 'João',
  lastName: 'Silva',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  isVerified: true,
  kycStatus: 'approved',
  role: 'user',
  preferences: {
    language: 'pt',
    currency: 'USD',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profilePublic: false,
      activityPublic: true,
    },
  },
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-02-01T14:20:00Z',
}

// ===== PROJETOS MOCK =====
export const mockProjects: Project[] = [
  {
    id: 'defi-protocol-2024',
    name: 'DeFi Protocol',
    symbol: 'DFP',
    description: 'Protocolo DeFi inovador com yield farming automático e liquidity mining avançado',
    longDescription: 'O DeFi Protocol é uma plataforma revolucionária que combina yield farming automático, liquidity mining e governança descentralizada. Nossa solução permite que usuários maximizem seus retornos através de estratégias algorítmicas inteligentes.',
    logo: '🔷',
    website: 'https://defiprotocol.finance',
    whitepaper: 'https://defiprotocol.finance/whitepaper.pdf',
    social: {
      twitter: 'https://twitter.com/defiprotocol',
      telegram: 'https://t.me/defiprotocol',
      discord: 'https://discord.gg/defiprotocol',
    },
    category: 'DeFi',
    network: 'Lunes',
    status: 'active',
    phases: [
      {
        id: 'phase-1',
        name: 'Whitelist',
        type: 'whitelist',
        startDate: '2024-02-10T00:00:00Z',
        endDate: '2024-02-20T23:59:59Z',
        tokenPrice: 0.08,
        totalTokens: 1000000,
        soldTokens: 750000,
        minAllocation: 100,
        maxAllocation: 5000,
        requirements: {
          kycRequired: true,
          minStaking: 1000,
          whitelist: true,
        },
        status: 'completed',
      },
      {
        id: 'phase-2',
        name: 'Pré-Venda',
        type: 'presale',
        startDate: '2024-02-21T00:00:00Z',
        endDate: '2024-03-05T23:59:59Z',
        tokenPrice: 0.12,
        totalTokens: 2000000,
        soldTokens: 1650000,
        minAllocation: 50,
        maxAllocation: 10000,
        vestingSchedule: [
          { percentage: 25, unlockDate: '2024-03-06T00:00:00Z', status: 'unlocked' },
          { percentage: 25, unlockDate: '2024-04-06T00:00:00Z', status: 'locked' },
          { percentage: 25, unlockDate: '2024-05-06T00:00:00Z', status: 'locked' },
          { percentage: 25, unlockDate: '2024-06-06T00:00:00Z', status: 'locked' },
        ],
        requirements: {
          kycRequired: true,
        },
        status: 'active',
      },
    ],
    tokenomics: {
      totalSupply: 100000000,
      initialCirculating: 15000000,
      distribution: {
        publicSale: 30,
        privateSale: 20,
        team: 15,
        advisors: 5,
        liquidity: 10,
        marketing: 10,
        reserve: 10,
      },
    },
    team: [
      {
        name: 'Alex Johnson',
        role: 'CEO & Founder',
        bio: 'Ex-Goldman Sachs, especialista em DeFi com 8 anos de experiência',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        linkedin: 'https://linkedin.com/in/alexjohnson',
      },
      {
        name: 'Sarah Chen',
        role: 'CTO',
        bio: 'Ex-Ethereum Foundation, desenvolvedora core de smart contracts',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop&crop=face',
        linkedin: 'https://linkedin.com/in/sarahchen',
      },
    ],
    roadmap: [
      {
        quarter: 'Q1',
        year: 2024,
        milestones: ['Launch do Token', 'DEX Integration', 'Mobile App Beta'],
        status: 'in_progress',
      },
      {
        quarter: 'Q2',
        year: 2024,
        milestones: ['Governance Launch', 'Cross-chain Bridge', 'NFT Marketplace'],
        status: 'upcoming',
      },
    ],
    metrics: {
      totalRaised: 2450000,
      participantsCount: 1250,
      averageAllocation: 1960,
      socialMetrics: {
        twitterFollowers: 45000,
        telegramMembers: 12000,
        discordMembers: 8500,
      },
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-02-15T12:30:00Z',
  },
  {
    id: 'gaming-metaverse-worlds',
    name: 'Gaming Metaverse Worlds',
    symbol: 'GMW',
    description: 'Metaverso de jogos P2E com economia sustentável e NFTs únicos',
    longDescription: 'Gaming Metaverse Worlds é um ecossistema completo de jogos Play-to-Earn com economia circular sustentável. Os jogadores podem possuir terras virtuais, criar conteúdo e monetizar suas habilidades.',
    logo: '🎮',
    website: 'https://gamingmetaverse.world',
    whitepaper: 'https://gamingmetaverse.world/litepaper.pdf',
    social: {
      twitter: 'https://twitter.com/gamingmeta',
      telegram: 'https://t.me/gamingmetaverse',
      discord: 'https://discord.gg/gamingmeta',
    },
    category: 'Gaming',
    network: 'Lunes',
    status: 'active',
    phases: [
      {
        id: 'phase-1-gmw',
        name: 'Private Sale',
        type: 'presale',
        startDate: '2024-02-15T00:00:00Z',
        endDate: '2024-03-15T23:59:59Z',
        tokenPrice: 0.05,
        totalTokens: 5000000,
        soldTokens: 3200000,
        minAllocation: 200,
        maxAllocation: 20000,
        requirements: {
          kycRequired: true,
          previousParticipation: true,
        },
        status: 'active',
      },
    ],
    tokenomics: {
      totalSupply: 500000000,
      initialCirculating: 50000000,
      distribution: {
        publicSale: 25,
        privateSale: 15,
        team: 20,
        advisors: 5,
        liquidity: 15,
        marketing: 10,
        reserve: 10,
      },
    },
    team: [
      {
        name: 'Marcus Kim',
        role: 'Game Director',
        bio: 'Ex-Riot Games, 12 anos criando experiências de jogos imersivas',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
    ],
    roadmap: [
      {
        quarter: 'Q1',
        year: 2024,
        milestones: ['Alpha Launch', 'Land Sale', 'Character NFTs'],
        status: 'in_progress',
      },
    ],
    metrics: {
      totalRaised: 1680000,
      participantsCount: 890,
      averageAllocation: 1888,
      socialMetrics: {
        twitterFollowers: 28000,
        telegramMembers: 7500,
        discordMembers: 15000,
      },
    },
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-14T09:15:00Z',
  },
  {
    id: 'ai-blockchain-oracle',
    name: 'AI Blockchain Oracle',
    symbol: 'AIO',
    description: 'Oracle descentralizado alimentado por IA para dados off-chain confiáveis',
    longDescription: 'AI Blockchain Oracle revoluciona a conectividade blockchain fornecendo dados off-chain através de inteligência artificial avançada e consenso descentralizado.',
    logo: '🤖',
    website: 'https://aiblockchain.oracle',
    whitepaper: 'https://aiblockchain.oracle/wp.pdf',
    social: {
      twitter: 'https://twitter.com/aiboracle',
      telegram: 'https://t.me/aiboracle',
    },
    category: 'Infrastructure',
    network: 'Lunes',
    status: 'whitelist',
    phases: [
      {
        id: 'phase-wl-aio',
        name: 'Whitelist Registration',
        type: 'whitelist',
        startDate: '2024-03-01T00:00:00Z',
        endDate: '2024-03-15T23:59:59Z',
        tokenPrice: 0.15,
        totalTokens: 3000000,
        soldTokens: 0,
        minAllocation: 300,
        maxAllocation: 8000,
        requirements: {
          kycRequired: true,
          minStaking: 2000,
          whitelist: true,
        },
        status: 'upcoming',
      },
    ],
    tokenomics: {
      totalSupply: 200000000,
      initialCirculating: 30000000,
      distribution: {
        publicSale: 35,
        privateSale: 20,
        team: 18,
        advisors: 7,
        liquidity: 10,
        marketing: 5,
        reserve: 5,
      },
    },
    team: [
      {
        name: 'Dr. Emily Watson',
        role: 'Chief AI Officer',
        bio: 'PhD em Machine Learning, ex-Google AI',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
    ],
    roadmap: [
      {
        quarter: 'Q2',
        year: 2024,
        milestones: ['Testnet Launch', 'AI Model Training', 'Oracle Network'],
        status: 'upcoming',
      },
    ],
    metrics: {
      totalRaised: 0,
      participantsCount: 0,
      averageAllocation: 0,
      socialMetrics: {
        twitterFollowers: 12000,
        telegramMembers: 3500,
      },
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-10T16:45:00Z',
  },
]

// ===== INVESTIMENTOS MOCK =====
export const mockInvestments: InvestmentDetails[] = [
  {
    id: 'inv-001',
    userId: 'user-123',
    projectId: 'defi-protocol-2024',
    phaseId: 'phase-2',
    amount: 2500,
    currency: 'USDT',
    tokensAllocated: 20833,
    tokensReceived: 5208,
    tokensVesting: 15625,
    tokensClaimed: 5208,
    status: 'confirmed',
    transactionHash: '0x742d35Cc6342C8532Da096a04Ac8B8B47238EbF1',
    vestingSchedule: [
      { percentage: 25, unlockDate: '2024-03-06T00:00:00Z', status: 'claimed' },
      { percentage: 25, unlockDate: '2024-04-06T00:00:00Z', status: 'unlocked' },
      { percentage: 25, unlockDate: '2024-05-06T00:00:00Z', status: 'locked' },
      { percentage: 25, unlockDate: '2024-06-06T00:00:00Z', status: 'locked' },
    ],
    createdAt: '2024-02-25T14:30:00Z',
    updatedAt: '2024-03-06T10:15:00Z',
    project: mockProjects[0],
    phase: mockProjects[0].phases[1],
    currentValue: 3250,
    roi: 750,
    roiPercentage: 30,
    nextVestingDate: '2024-04-06T00:00:00Z',
    claimableTokens: 5208,
  },
  {
    id: 'inv-002',
    userId: 'user-123',
    projectId: 'gaming-metaverse-worlds',
    phaseId: 'phase-1-gmw',
    amount: 1000,
    currency: 'USDC',
    tokensAllocated: 20000,
    tokensReceived: 0,
    tokensVesting: 20000,
    tokensClaimed: 0,
    status: 'confirmed',
    transactionHash: '0x8f5c3b2a1e9d4f7a6b2c8e1f5a3b9c7d2e8f1a4b',
    vestingSchedule: [
      { percentage: 100, unlockDate: '2024-05-15T00:00:00Z', status: 'locked' },
    ],
    createdAt: '2024-02-20T09:45:00Z',
    updatedAt: '2024-02-20T09:45:00Z',
    project: mockProjects[1],
    phase: mockProjects[1].phases[0],
    currentValue: 1400,
    roi: 400,
    roiPercentage: 40,
    nextVestingDate: '2024-05-15T00:00:00Z',
    claimableTokens: 0,
  },
]

// ===== STAKING POOLS MOCK =====
export const mockStakingPools: StakingPool[] = [
  {
    id: 'lunes-staking-30d',
    name: 'LUNES Staking 30 dias',
    token: 'LUNES',
    apy: 15.5,
    totalStaked: 2500000,
    totalRewards: 120000,
    minStaking: 100,
    maxStaking: 50000,
    lockPeriod: 30,
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
  },
  {
    id: 'lunes-staking-90d',
    name: 'LUNES Staking 90 dias',
    token: 'LUNES',
    apy: 22.8,
    totalStaked: 1800000,
    totalRewards: 95000,
    minStaking: 500,
    maxStaking: 100000,
    lockPeriod: 90,
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
  },
  {
    id: 'lunes-staking-365d',
    name: 'LUNES Staking 1 ano',
    token: 'LUNES',
    apy: 35.2,
    totalStaked: 950000,
    totalRewards: 75000,
    minStaking: 1000,
    maxStaking: 200000,
    lockPeriod: 365,
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
  },
]

// ===== USER STAKING MOCK =====
export const mockUserStaking: UserStaking[] = [
  {
    id: 'stake-001',
    userId: 'user-123',
    poolId: 'lunes-staking-90d',
    amount: 5000,
    rewards: 125.5,
    unclaimedRewards: 45.2,
    startDate: '2024-01-15T10:00:00Z',
    endDate: '2024-04-15T10:00:00Z',
    status: 'active',
  },
  {
    id: 'stake-002',
    userId: 'user-123',
    poolId: 'lunes-staking-30d',
    amount: 2000,
    rewards: 89.3,
    unclaimedRewards: 89.3,
    startDate: '2024-02-01T14:30:00Z',
    endDate: '2024-03-03T14:30:00Z',
    status: 'completed',
  },
]

// ===== LAUNCHPOOL PROJECTS MOCK =====
export const mockLaunchpoolProjects: LaunchpoolProject[] = [
  {
    id: 'launchpool-dfp',
    name: 'DeFi Protocol Launchpool',
    symbol: 'DFP',
    description: 'Faça staking de LUNES e ganhe tokens DFP',
    logo: '🔷',
    stakingToken: 'LUNES',
    rewardToken: 'DFP',
    totalRewards: 100000,
    distributedRewards: 35000,
    totalStaked: 850000,
    apy: 45.5,
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-03-31T23:59:59Z',
    status: 'active',
  },
  {
    id: 'launchpool-gmw',
    name: 'Gaming Metaverse Launchpool',
    symbol: 'GMW',
    description: 'Faça staking de LUNES e ganhe tokens GMW',
    logo: '🎮',
    stakingToken: 'LUNES',
    rewardToken: 'GMW',
    totalRewards: 200000,
    distributedRewards: 0,
    totalStaked: 0,
    apy: 38.2,
    startDate: '2024-03-15T00:00:00Z',
    endDate: '2024-05-15T23:59:59Z',
    status: 'upcoming',
  },
]

// ===== NOTIFICAÇÕES MOCK =====
export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    userId: 'user-123',
    type: 'claim',
    title: 'Tokens Disponíveis para Reivindicar',
    message: 'Você tem 5,208 tokens DFP disponíveis para reivindicar!',
    data: {
      projectId: 'defi-protocol-2024',
      amount: 5208,
      token: 'DFP',
    },
    read: false,
    priority: 'high',
    createdAt: '2024-03-06T10:00:00Z',
  },
  {
    id: 'notif-002',
    userId: 'user-123',
    type: 'investment',
    title: 'Investimento Confirmado',
    message: 'Seu investimento de $1,000 em Gaming Metaverse foi confirmado na blockchain.',
    data: {
      projectId: 'gaming-metaverse-worlds',
      amount: 1000,
      txHash: '0x8f5c3b2a1e9d4f7a6b2c8e1f5a3b9c7d2e8f1a4b',
    },
    read: true,
    priority: 'medium',
    createdAt: '2024-02-20T09:50:00Z',
  },
  {
    id: 'notif-003',
    userId: 'user-123',
    type: 'airdrop',
    title: 'Nova Oportunidade de Airdrop',
    message: 'AI Blockchain Oracle está oferecendo airdrop para holders de LUNES!',
    data: {
      projectId: 'ai-blockchain-oracle',
      requirement: 'hold_lunes',
      amount: 500,
    },
    read: false,
    priority: 'medium',
    createdAt: '2024-03-01T12:00:00Z',
  },
  {
    id: 'notif-004',
    userId: 'user-123',
    type: 'announcement',
    title: 'Sistema de Governança Ativo',
    message: 'O sistema de governança da plataforma está agora ativo. Participe das votações!',
    data: {
      type: 'governance_launch',
    },
    read: false,
    priority: 'low',
    createdAt: '2024-02-28T15:30:00Z',
  },
]

// ===== TRANSAÇÕES MOCK =====
export const mockTransactions: Transaction[] = [
  {
    id: 'tx-001',
    userId: 'user-123',
    type: 'investment',
    amount: 2500,
    currency: 'USDT',
    status: 'confirmed',
    transactionHash: '0x742d35Cc6342C8532Da096a04Ac8B8B47238EbF1',
    blockNumber: 1234567,
    gasUsed: 21000,
    gasPrice: 20,
    fee: 0.42,
    metadata: {
      projectId: 'defi-protocol-2024',
      phaseId: 'phase-2',
      tokensReceived: 20833,
    },
    createdAt: '2024-02-25T14:30:00Z',
    updatedAt: '2024-02-25T14:35:00Z',
  },
  {
    id: 'tx-002',
    userId: 'user-123',
    type: 'claim',
    amount: 5208,
    currency: 'DFP',
    status: 'confirmed',
    transactionHash: '0x9a3b7c5d8e2f1a4b6c9d7e3f8a1b5c2d9e4f7a6b',
    blockNumber: 1234890,
    gasUsed: 45000,
    gasPrice: 22,
    fee: 0.99,
    metadata: {
      investmentId: 'inv-001',
      vestingPhase: 1,
    },
    createdAt: '2024-03-06T10:15:00Z',
    updatedAt: '2024-03-06T10:20:00Z',
  },
  {
    id: 'tx-003',
    userId: 'user-123',
    type: 'staking',
    amount: 5000,
    currency: 'LUNES',
    status: 'confirmed',
    transactionHash: '0x1f2e3d4c5b6a9e8d7c6b5a4f3e2d1c9b8a7f6e5d',
    blockNumber: 1234123,
    gasUsed: 32000,
    gasPrice: 18,
    fee: 0.576,
    metadata: {
      poolId: 'lunes-staking-90d',
      lockPeriod: 90,
      expectedRewards: 284.25,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:05:00Z',
  },
]

// ===== ESTATÍSTICAS GERAIS =====
export const mockPlatformStats = {
  totalProjects: 15,
  activeProjects: 8,
  totalRaised: 12500000,
  totalParticipants: 4250,
  totalValueLocked: 8750000,
  averageRoi: 24.5,
  successfulProjects: 7,
  upcomingProjects: 3,
}

// ===== CATEGORIAS DE PROJETOS =====
export const mockProjectCategories = [
  { name: 'DeFi', count: 5, description: 'Finanças Descentralizadas' },
  { name: 'Gaming', count: 4, description: 'Jogos e Metaverso' },
  { name: 'Infrastructure', count: 3, description: 'Infraestrutura Blockchain' },
  { name: 'NFT', count: 2, description: 'Tokens Não Fungíveis' },
  { name: 'AI', count: 1, description: 'Inteligência Artificial' },
]

// ===== PREÇOS MOCK EM TEMPO REAL =====
export const mockTokenPrices = {
  'LUNES': { current: 0.85, change24h: 5.2, volume24h: 1250000 },
  'DFP': { current: 0.156, change24h: 12.8, volume24h: 450000 },
  'GMW': { current: 0.072, change24h: -2.1, volume24h: 280000 },
  'AIO': { current: 0.0, change24h: 0, volume24h: 0 },
}

// Função para simular delay de API
export const simulateApiDelay = (ms: number = 800) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Função para simular erro ocasional
export const simulateApiError = (errorRate: number = 0.1) => {
  if (Math.random() < errorRate) {
    throw new Error('Erro simulado de API')
  }
}
