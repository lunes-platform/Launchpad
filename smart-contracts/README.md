# Lunes Launchpad - Smart Contracts

Este diretório contém todos os smart contracts relacionados ao ecossistema Lunes Launchpad. Ele é configurado como um **workspace Cargo** para gerenciar múltiplos contratos e crates de forma eficiente e organizada.

## Arquitetura do Diretório

A estrutura foi projetada para promover a modularidade, separação de responsabilidades e facilidade de manutenção.

```
smart-contracts/
├── Cargo.toml          # Define o workspace Cargo e perfis de compilação.
├── contracts/          # Contém os smart contracts individuais.
│   └── launchpad/      # Contrato principal do Launchpad.
│       ├── Cargo.toml  # Dependências e metadados do contrato.
│       └── src/        # Código-fonte do contrato.
├── crates/             # Crates Rust auxiliares (lógica compartilhada, tipos, etc.).
│   └── (vazio)         # Adicione aqui crates como `shared-types`.
├── docs/               # Documentação técnica e de segurança.
├── scripts/            # Scripts para build, deploy, testes e benchmarks.
├── tests/              # Testes de integração e end-to-end (E2E).
└── README.md           # Este arquivo.
```

## Pré-requisitos

Certifique-se de ter o [ambiente de desenvolvimento Ink!](https://use.ink/getting-started/setup/) configurado corretamente. As principais ferramentas são:

-   **Rust Toolchain**: `rustup` com o toolchain `stable`.
-   **`cargo-contract`**: Ferramenta de linha de comando para contratos Ink!.
-   **Nó de Desenvolvimento**: `substrate-contracts-node` para testes locais.

## Comandos Comuns

Todos os comandos devem ser executados a partir do diretório raiz `smart-contracts/`.

### Compilar todos os contratos

```bash
cargo build
```

### Compilar um contrato específico para deploy (Wasm)

Para compilar o contrato `launchpad` em modo `release`:

```bash
cargo contract build --manifest-path contracts/launchpad/Cargo.toml
```

O artefato final (`.contract` e `.wasm`) será gerado em `target/ink/launchpad.contract`.

### Executar Testes

#### Testes Unitários

Para executar os testes unitários de todos os contratos e crates:

```bash
cargo test
```

Para um contrato específico:

```bash
cargo test --package launchpad
```

#### Testes End-to-End (E2E)

Os testes E2E interagem com um nó de blockchain real. Certifique-se de que o `substrate-contracts-node` esteja em execução.

```bash
# Navegue até o diretório do contrato que contém os testes E2E
cd contracts/launchpad

# Execute os testes E2E
cargo test --features e2e-tests

# Volte para o diretório raiz
cd ../..
```

## Princípios de Design

-   **Segurança em Primeiro Lugar**: Aderência estrita às melhores práticas de segurança para smart contracts.
-   **TDD (Test-Driven Development)**: A lógica de negócio é desenvolvida através de testes (unitários e E2E).
-   **Modularidade**: O código é organizado em módulos lógicos e, quando aplicável, em crates separados para reuso.
-   **Otimização de Gás**: O código é escrito com a consciência dos custos de gás, buscando sempre a eficiência.
-   **Contratos Atualizáveis (Upgradeable)**: O design prevê a possibilidade de atualização dos contratos sem perda de estado, seguindo padrões seguros.
