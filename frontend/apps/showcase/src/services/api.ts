import type { Project, UserInvestment, StakingPool } from "../types";

import { LUNES_API_CONFIG } from "../config/lunes";
import { 
  shouldUseMockApi, 
  mockProjectsApi, 
  mockInvestmentsApi, 
  mockStakingApi 
} from "./mockApi";

/**
 * Configuração da API da Rede Lunes
 */
const API_BASE_URL = LUNES_API_CONFIG.backendUrl;

/**
 * Classe para tratamento de erros da API
 */
export class ApiError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Função utilitária para fazer requisições HTTP
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Erro de rede ou parsing
    throw new ApiError("Erro de conexão com o servidor", 0, "NETWORK_ERROR");
  }
}

/**
 * Serviços de API para projetos da Rede Lunes
 */
export const projectsApi = {
  /**
   * Busca todos os projetos da Rede Lunes
   */
  async getAll(): Promise<Project[]> {
    if (shouldUseMockApi()) {
      return mockProjectsApi.getAll();
    }
    return fetchApi<Project[]>(LUNES_API_CONFIG.endpoints.projects);
  },

  /**
   * Busca um projeto específico por ID
   */
  async getById(id: string): Promise<Project> {
    if (shouldUseMockApi()) {
      const project = await mockProjectsApi.getById(id);
      if (!project) {
        throw new ApiError(`Projeto ${id} não encontrado`, 404);
      }
      return project;
    }
    return fetchApi<Project>(`${LUNES_API_CONFIG.endpoints.projects}/${id}`);
  },

  /**
   * Busca projetos com filtros
   */
  async getFiltered(filters: {
    phase?: string;
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    projects: Project[];
    total: number;
    hasMore: boolean;
  }> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString
      ? `${LUNES_API_CONFIG.endpoints.projects}?${queryString}`
      : LUNES_API_CONFIG.endpoints.projects;

    return fetchApi(endpoint);
  },

  /**
   * Busca projetos por fase específica
   */
  async getByPhase(phase: string): Promise<Project[]> {
    if (shouldUseMockApi()) {
      return mockProjectsApi.getByPhase(phase);
    }
    return fetchApi<Project[]>(
      `${LUNES_API_CONFIG.endpoints.projects}/phase/${phase}`,
    );
  },

  /**
   * Busca projetos em destaque da Rede Lunes
   */
  async getFeatured(): Promise<Project[]> {
    return fetchApi<Project[]>(
      `${LUNES_API_CONFIG.endpoints.projects}/featured`,
    );
  },

  /**
   * Busca estatísticas gerais dos projetos da Rede Lunes
   */
  async getStats(): Promise<{
    totalProjects: number;
    totalRaised: string;
    activeProjects: number;
    completedProjects: number;
  }> {
    return fetchApi(`${LUNES_API_CONFIG.endpoints.projects}/stats`);
  },

  /**
   * Busca projetos criados por um usuário específico
   */
  async getByUser(userAddress: string): Promise<Project[]> {
    return fetchApi<Project[]>(
      `${LUNES_API_CONFIG.endpoints.projects}/user/${userAddress}`,
    );
  },
};

/**
 * Serviços relacionados a investimentos do usuário na Rede Lunes
 */
