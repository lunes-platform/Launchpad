# @launchpad/shared-ui

Biblioteca de componentes UI reutilizáveis para o projeto Launchpad.

## 🎯 Objetivo

Este pacote fornece componentes de interface de usuário consistentes, acessíveis e reutilizáveis que seguem o design system do projeto Launchpad.

## 🚀 Instalação

```bash
# No workspace root
pnpm install

# Para usar em outro pacote do monorepo
pnpm add @launchpad/shared-ui
```

## 📦 Componentes Disponíveis

### Button

Componente de botão com múltiplas variantes e estados.

```tsx
import { Button } from "@launchpad/shared-ui";

<Button variant="primary" size="md" loading={false}>
  Clique aqui
</Button>;
```

**Variantes:** `primary`, `secondary`, `outline`, `ghost`, `destructive`
**Tamanhos:** `sm`, `md`, `lg`

### Input

Componente de entrada de dados com validação e estados.

```tsx
import { Input } from "@launchpad/shared-ui";

<Input
  label="Email"
  type="email"
  placeholder="seu@email.com"
  error="Email inválido"
  helperText="Digite seu melhor email"
/>;
```

**Variantes:** `default`, `error`, `success`, `warning`
**Tamanhos:** `sm`, `md`, `lg`

### Modal

Componente de modal com animações e acessibilidade.

```tsx
import { Modal } from "@launchpad/shared-ui";

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título do Modal"
  size="md"
>
  Conteúdo do modal
</Modal>;
```

**Tamanhos:** `sm`, `md`, `lg`, `xl`, `full`

### Card

Componente de cartão para organizar conteúdo.

```tsx
import { Card } from "@launchpad/shared-ui";

<Card
  variant="elevated"
  padding="md"
  hoverable
  header={<h3>Título</h3>}
  footer={<Button>Ação</Button>}
>
  Conteúdo do card
</Card>;
```

**Variantes:** `default`, `elevated`, `outlined`, `filled`
**Padding:** `none`, `sm`, `md`, `lg`

## 🎨 Design System

### Cores

- **Primary:** Roxo (#8b5cf6)
- **Secondary:** Grafite (#64748b)
- **Success:** Verde (#22c55e)
- **Warning:** Laranja (#f59e0b)
- **Error:** Vermelho (#ef4444)

### Tipografia

- **Font Family:** Inter
- **Tamanhos:** sm (14px), base (16px), lg (18px), xl (20px)

### Espaçamento

- **Padding:** sm (16px), md (24px), lg (32px)
- **Margin:** sm (8px), md (16px), lg (24px)

### Sombras

- **Soft:** 0 2px 8px rgba(0,0,0,0.08)
- **Medium:** 0 4px 16px rgba(0,0,0,0.12)
- **Strong:** 0 8px 32px rgba(0,0,0,0.16)

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Build do pacote
pnpm build

# Desenvolvimento com watch
pnpm dev

# Linting
pnpm lint

# Testes
pnpm test
```

### Estrutura de Arquivos

```
src/
├── components/          # Componentes React
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   ├── Card/
│   └── index.ts
├── utils/              # Utilitários
│   ├── cn.ts          # Classe CSS helper
│   └── index.ts
├── styles/            # Estilos globais
│   └── globals.css
└── index.ts           # Exportações principais
```

## 🧪 Testes

Os componentes são testados com:

- **Vitest** para testes unitários
- **React Testing Library** para testes de componentes
- **@testing-library/jest-dom** para matchers customizados

```bash
# Executar testes
pnpm test

# Testes em modo watch
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 📝 Contribuição

1. Siga os padrões de código estabelecidos
2. Adicione testes para novos componentes
3. Documente props e comportamentos
4. Mantenha a acessibilidade (ARIA, foco, teclado)
5. Use TypeScript para tipagem forte

## 🔧 Configuração

### Tailwind CSS

O pacote usa Tailwind CSS com configuração customizada que inclui:

- Design tokens do projeto
- Animações personalizadas
- Utilitários customizados

### TypeScript

Configuração otimizada para:

- Strict mode habilitado
- Resolução de módulos ESNext
- Declarações de tipo incluídas no build

## 📄 Licença

Este projeto é parte do ecossistema Launchpad e segue as mesmas diretrizes de licenciamento.
