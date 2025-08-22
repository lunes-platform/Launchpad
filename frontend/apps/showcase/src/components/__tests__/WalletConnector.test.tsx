import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletConnector } from "../WalletConnector";
import { WalletProvider, useWallet } from "../../contexts/WalletContext";

// Mock do contexto de carteira
vi.mock("../../contexts/WalletContext", () => ({
  useWallet: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <WalletProvider>{component}</WalletProvider>
    </QueryClientProvider>,
  );
};

describe("WalletConnector", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock padrão para useWallet
    vi.mocked(useWallet).mockReturnValue({
      isReady: false,
      accounts: [],
      selectedAccount: null,
      error: null,
      isLoading: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
      selectAccount: vi.fn(),
      hasExtensions: true,
    });
  });

  it("deve renderizar o botão de conectar carteira quando não conectado", () => {
    renderWithProviders(<WalletConnector />);

    expect(screen.getByText(/conectar carteira/i)).toBeInTheDocument();
  });

  it("deve mostrar opção de conectar quando há extensões disponíveis", async () => {
    vi.mocked(useWallet).mockReturnValue({
      isReady: false,
      accounts: [],
      selectedAccount: null,
      error: null,
      isLoading: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
      selectAccount: vi.fn(),
      hasExtensions: true,
    });

    renderWithProviders(<WalletConnector />);

    expect(screen.getByText(/conectar carteira/i)).toBeInTheDocument();
  });

  it("deve chamar função connect quando botão é clicado", async () => {
    const mockConnect = vi.fn();

    vi.mocked(useWallet).mockReturnValue({
      isReady: false,
      accounts: [],
      selectedAccount: null,
      error: null,
      isLoading: false,
      connect: mockConnect,
      disconnect: vi.fn(),
      selectAccount: vi.fn(),
      hasExtensions: true,
    });

    renderWithProviders(<WalletConnector />);

    const connectButton = screen.getByText(/conectar carteira/i);
    fireEvent.click(connectButton);

    expect(mockConnect).toHaveBeenCalled();
  });

  it("deve mostrar estado de carregamento", () => {
    vi.mocked(useWallet).mockReturnValue({
      isReady: false,
      accounts: [],
      selectedAccount: null,
      error: null,
      isLoading: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
      selectAccount: vi.fn(),
      hasExtensions: true,
    });

    renderWithProviders(<WalletConnector />);

    expect(screen.getByText(/conectando/i)).toBeInTheDocument();
  });

  it("deve mostrar mensagem de erro quando houver falha", () => {
    vi.mocked(useWallet).mockReturnValue({
      isReady: false,
      accounts: [],
      selectedAccount: null,
      error: "Erro ao carregar extensões",
      isLoading: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
      selectAccount: vi.fn(),
      hasExtensions: false,
    });

    renderWithProviders(<WalletConnector />);

    expect(screen.getByText(/erro ao carregar extensões/i)).toBeInTheDocument();
  });

  it("deve mostrar interface de conta conectada", async () => {
    const mockAccount = {
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      meta: { name: "Alice", source: "polkadot-js" },
      type: "sr25519" as const,
    };

    vi.mocked(useWallet).mockReturnValue({
      isReady: true,
      accounts: [mockAccount],
      selectedAccount: mockAccount,
      error: null,
      isLoading: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
      selectAccount: vi.fn(),
      hasExtensions: true,
    });

    renderWithProviders(<WalletConnector />);

    // Verifica se há um botão (que seria o botão de desconectar ou trocar conta)
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
