import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import React from "react";
import { WalletProvider, useWallet } from "../WalletContext";
import type { UseLunesExtensionReturn } from "../../hooks/useLunesExtension";
import { useLunesExtension } from "../../hooks/useLunesExtension";

// Mock do hook useLunesExtension
vi.mock("../../hooks/useLunesExtension", () => ({
  useLunesExtension: vi.fn(),
}));

// Obtém a referência mockada do hook
const mockUseLunesExtension = vi.mocked(useLunesExtension);

// Mock de dados de teste para o estado da carteira
const mockWalletState: UseLunesExtensionReturn = {
  isReady: false,
  accounts: null,
  selectedAccount: null,
  injector: null,
  error: null,
  isLoading: false,
  hasExtensions: false,
  connect: vi.fn(),
  disconnect: vi.fn(),
  selectAccount: vi.fn(),
};

const mockConnectedWalletState: UseLunesExtensionReturn = {
  isReady: true,
  accounts: [
    {
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      meta: {
        genesisHash: "0x123",
        name: "Alice",
        source: "polkadot-js",
      },
      type: "sr25519",
    },
  ],
  selectedAccount: {
    address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    meta: {
      genesisHash: "0x123",
      name: "Alice",
      source: "polkadot-js",
    },
    type: "sr25519",
  },
  injector: {
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
  error: null,
  isLoading: false,
  hasExtensions: true,
  connect: vi.fn(),
  disconnect: vi.fn(),
  selectAccount: vi.fn(),
};

// Componente de teste para verificar o contexto
const TestComponent: React.FC = () => {
  const wallet = useWallet();

  return (
    <div>
      <div data-testid="is-ready">{wallet.isReady.toString()}</div>
      <div data-testid="has-extensions">{wallet.hasExtensions.toString()}</div>
      <div data-testid="is-loading">{wallet.isLoading.toString()}</div>
      <div data-testid="error">{wallet.error || "null"}</div>
      <div data-testid="selected-account">
        {wallet.selectedAccount?.meta.name || "null"}
      </div>
      <div data-testid="accounts-count">{wallet.accounts?.length || 0}</div>
      <button onClick={wallet.connect} data-testid="connect-button">
        Conectar
      </button>
      <button onClick={wallet.disconnect} data-testid="disconnect-button">
        Desconectar
      </button>
    </div>
  );
};

// Componente que tenta usar o hook fora do provider
const ComponentWithoutProvider: React.FC = () => {
  useWallet();
  return <div>Não deveria renderizar</div>;
};

/**
 * Testes para o WalletContext
 *
 * Cobertura:
 * - WalletProvider fornece o contexto corretamente
 * - useWallet funciona dentro do provider
 * - useWallet lança erro fora do provider
 * - Estados diferentes da carteira são propagados
 * - Funções da carteira são acessíveis
 * - Integração com usePolkadotExtension
 */
describe("WalletContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLunesExtension.mockReturnValue(mockWalletState);
  });

  describe("WalletProvider", () => {
    it("deve renderizar children corretamente", () => {
      render(
        <WalletProvider>
          <div data-testid="child">Conteúdo filho</div>
        </WalletProvider>,
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Conteúdo filho")).toBeInTheDocument();
    });

    it("deve chamar useLunesExtension internamente", () => {
      render(
        <WalletProvider>
          <div>Teste</div>
        </WalletProvider>,
      );

      expect(mockUseLunesExtension).toHaveBeenCalledTimes(1);
    });

    it("deve fornecer o estado da carteira para componentes filhos", () => {
      render(
        <WalletProvider>
          <TestComponent />
        </WalletProvider>,
      );

      expect(screen.getByTestId("is-ready")).toHaveTextContent("false");
      expect(screen.getByTestId("has-extensions")).toHaveTextContent("false");
      expect(screen.getByTestId("is-loading")).toHaveTextContent("false");
      expect(screen.getByTestId("error")).toHaveTextContent("null");
      expect(screen.getByTestId("selected-account")).toHaveTextContent("null");
      expect(screen.getByTestId("accounts-count")).toHaveTextContent("0");
    });

    it("deve fornecer funções da carteira para componentes filhos", () => {
      render(
        <WalletProvider>
          <TestComponent />
        </WalletProvider>,
      );

      const connectButton = screen.getByTestId("connect-button");
      const disconnectButton = screen.getByTestId("disconnect-button");

      expect(connectButton).toBeInTheDocument();
      expect(disconnectButton).toBeInTheDocument();

      // Verifica se as funções são chamadas quando os botões são clicados
      connectButton.click();
      expect(mockWalletState.connect).toHaveBeenCalledTimes(1);

      disconnectButton.click();
      expect(mockWalletState.disconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe("useWallet Hook", () => {
    it("deve retornar o estado da carteira quando usado dentro do provider", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      );

      const { result } = renderHook(() => useWallet(), { wrapper });

      expect(result.current).toEqual(mockWalletState);
    });

    it("deve lançar erro quando usado fora do provider", () => {
      // Captura erros do console para evitar poluição nos logs de teste
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<ComponentWithoutProvider />);
      }).toThrow(
        "useWallet deve ser usado dentro de um WalletProvider. " +
          "Certifique-se de que o componente está envolvido pelo WalletProvider.",
      );

      consoleSpy.mockRestore();
    });

    it("deve retornar estado conectado quando a carteira está conectada", () => {
      mockUseLunesExtension.mockReturnValue(mockConnectedWalletState);

      render(
        <WalletProvider>
          <TestComponent />
        </WalletProvider>,
      );

      expect(screen.getByTestId("is-ready")).toHaveTextContent("true");
      expect(screen.getByTestId("has-extensions")).toHaveTextContent("true");
      expect(screen.getByTestId("selected-account")).toHaveTextContent("Alice");
      expect(screen.getByTestId("accounts-count")).toHaveTextContent("1");
    });

    it("deve propagar erros da carteira", () => {
      const errorState = {
        ...mockWalletState,
        error: "Erro de conexão com a carteira",
      };
      mockUseLunesExtension.mockReturnValue(errorState);

      render(
        <WalletProvider>
          <TestComponent />
        </WalletProvider>,
      );

      expect(screen.getByTestId("error")).toHaveTextContent(
        "Erro de conexão com a carteira",
      );
    });

    it("deve propagar estado de carregamento", () => {
      const loadingState = {
        ...mockWalletState,
        isLoading: true,
      };
      mockUseLunesExtension.mockReturnValue(loadingState);

      render(
        <WalletProvider>
          <TestComponent />
        </WalletProvider>,
      );

      expect(screen.getByTestId("is-loading")).toHaveTextContent("true");
    });
  });

  describe("Integração com useLunesExtension", () => {
    it("deve repassar todas as propriedades do useLunesExtension", () => {
      const customState: UseLunesExtensionReturn = {
        isReady: true,
        accounts: [
          {
            address: "5Test123",
            meta: {
              name: "Test Account",
              source: "test",
              genesisHash: "0x456",
            },
            type: "sr25519",
          },
        ],
        selectedAccount: {
          address: "5Test123",
          meta: { name: "Test Account", source: "test", genesisHash: "0x456" },
          type: "sr25519",
        },
        injector: null,
        error: "Erro personalizado",
        isLoading: true,
        hasExtensions: true,
        connect: vi.fn(),
        disconnect: vi.fn(),
        selectAccount: vi.fn(),
      };

      mockUseLunesExtension.mockReturnValue(customState);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      );

      const { result } = renderHook(() => useWallet(), { wrapper });

      expect(result.current).toEqual(customState);
      expect(result.current.isReady).toBe(true);
      expect(result.current.accounts).toHaveLength(1);
      expect(result.current.selectedAccount?.meta.name).toBe("Test Account");
      expect(result.current.error).toBe("Erro personalizado");
      expect(result.current.isLoading).toBe(true);
      expect(result.current.hasExtensions).toBe(true);
    });

    it("deve manter referências das funções do hook original", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      );

      const { result } = renderHook(() => useWallet(), { wrapper });

      expect(result.current.connect).toBe(mockWalletState.connect);
      expect(result.current.disconnect).toBe(mockWalletState.disconnect);
      expect(result.current.selectAccount).toBe(mockWalletState.selectAccount);
    });
  });

  describe("Casos Extremos", () => {
    it("deve funcionar com múltiplos componentes filhos usando o contexto", () => {
      const SecondTestComponent: React.FC = () => {
        const { isReady } = useWallet();
        return <div data-testid="second-component">{isReady.toString()}</div>;
      };

      render(
        <WalletProvider>
          <TestComponent />
          <SecondTestComponent />
        </WalletProvider>,
      );

      expect(screen.getByTestId("is-ready")).toHaveTextContent("false");
      expect(screen.getByTestId("second-component")).toHaveTextContent("false");

      // Verifica se ambos os componentes recebem o mesmo estado
      expect(screen.getByTestId("is-ready")).toHaveTextContent(
        screen.getByTestId("second-component").textContent || "",
      );
    });

    it("deve funcionar com providers aninhados (não recomendado, mas possível)", () => {
      render(
        <WalletProvider>
          <WalletProvider>
            <TestComponent />
          </WalletProvider>
        </WalletProvider>,
      );

      // Deve funcionar normalmente, usando o provider mais próximo
      expect(screen.getByTestId("is-ready")).toHaveTextContent("false");
      expect(mockUseLunesExtension).toHaveBeenCalledTimes(2); // Chamado duas vezes devido aos dois providers
    });
  });
});
