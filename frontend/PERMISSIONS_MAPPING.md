# Mapeamento de Permissões - Lunes Launchpad

## Resumo das Alterações

**Objetivo:** Permitir que qualquer conta possa criar projetos na plataforma.

**Mudança Implementada:** Adicionada a permissão `CREATE_PROJECT`, `EDIT_PROJECT` e `PUBLISH_PROJECT` para todos os tipos de usuário (exceto usuários banidos).

---

## Mapeamento Completo de Permissões por Papel

### 🔴 ADMIN
**Permissões:** Acesso total ao sistema
- ✅ **Gestão de Projetos:** CREATE_PROJECT, EDIT_PROJECT, DELETE_PROJECT, PUBLISH_PROJECT, MANAGE_PROJECT_PHASES, MANAGE_INVESTORS, CONFIGURE_PROJECT_LIMITS
- ✅ **Administração:** MANAGE_USERS, MANAGE_PROJECTS, MANAGE_SYSTEM, MANAGE_REWARDS, MANAGE_KYC, MANAGE_PHASES, MANAGE_FEES, MANAGE_LIMITS, AUDIT_SYSTEM
- ✅ **Analytics:** VIEW_ANALYTICS, VIEW_ADMIN_ANALYTICS, VIEW_PROJECT_ANALYTICS, VIEW_USER_ANALYTICS, EXPORT_DATA
- ✅ **Investimentos:** Todos os tipos (PRESALE, WHITELIST, PUBLIC, LUNES, LUSDT)
- ✅ **Privilégios VIP:** PRIORITY_ACCESS, REDUCED_FEES, HIGHER_LIMITS, PREMIUM_SUPPORT, VIP_FEATURES, EARLY_ACCESS
- ✅ **KYC:** ACCESS_KYC_PHASES, SUBMIT_KYC, APPROVE_KYC, REJECT_KYC
- ✅ **Sistema:** UPDATE_PRICES, SYSTEM_MAINTENANCE, EMERGENCY_STOP
- ✅ **Segurança:** BAN_USER, UNBAN_USER, SUSPEND_USER, SECURITY_AUDIT

### 🟡 PROJECT_ISSUER (Emissor de Projetos)
**Permissões:** Foco em gestão de projetos + investimentos
- ✅ **Gestão de Projetos:** CREATE_PROJECT, EDIT_PROJECT, PUBLISH_PROJECT, MANAGE_PROJECT_PHASES, MANAGE_INVESTORS, CONFIGURE_PROJECT_LIMITS
- ✅ **Analytics:** VIEW_PROJECT_ANALYTICS, EXPORT_DATA
- ✅ **Investimentos:** Todos os tipos (PRESALE, WHITELIST, PUBLIC, LUNES, LUSDT)
- ✅ **Staking:** STAKE_TOKENS, UNSTAKE_TOKENS, CLAIM_STAKING_REWARDS, PARTICIPATE_RAFFLE, CLAIM_TOKENS, CLAIM_REWARDS
- ✅ **KYC:** ACCESS_KYC_PHASES, SUBMIT_KYC

### 🟢 INVESTOR_VIP (Investidor VIP)
**Permissões:** Privilégios VIP + **criação de projetos** ⭐
- ✅ **Gestão de Projetos:** CREATE_PROJECT, EDIT_PROJECT, PUBLISH_PROJECT ⭐ **NOVO**
- ✅ **Investimentos:** Todos os tipos (PRESALE, WHITELIST, PUBLIC, LUNES, LUSDT)
- ✅ **Privilégios VIP:** PRIORITY_ACCESS, REDUCED_FEES, HIGHER_LIMITS, PREMIUM_SUPPORT, VIP_FEATURES, EARLY_ACCESS
- ✅ **Staking:** STAKE_TOKENS, UNSTAKE_TOKENS, CLAIM_STAKING_REWARDS, PARTICIPATE_RAFFLE, CLAIM_TOKENS, CLAIM_REWARDS
- ✅ **Analytics:** VIEW_USER_ANALYTICS
- ✅ **KYC:** ACCESS_KYC_PHASES, SUBMIT_KYC

