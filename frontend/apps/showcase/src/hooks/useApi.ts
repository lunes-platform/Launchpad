import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, investmentsApi, stakingApi } from "../services/api";
import { LUNES_API_CONFIG } from "../config/lunes";

/**
 * Hook para buscar todos os projetos da Rede Lunes
 */
export const useProjects = () => {
  return useQuery({
    queryKey: ["lunes-projects"],
    queryFn: projectsApi.getAll,
    staleTime: LUNES_API_CONFIG.cache.projectsStaleTime,
    gcTime: LUNES_API_CONFIG.cache.projectsStaleTime * 2,
  });
};

/**
 * Hook para buscar um projeto específico por ID na Rede Lunes
 */
export const useProject = (id: string) => {
  return useQuery({
    queryKey: ["lunes-project", id],
    queryFn: () => projectsApi.getById(id),
    staleTime: LUNES_API_CONFIG.cache.projectsStaleTime,
    gcTime: LUNES_API_CONFIG.cache.projectsStaleTime * 2,
    enabled: !!id,
  });
};

/**
 * Hook para buscar projetos por fase na Rede Lunes
 */
export const useProjectsByPhase = (phase: string) => {
  return useQuery({
    queryKey: ["lunes-projects", "phase", phase],
    queryFn: () => projectsApi.getByPhase(phase),
    staleTime: LUNES_API_CONFIG.cache.projectsStaleTime,
    gcTime: LUNES_API_CONFIG.cache.projectsStaleTime * 2,
    enabled: !!phase,
  });
};

/**
 * Hook para buscar projetos em destaque da Rede Lunes
 */
export const useFeaturedProjects = () => {
  return useQuery({
    queryKey: ["lunes-projects", "featured"],
    queryFn: projectsApi.getFeatured,
    staleTime: LUNES_API_CONFIG.cache.projectsStaleTime,
    gcTime: LUNES_API_CONFIG.cache.projectsStaleTime * 2,
  });
};

/**
 * Hook para buscar projetos criados por um usuário específico
 */
export const useUserProjects = (userAddress: string) => {
  return useQuery({
    queryKey: ["lunes-projects", "user", userAddress],
    queryFn: () => projectsApi.getByUser(userAddress),
    staleTime: LUNES_API_CONFIG.cache.userDataStaleTime,
    gcTime: LUNES_API_CONFIG.cache.userDataStaleTime * 2,
    enabled: !!userAddress,
  });
};

/**
 * Hook para buscar investimentos do usuário na Rede Lunes
 */
export const useUserInvestments = (userAddress: string) => {
  return useQuery({
    queryKey: ["lunes-investments", userAddress],
    queryFn: () => investmentsApi.getByUser(userAddress),
    staleTime: LUNES_API_CONFIG.cache.userDataStaleTime,
    gcTime: LUNES_API_CONFIG.cache.userDataStaleTime * 2,
    enabled: !!userAddress,
  });
};

/**
 * Hook para buscar pools de staking da Rede Lunes
 */
export const useStakingPools = () => {
  return useQuery({
    queryKey: ["lunes-staking", "pools"],
    queryFn: stakingApi.getPools,
    staleTime: LUNES_API_CONFIG.cache.projectsStaleTime,
    gcTime: LUNES_API_CONFIG.cache.projectsStaleTime * 2,
  });
};

/**
 * Hook para buscar informações de staking do usuário na Rede Lunes
 */
export const useUserStaking = (userAddress: string) => {
  return useQuery({
    queryKey: ["lunes-staking", "user", userAddress],
    queryFn: () => stakingApi.getUserStaking(userAddress),
    staleTime: LUNES_API_CONFIG.cache.userDataStaleTime,
    gcTime: LUNES_API_CONFIG.cache.userDataStaleTime * 2,
    enabled: !!userAddress,
  });
};

/**
 * Hook para criar um novo investimento na Rede Lunes
 */
