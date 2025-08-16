# 🚀 Launchpad Lunes - Plataforma de Lançamento On-Chain

Uma plataforma de lançamento de projetos (launchpad) totalmente on-chain, construída com smart contracts **ink! 5.x** para o ecossistema Substrate/Polkadot. Este projeto permite a venda de tokens, staking e governança de forma descentralizada, segura e eficiente.

**Construído com ink! 5.x - Smart Contracts de nível empresarial para a Web3.**

[![ink! version](https://img.shields.io/badge/ink!-5.1.x-blue)](https://use.ink/)
[![Rust](https://img.shields.io/badge/rust-stable-orange.svg)](https://www.rust-lang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security](https://img.shields.io/badge/Security-Focused-green.svg)](docs/security/)

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
git clone <repository-url> launchpad-lunes
cd launchpad-lunes

# 2. Instale todas as dependências (Rust, ink!, Node.js)
# O script tornará os outros scripts executáveis
./scripts/setup/install-dependencies.sh

# 3. Configure o ambiente de desenvolvimento
./scripts/setup/setup-development.sh
```

### Fluxo de Desenvolvimento (TDD)

```bash
# 1. Execute todos os testes (Smart Contracts e Frontend)
./scripts/test/test-all.sh

# 2. Compile todos os componentes para produção
./scripts/build/build-all.sh

# 3. Inicie o ambiente de desenvolvimento
# Frontend
cd frontend-new && npm run dev

# Testes de Smart Contracts (em modo de observação)
cd smart-contracts && cargo test --workspace -- --watch
```

## 📁 Estrutura do Projeto

```
launchpad-lunes/
├── smart-contracts/      # Smart Contracts em ink! 5.x
│   └── upgradeable/      # Lógica principal dos contratos atualizáveis
├── frontend-new/         # Aplicação Frontend (React + Vite)
├── docs/                 # Documentação completa do projeto
│   ├── architecture/     # Desenhos de arquitetura e fluxos
│   ├── guides/           # Guias de setup, uso e contribuição
│   ├── reports/          # Relatórios de progresso e análises
│   └── security/         # Auditorias e checklists de segurança
└── scripts/              # Scripts de automação (setup, build, test)
```

## 🧪 Testes (Metodologia TDD)

Este projeto segue rigorosamente a metodologia de Desenvolvimento Guiado por Testes (TDD).

### Smart Contracts

```bash
cd smart-contracts/upgradeable
# 1. Escreva um teste que falhe em um dos arquivos _test.rs
# 2. Implemente a funcionalidade no arquivo .rs correspondente
# 3. Execute os testes até que passem
cargo test
# 4. Verifique a cobertura dos testes
cargo tarpaulin --out Html
```

### Frontend

```bash
cd frontend-new
# 1. Escreva um teste que falhe para um componente ou hook
# 2. Implemente a funcionalidade
# 3. Execute os testes
npm test
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
