# 👥 Análise de Papéis dos Usuários - Launchpad Lunes Frontend

## 📋 Visão Geral

Esta análise detalha todos os tipos de usuários, suas permissões, funcionalidades disponíveis e interfaces necessárias para o frontend do Launchpad Lunes.

## 🎭 Tipos de Usuários

### 1. 👑 **ADMINISTRADOR (Admin)**
**Papel**: Controle total do sistema
**Identificação**: `self.admin` (AccountId único)

#### 🔧 **Permissões Administrativas:**

##### **Gestão de Projetos**
- ✅ `configure_phase()` - Configurar todas as fases de projetos
- ✅ `force_complete_all_phases()` - Finalizar fases em emergência
- ✅ `get_project_phases_status()` - Monitorar status de fases

##### **Gestão de Usuários**
- ✅ `batch_update_kyc_status()` - Aprovar/rejeitar KYC em lote
- ✅ `batch_manage_whitelist()` - Gerenciar whitelist de projetos
- ✅ `update_user_profile()` - Atualizar perfis de usuários
- ✅ `ban_user()` - Banir usuários problemáticos
- ✅ `add_participation_points()` - Adicionar pontos de participação

##### **Configurações do Sistema**
- ✅ `set_platform_fee()` - Alterar taxas da plataforma
- ✅ `set_fee_recipient()` - Alterar destinatário das taxas
- ✅ `set_project_listing_fees()` - Alterar taxas de listagem
- ✅ `configure_payment_token()` - Configurar tokens de pagamento
- ✅ `set_price_oracle()` - Definir oráculo de preços
- ✅ `update_prices()` - Atualizar preços das moedas

##### **Gestão de Recompensas**
- ✅ `distribute_staking_rewards()` - Distribuir recompensas de staking
- ✅ `distribute_project_buy_rewards()` - Distribuir recompensas de compra
- ✅ `distribute_participation_rewards()` - Distribuir recompensas de participação
- ✅ `configure_auto_distribution()` - Configurar distribuição automática

##### **Analytics e Monitoramento**
- ✅ `get_admin_dashboard()` - Dashboard administrativo completo
- ✅ `reset_platform_metrics()` - Resetar métricas da plataforma
- ✅ Acesso a todas as métricas e relatórios

#### 🖥️ **Interface Admin Necessária:**

```
🏛️ PAINEL ADMINISTRATIVO
├── 📊 Dashboard Principal
│   ├── Métricas gerais da plataforma
│   ├── Volume total (LUNES/LUSDT)
│   ├── Número de usuários/projetos
│   ├── Status dos pools de recompensa
│   └── Alertas e notificações
├── 🚀 Gestão de Projetos
│   ├── Lista de projetos ativos
│   ├── Configuração de fases
│   ├── Status de cada fase
│   ├── Forçar finalização (emergência)
│   └── Métricas por projeto
├── 👥 Gestão de Usuários
│   ├── Lista de usuários
│   ├── Aprovação KYC em lote
│   ├── Gestão de whitelist
│   ├── Banimento de usuários
│   ├── Perfis VIP
│   └── Pontuação de participação
├── ⚙️ Configurações do Sistema
│   ├── Taxas da plataforma
│   ├── Tokens de pagamento
│   ├── Oráculos de preço
│   ├── Limites padrão
│   └── Distribuição automática
├── 💰 Gestão de Recompensas
│   ├── Pools de recompensas
│   ├── Distribuições manuais
│   ├── Configuração automática
│   └── Histórico de distribuições
└── 📈 Analytics Avançadas
    ├── Relatórios detalhados
    ├── Métricas de performance
    ├── Logs de auditoria
    └── Exportação de dados
```

---

### 2. 🏢 **PROJETO/EMISSOR**
**Papel**: Criador de projetos que busca captação
**Identificação**: Conta que submete projetos

#### 🔧 **Funcionalidades Disponíveis:**

##### **Submissão de Projeto**
- ✅ Pagar taxa de listagem (LUNES + LUSDT)
- ✅ Submeter informações do projeto
- ✅ Upload de documentação (whitepaper, etc.)

##### **Acompanhamento**
- ✅ Ver status das fases do projeto
- ✅ Métricas de captação em tempo real
- ✅ Lista de investidores
- ✅ Receitas acumuladas

#### 🖥️ **Interface Projeto Necessária:**

