/**
 * Mock API para desenvolvimento
 * 
 * Este arquivo fornece dados mockados para simular as respostas da API
 * quando não há um backend disponível em desenvolvimento.
 */

import type { 
  Project, 
  UserInvestment, 
  StakingPool,
  SecurityAuditEvent
} from '../types';

// Delay para simular latência de rede
const MOCK_DELAY = 800;

/**
 * Simula delay de rede
 */
const delay = (ms: number = MOCK_DELAY) => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Dados mockados de projetos
 */
const mockProjects: Project[] = [
  {
    id: "proj-001",
    name: "DeFi Protocol Alpha",
    symbol: "DPA",
    description: "Protocolo DeFi inovador para yield farming automatizado com estratégias de baixo risco.",
    logo: "/images/projects/defi-alpha-logo.png",
    banner: "/images/projects/defi-alpha-banner.jpg",
    website: "https://defi-alpha.com",
    twitter: "https://twitter.com/defi_alpha",
    telegram: "https://t.me/defi_alpha",
    totalSupply: "1000000",
    tokenPrice: "0.5",
    hardCap: "500000",
    softCap: "100000",
    minInvestment: "50",
    maxInvestment: "5000",
    phase: "sale",
    startDate: new Date("2024-02-01T00:00:00Z"),
    endDate: new Date("2024-03-15T23:59:59Z"),
    distributionDate: new Date("2024-03-20T00:00:00Z"),
    raised: "125000",
    participants: 47,
    progress: 25,
    isKycRequired: true,
    isWhitelistOnly: false,
    acceptedTokens: ["LUNES", "USDT"],
  },
  {
    id: "proj-002",
    name: "GameFi Arena",
    symbol: "GFA",
    description: "Plataforma de jogos blockchain com NFTs únicos e sistema de recompensas inovador.",
    logo: "/images/projects/gamefi-arena-logo.png",
    website: "https://gamefi-arena.com",
    twitter: "https://twitter.com/gamefi_arena",
    totalSupply: "500000",
    tokenPrice: "0.6",
    hardCap: "300000",
    softCap: "75000",
    minInvestment: "100",
    maxInvestment: "3000",
    phase: "sale",
    startDate: new Date("2024-02-05T00:00:00Z"),
    endDate: new Date("2024-03-20T23:59:59Z"),
    distributionDate: new Date("2024-03-25T00:00:00Z"),
    raised: "75000",
    participants: 32,
    progress: 25,
    isKycRequired: false,
    isWhitelistOnly: true,
    acceptedTokens: ["LUNES"],
  },
  {
    id: "proj-003",
    name: "Green Energy Token",
    symbol: "GET",
    description: "Token sustentável para financiamento de projetos de energia renovável.",
    logo: "/images/projects/green-energy-logo.png",
    banner: "/images/projects/green-energy-banner.jpg",
    website: "https://green-energy-token.com",
    totalSupply: "2000000",
    tokenPrice: "0.4",
    hardCap: "800000",
    softCap: "200000",
    minInvestment: "25",
    maxInvestment: "10000",
    phase: "completed",
    startDate: new Date("2023-12-01T00:00:00Z"),
    endDate: new Date("2024-01-31T23:59:59Z"),
    distributionDate: new Date("2024-02-05T00:00:00Z"),
    raised: "800000",
    participants: 156,
    progress: 100,
    isKycRequired: true,
    isWhitelistOnly: false,
    acceptedTokens: ["LUNES", "USDT", "USDC"],
  },
];

/**
 * Dados mockados de investimentos por usuário
 */
