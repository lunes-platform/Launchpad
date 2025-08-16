# 🗺️ Sitemap Completo - Launchpad Lunes (ATUALIZADO)

## 📋 Hierarquia de Navegação

### 🌐 **Área Pública/Marketing**

#### 🏠 **Página Principal**
- **URL**: `/`
- **Componente**: `HomePage`
- **Funcionalidades**:
  - Hero section com estatísticas da plataforma
  - Projetos em destaque
  - Próximos lançamentos
  - Estatísticas em tempo real (TVL, usuários, projetos)

#### 🚀 **Projetos**
- **URL**: `/projetos`
- **Componente**: `ProjectsPage`
- **Funcionalidades**: Lista de todos os projetos com filtros

- **URL**: `/projetos/:id`
- **Componente**: `ProjectDetailsPage`
- **Funcionalidades**:
  - **Informações Gerais**: Descrição, tokenomics, equipe
  - **Cronograma de Fases**: Visualização do status de cada fase
    - Whitelist (40-60% desconto, 6-12 meses vesting)
    - Pré-Venda (15-25% desconto, 3-6 meses vesting)
    - Venda Pública (sem desconto, vesting mínimo)
    - Launchpool (apenas staking)
    - Rifa (sorteios diários)
  - **Seção de Participação Dinâmica** (muda conforme fase ativa):
    - Interface Whitelist (durante fase Whitelist)
    - Formulário de Investimento com opções de pagamento (LUNES/USDT-TON/USDT-Solana)
    - Interface Launchpool (durante fase Launchpool)
    - Interface Rifa (durante fase Rifa)
    - Resultados/Vesting Info (fase finalizada)
  - **Material AMA**: Vídeos, transcrições
  - **Links Externos**
  - **Histórico de Alocações** (se público)

#### 🏊 **Launchpool**
- **URL**: `/launchpool`
- **Componente**: `LaunchpoolPage`
- **Funcionalidades**: Lista de projetos com Launchpool ativo/futuro
- **Redirecionamento**: Clique leva para `/projetos/:id` focado na seção Launchpool

#### 🎲 **Rifa (Loteria)**
- **URL**: `/rifa`
- **Componente**: `RafflePage`
- **Funcionalidades**: Lista de projetos/sorteios de Rifa
- **Redirecionamento**: Clique leva para `/projetos/:id` focado na seção Rifa

#### 📚 **Páginas Informativas**
- **URL**: `/como-participar` - Guia das diferentes fases
- **URL**: `/para-projetos` - Guia para configurar fases de lançamento
- **URL**: `/faq` - Perguntas frequentes
- **URL**: `/sobre` - Sobre a plataforma
- **URL**: `/termos-servico` - Termos de serviço
- **URL**: `/politica-privacidade` - Política de privacidade

#### 🔐 **Autenticação**
- **Modal**: `WalletConnectModal`
- **Funcionalidades**: Conectar carteira (SubWallet, Polkadot.js)

---

### 👤 **Área Autenticada (Usuário)**

#### 📊 **Dashboard**
- **URL**: `/dashboard`
- **Componente**: `DashboardPage`
- **Funcionalidades**: Painel geral do usuário

#### 💼 **Meus Investimentos**
- **URL**: `/dashboard/meus-investimentos`
- **Componente**: `MyInvestmentsPage`
- **Funcionalidades**: Lista de projetos investidos

- **URL**: `/dashboard/meus-investimentos/:id`
- **Componente**: `InvestmentDetailsPage`
- **Funcionalidades**:
  - Detalhes do investimento
  - Status da alocação por fase
  - Status do vesting
  - Cronograma de liberação

#### 🪙 **Tokens a Reivindicar**
- **URL**: `/dashboard/tokens-a-reivindicar`
- **Componente**: `ClaimTokensPage`
- **Funcionalidades**:
  - Visualização do cronograma de vesting por projeto
  - Interface para reivindicar tokens liberados

#### 💳 **Carteiras**
- **URL**: `/dashboard/carteiras`
- **Componente**: `WalletsPage`
- **Funcionalidades**: Gerenciamento de carteiras conectadas

#### 📜 **Histórico**
- **URL**: `/dashboard/historico`
- **Componente**: `HistoryPage`
- **Funcionalidades**:
  - Ações realizadas em diferentes fases
  - Histórico de transações
  - Participações em Whitelist, Pré-Venda, etc.

#### ⚙️ **Configurações**
- **URL**: `/dashboard/configuracoes`
- **Componente**: `UserSettingsPage`
- **Funcionalidades**: Configurações do usuário

#### 🎁 **Airdrop Claims**
- **URL**: `/dashboard/airdrop-claims`
- **Componente**: `AirdropClaimsPage`
- **Funcionalidades**: Reivindicar airdrops disponíveis

---

### 🔧 **Área Autenticada (Admin)**

