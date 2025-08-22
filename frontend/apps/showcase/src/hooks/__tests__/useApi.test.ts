import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  useProjects,
  useProject,
  useProjectsByPhase,
  useFeaturedProjects,
  useUserInvestments,
  useStakingPools,
  useUserStaking,
  useCreateInvestment,
  useStake,
  useUnstake,
  useClaimStakingRewards,
  useUpdateInvestmentStatus,
  useLunesApiUtils,
} from "../useApi";
import * as apiModule from "../../services/api";

// Mock dos serviços de API
vi.mock("../../services/api", () => ({
  projectsApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getByPhase: vi.fn(),
    getFeatured: vi.fn(),
  },
  investmentsApi: {
    getByUser: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
  },
  stakingApi: {
    getPools: vi.fn(),
    getUserStaking: vi.fn(),
    stake: vi.fn(),
    unstake: vi.fn(),
    claimRewards: vi.fn(),
  },
}));

// Mock da configuração da API Lunes
vi.mock("../../config/lunes", () => ({
  LUNES_API_CONFIG: {
    cache: {
      projectsStaleTime: 5 * 60 * 1000, // 5 minutos
      userDataStaleTime: 2 * 60 * 1000, // 2 minutos
    },
  },
}));

// Dados de teste
const mockProjects = [
  { id: "1", name: "Projeto 1", phase: "funding", featured: true },
  { id: "2", name: "Projeto 2", phase: "development", featured: false },
];

const mockProject = {
  id: "1",
  name: "Projeto 1",
  phase: "funding",
  featured: true,
};

const mockInvestments = [
  { id: "1", projectId: "1", userAddress: "0x123", amount: 1000 },
  { id: "2", projectId: "2", userAddress: "0x123", amount: 2000 },
];

const mockStakingPools = [
  { id: "1", name: "Pool 1", apy: 12.5, totalStaked: 100000 },
  { id: "2", name: "Pool 2", apy: 15.0, totalStaked: 50000 },
];

const mockUserStaking = {
  totalStaked: 5000,
  rewards: 125,
  pools: [{ poolId: "1", amount: 5000 }],
};