const mockInvestmentsByUser: Record<string, UserInvestment[]> = {
  // Investidor Padrão
  "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY": [
    {
      id: "inv-1",
      projectId: "proj-001",
      projectName: "DeFi Protocol Alpha",
      amount: "1000",
      token: "LUNES",
      tokenSymbol: "DPA",
      totalTokens: "2000",
      claimableAmount: "500",
      timestamp: new Date("2024-02-05T10:30:00Z"),
      status: "confirmed",
      txHash: "0x1234567890abcdef",
      vestingSchedule: [
        {
          date: new Date("2024-03-20T00:00:00Z"),
          amount: "500",
          percentage: 25,
          claimed: true,
          claimable: false,
        },
        {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias a partir de hoje
          amount: "500",
          percentage: 25,
          claimed: false,
          claimable: true,
        },
        {
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias a partir de hoje
          amount: "500",
          percentage: 25,
          claimed: false,
          claimable: false,
        },
        {
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias a partir de hoje
          amount: "500",
          percentage: 25,
          claimed: false,
          claimable: false,
        },
      ],
    },
    {
      id: "inv-2",
      projectId: "proj-002",
      projectName: "GameFi Arena",
      amount: "500",
      token: "LUNES",
      tokenSymbol: "GFA",
      totalTokens: "833",
      claimableAmount: "208",
      timestamp: new Date("2024-02-10T15:45:00Z"),
      status: "confirmed",
      txHash: "0xabcdef1234567890",
      vestingSchedule: [
        {
          date: new Date("2024-03-25T00:00:00Z"),
          amount: "208",
          percentage: 25,
          claimed: true,
          claimable: false,
        },
        {
          date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 dia a partir de hoje
          amount: "208",
          percentage: 25,
          claimed: false,
          claimable: true,
        },
        {
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 dias a partir de hoje
          amount: "208",
          percentage: 25,
          claimed: false,
          claimable: false,
        },
        {
          date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 dias a partir de hoje
          amount: "209",
          percentage: 25,
          claimed: false,
          claimable: false,
        },
      ],
    },
    {
      id: "inv-3",
      projectId: "proj-001",
      projectName: "DeFi Protocol Alpha",
      amount: "2000",
      token: "USDT",
      tokenSymbol: "DPA",
      totalTokens: "4000",
      claimableAmount: "1000",
      timestamp: new Date("2024-01-15T10:30:00Z"),
      status: "confirmed",
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
      vestingSchedule: [
        {
          date: new Date("2024-02-15T00:00:00Z"),
          amount: "1000",
          percentage: 25,
          claimed: true,
          claimable: false,
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás (disponível para resgate)
          amount: "1000",
          percentage: 25,
          claimed: false,
          claimable: true,
        },
        {
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias a partir de hoje
          amount: "1000",
          percentage: 25,
          claimed: false,
          claimable: false,
        },
        {
          date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 dias a partir de hoje
          amount: "1000",
          percentage: 25,
          claimed: false,
          claimable: false,
        },
      ],
    },
    {
      id: "inv-4",
      projectId: "proj-002",
      projectName: "GameFi Arena",
      amount: "1000",
      token: "LUNES",
      tokenSymbol: "GFA",
      totalTokens: "1666",
      claimableAmount: "416",
      timestamp: new Date("2024-01-10T14:20:00Z"),
      status: "confirmed",
      txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
      vestingSchedule: [
        {
          date: new Date("2024-02-10T00:00:00Z"),
          amount: "416",
          percentage: 25,
          claimed: true,
          claimable: false,
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás (disponível para resgate)
          amount: "416",
          percentage: 25,
          claimed: false,
          claimable: true,
        },
        {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias a partir de hoje
          amount: "417",
          percentage: 25,
          claimed: false,
          claimable: false,
        },
        {
          date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 dias a partir de hoje
          amount: "417",
          percentage: 25,
          claimed: false,
          claimable: false,
        },
      ],
    },
  ],
  // Investidor VIP
  "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty": [
    {
      id: "inv-3",
      projectId: "proj-001",
      projectName: "DeFi Protocol Alpha",
      amount: "5000",
      token: "LUNES",
      tokenSymbol: "DPA",
      totalTokens: "10000",
      claimableAmount: "2500",
      timestamp: new Date("2024-02-01T08:00:00Z"),
      status: "confirmed",
      txHash: "0xfedcba0987654321",
      vestingSchedule: [
        {
          date: new Date("2024-03-20T00:00:00Z"),
          amount: "2500",
          percentage: 25,
          claimed: true,
          claimable: false,
        },
        {
          date: new Date("2024-04-20T00:00:00Z"),
          amount: "2500",
          percentage: 25,
          claimed: false,
          claimable: true,
        },
        {
          date: new Date("2024-05-20T00:00:00Z"),
          amount: "2500",
          percentage: 25,
          claimed: false,
          claimable: false,
        },
        {
          date: new Date("2024-06-20T00:00:00Z"),
          amount: "2500",
          percentage: 25,
          claimed: false,
          claimable: false,
        },
      ],
    },
    {
      id: "inv-4",
      projectId: "proj-003",
      projectName: "Green Energy Token",
      amount: "2000",
      token: "LUNES",
      tokenSymbol: "GET",
      totalTokens: "5000",
      claimableAmount: "0",
      timestamp: new Date("2023-12-15T12:00:00Z"),
      status: "confirmed",
      txHash: "0x1122334455667788",
      vestingSchedule: [
        {
          date: new Date("2024-02-05T00:00:00Z"),
          amount: "1250",
          percentage: 25,
          claimed: true,
          claimable: false,
        },
        {
          date: new Date("2024-03-05T00:00:00Z"),
          amount: "1250",
          percentage: 25,
          claimed: true,
          claimable: false,
        },
        {
          date: new Date("2024-04-05T00:00:00Z"),
          amount: "1250",
          percentage: 25,
          claimed: true,
          claimable: false,
        },
        {
          date: new Date("2024-05-05T00:00:00Z"),
          amount: "1250",
          percentage: 25,
          claimed: true,
          claimable: false,
        },
      ],
    },
  ],
};