#### 🏠 **Dashboard Admin**
- **URL**: `/admin`
- **Componente**: `AdminDashboardPage`
- **Funcionalidades**: Dashboard administrativo

#### 🚀 **Gerenciar Projetos**
- **URL**: `/admin/projetos`
- **Componente**: `AdminProjectsPage`
- **Funcionalidades**: Gerenciamento completo de projetos

- **URL**: `/admin/projetos/novo`
- **Componente**: `CreateProjectPage`
- **Funcionalidades**:
  - Criação de novo projeto
  - Configuração detalhada de cada fase (datas, alocações, preços, limites, opções de pagamento)

- **URL**: `/admin/projetos/:id/editar`
- **Componente**: `EditProjectPage`
- **Funcionalidades**:
  - Edição de projeto existente
  - Ajuste de parâmetros das fases (se permitido)

- **URL**: `/admin/projetos/:id/alocacoes`
- **Componente**: `ProjectAllocationsPage`
- **Funcionalidades**:
  - Visualização e gerenciamento das alocações de compradores
  - Resultados das fases de venda/whitelist

- **URL**: `/admin/projetos/:id/depositos`
- **Componente**: `ProjectDepositsPage`
- **Funcionalidades**: Visualização do status dos depósitos de tokens

- **URL**: `/admin/projetos/:id/distribuicoes`
- **Componente**: `ProjectDistributionsPage`
- **Funcionalidades**:
  - Orquestração e acompanhamento das distribuições
  - Execução após fases de venda/airdrop

#### 🏛️ **Gerenciar Tesouraria**
- **URL**: `/admin/tesouraria`
- **Componente**: `AdminTreasuryPage`
- **Sub-rotas**:
  - `/admin/tesouraria/operacoes-pendentes` - Operações pendentes
  - `/admin/tesouraria/configuracoes` - Configurações da tesouraria

#### 🔒 **Gerenciar Custódia**
- **URL**: `/admin/custodia`
- **Componente**: `AdminCustodyPage`
- **Sub-rotas**:
  - `/admin/custodia/airdrop-campaigns` - Campanhas de Airdrop (Fase Airdrop)

#### 👥 **Gerenciar Usuários**
- **URL**: `/admin/usuarios`
- **Componente**: `AdminUsersPage`

#### ⚙️ **Configurações da Plataforma**
- **URL**: `/admin/configuracoes-plataforma`
- **Componente**: `AdminPlatformSettingsPage`

#### 📋 **Auditoria**
- **URL**: `/admin/auditoria`
- **Componente**: `AdminAuditPage`

---

## 🎨 **Componentes de Layout**

### 📱 **Componentes Principais**
1. **Header** - Navegação principal com conectar carteira
2. **Sidebar** - Navegação lateral (dashboard)
3. **Footer** - Links úteis e informações
4. **WalletConnector** - Modal de conexão de carteira
5. **NotificationCenter** - Centro de notificações
6. **LoadingSpinner** - Indicador de carregamento
7. **ErrorBoundary** - Tratamento de erros

### 🧩 **Componentes Específicos**
1. **ProjectCard** - Card de projeto
2. **PhaseIndicator** - Indicador de fase
3. **StakingPool** - Pool de staking
4. **RaffleTicket** - Bilhete de rifa
5. **PaymentForm** - Formulário de pagamento
6. **VotingCard** - Card de votação
7. **PortfolioChart** - Gráfico de portfólio
8. **TransactionHistory** - Histórico de transações

---

## 🔄 **Fluxos de Usuário Principais**

### 1. **Fluxo de Participação em IDO**
```
Home → Projects → Project Details → Connect Wallet → Choose Phase → Payment → Confirmation
```

### 2. **Fluxo de Staking**
```
Dashboard → Launchpool → Choose Pool → Stake Amount → Confirm Transaction → Track Rewards
```

### 3. **Fluxo de Governança**
```
Governance → View Proposals → Connect Wallet → Vote → Confirm → Track Results
```

### 4. **Fluxo de Afiliados**
```
Affiliates → Register → Get Referral Code → Share → Track Commissions → Withdraw
```

---

## 📱 **Responsividade**

### **Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Adaptações por Dispositivo**
- **Mobile**: Navegação em hambúrguer, cards em coluna única
- **Tablet**: Navegação híbrida, grid 2 colunas
- **Desktop**: Navegação completa, grid 3-4 colunas

---

## 🔒 **Estados de Autenticação**

### **Usuário Não Conectado**
- Acesso limitado a páginas públicas
- Botão "Connect Wallet" em destaque
- Informações gerais dos projetos

### **Usuário Conectado**
- Acesso completo a todas as funcionalidades
- Dashboard personalizado
- Histórico de transações
- Participação em governança

### **Usuário KYC Verificado**
- Acesso a projetos premium
- Limites de investimento aumentados
- Funcionalidades avançadas
