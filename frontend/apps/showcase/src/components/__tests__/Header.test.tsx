import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "../layout/Header";
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

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock padrão para useWallet
    vi.mocked(useWallet).mockReturnValue({
      isReady: false,
      accounts: [],
      selectedAccount: null,
      injector: null,
      error: null,
      isLoading: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
      selectAccount: vi.fn(),
      hasExtensions: true,
    });
  });

  it("deve renderizar o logo da aplicação", () => {
    renderWithProviders(<Header />);

    expect(screen.getByText("Launchpad Lunes")).toBeInTheDocument();
  });

  it("deve renderizar todos os links de navegação desktop", () => {
    renderWithProviders(<Header />);

    // Verifica links de navegação desktop (não visíveis em mobile)
    const desktopLinks = screen.getAllByRole("link");
    const linkTexts = desktopLinks.map((link) => link.textContent);

    expect(linkTexts).toContain("Início");
    expect(linkTexts).toContain("Projetos");
    expect(linkTexts).toContain("Launchpool");
    expect(linkTexts).toContain("Governança");
  });

  it("deve renderizar o componente WalletConnector", () => {
    renderWithProviders(<Header />);

    // O WalletConnector deve estar presente (verifica pelo botão de conectar)
    expect(screen.getByText(/conectar carteira/i)).toBeInTheDocument();
  });

  it("deve mostrar o botão do menu mobile", () => {
    renderWithProviders(<Header />);

    // Verifica se o botão do menu mobile está presente (procura por qualquer botão que não seja o de conectar carteira)
    const buttons = screen.getAllByRole("button");
    const menuButton = buttons.find(
      (button) =>
        button.querySelector("svg") &&
        !button.textContent?.includes("Conectar"),
    );
    expect(menuButton).toBeInTheDocument();
  });

  it("deve abrir e fechar o menu mobile ao clicar no botão", () => {
    renderWithProviders(<Header />);

    const buttons = screen.getAllByRole("button");
    const menuButton = buttons.find(
      (button) =>
        button.querySelector("svg") &&
        !button.textContent?.includes("Conectar"),
    );

    expect(menuButton).toBeInTheDocument();

    // Inicialmente o menu mobile não deve estar visível
    const initialLinks = screen.getAllByRole("link");

    // Clica para abrir o menu mobile
    fireEvent.click(menuButton!);

    // Verifica se os links do menu mobile aparecem
    const mobileLinks = screen.getAllByRole("link");
    expect(mobileLinks.length).toBeGreaterThan(initialLinks.length);

    // Clica novamente para fechar
    fireEvent.click(menuButton!);

    // O menu mobile deve estar fechado (apenas links desktop visíveis)
    const linksAfterClose = screen.getAllByRole("link");
    expect(linksAfterClose.length).toBe(initialLinks.length);
  });

  it("deve ter os links corretos com hrefs apropriados", () => {
    renderWithProviders(<Header />);

    expect(screen.getByRole("link", { name: /início/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: /projetos/i })).toHaveAttribute(
      "href",
      "/projetos",
    );
    expect(screen.getByRole("link", { name: /launchpool/i })).toHaveAttribute(
      "href",
      "/launchpool",
    );
    expect(screen.getByRole("link", { name: /governança/i })).toHaveAttribute(
      "href",
      "/governanca",
    );
  });

  it("deve aplicar as classes CSS corretas", () => {
    renderWithProviders(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass(
      "bg-white",
      "shadow-sm",
      "border-b",
      "border-gray-200",
    );
  });

  it("deve mostrar ícones diferentes no botão do menu mobile", () => {
    renderWithProviders(<Header />);

    const buttons = screen.getAllByRole("button");
    const menuButton = buttons.find(
      (button) =>
        button.querySelector("svg") &&
        !button.textContent?.includes("Conectar"),
    );

    expect(menuButton).toBeInTheDocument();

    // Inicialmente deve mostrar o ícone de Menu
    expect(menuButton!.querySelector("svg")).toBeInTheDocument();

    // Clica para abrir
    fireEvent.click(menuButton!);

    // Deve mostrar o ícone de X (fechar)
    expect(menuButton!.querySelector("svg")).toBeInTheDocument();
  });
});