### 🔵 INVESTOR_VERIFIED (Investidor Verificado)
**Permissões:** Investimentos com KYC + **criação de projetos** ⭐
- ✅ **Gestão de Projetos:** CREATE_PROJECT, EDIT_PROJECT, PUBLISH_PROJECT ⭐ **NOVO**
- ✅ **Investimentos:** Todos os tipos (PRESALE, WHITELIST, PUBLIC, LUNES, LUSDT)
- ✅ **Staking:** STAKE_TOKENS, UNSTAKE_TOKENS, CLAIM_STAKING_REWARDS, PARTICIPATE_RAFFLE, CLAIM_TOKENS, CLAIM_REWARDS
- ✅ **Analytics:** VIEW_USER_ANALYTICS
- ✅ **KYC:** ACCESS_KYC_PHASES, SUBMIT_KYC

### ⚪ INVESTOR_STANDARD (Investidor Padrão)
**Permissões:** Investimentos básicos + **criação de projetos** ⭐
- ✅ **Gestão de Projetos:** CREATE_PROJECT, EDIT_PROJECT, PUBLISH_PROJECT ⭐ **NOVO**
- ✅ **Investimentos:** Apenas público (INVEST_IN_PROJECTS, INVEST_PUBLIC, INVEST_LUNES, INVEST_LUSDT)
- ✅ **Staking:** STAKE_TOKENS, UNSTAKE_TOKENS, CLAIM_STAKING_REWARDS, PARTICIPATE_RAFFLE, CLAIM_TOKENS, CLAIM_REWARDS
- ✅ **KYC:** SUBMIT_KYC

### 🟠 PRICE_ORACLE (Oráculo de Preços)
**Permissões:** Função específica + **criação de projetos** ⭐
- ✅ **Gestão de Projetos:** CREATE_PROJECT, EDIT_PROJECT, PUBLISH_PROJECT ⭐ **NOVO**
- ✅ **Sistema:** UPDATE_PRICES

### ❌ USER_BANNED (Usuário Banido)
**Permissões:** Apenas reivindicação de tokens
- ✅ **Limitado:** CLAIM_TOKENS
- ❌ **Sem criação de projetos** (mantido por segurança)

---

## Impacto das Mudanças

### ✅ Benefícios
1. **Democratização:** Qualquer usuário autenticado pode criar projetos
2. **Inclusão:** Remove barreiras de entrada para empreendedores
3. **Crescimento:** Potencial aumento no número de projetos na plataforma
4. **Flexibilidade:** Usuários podem evoluir de investidores para emissores

### ⚠️ Considerações de Segurança
1. **Moderação:** Pode ser necessário implementar sistema de aprovação/moderação
2. **Qualidade:** Risco de projetos de baixa qualidade
3. **Spam:** Possível aumento de projetos spam ou fraudulentos
4. **KYC:** Considerar exigir KYC para publicação de projetos

### 🔧 Recomendações Técnicas
1. **Implementar sistema de moderação** para novos projetos
2. **Adicionar filtros de qualidade** baseados no histórico do usuário
3. **Considerar limites** por tipo de usuário (ex: STANDARD = 1 projeto/mês)
4. **Monitorar métricas** de qualidade e fraude

---

## Arquivos Modificados

- **`apps/showcase/src/types/auth.ts`**: Atualizado mapeamento `ROLE_PERMISSIONS`
- **Linhas alteradas**: 421-507 (adição de permissões CREATE_PROJECT, EDIT_PROJECT, PUBLISH_PROJECT)

## Como Testar

1. **Login com diferentes tipos de conta**
2. **Verificar visibilidade do botão "Novo Projeto"** na interface
3. **Testar criação de projeto** com cada tipo de usuário
4. **Validar permissões** na navegação e rotas protegidas

---

*Documento gerado em: $(date)*
*Versão: 1.0*