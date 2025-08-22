import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";

/**
 * Configuração do React Query Client
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos
      staleTime: 5 * 60 * 1000,
      // Manter cache por 10 minutos
      gcTime: 10 * 60 * 1000,
      // Retry automático em caso de erro
      retry: 2,
      // Refetch quando a janela ganha foco
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry automático para mutations
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Provider do React Query para gerenciar estado do servidor
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools apenas em desenvolvimento */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}

export { queryClient };
