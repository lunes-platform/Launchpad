import { useState, useEffect, useMemo, useCallback } from "react";
import type { Project } from "../types";

/**
 * Interface para configuração da paginação
 */
interface PaginationConfig {
  pageSize: number;
  initialPage: number;
  prefetchPages: number;
}

/**
 * Interface para o estado da paginação
 */
interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Interface para cache de projetos
 */
interface ProjectCache {
  [page: number]: {
    data: Project[];
    timestamp: number;
    expiresAt: number;
  };
}

/**
 * Hook personalizado para gerenciar paginação, lazy loading e cache de projetos
 *
 * @param projects - Array completo de projetos
 * @param config - Configuração da paginação
 * @returns Estado e funções para gerenciar a paginação
 */
export function useProjectsPagination(
  projects: Project[],
  config: PaginationConfig = {
    pageSize: 9, // 3x3 grid
    initialPage: 1,
    prefetchPages: 2,
  },
) {
  const [currentPage, setCurrentPage] = useState(config.initialPage);
  const [cache, setCache] = useState<ProjectCache>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefetchedPages, setPrefetchedPages] = useState<Set<number>>(
    new Set(),
  );

  // Constantes de cache
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  const MAX_CACHE_SIZE = 20; // Máximo de páginas em cache

  // Calcular informações da paginação
  const paginationInfo = useMemo((): PaginationState => {
    const totalItems = projects.length;
    const totalPages = Math.ceil(totalItems / config.pageSize);

    return {
      currentPage,
      totalPages,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      isLoading,
      error,
    };
  }, [projects.length, config.pageSize, currentPage, isLoading, error]);

  /**
   * Simula carregamento assíncrono de uma página
   * Em uma aplicação real, isso faria uma chamada para a API
   */
  const loadPage = useCallback(
    async (page: number): Promise<Project[]> => {
      // Simular delay de rede
      await new Promise((resolve) =>
        setTimeout(resolve, 300 + Math.random() * 200),
      );

      const startIndex = (page - 1) * config.pageSize;
      const endIndex = startIndex + config.pageSize;

      return projects.slice(startIndex, endIndex);
    },
    [projects, config.pageSize],
  );

  /**
   * Verifica se uma página está em cache e ainda é válida
   */
  const isPageCached = useCallback(
    (page: number): boolean => {
      const cachedPage = cache[page];
      if (!cachedPage) return false;

      return Date.now() < cachedPage.expiresAt;
    },
    [cache],
  );

  /**
   * Limpa páginas expiradas do cache
   */
  const cleanExpiredCache = useCallback(() => {
    const now = Date.now();
    const validPages: ProjectCache = {};

    Object.entries(cache).forEach(([page, data]) => {
      if (now < data.expiresAt) {
        validPages[parseInt(page)] = data;
      }
    });

    setCache(validPages);
  }, [cache]);

  /**
   * Limita o tamanho do cache removendo as páginas mais antigas
   */
  const limitCacheSize = useCallback((newCache: ProjectCache) => {
    const pages = Object.keys(newCache).map(Number);

    if (pages.length <= MAX_CACHE_SIZE) {
      return newCache;
    }

    // Ordenar por timestamp (mais recente primeiro)
    const sortedPages = pages.sort(
      (a, b) => newCache[b].timestamp - newCache[a].timestamp,
    );

    // Manter apenas as páginas mais recentes
    const limitedCache: ProjectCache = {};
    sortedPages.slice(0, MAX_CACHE_SIZE).forEach((page) => {
      limitedCache[page] = newCache[page];
    });

    return limitedCache;
  }, []);

  /**
   * Carrega uma página específica com cache
   */
  const fetchPage = useCallback(
    async (page: number, isPrefetch = false) => {
      // Verificar se a página está em cache
      if (isPageCached(page)) {
        return cache[page].data;
      }

      if (!isPrefetch) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const pageData = await loadPage(page);
        const now = Date.now();

        // Atualizar cache
        setCache((prevCache) => {
          const newCache = {
            ...prevCache,
            [page]: {
              data: pageData,
              timestamp: now,
              expiresAt: now + CACHE_DURATION,
            },
          };

          return limitCacheSize(newCache);
        });

        return pageData;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao carregar projetos";
        if (!isPrefetch) {
          setError(errorMessage);
        }
        throw err;
      } finally {
        if (!isPrefetch) {
          setIsLoading(false);
        }
      }
    },
    [isPageCached, cache, loadPage, limitCacheSize],
  );

  /**
   * Prefetch de páginas adjacentes
   */
  const prefetchAdjacentPages = useCallback(
    async (centerPage: number) => {
      const pagesToPrefetch: number[] = [];

      // Páginas para prefetch (anterior e próxima)
      for (let i = 1; i <= config.prefetchPages; i++) {
        const prevPage = centerPage - i;
        const nextPage = centerPage + i;

        if (
          prevPage >= 1 &&
          !isPageCached(prevPage) &&
          !prefetchedPages.has(prevPage)
        ) {
          pagesToPrefetch.push(prevPage);
        }

        if (
          nextPage <= paginationInfo.totalPages &&
          !isPageCached(nextPage) &&
          !prefetchedPages.has(nextPage)
        ) {
          pagesToPrefetch.push(nextPage);
        }
      }

      // Executar prefetch em paralelo
      const prefetchPromises = pagesToPrefetch.map(async (page) => {
        try {
          await fetchPage(page, true);
          setPrefetchedPages((prev) => new Set([...prev, page]));
        } catch (err) {
          // Ignorar erros de prefetch
          console.warn(`Falha no prefetch da página ${page}:`, err);
        }
      });

      await Promise.allSettled(prefetchPromises);
    },
    [
      config.prefetchPages,
      isPageCached,
      prefetchedPages,
      paginationInfo.totalPages,
      fetchPage,
    ],
  );

  /**
   * Navegar para uma página específica
   */
  const goToPage = useCallback(
    async (page: number) => {
      if (
        page < 1 ||
        page > paginationInfo.totalPages ||
        page === currentPage
      ) {
        return;
      }

      setCurrentPage(page);

      // Carregar a página atual
      await fetchPage(page);

      // Prefetch das páginas adjacentes
      prefetchAdjacentPages(page);
    },
    [currentPage, paginationInfo.totalPages, fetchPage, prefetchAdjacentPages],
  );

  /**
   * Navegar para a próxima página
   */
  const nextPage = useCallback(() => {
    if (paginationInfo.hasNextPage) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, paginationInfo.hasNextPage, goToPage]);

  /**
   * Navegar para a página anterior
   */
  const previousPage = useCallback(() => {
    if (paginationInfo.hasPreviousPage) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, paginationInfo.hasPreviousPage, goToPage]);

  /**
   * Obter projetos da página atual
   */
  const currentPageProjects = useMemo(() => {
    if (isPageCached(currentPage)) {
      return cache[currentPage].data;
    }
    return [];
  }, [currentPage, cache, isPageCached]);

  /**
   * Resetar paginação (útil quando filtros mudam)
   */
  const resetPagination = useCallback(() => {
    setCurrentPage(config.initialPage);
    setCache({});
    setPrefetchedPages(new Set());
    setError(null);
  }, [config.initialPage]);

  /**
   * Invalidar cache (forçar recarregamento)
   */
  const invalidateCache = useCallback(() => {
    setCache({});
    setPrefetchedPages(new Set());
  }, []);

  // Efeito para carregar a página inicial
  useEffect(() => {
    if (projects.length > 0) {
      fetchPage(currentPage).then(() => {
        // Prefetch da próxima página após carregar a inicial
        prefetchAdjacentPages(currentPage);
      });
    }
  }, [projects.length]); // Apenas quando os projetos mudarem

  // Efeito para limpeza periódica do cache
  useEffect(() => {
    const interval = setInterval(cleanExpiredCache, 60000); // Limpar a cada minuto
    return () => clearInterval(interval);
  }, [cleanExpiredCache]);

  return {
    // Estado da paginação
    ...paginationInfo,

    // Dados da página atual
    projects: currentPageProjects,

    // Funções de navegação
    goToPage,
    nextPage,
    previousPage,

    // Funções de controle
    resetPagination,
    invalidateCache,

    // Informações de cache
    cacheSize: Object.keys(cache).length,
    isCached: isPageCached(currentPage),
  };
}

/**
 * Hook simplificado para paginação básica sem cache
 */
export function useSimplePagination(items: any[], pageSize: number = 9) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const previousPage = () => goToPage(currentPage - 1);
  const resetPagination = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    totalItems: items.length,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    items: currentItems,
    goToPage,
    nextPage,
    previousPage,
    resetPagination,
  };
}
