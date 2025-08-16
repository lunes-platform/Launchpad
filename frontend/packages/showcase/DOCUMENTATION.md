# Lunes Launchpad Frontend - Documentação Técnica

**Versão:** 1.0.0 (Estado Atual em 13/08/2025)
**Autor:** Gemini, Ajudante de IA

## 1. Visão Geral e Propósito

Este documento serve como a referência técnica oficial para o estado atual do projeto frontend do **Lunes Launchpad**. Seu objetivo principal é mapear todas as funcionalidades, componentes, arquitetura e lógicas de negócio implementadas até o momento. 

Esta documentação deve ser usada como uma "fonte da verdade" para:
- **Evitar regressões** e a remoção acidental de funcionalidades existentes durante refatorações.
- **Guiar o desenvolvimento futuro**, garantindo a consistência com os padrões já estabelecidos.
- **Facilitar o onboarding** de novos membros na equipe.
- **Servir de memória de projeto** para a equipe e para a IA.

---

## 2. Stack de Tecnologias

A aplicação é construída com um conjunto moderno de tecnologias focadas em performance, escalabilidade e experiência do desenvolvedor (DX).

- **Framework Principal:** **React 18**
- **Build Tool:** **Vite** (para desenvolvimento e build rápidos)
- **Linguagem:** **TypeScript** (para segurança de tipos em todo o projeto)
- **Estilização:** **Tailwind CSS v3.4** (utility-first, com tema customizado)
- **Roteamento:** **React Router DOM v6** (para navegação SPA)
- **Ícones:** **Lucide React** (biblioteca de ícones leve e customizável)
- **Cliente HTTP:** **Axios** (para chamadas API, embora atualmente usando mocks)
- **Notificações:** **React Hot Toast** (para feedback ao usuário)

---

## 3. Arquitetura e Estrutura de Pastas

O projeto segue uma estrutura de pastas organizada e modular para facilitar a localização e manutenção do código.

```
/frontend/packages/showcase/src/
├── assets/         # Imagens, fontes e outros ativos estáticos
├── components/     # Componentes React reutilizáveis
│   ├── forms/      # Componentes específicos de formulários (ex: PSP22ContractValidator)
│   ├── layout/     # Componentes estruturais (Header, Footer, Layout)
│   ├── pwa/        # Lógica do Progressive Web App (PWAManager)
│   └── ui/         # Componentes de UI genéricos (Button, Card, Input, Modal, etc.)
├── contexts/       # Contextos React para gestão de estado global
│   ├── AppContext.tsx
│   └── WalletContext.tsx
├── data/           # Dados mockados para desenvolvimento local
│   └── mockData.ts
├── hooks/          # Hooks customizados para encapsular lógicas
│   ├── useLocalStorage.ts
│   ├── useNotifications.ts
│   └── useProjectSubmission.ts
├── pages/          # Componentes que representam as páginas da aplicação
│   ├── admin/      # Páginas da área administrativa
│   └── dashboard/  # Páginas do dashboard do usuário
├── types/          # Definições de tipos e interfaces globais
│   └── api.ts
├── utils/          # Funções utilitárias genéricas
│   └── lunesValidation.ts
├── App.tsx         # Componente raiz com a definição das rotas
├── main.tsx        # Ponto de entrada da aplicação
└── index.css       # Estilos globais e classes customizadas com @apply
```

---

## 4. Sistema de Roteamento (`App.tsx`)

O roteamento é centralizado no arquivo `src/App.tsx` e utiliza `react-router-dom`. As rotas estão organizadas em três seções principais:

1.  **Área Pública/Marketing:** Acessível a todos os visitantes.
    - `/`, `/projetos`, `/launchpool`, `/governanca`, `/tesouraria`, `/docs`, `/faq`, etc.
    - **Rotas Duplas (PT/EN):** Para compatibilidade, rotas principais como `/governance` e `/governanca` apontam para o mesmo componente.

2.  **Dashboard do Usuário (Autenticado):** Rotas prefixadas com `/dashboard`.
    - `/dashboard`, `/dashboard/meus-investimentos`, `/dashboard/configuracoes`, etc.

3.  **Dashboard do Admin (Autenticado):** Rotas prefixadas com `/admin`.
    - `/admin`, `/admin/projetos`, `/admin/projetos/novo`, `/admin/tesouraria`, etc.

-   **Página 404:** Uma rota `*` captura todas as URLs não encontradas e renderiza a `NotFoundPage`.

---

## 5. Gestão de Estado (Contexts)

O estado global é gerenciado através de Contextos React para evitar "prop drilling".

-   **`AppContext.tsx`:** Gerencia o estado geral da aplicação, como tema (dark/light), configurações de usuário e notificações.
-   **`WalletContext.tsx`:** Gerencia a conexão com carteiras Web3 (atualmente usando mock data), incluindo contas, saldos e funções de conexão/desconexão.

---

## 6. Design System e Componentes

Foi implementado um robusto sistema de design, garantindo consistência visual e reutilização de código.

### **Tema Tailwind (`tailwind.config.js`)**