```
🚀 PAINEL DO PROJETO
├── 📊 Dashboard do Projeto
│   ├── Status atual das fases
│   ├── Progresso de captação
│   ├── Número de investidores
│   ├── Volume captado (LUNES/LUSDT)
│   └── Próximos marcos
├── 📋 Gestão de Fases
│   ├── Cronograma de fases
│   ├── Configurações de cada fase
│   ├── Whitelist de investidores
│   └── Status de aprovação
├── 👥 Investidores
│   ├── Lista de investidores
│   ├── Valores investidos
│   ├── Fases de participação
│   └── Status de vesting
├── 💰 Financeiro
│   ├── Receitas por fase
│   ├── Taxas pagas
│   ├── Projeções
│   └── Histórico de transações
└── 📈 Analytics
    ├── Métricas de performance
    ├── Conversão por fase
    ├── Demografia de investidores
    └── Relatórios exportáveis
```

---

### 3. 💎 **INVESTIDOR VIP**
**Papel**: Investidor com privilégios especiais
**Identificação**: `UserProfile.is_vip = true`

#### 🔧 **Privilégios Especiais:**
- ✅ **Limites Aumentados**: Limites de investimento superiores
- ✅ **Acesso Prioritário**: Entrada antecipada em fases
- ✅ **Suporte Premium**: Atendimento diferenciado
- ✅ **Taxas Reduzidas**: Possíveis descontos em taxas
- ✅ **Analytics Avançadas**: Métricas detalhadas

#### 🖥️ **Interface VIP Necessária:**

```
💎 PAINEL VIP
├── 🏆 Status VIP
│   ├── Nível VIP atual
│   ├── Benefícios ativos
│   ├── Limites especiais
│   └── Histórico de privilégios
├── 🚀 Acesso Prioritário
│   ├── Projetos em pré-lançamento
│   ├── Fases exclusivas VIP
│   ├── Alocações garantidas
│   └── Notificações prioritárias
├── 📊 Analytics Premium
│   ├── Relatórios detalhados
│   ├── Performance do portfólio
│   ├── Projeções avançadas
│   └── Comparativos de mercado
└── 🎯 Gestão Avançada
    ├── Auto-investimento
    ├── Estratégias personalizadas
    ├── Alertas customizados
    └── Suporte dedicado
```

---

### 4. ✅ **INVESTIDOR VERIFICADO (KYC)**
**Papel**: Investidor com identidade verificada
**Identificação**: `UserProfile.kyc_verified = true`

#### 🔧 **Benefícios da Verificação:**
- ✅ **Acesso Completo**: Todas as fases que requerem KYC
- ✅ **Limites Maiores**: Limites de investimento aumentados
- ✅ **Confiabilidade**: Badge de verificação
- ✅ **Compliance**: Atende regulamentações

#### 🖥️ **Funcionalidades Adicionais:**
- ✅ Participação em fases que requerem KYC
- ✅ Limites de investimento superiores
- ✅ Acesso a projetos premium
- ✅ Histórico completo de transações

---

### 5. 👤 **INVESTIDOR PADRÃO**
**Papel**: Usuário comum da plataforma
**Identificação**: Qualquer AccountId conectado

#### 🔧 **Funcionalidades Básicas:**

##### **Investimentos**
- ✅ `invest_with_lunes()` - Investir com LUNES nativo
- ✅ `invest_with_lusdt()` - Investir com LUSDT
- ✅ Participar de fases públicas
- ✅ Ver projetos disponíveis

##### **Vesting e Claims**
- ✅ `claim_tokens()` - Resgatar tokens liberados
- ✅ `get_claimable_amount()` - Ver tokens disponíveis
- ✅ Ver cronograma de vesting

##### **Staking (Launchpool)**
- ✅ `stake()` - Fazer staking de LUNES
- ✅ `unstake()` - Retirar staking
- ✅ `get_stake_info()` - Ver informações de staking
- ✅ Participar de launchpools

##### **Raffle (Loteria)**
- ✅ `buy_raffle_tickets()` - Comprar tickets de rifa
- ✅ `claim_raffle_allocation()` - Resgatar prêmios
- ✅ Ver resultados de sorteios

##### **Recompensas**
- ✅ `claim_staking_rewards()` - Resgatar recompensas de staking
- ✅ `claim_project_buy_rewards()` - Resgatar recompensas de compra
- ✅ `claim_participation_rewards()` - Resgatar recompensas de participação

#### 🖥️ **Interface Investidor Necessária:**