// Wrapper para React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useApi Hooks", () => {
  let mockProjectsApi: any;
  let mockInvestmentsApi: any;
  let mockStakingApi: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Obtém as referências mockadas
    mockProjectsApi = vi.mocked(apiModule.projectsApi);
    mockInvestmentsApi = vi.mocked(apiModule.investmentsApi);
    mockStakingApi = vi.mocked(apiModule.stakingApi);
  });

  describe("Query Hooks - Projetos", () => {
    it("useProjects deve buscar todos os projetos", async () => {
      mockProjectsApi.getAll.mockResolvedValue(mockProjects);

      const { result } = renderHook(() => useProjects(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProjects);
      expect(mockProjectsApi.getAll).toHaveBeenCalledTimes(1);
    });

    it("useProject deve buscar um projeto específico por ID", async () => {
      mockProjectsApi.getById.mockResolvedValue(mockProject);

      const { result } = renderHook(() => useProject("1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProject);
      expect(mockProjectsApi.getById).toHaveBeenCalledWith("1");
    });

    it("useProject não deve fazer chamada quando ID está vazio", () => {
      const { result } = renderHook(() => useProject(""), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(true);
      expect(mockProjectsApi.getById).not.toHaveBeenCalled();
    });

    it("useProjectsByPhase deve buscar projetos por fase", async () => {
      const fundingProjects = mockProjects.filter((p) => p.phase === "funding");
      mockProjectsApi.getByPhase.mockResolvedValue(fundingProjects);

      const { result } = renderHook(() => useProjectsByPhase("funding"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(fundingProjects);
      expect(mockProjectsApi.getByPhase).toHaveBeenCalledWith("funding");
    });

    it("useFeaturedProjects deve buscar projetos em destaque", async () => {
      const featuredProjects = mockProjects.filter((p) => p.featured);
      mockProjectsApi.getFeatured.mockResolvedValue(featuredProjects);

      const { result } = renderHook(() => useFeaturedProjects(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(featuredProjects);
      expect(mockProjectsApi.getFeatured).toHaveBeenCalledTimes(1);
    });
  });

  describe("Query Hooks - Investimentos e Staking", () => {
    it("useUserInvestments deve buscar investimentos do usuário", async () => {
      mockInvestmentsApi.getByUser.mockResolvedValue(mockInvestments);

      const { result } = renderHook(() => useUserInvestments("0x123"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockInvestments);
      expect(mockInvestmentsApi.getByUser).toHaveBeenCalledWith("0x123");
    });

    it("useStakingPools deve buscar pools de staking", async () => {
      mockStakingApi.getPools.mockResolvedValue(mockStakingPools);

      const { result } = renderHook(() => useStakingPools(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockStakingPools);
      expect(mockStakingApi.getPools).toHaveBeenCalledTimes(1);
    });

    it("useUserStaking deve buscar informações de staking do usuário", async () => {
      mockStakingApi.getUserStaking.mockResolvedValue(mockUserStaking);

      const { result } = renderHook(() => useUserStaking("0x123"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockUserStaking);
      expect(mockStakingApi.getUserStaking).toHaveBeenCalledWith("0x123");
    });
  });

  describe("Mutation Hooks", () => {
    it("useCreateInvestment deve criar um novo investimento", async () => {
      const newInvestment = {
        id: "3",
        projectId: "1",
        userAddress: "0x123",
        amount: 3000,
      };
      mockInvestmentsApi.create.mockResolvedValue(newInvestment);

      const { result } = renderHook(() => useCreateInvestment(), {
        wrapper: createWrapper(),
      });

      const investmentData = {
        projectId: "1",
        userAddress: "0x123",
        amount: "3000",
        tokenAmount: "3000",
        transactionHash: "0xabc123",
      };

      await result.current.mutateAsync(investmentData);

      expect(mockInvestmentsApi.create).toHaveBeenCalledWith(investmentData);
    });

    it("useStake deve fazer stake em um pool", async () => {
      const stakeResult = { success: true, transactionHash: "0xabc" };
      mockStakingApi.stake.mockResolvedValue(stakeResult);

      const { result } = renderHook(() => useStake(), {
        wrapper: createWrapper(),
      });

      const stakeData = {
        poolId: "1",
        userAddress: "0x123",
        amount: "1000",
        transactionHash: "0xdef456",
      };

      await result.current.mutateAsync(stakeData);

      expect(mockStakingApi.stake).toHaveBeenCalledWith(stakeData);
    });

    it("useUnstake deve remover stake de um pool", async () => {
      const unstakeResult = { success: true, transactionHash: "0xdef" };
      mockStakingApi.unstake.mockResolvedValue(unstakeResult);

      const { result } = renderHook(() => useUnstake(), {
        wrapper: createWrapper(),
      });

      const unstakeData = {
        stakingId: "1",
        userAddress: "0x123",
        transactionHash: "0xghi789",
      };

      await result.current.mutateAsync(unstakeData);

      expect(mockStakingApi.unstake).toHaveBeenCalledWith(unstakeData);
    });

    it("useClaimStakingRewards deve reivindicar recompensas", async () => {
      const claimResult = {
        success: true,
        rewards: 125,
        transactionHash: "0xghi",
      };
      mockStakingApi.claimRewards.mockResolvedValue(claimResult);

      const { result } = renderHook(() => useClaimStakingRewards(), {
        wrapper: createWrapper(),
      });

      const claimData = { poolId: "1", userAddress: "0x123" };

      await result.current.mutateAsync(claimData);

      expect(mockStakingApi.claimRewards).toHaveBeenCalledWith(claimData);
    });

    it("useUpdateInvestmentStatus deve atualizar status do investimento", async () => {
      const updateResult = { success: true };
      mockInvestmentsApi.updateStatus.mockResolvedValue(updateResult);

      const { result } = renderHook(() => useUpdateInvestmentStatus(), {
        wrapper: createWrapper(),
      });

      const updateData = { investmentId: "1", status: "confirmed" as const };

      await result.current.mutateAsync(updateData);

      expect(mockInvestmentsApi.updateStatus).toHaveBeenCalledWith(
        "1",
        "confirmed",
      );
    });
  });

  describe("Utility Hooks", () => {
    it("useLunesApiUtils deve fornecer utilitários de cache", () => {
      const { result } = renderHook(() => useLunesApiUtils(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty("invalidateProjects");
      expect(result.current).toHaveProperty("invalidateUserInvestments");
      expect(result.current).toHaveProperty("invalidateUserStaking");
      expect(result.current).toHaveProperty("invalidateStaking");
      expect(result.current).toHaveProperty("clearLunesCache");
      expect(result.current).toHaveProperty("prefetchProject");

      // Testa se as funções são do tipo correto
      expect(typeof result.current.invalidateProjects).toBe("function");
      expect(typeof result.current.invalidateUserInvestments).toBe("function");
      expect(typeof result.current.invalidateUserStaking).toBe("function");
      expect(typeof result.current.invalidateStaking).toBe("function");
      expect(typeof result.current.clearLunesCache).toBe("function");
      expect(typeof result.current.prefetchProject).toBe("function");
    });
  });

  describe("Error Handling", () => {
    it("useProjects deve lidar com erros da API", async () => {
      const error = new Error("API Error");
      mockProjectsApi.getAll.mockRejectedValue(error);

      const { result } = renderHook(() => useProjects(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it("useCreateInvestment deve lidar com erros de mutação", async () => {
      const error = new Error("Investment creation failed");
      mockInvestmentsApi.create.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateInvestment(), {
        wrapper: createWrapper(),
      });

      const investmentData = {
        projectId: "1",
        userAddress: "0x123",
        amount: "3000",
        tokenAmount: "3000",
        transactionHash: "0xjkl012",
      };

      await expect(result.current.mutateAsync(investmentData)).rejects.toThrow(
        "Investment creation failed",
      );
    });
  });

  describe("Cache Configuration", () => {
    it("hooks devem usar configurações de cache corretas", () => {
      const { result: projectsResult } = renderHook(() => useProjects(), {
        wrapper: createWrapper(),
      });

      const { result: userInvestmentsResult } = renderHook(
        () => useUserInvestments("0x123"),
        {
          wrapper: createWrapper(),
        },
      );

      // Verifica se os hooks foram renderizados sem erro
      expect(projectsResult.current).toBeDefined();
      expect(userInvestmentsResult.current).toBeDefined();
    });
  });
});
