import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "../layout/Footer";

/**
 * Testes para o componente Footer
 *
 * Cobertura:
 * - Renderização de elementos principais
 * - Links de navegação e suas URLs
 * - Redes sociais e links externos
 * - Estrutura e conteúdo textual
 * - Classes CSS e acessibilidade
 */
describe("Footer", () => {
  it("deve renderizar o título e descrição da plataforma", () => {
    render(<Footer />);

    // Verifica o título principal
    expect(screen.getByText("Launchpad Lunes")).toBeInTheDocument();

    // Verifica a descrição
    expect(
      screen.getByText(
        /A plataforma descentralizada para lançamento de projetos/,
      ),
    ).toBeInTheDocument();
  });

  it("deve renderizar todos os links de redes sociais", () => {
    render(<Footer />);

    // Verifica se todos os links de redes sociais estão presentes
    expect(
      document.querySelector('a[href="https://github.com/lunes-platform"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('a[href="https://twitter.com/lunes_platform"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('a[href="https://t.me/lunes_platform"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('a[href="https://lunes.io"]'),
    ).toBeInTheDocument();
  });

  it("deve ter os links de redes sociais com URLs corretas", () => {
    render(<Footer />);

    // Verifica as URLs dos links de redes sociais
    const githubLink = document.querySelector(
      'a[href="https://github.com/lunes-platform"]',
    );
    const twitterLink = document.querySelector(
      'a[href="https://twitter.com/lunes_platform"]',
    );
    const telegramLink = document.querySelector(
      'a[href="https://t.me/lunes_platform"]',
    );
    const websiteLink = document.querySelector('a[href="https://lunes.io"]');

    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/lunes-platform",
    );
    expect(twitterLink).toHaveAttribute(
      "href",
      "https://twitter.com/lunes_platform",
    );
    expect(telegramLink).toHaveAttribute("href", "https://t.me/lunes_platform");
    expect(websiteLink).toHaveAttribute("href", "https://lunes.io");
  });

  it("deve renderizar a seção de links da plataforma", () => {
    render(<Footer />);

    // Verifica o título da seção
    expect(screen.getByText("Plataforma")).toBeInTheDocument();

    // Verifica os links da plataforma
    expect(screen.getByRole("link", { name: "Projetos" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Launchpool" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Governança" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Programa de Afiliados" }),
    ).toBeInTheDocument();
  });

  it("deve ter os links da plataforma com URLs corretas", () => {
    render(<Footer />);

    // Verifica as URLs dos links da plataforma
    expect(screen.getByRole("link", { name: "Projetos" })).toHaveAttribute(
      "href",
      "/projetos",
    );
    expect(screen.getByRole("link", { name: "Launchpool" })).toHaveAttribute(
      "href",
      "/launchpool",
    );
    expect(screen.getByRole("link", { name: "Governança" })).toHaveAttribute(
      "href",
      "/governanca",
    );
    expect(
      screen.getByRole("link", { name: "Programa de Afiliados" }),
    ).toHaveAttribute("href", "/afiliados");
  });

  it("deve renderizar a seção de suporte", () => {
    render(<Footer />);

    // Verifica o título da seção
    expect(screen.getByText("Suporte")).toBeInTheDocument();

    // Verifica os links de suporte
    expect(
      screen.getByRole("link", { name: "Como Participar" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "FAQ" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Termos de Uso" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Política de Privacidade" }),
    ).toBeInTheDocument();
  });

  it("deve ter os links de suporte com URLs corretas", () => {
    render(<Footer />);

    // Verifica as URLs dos links de suporte
    expect(
      screen.getByRole("link", { name: "Como Participar" }),
    ).toHaveAttribute("href", "/como-participar");
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute(
      "href",
      "/faq",
    );
    expect(screen.getByRole("link", { name: "Termos de Uso" })).toHaveAttribute(
      "href",
      "/termos",
    );
    expect(
      screen.getByRole("link", { name: "Política de Privacidade" }),
    ).toHaveAttribute("href", "/privacidade");
  });

  it("deve renderizar as informações de copyright", () => {
    render(<Footer />);

    // Verifica o texto de copyright
    expect(
      screen.getByText("© 2024 Lunes Platform. Todos os direitos reservados."),
    ).toBeInTheDocument();

    // Verifica a mensagem sobre Polkadot
    expect(
      screen.getByText("Construído com ❤️ no ecossistema Polkadot"),
    ).toBeInTheDocument();
  });

  it("deve aplicar as classes CSS corretas", () => {
    const { container } = render(<Footer />);

    // Verifica se o footer tem as classes corretas
    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("bg-grafite", "text-white");
  });

  it("deve ter links externos com atributos de segurança", () => {
    render(<Footer />);

    // Verifica se os links externos têm target="_blank" e rel="noopener noreferrer"
    const externalLinks = [
      document.querySelector('a[href="https://github.com/lunes-platform"]'),
      document.querySelector('a[href="https://twitter.com/lunes_platform"]'),
      document.querySelector('a[href="https://t.me/lunes_platform"]'),
      document.querySelector('a[href="https://lunes.io"]'),
    ];

    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