/**
 * Dados mockados de pools de staking
 */
const mockStakingPools: StakingPool[] = [
  {
    id: "pool-001",
    name: "LUNES Staking Pool",
    token: "LUNES",
    apy: 12.5,
    totalStaked: "1500000",
    lockPeriod: 30,
    isActive: true,
  },
  {
    id: "pool-002",
    name: "High Yield Pool",
    token: "LUNES",
    apy: 18.0,
    totalStaked: "750000",
    lockPeriod: 90,
    isActive: true,
  },
];

/**
 * Mock API para projetos
 */
export const mockProjectsApi = {
  /**
   * Busca todos os projetos
   */
  async getAll(): Promise<Project[]> {
    await delay();
    console.log('📊 [Mock API] Buscando todos os projetos...');
    return mockProjects;
  },

  /**
   * Busca um projeto por ID
   */
  async getById(id: string): Promise<Project | null> {
    await delay();
    console.log(`📊 [Mock API] Buscando projeto ${id}...`);
    const project = mockProjects.find(p => p.id === id);
    return project || null;
  },

  /**
   * Busca projetos por fase
   */
  async getByPhase(phase: string): Promise<Project[]> {
    await delay();
    console.log(`📊 [Mock API] Buscando projetos na fase ${phase}...`);
    return mockProjects.filter(p => p.phase === phase);
  },
};

/**
 * Mock API para investimentos
 */
export const mockInvestmentsApi = {
  /**
   * Busca investimentos de um usuário
   */
  async getByUser(userAddress: string): Promise<UserInvestment[]> {
    await delay();
    console.log(`💰 [Mock API] Buscando investimentos do usuário ${userAddress.slice(0, 8)}...`);
    const investments = mockInvestmentsByUser[userAddress] || [];
    console.log(`💰 [Mock API] Encontrados ${investments.length} investimentos`);
    return investments;
  },
};

/**
 * Mock API para staking
 */
export const mockStakingApi = {
  /**
   * Busca pools de staking
   */
  async getPools(): Promise<StakingPool[]> {
    await delay();
    console.log('🏦 [Mock API] Buscando pools de staking...');
    return mockStakingPools;
  },
};

/**
 * Mock API para auditoria de segurança
 */
export const mockSecurityApi = {
  /**
   * Loga um evento de segurança
   */
  async logEvent(event: SecurityAuditEvent): Promise<void> {
    await delay(100);
    console.log('🛡️ [Mock API] Evento de segurança registrado:', event);
  },
};

/**
 * Verifica se deve usar mock baseado no ambiente
 */
export const shouldUseMockApi = (): boolean => {
  const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
  const forceMock = import.meta.env.VITE_USE_MOCK_API === 'true';
  const hasBackend = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== '';
  
  return isDevelopment && (forceMock || !hasBackend);
};

/**
 * Log de inicialização do mock
 */
if (shouldUseMockApi()) {
  console.log('🎭 [Mock API] Sistema de mock ativado para desenvolvimento');
  console.log('📊 Projetos mockados:', mockProjects.length);
  console.log('💰 Usuários com investimentos:', Object.keys(mockInvestmentsByUser).length);
  console.log('🏦 Pools de staking:', mockStakingPools.length);
}