export const investmentsApi = {
  /**
   * Busca investimentos de um usuário na Rede Lunes
   */
  async getByUser(userAddress: string): Promise<UserInvestment[]> {
    if (shouldUseMockApi()) {
      return mockInvestmentsApi.getByUser(userAddress);
    }
    return fetchApi<UserInvestment[]>(
      `${LUNES_API_CONFIG.endpoints.investments}/user/${userAddress}`,
    );
  },

  /**
   * Cria um novo investimento na Rede Lunes
   */
  async create(investment: {
    projectId: string;
    userAddress: string;
    amount: string;
    tokenAmount: string;
    transactionHash: string;
  }): Promise<UserInvestment> {
    return fetchApi<UserInvestment>(LUNES_API_CONFIG.endpoints.investments, {
      method: "POST",
      body: JSON.stringify(investment),
    });
  },

  /**
   * Atualiza status de um investimento
   */
  async updateStatus(
    investmentId: string,
    status: "pending" | "confirmed" | "failed",
  ): Promise<UserInvestment> {
    return fetchApi<UserInvestment>(
      `${LUNES_API_CONFIG.endpoints.investments}/${investmentId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    );
  },

  /**
   * Busca estatísticas de investimentos do usuário
   */
  async getUserStats(userAddress: string): Promise<{
    totalInvested: string;
    currentValue: string;
    totalPnl: string;
    totalPnlPercentage: number;
    activeInvestments: number;
    completedInvestments: number;
  }> {
    return fetchApi(
      `${LUNES_API_CONFIG.endpoints.investments}/user/${userAddress}/stats`,
    );
  },
};

/**
 * Serviços de API para staking na Rede Lunes
 */
export const stakingApi = {
  /**
   * Busca pools de staking disponíveis na Rede Lunes
   */
  async getPools(): Promise<StakingPool[]> {
    if (shouldUseMockApi()) {
      return mockStakingApi.getPools();
    }
    return fetchApi<StakingPool[]>(
      `${LUNES_API_CONFIG.endpoints.staking}/pools`,
    );
  },

  /**
   * Busca informações de staking do usuário na Rede Lunes
   */
  async getUserStaking(userAddress: string): Promise<{
    totalStaked: string;
    totalRewards: string;
    activePools: StakingPool[];
  }> {
    return fetchApi(
      `${LUNES_API_CONFIG.endpoints.staking}/user/${userAddress}`,
    );
  },

  /**
   * Inicia staking em um pool da Rede Lunes
   */
  async stake(data: {
    poolId: string;
    userAddress: string;
    amount: string;
    transactionHash: string;
  }): Promise<{
    success: boolean;
    stakingId: string;
  }> {
    return fetchApi(`${LUNES_API_CONFIG.endpoints.staking}/stake`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Remove staking de um pool da Rede Lunes
   */
  async unstake(data: {
    stakingId: string;
    userAddress: string;
    transactionHash: string;
  }): Promise<{
    success: boolean;
  }> {
    return fetchApi(`${LUNES_API_CONFIG.endpoints.staking}/unstake`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Reivindica recompensas de staking na Rede Lunes
   */
  async claimRewards(data: {
    poolId: string;
    userAddress: string;
  }): Promise<{ success: boolean; txHash: string; amount: string }> {
    return fetchApi(`${LUNES_API_CONFIG.endpoints.staking}/claim`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

/**
 * Serviços relacionados a preços e cotações
 */
export const pricesApi = {
  /**
   * Busca preços atuais dos tokens
   */
  async getCurrentPrices(symbols: string[]): Promise<
    Record<
      string,
      {
        usd: number;
        change24h: number;
        lastUpdated: string;
      }
    >
  > {
    const params = new URLSearchParams();
    symbols.forEach((symbol) => params.append("symbols", symbol));

    return fetchApi(`/prices/current?${params.toString()}`);
  },

  /**
   * Busca histórico de preços
   */
  async getPriceHistory(
    symbol: string,
    period: "1d" | "7d" | "30d" | "90d" | "1y",
  ): Promise<{
    symbol: string;
    prices: Array<{
      timestamp: number;
      price: number;
    }>;
  }> {
    return fetchApi(`/prices/history/${symbol}?period=${period}`);
  },
};

/**
 * Serviços relacionados a notificações
 */
export const notificationsApi = {
  /**
   * Busca notificações do usuário
   */
  async getByUser(userAddress: string): Promise<
    Array<{
      id: string;
      type: "investment" | "staking" | "project" | "system";
      title: string;
      message: string;
      read: boolean;
      createdAt: string;
      data?: Record<string, any>;
    }>
  > {
    return fetchApi(`/notifications/user/${userAddress}`);
  },

  /**
   * Marca notificação como lida
   */
  async markAsRead(notificationId: string): Promise<void> {
    await fetchApi(`/notifications/${notificationId}/read`, {
      method: "PATCH",
    });
  },

  /**
   * Marca todas as notificações como lidas
   */
  async markAllAsRead(userAddress: string): Promise<void> {
    await fetchApi(`/notifications/user/${userAddress}/read-all`, {
      method: "PATCH",
    });
  },
};

/**
 * Função utilitária para lidar com erros da API
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.code) {
      case "NETWORK_ERROR":
        return "Erro de conexão. Verifique sua internet e tente novamente.";
      case "UNAUTHORIZED":
        return "Acesso não autorizado. Conecte sua carteira.";
      case "NOT_FOUND":
        return "Recurso não encontrado.";
      case "VALIDATION_ERROR":
        return "Dados inválidos fornecidos.";
      default:
        return error.message;
    }
  }

  return "Erro inesperado. Tente novamente.";
};

/**
 * Exportação padrão com todos os serviços
 */
export default {
  projects: projectsApi,
  investments: investmentsApi,
  staking: stakingApi,
  prices: pricesApi,
  notifications: notificationsApi,
  handleError: handleApiError,
};
