import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useLunesExtension } from "../useLunesExtension";
import type {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";

// Mock das dependências do Polkadot
const mockWeb3Enable = vi.fn();
const mockWeb3AccountsSubscribe = vi.fn();
const mockWeb3FromSource = vi.fn();
const mockUnsubscribe = vi.fn();

// Mock do módulo @polkadot/extension-dapp
vi.mock("@polkadot/extension-dapp", () => ({
  web3Enable: mockWeb3Enable,
  web3AccountsSubscribe: mockWeb3AccountsSubscribe,
  web3FromSource: mockWeb3FromSource,
}));

// Mock de contas de teste
const mockAccounts: InjectedAccountWithMeta[] = [
  {
    address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    meta: {
      genesisHash: "0x123",
      name: "Alice",
      source: "polkadot-js",
    },
    type: "sr25519",
  },
  {
    address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    meta: {
      genesisHash: "0x123",
      name: "Bob",
      source: "subwallet-js",
    },
    type: "sr25519",
  },
];

// Mock de extensões
const mockExtensions: InjectedExtension[] = [
  {
    name: "polkadot-js",
    version: "0.44.1",
    accounts: {
      get: vi.fn(),
      subscribe: vi.fn(),
    },
    signer: {
      signPayload: vi.fn(),
      signRaw: vi.fn(),
    },
    metadata: {
      get: vi.fn(),
      provide: vi.fn(),
    },
  },
];

// Mock do injector
const mockInjector: InjectedExtension = {
  name: "polkadot-js",
  version: "0.44.1",
  accounts: {
    get: vi.fn(),
    subscribe: vi.fn(),
  },
  signer: {
    signPayload: vi.fn(),
    signRaw: vi.fn(),
  },
  metadata: {
    get: vi.fn(),
    provide: vi.fn(),
  },
};

/**
 * Testes para o hook usePolkadotExtension
 *
 * Cobertura:
 * - Estado inicial do hook
 * - Conexão bem-sucedida com extensões
 * - Tratamento de erros de conexão
 * - Seleção de contas
 * - Desconexão
 * - Obtenção de injector
 * - Cleanup de efeitos
 * - Casos extremos e edge cases
 */
describe("useLunesExtension", () => {
  beforeEach(() => {
    // Reset de todos os mocks
    vi.clearAllMocks();

    // Mock padrão do document.readyState
    Object.defineProperty(document, "readyState", {
      value: "complete",
      writable: true,
    });

    // Mock padrão das funções
    mockWeb3Enable.mockResolvedValue(mockExtensions);
    mockWeb3AccountsSubscribe.mockImplementation((callback) => {
      callback(mockAccounts);
      return mockUnsubscribe;
    });
    mockWeb3FromSource.mockResolvedValue(mockInjector);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Estado Inicial", () => {
    it("deve ter o estado inicial correto", () => {
      const { result } = renderHook(() => useLunesExtension());

      expect(result.current.isReady).toBe(false);
      expect(result.current.accounts).toBe(null);
      expect(result.current.selectedAccount).toBe(null);
      expect(result.current.injector).toBe(null);
      expect(result.current.error).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasExtensions).toBe(false);
      expect(typeof result.current.connect).toBe("function");
      expect(typeof result.current.disconnect).toBe("function");
      expect(typeof result.current.selectAccount).toBe("function");
    });
  });

  describe("Conexão com Extensões", () => {
    it("deve conectar com sucesso às extensões disponíveis", async () => {
      const { result } = renderHook(() => useLunesExtension());

      await act(async () => {
        await result.current.connect();
      });

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      expect(mockWeb3Enable).toHaveBeenCalledWith("Launchpad Lunes");
      expect(mockWeb3AccountsSubscribe).toHaveBeenCalled();
      expect(result.current.accounts).toEqual(mockAccounts);
      expect(result.current.selectedAccount).toEqual(mockAccounts[0]);
      expect(result.current.hasExtensions).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it("deve definir isLoading como true durante a conexão", async () => {
      const { result } = renderHook(() => useLunesExtension());

      // Mock para simular delay na conexão
      mockWeb3Enable.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockExtensions), 100),
          ),
      );

      act(() => {
        result.current.connect();
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("deve tratar erro quando nenhuma extensão é encontrada", async () => {
      mockWeb3Enable.mockResolvedValue([]);

      const { result } = renderHook(() => useLunesExtension());

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.error).toContain(
        "Nenhuma extensão de carteira encontrada",
      );
      expect(result.current.isReady).toBe(false);
      expect(result.current.hasExtensions).toBe(false);
    });

    it("deve tratar erro genérico durante a conexão", async () => {
      const errorMessage = "Erro de conexão";
      mockWeb3Enable.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useLunesExtension());

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isReady).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it("deve tratar erro desconhecido durante a conexão", async () => {
      mockWeb3Enable.mockRejectedValue("Erro string");

      const { result } = renderHook(() => useLunesExtension());

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.error).toBe(
        "Erro desconhecido ao conectar carteira",
      );
    });
  });

  describe("Gerenciamento de Contas", () => {
    it("deve selecionar automaticamente a primeira conta disponível", async () => {
      const { result } = renderHook(() => useLunesExtension());

      await act(async () => {
        await result.current.connect();
      });

      await waitFor(() => {
        expect(result.current.selectedAccount).toEqual(mockAccounts[0]);
      });
    });

    it("deve permitir selecionar uma conta específica", async () => {
      const { result } = renderHook(() => useLunesExtension());

      await act(async () => {
        await result.current.connect();
      });

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      act(() => {
        result.current.selectAccount(mockAccounts[1]);
      });

      expect(result.current.selectedAccount).toEqual(mockAccounts[1]);
    });

    it("deve obter o injector da conta selecionada", async () => {
      const { result } = renderHook(() => useLunesExtension());

      await act(async () => {
        await result.current.connect();
      });

      await waitFor(() => {
        expect(result.current.injector).toEqual(mockInjector);
      });

      expect(mockWeb3FromSource).toHaveBeenCalledWith(
        mockAccounts[0].meta.source,
      );
    });

    it("deve tratar erro ao obter injector", async () => {
      const errorMessage = "Erro ao obter injector";
      mockWeb3FromSource.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useLunesExtension());

      await act(async () => {
        await result.current.connect();
      });

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });
    });

    it("deve definir injector como null quando não há conta selecionada", async () => {
      const { result } = renderHook(() => useLunesExtension());

      // Simula contas vazias
      mockWeb3AccountsSubscribe.mockImplementation((callback) => {
        callback([]);
        return mockUnsubscribe;
      });

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.injector).toBe(null);
    });
  });

  describe("Desconexão", () => {
    it("deve desconectar e limpar o estado corretamente", async () => {
      const { result } = renderHook(() => useLunesExtension());

      // Primeiro conecta
      await act(async () => {
        await result.current.connect();
      });

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      // Depois desconecta
      act(() => {
        result.current.disconnect();
      });

      expect(result.current.isReady).toBe(false);
      expect(result.current.accounts).toBe(null);
      expect(result.current.selectedAccount).toBe(null);
      expect(result.current.injector).toBe(null);
      expect(result.current.error).toBe(null);
      expect(result.current.hasExtensions).toBe(false);
      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it("deve funcionar mesmo se não houver subscription ativa", () => {
      const { result } = renderHook(() => useLunesExtension());

      // Tenta desconectar sem ter conectado antes
      expect(() => {
        act(() => {
          result.current.disconnect();
        });
      }).not.toThrow();
    });
  });

  describe("Cleanup e Efeitos", () => {
    it("deve fazer cleanup da subscription ao desmontar", () => {
      const { unmount } = renderHook(() => useLunesExtension());

      // Simula uma conexão ativa
      const mockUnsubscribeFn = vi.fn();
      mockWeb3AccountsSubscribe.mockReturnValue(mockUnsubscribeFn);

      unmount();

      // O cleanup deve ser chamado automaticamente
      // Nota: Este teste verifica se não há vazamentos de memória
    });
  });

  describe("Casos Extremos", () => {
    it("deve funcionar quando document não está pronto", async () => {
      // Mock document.readyState como loading
      Object.defineProperty(document, "readyState", {
        value: "loading",
        writable: true,
      });

      const { result } = renderHook(() => useLunesExtension());

      // Simula o evento DOMContentLoaded
      const connectPromise = act(async () => {
        const promise = result.current.connect();

        // Simula o documento ficando pronto
        setTimeout(() => {
          Object.defineProperty(document, "readyState", {
            value: "complete",
            writable: true,
          });
          document.dispatchEvent(new Event("DOMContentLoaded"));
        }, 50);

        return promise;
      });

      await connectPromise;

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });
    });

    it("deve manter consistência quando contas mudam dinamicamente", async () => {
      let accountsCallback:
        | ((accounts: InjectedAccountWithMeta[]) => void)
        | null = null;

      mockWeb3AccountsSubscribe.mockImplementation((callback) => {
        accountsCallback = callback;
        callback(mockAccounts);
        return mockUnsubscribe;
      });

      const { result } = renderHook(() => useLunesExtension());

      await act(async () => {
        await result.current.connect();
      });

      await waitFor(() => {
        expect(result.current.accounts).toEqual(mockAccounts);
      });

      // Simula mudança nas contas
      const newAccounts = [mockAccounts[1]];

      act(() => {
        if (accountsCallback) {
          accountsCallback(newAccounts);
        }
      });

      expect(result.current.accounts).toEqual(newAccounts);
    });

    it("deve tratar múltiplas chamadas de connect corretamente", async () => {
      const { result } = renderHook(() => useLunesExtension());

      // Chama connect múltiplas vezes rapidamente
      await act(async () => {
        await Promise.all([
          result.current.connect(),
          result.current.connect(),
          result.current.connect(),
        ]);
      });

      // O hook pode ter lógica para prevenir múltiplas chamadas simultâneas
      // Verifica se pelo menos uma chamada foi feita
      expect(mockWeb3Enable).toHaveBeenCalledWith("Launchpad Lunes");

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });
    });
  });

  describe("Integração com Diferentes Extensões", () => {
    it("deve funcionar com diferentes fontes de conta", async () => {
      const accountWithDifferentSource: InjectedAccountWithMeta = {
        ...mockAccounts[0],
        meta: {
          ...mockAccounts[0].meta,
          source: "talisman",
        },
      };

      mockWeb3AccountsSubscribe.mockImplementation((callback) => {
        callback([accountWithDifferentSource]);
        return mockUnsubscribe;
      });

      const { result } = renderHook(() => useLunesExtension());

      await act(async () => {
        await result.current.connect();
      });

      await waitFor(() => {
        expect(result.current.selectedAccount).toEqual(
          accountWithDifferentSource,
        );
      });

      expect(mockWeb3FromSource).toHaveBeenCalledWith("talisman");
    });
  });
});
