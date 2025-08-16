# 🚀 Launchpad Lunes - Monorepo do Frontend

Este diretório contém o monorepo para todas as aplicações de frontend do Launchpad Lunes, gerenciado com **PNPM Workspaces**. A estrutura de monorepo nos permite compartilhar código, manter a consistência e desenvolver múltiplas aplicações de forma independente e organizada.

## 📦 Estrutura de Pacotes (Packages)

O coração deste monorepo é o diretório `packages/`, que contém as seguintes aplicações e bibliotecas compartilhadas:

### Aplicações

-   `packages/showcase`: A aplicação principal de vitrine de projetos, onde os usuários podem descobrir e aprender sobre os lançamentos.
-   `packages/user-dashboard`: (Em desenvolvimento) O painel de controle para os usuários gerenciarem seus investimentos, tokens e perfil.
-   `packages/dev-dashboard`: (Em desenvolvimento) O painel de controle para a equipe Lunes gerenciar os projetos, fases e configurações da plataforma.
-   `packages/token-listing`: (Em desenvolvimento) Uma aplicação dedicada para listar e explorar todos os tokens PSP22 da rede Lunes.

### Bibliotecas Compartilhadas

-   `packages/shared-ui`: Uma biblioteca de componentes React (usando Tailwind CSS) compartilhada entre todas as aplicações para garantir consistência visual.
-   `packages/shared-hooks`: Um pacote de hooks React e lógica de estado (ex: `react-query`, `zustand`) compartilhado para evitar duplicação de código.

## 🛠️ Início Rápido (Quick Start)

### Pré-requisitos

-   **Node.js**: v18.x ou superior
-   **PNPM**: v8.x ou superior (`npm install -g pnpm`)

### Instalação

```bash
# 1. Instale todas as dependências do monorepo a partir da raiz de /frontend
pnpm install
```
O PNPM irá automaticamente encontrar todos os pacotes no workspace e instalar suas dependências.

## 💻 Fluxo de Desenvolvimento

Você pode executar scripts para pacotes específicos a partir da raiz do diretório `frontend` usando o comando `pnpm --filter`.

### Iniciar um Ambiente de Desenvolvimento

```bash
# Iniciar a aplicação de vitrine (showcase)
pnpm --filter showcase dev

# Iniciar o dashboard do usuário
pnpm --filter user-dashboard dev
```
Você pode rodar múltiplas aplicações simultaneamente em diferentes terminais.

### Outros Scripts

```bash
# Buildar todas as aplicações
pnpm run build

# Executar o linter em todas as aplicações
pnpm run lint

# Executar os testes de todos os pacotes
pnpm run test
```
Os scripts na raiz são atalhos para executar os comandos em todos os pacotes. Para executar um script em um único pacote, use o `--filter`:
```bash
pnpm --filter shared-ui build
```

## 🌱 Adicionando um Novo Pacote

1.  Crie um novo diretório dentro de `packages/`.
2.  Adicione um `package.json` para o novo pacote.
3.  Se for uma aplicação, pode copiar a estrutura de um dos pacotes existentes (ex: `showcase`).
4.  Se for uma biblioteca, pode copiar a estrutura de `shared-ui`.
5.  Execute `pnpm install` na raiz do `frontend` para registrar o novo pacote no workspace.

## 🤝 Contribuição

Ao contribuir, lembre-se de:
-   Adicionar componentes e hooks reutilizáveis aos pacotes `shared-ui` e `shared-hooks`.
-   Garantir que os testes passem em todos os pacotes afetados pela sua mudança.
-   Manter a consistência de código e estilo entre os pacotes.