```
👤 PAINEL DO INVESTIDOR
├── 🏠 Dashboard Principal
│   ├── Saldo de carteira (LUNES/LUSDT)
│   ├── Portfólio de investimentos
│   ├── Tokens em vesting
│   ├── Recompensas pendentes
│   └── Notificações importantes
├── 🚀 Projetos Disponíveis
│   ├── Lista de projetos ativos
│   ├── Filtros por fase/categoria
│   ├── Detalhes de cada projeto
│   ├── Calculadora de investimento
│   └── Histórico de preços
├── 💰 Meus Investimentos
│   ├── Projetos investidos
│   ├── Valores por projeto/fase
│   ├── Status de vesting
│   ├── Tokens disponíveis para claim
│   └── Performance do portfólio
├── 🎯 Staking (Launchpool)
│   ├── Staking atual de LUNES
│   ├── Recompensas acumuladas
│   ├── Launchpools disponíveis
│   ├── Alocações por projeto
│   └── Histórico de staking
├── 🎲 Raffle (Loteria)
│   ├── Rifas ativas
│   ├── Meus tickets
│   ├── Resultados de sorteios
│   ├── Prêmios ganhos
│   └── Histórico de participação
├── 🎁 Recompensas
│   ├── Recompensas de staking
│   ├── Recompensas de participação
│   ├── Recompensas de compra
│   ├── Histórico de claims
│   └── Projeções futuras
├── 👤 Meu Perfil
│   ├── Informações pessoais
│   ├── Status KYC
│   ├── Limites de investimento
│   ├── Configurações de conta
│   └── Histórico de atividades
└── 📊 Analytics Pessoais
    ├── Performance geral
    ├── ROI por projeto
    ├── Distribuição de investimentos
    └── Relatórios mensais
```

---

### 6. 🚫 **USUÁRIO BANIDO**
**Papel**: Usuário com acesso restrito
**Identificação**: `UserProfile.is_banned = true`

#### 🔧 **Restrições:**
- ❌ **Investimentos Bloqueados**: Não pode investir em projetos
- ❌ **Staking Bloqueado**: Não pode fazer staking
- ❌ **Raffle Bloqueado**: Não pode participar de rifas
- ✅ **Claims Permitidos**: Pode resgatar tokens já adquiridos
- ✅ **Visualização**: Pode ver informações públicas

#### 🖥️ **Interface Restrita:**
- Mensagem de banimento
- Acesso apenas a claims de tokens existentes
- Informações de contato para recurso

---

### 7. 🔮 **ORÁCULO DE PREÇOS**
**Papel**: Sistema que atualiza preços das moedas
**Identificação**: `price_data.price_oracle` (AccountId específico)

#### 🔧 **Funcionalidades:**
- ✅ `update_prices()` - Atualizar preços LUNES/LUSDT
- ✅ Fornecer dados de mercado em tempo real

---

## 📊 **Matriz de Permissões**

| Funcionalidade | Admin | Projeto | VIP | KYC | Padrão | Banido | Oráculo |
|----------------|-------|---------|-----|-----|--------|--------|---------|
| **Configurar Fases** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Investir LUNES** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Investir LUSDT** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Fases KYC** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Staking** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Raffle** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Claim Tokens** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Claim Rewards** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Gestão Usuários** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Atualizar Preços** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

## 🎯 **Fluxos de Usuário Principais**

### **Fluxo do Investidor:**
```
1. Conectar Carteira → 2. Ver Projetos → 3. Escolher Projeto → 
4. Verificar Fase Ativa → 5. Calcular Investimento → 6. Investir → 
7. Acompanhar Vesting → 8. Fazer Claims → 9. Receber Tokens
```

### **Fluxo do Admin:**
```
1. Login Admin → 2. Dashboard → 3. Configurar Projeto → 
4. Definir Fases → 5. Gerenciar Usuários → 6. Monitorar Sistema → 
7. Distribuir Recompensas → 8. Analytics
```

### **Fluxo do Projeto:**
```
1. Submeter Projeto → 2. Pagar Taxa → 3. Aguardar Aprovação → 
4. Configurar Fases → 5. Monitorar Captação → 6. Receber Fundos
```

## 🔐 **Considerações de Segurança para Frontend**

### **Validações Necessárias:**
- ✅ Verificar papel do usuário antes de mostrar funcionalidades
- ✅ Validar limites de investimento em tempo real
- ✅ Verificar status de fases antes de permitir ações
- ✅ Confirmar saldos antes de transações
- ✅ Validar status KYC para fases restritas

### **Estados de Loading:**
- ✅ Carregamento de dados da blockchain
- ✅ Confirmação de transações
- ✅ Sincronização de saldos
- ✅ Atualização de métricas

### **Tratamento de Erros:**
- ✅ Usuário banido
- ✅ Limites excedidos
- ✅ Fases inativas
- ✅ Saldo insuficiente
- ✅ KYC não verificado

Esta análise fornece a base completa para desenvolver as interfaces de usuário apropriadas para cada papel no sistema Launchpad Lunes! 🚀