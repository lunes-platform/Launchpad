# 🚀 Launchpad Lunes - Plataforma de Lançamento On-Chain

Uma plataforma de lançamento de projetos (launchpad) totalmente on-chain, construída com smart contracts **ink! 5.x** para o ecossistema Substrate/Polkadot. Este projeto permite a venda de tokens, staking e governança de forma descentralizada, segura e eficiente.

**Construído com ink! 5.x - Smart Contracts de nível empresarial para a Web3.**

[![ink! version](https://img.shields.io/badge/ink!-5.1.x-blue)](https://use.ink/)
[![Rust](https://img.shields.io/badge/rust-stable-orange.svg)](https://www.rust-lang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security](https://img.shields.io/badge/Security-Focused-green.svg)](docs/security/)
![Frontend CI](https://github.com/lunes-platform/Launchpad/actions/workflows/frontend-ci.yml/badge.svg)
![Smart Contracts CI](https://github.com/lunes-platform/Launchpad/actions/workflows/rust-ci.yml/badge.svg)

## 🎯 Visão Geral

O Launchpad Lunes elimina a necessidade de um backend centralizado, operando exclusivamente com um conjunto de smart contracts robustos e um frontend reativo. Isso garante máxima segurança, transparência e resistência à censura.

## 🏗️ Arquitetura Simplificada

A nova arquitetura é limpa e direta, promovendo a descentralização:

```
┌─────────────────┐      ┌─────────────────┐
│   Frontend      │──────│ Smart Contracts │
│ (React + Vite)  │      │   (ink! 5.x)    │
└─────────────────┘      └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐      ┌─────────────────┐
│  Usuário Final  │      │ Rede Substrate  │
│(Interação Wallet)│      │   (Blockchain)  │
└─────────────────┘      └─────────────────┘
```

## 🛠️ Início Rápido (Quick Start)

### Pré-requisitos

- **Node.js**: v18.x ou superior
- **Rust**: toolchain `stable`
- **`cargo-contract`**: v3.0.0 ou superior

### Instalação e Setup

```bash
# 1. Clone o repositório
git clone https://github.com/lunes-platform/Launchpad.git
cd Launchpad

# 2. Instale dependências (Rust, ink!, Node.js) e prepare o ambiente
# O script tornará os outros scripts executáveis
./scripts/setup/install-dependencies.sh

# 3. Configure o ambiente de desenvolvimento
./scripts/setup/setup-development.sh
```

### Fluxo de Desenvolvimento (TDD)

```bash
# 1. Execute todos os testes (Smart Contracts e Frontend)
./scripts/test/test-all.sh

# 2. Inicie o ambiente de desenvolvimento
# Frontend (monorepo pnpm)
cd frontend
# escolha um pacote para rodar
pnpm dev:showcase
# ou
pnpm dev:user-dashboard
# ou
pnpm dev:dev-dashboard

# 3. Testes/Build de Smart Contracts
cd smart-contracts
cargo test --workspace --all-features
cargo build --workspace --release
```

## 📁 Estrutura do Projeto

```
Launchpad/
├── smart-contracts/      # Smart Contracts em ink! 5.x (workspace Rust)
├── frontend/             # Monorepo PNPM com apps/packages React + Vite
├── docs/                 # Documentação completa do projeto
│   ├── architecture/     # Desenhos de arquitetura e fluxos
│   ├── guides/           # Guias de setup, uso e contribuição
│   ├── reports/          # Relatórios de progresso e análises
│   └── security/         # Auditorias e checklists de segurança
└── scripts/              # Scripts de automação (setup, test)
```

## 🧪 Testes (Metodologia TDD)

Este projeto segue rigorosamente a metodologia de Desenvolvimento Guiado por Testes (TDD).

### Smart Contracts

```bash
cd smart-contracts
# 1. Escreva um teste que falhe em um dos arquivos de teste
# 2. Implemente a funcionalidade no módulo correspondente
# 3. Execute os testes até que passem
cargo test --workspace --all-features
# 4. (Opcional) Verifique a cobertura dos testes (requer tarpaulin)
cargo tarpaulin --workspace --out Html
```

### Frontend

```bash
cd frontend
# 1. Escreva um teste que falhe para um componente ou hook
# 2. Implemente a funcionalidade
# 3. Execute os testes (monorepo)
pnpm test
```

## 📚 Documentação

Toda a documentação do projeto foi centralizada no diretório `docs/`. Recomendamos a leitura dos seguintes documentos para uma compreensão completa:

- **[Guia de Setup](docs/guides/SETUP_GUIDE.md)**: Instruções detalhadas de configuração.
- **[Workflow TDD](docs/architecture/tdd-workflow.md)**: Guia sobre nosso processo de desenvolvimento.
- **[Guias de Segurança](docs/security/)**: Nossas políticas e auditorias de segurança.

## 🤝 Contribuição

1. Siga a metodologia TDD.
2. Escreva testes antes de implementar o código.
3. Garanta que todos os testes passem (`./scripts/test/test-all.sh`).
4. Atualize a documentação relevante.
5. Submeta um Pull Request.

## 📄 Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo `LICENSE` para mais detalhes.
