# Launchpad Lunes - Guia de Configuração Abrangente (Arquitetura On-Chain)

Este guia fornece instruções passo a passo para configurar o ambiente de desenvolvimento completo do Launchpad Lunes, que agora opera com uma arquitetura 100% on-chain.

## Pré-requisitos

- **Sistema Operacional**: Linux, macOS, ou Windows com WSL2
- **Git**: Versão 2.30 ou superior
- **Node.js**: Versão 18.x ou superior
- **PNPM**: Versão 8.x ou superior (`npm install -g pnpm`)
- **Rust**: Versão `stable` mais recente

## Início Rápido (Quick Start)

```bash
# 1. Clone o repositório
git clone <repository-url> launchpad-lunes
cd launchpad-lunes

# 2. Execute o script de instalação completo
# Este script instalará as dependências de Rust/ink! e do Frontend.
./scripts/setup/install-dependencies.sh

# 3. Configure o ambiente de desenvolvimento
# Este script criará arquivos .env de exemplo e outras configurações.
./scripts/setup/setup-development.sh
```

## Configuração por Componente

### 1. Smart Contracts (ink! 5.x)

#### Instalação de Dependências Rust e ink!

O script `install-dependencies.sh` já cuida dos seguintes passos:

```bash
# Instala o toolchain do Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Adiciona o target WebAssembly para os contratos ink!
rustup target add wasm32-unknown-unknown

# Instala o cargo-contract para desenvolvimento com ink!
cargo install cargo-contract

# Instala ferramentas adicionais de desenvolvimento
cargo install cargo-dylint dylint-link
cargo install cargo-tarpaulin  # Ferramenta de cobertura de código
```

#### Comandos de Teste e Build

```bash
cd smart-contracts/upgradeable

# Execute todos os testes dos contratos (abordagem TDD)
cargo test

# Compile os contratos para produção
cargo build --release

# Gere um relatório de cobertura de código
cargo tarpaulin --out Html
```

### 2. Aplicação Frontend (Monorepo com PNPM)

#### Instalação de Dependências Node.js

O script `install-dependencies.sh` já executa a instalação via PNPM na raiz do monorepo. Para fazer manualmente:

```bash
cd frontend

# Instala as dependências de todos os pacotes no workspace
pnpm install
```

#### Comandos de Teste e Desenvolvimento (TDD)

Execute estes comandos a partir do diretório `frontend/`.

```bash
# Iniciar a aplicação de vitrine em modo de desenvolvimento
pnpm --filter showcase dev

# Executar os testes para um pacote específico
pnpm --filter showcase test

# Executar os testes para todos os pacotes
pnpm run test

# Buildar todas as aplicações para produção
pnpm run build
```

## Fluxo de Trabalho TDD

### TDD para Smart Contracts
```bash
cd smart-contracts/upgradeable
# 1. Escreva um teste que falhe em um arquivo `*_test.rs`
# 2. Implemente a funcionalidade no arquivo `.rs` correspondente
# 3. Execute o teste até ele passar
cargo test nome_do_seu_teste
# 4. Refatore e verifique a cobertura
cargo tarpaulin --out Html
```

### TDD para o Frontend
```bash
cd frontend
# 1. Escreva um teste que falhe para um componente
pnpm --filter showcase test -- --testNamePattern="MeuComponente"
# 2. Implemente o componente no pacote `showcase` (ou outro)
# 3. Execute o teste novamente até ele passar
# 4. Execute todos os testes do monorepo
pnpm run test
```

## Próximos Passos

1.  **Siga o fluxo de trabalho TDD** para cada componente.
2.  **Configure pipelines de CI/CD** usando os workflows do GitHub Actions.
3.  **Revise as considerações de segurança** na pasta `docs/security`.
4.  **Faça o deploy em um ambiente de teste** para validação.