export const useCreateInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: investmentsApi.create,
    onSuccess: (_data, variables) => {
      // Invalida e refetch os investimentos do usuário
      queryClient.invalidateQueries({
        queryKey: ["lunes-investments", variables.userAddress],
      });

      // Invalida os projetos para atualizar estatísticas
      queryClient.invalidateQueries({
        queryKey: ["lunes-projects"],
      });
    },
  });
};

/**
 * Hook para fazer stake em um pool da Rede Lunes
 */
export const useStake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stakingApi.stake,
    onSuccess: (_data, variables) => {
      // Invalida informações de staking do usuário
      queryClient.invalidateQueries({
        queryKey: ["lunes-staking", "user", variables.userAddress],
      });

      // Invalida pools de staking para atualizar informações
      queryClient.invalidateQueries({
        queryKey: ["lunes-staking", "pools"],
      });
    },
  });
};

/**
 * Hook para remover stake de um pool da Rede Lunes
 */
export const useUnstake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stakingApi.unstake,
    onSuccess: (_data, variables) => {
      // Invalida informações de staking do usuário
      queryClient.invalidateQueries({
        queryKey: ["lunes-staking", "user", variables.userAddress],
      });

      // Invalida pools de staking para atualizar informações
      queryClient.invalidateQueries({
        queryKey: ["lunes-staking", "pools"],
      });
    },
  });
};

/**
 * Hook para reivindicar recompensas de staking na Rede Lunes
 */
export const useClaimStakingRewards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stakingApi.claimRewards,
    onSuccess: (_data, variables) => {
      // Invalida informações de staking do usuário
      queryClient.invalidateQueries({
        queryKey: ["lunes-staking", "user", variables.userAddress],
      });

      // Invalida pools de staking para atualizar informações
      queryClient.invalidateQueries({
        queryKey: ["lunes-staking", "pools"],
      });
    },
  });
};

/**
 * Hook para atualizar status de investimento
 */
export const useUpdateInvestmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      investmentId,
      status,
    }: {
      investmentId: string;
      status: "pending" | "confirmed" | "failed";
    }) => investmentsApi.updateStatus(investmentId, status),
    onSuccess: () => {
      // Invalida investimentos do usuário para refletir a mudança de status
      queryClient.invalidateQueries({
        queryKey: ["lunes-investments"],
      });
    },
  });
};

/**
 * Utilitários para gerenciar cache da API da Rede Lunes
 */
export const useLunesApiUtils = () => {
  const queryClient = useQueryClient();

  return {
    /**
     * Invalida todos os dados de projetos da Rede Lunes
     */
    invalidateProjects: () => {
      queryClient.invalidateQueries({ queryKey: ["lunes-projects"] });
    },

    /**
     * Invalida dados de investimentos de um usuário específico
     */
    invalidateUserInvestments: (userAddress: string) => {
      queryClient.invalidateQueries({
        queryKey: ["lunes-investments", userAddress],
      });
    },

    /**
     * Invalida dados de staking de um usuário específico
     */
    invalidateUserStaking: (userAddress: string) => {
      queryClient.invalidateQueries({
        queryKey: ["lunes-staking", "user", userAddress],
      });
    },

    /**
     * Invalida todos os dados de staking
     */
    invalidateStaking: () => {
      queryClient.invalidateQueries({ queryKey: ["lunes-staking"] });
    },

    /**
     * Limpa todo o cache da API da Rede Lunes
     */
    clearLunesCache: () => {
      queryClient.clear();
    },

    /**
     * Pré-carrega dados de um projeto específico
     */
    prefetchProject: (projectId: string) => {
      queryClient.prefetchQuery({
        queryKey: ["lunes-project", projectId],
        queryFn: () => projectsApi.getById(projectId),
        staleTime: LUNES_API_CONFIG.cache.projectsStaleTime,
      });
    },
  };
};