-   **Cores:** Paleta de cores customizada com `primary` (roxo Lunes), `success`, `warning`, `error`, além de tons de cinza para fundos e bordas.
-   **Fontes:** `Inter` para o corpo e `Space Grotesk` para títulos.
-   **Bordas e Sombras:** `borderRadius` e `boxShadow` customizados para criar um visual moderno e elevado (`card`, `button`, `modal`, `glow`).
-   **Animações:** Animações e keyframes pré-definidos (`fade-in`, `slide-up`, `pulse-glow`).

### **Estilos Globais (`index.css`)**

-   Define estilos base para `body`, `h1-h6`, etc.
-   Contém classes de componentes customizadas usando `@apply` para agrupar utilitários Tailwind (ex: `.card`, `.btn-primary`, `.input`).

### **Biblioteca de Componentes UI (`/components/ui`)**

-   `Button.tsx`: Botões com variantes (primary, secondary, outline, ghost).
-   `Card.tsx`: Componente base para todos os cards, com variantes de hover e elevação.
-   `Input.tsx`, `Textarea.tsx`, `Select.tsx`: Elementos de formulário estilizados.
-   `Modal.tsx`: Modal genérico e reutilizável.
-   `LoadingSpinner.tsx`: Spinner de carregamento com variantes de tamanho e opção de tela cheia.
-   `ErrorBoundary.tsx`: Componente que captura erros de renderização e exibe uma UI de fallback, prevenindo que a aplicação inteira quebre.
-   `ConnectionStatus.tsx`: Exibe um indicador visual e um toast quando o usuário fica offline/online.

### **Componentes de Layout (`/components/layout`)**

-   `Header.tsx`: Cabeçalho principal com navegação, menu responsivo (mobile) e botão de conexão de carteira.
-   `Footer.tsx`: Rodapé com links de navegação, redes sociais e informações legais. **Links foram corrigidos para apontar para as rotas corretas.**
-   `Layout.tsx`: Componente que envolve todas as páginas, unindo `Header`, `Footer` e o conteúdo principal.

---

## 7. Funcionalidade Principal Implementada: Cadastro de Projetos (Lunes PSP22)

Esta é a funcionalidade mais complexa e robusta implementada até agora.

### **Utilitários de Validação (`/utils/lunesValidation.ts`)**

-   Contém toda a lógica de negócio para validar projetos da rede Lunes.
-   `isValidLunesAddress()`: Valida o formato de um endereço Lunes.
-   `validatePSP22Contract()`: Simula uma chamada a um contrato para verificar se ele adere ao padrão PSP22 (retorna nome, símbolo, etc.).
-   `validateProjectCategory()`: Verifica se uma categoria de projeto é aprovada e retorna seus requisitos específicos (ex: auditoria obrigatória para DeFi).
-   `generateProjectValidationSummary()`: Cria um resumo detalhado do status de validação de um projeto.

### **Componente Validador (`/components/forms/PSP22ContractValidator.tsx`)**

-   Componente de UI dedicado para a validação do contrato.
-   Valida o endereço em tempo real (com debounce) enquanto o usuário digita.
-   Fornece feedback visual instantâneo (loading, sucesso, erro).
-   Se a validação for bem-sucedida, exibe os detalhes do token (nome, símbolo) e o status da auditoria.
-   Se falhar, exibe instruções claras sobre o que pode estar errado.

### **Hook de Submissão (`/hooks/useProjectSubmission.ts`)**

-   Encapsula a lógica de envio do formulário, incluindo validações de front-end e a simulação da chamada ao back-end.
-   `validateProjectData()`: Realiza uma verificação final dos dados no front-end antes do envio (ex: meta mínima, datas, alocação de fases).
-   `submitProject()`: Simula a chamada à API, retornando um resultado com `isValid`, `errors`, `warnings` e `projectId`.

### **Página de Criação (`/pages/admin/CreateProjectPage.tsx`)**

-   Integra todos os elementos acima em uma experiência de usuário coesa.
-   A validação do contrato PSP22 é o primeiro passo obrigatório.
-   O formulário auto-preenche o nome e símbolo do token após a validação bem-sucedida.
-   O seletor de categoria exibe os requisitos específicos da categoria escolhida.
-   O botão de "Criar Projeto" fica desabilitado até que o contrato seja validado e os campos obrigatórios sejam preenchidos.
-   Exibe o resultado da submissão (sucesso ou erro) de forma clara, com todos os detalhes retornados pelo "back-end".

---

## 8. Funcionalidades Adicionais

-   **Mock Data (`/data/mockData.ts`):** Um arquivo centralizado com dados realistas para popular a aplicação (projetos, usuários, pools de staking, etc.), permitindo o desenvolvimento e teste da UI sem depender de um back-end real.
-   **Hooks Utilitários:**
    -   `useLocalStorage.ts`: Facilita a leitura e escrita no Local Storage do navegador.
    -   `useNotifications.ts`: Gerencia o estado das notificações e a permissão de notificações do navegador.

Este documento reflete o estado robusto e bem arquitetado do frontend. Qualquer nova funcionalidade ou refatoração deve consultar este guia para manter a qualidade e consistência do projeto.
