import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "../layout/Layout";
import { useWallet } from "../../contexts/WalletContext";

// Mock dos componentes filhos
vi.mock("../layout/Header", () => ({
  Header: () => <header data-testid="header">Header Component</header>,
}));

vi.mock("../layout/Footer", () => ({
  Footer: () => <footer data-testid="footer">Footer Component</footer>,
}));

// Mock do WalletContext
vi.mock("../../contexts/WalletContext", () => ({
  useWallet: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

/**
 * Testes para o componente Layout
 *
 * Cobertura:
 * - Renderização da estrutura básica
 * - Renderização dos componentes Header e Footer
 * - Renderização do conteúdo children
 * - Classes CSS e estrutura HTML
 * - Comportamento responsivo
 */
describe("Layout", () => {
  beforeEach(() => {
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

  it("deve renderizar a estrutura básica do layout", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    // Verifica se a estrutura principal está presente
    const layoutContainer = document.querySelector(".min-h-screen");
    expect(layoutContainer).toBeInTheDocument();
    expect(layoutContainer).toHaveClass("bg-gray-50", "flex", "flex-col");
  });

  it("deve renderizar o componente Header", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    // Verifica se o Header está presente
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("Header Component")).toBeInTheDocument();
  });

  it("deve renderizar o componente Footer", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    // Verifica se o Footer está presente
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("Footer Component")).toBeInTheDocument();
  });

  it("deve renderizar o conteúdo children no main", () => {
    const testContent = "This is test content";

    render(
      <Layout>
        <div data-testid="test-content">{testContent}</div>
      </Layout>,
    );

    // Verifica se o conteúdo children está presente
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();

    // Verifica se está dentro do elemento main
    const mainElement = document.querySelector("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass("flex-1");
    expect(mainElement).toContainElement(screen.getByTestId("test-content"));
  });

  it("deve renderizar múltiplos elementos children", () => {
    render(
      <Layout>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
        <span data-testid="child-3">Third Child</span>
      </Layout>,
    );

    // Verifica se todos os children estão presentes
    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();

    expect(screen.getByText("First Child")).toBeInTheDocument();
    expect(screen.getByText("Second Child")).toBeInTheDocument();
    expect(screen.getByText("Third Child")).toBeInTheDocument();
  });

  it("deve ter a estrutura HTML correta", () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
    );

    // Verifica a hierarquia dos elementos
    const container = document.querySelector(".min-h-screen");
    const header = screen.getByTestId("header");
    const main = document.querySelector("main");
    const footer = screen.getByTestId("footer");

    expect(container).toContainElement(header);
    expect(container).toContainElement(main);
    expect(container).toContainElement(footer);

    // Verifica a ordem dos elementos
    const children = Array.from(container!.children);
    expect(children[0]).toBe(header);
    expect(children[1]).toBe(main);
    expect(children[2]).toBe(footer);
  });

  it("deve aplicar classes CSS responsivas", () => {
    const { container } = render(
      <Layout>
        <div>Content</div>
      </Layout>,
    );

    // Verifica se as classes responsivas estão aplicadas
    const layoutContainer = container.firstChild;
    expect(layoutContainer).toHaveClass(
      "min-h-screen",
      "bg-gray-50",
      "flex",
      "flex-col",
    );
  });

  it("deve funcionar com children vazios", () => {
    render(<Layout>{null}</Layout>);

    // Verifica se ainda renderiza Header e Footer mesmo sem children
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();

    // Verifica se o main ainda existe
    const mainElement = document.querySelector("main");
    expect(mainElement).toBeInTheDocument();
  });

  it("deve funcionar com children complexos", () => {
    render(
      <Layout>
        <section>
          <h1>Page Title</h1>
          <article>
            <p>Article content</p>
          </article>
        </section>
      </Layout>,
    );

    // Verifica se a estrutura complexa é renderizada corretamente
    expect(screen.getByText("Page Title")).toBeInTheDocument();
    expect(screen.getByText("Article content")).toBeInTheDocument();

    const section = document.querySelector("section");
    const article = document.querySelector("article");
    expect(section).toBeInTheDocument();
    expect(article).toBeInTheDocument();
  });
});
