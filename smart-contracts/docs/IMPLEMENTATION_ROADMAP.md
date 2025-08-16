# 🚀 Roadmap de Implementação - Launchpad Lunes Smart Contracts

## 📅 Sprint 1: Sistema de Fases (Semana 1-2)

### 1.1 Criar Módulo de Fases (`phases_system.rs`)

```rust
// Estruturas principais
pub enum PhaseType {
    Whitelist,
    PreSale,
    PublicSale,
    Launchpool,
    Raffle,
}

pub struct PhaseConfig {
    pub phase_type: PhaseType,
    pub start_time: Timestamp,
    pub end_time: Timestamp,
    pub total_allocation: Balance,
    pub min_investment: Balance,
    pub max_investment_per_user: Balance,
    pub discount_percentage: u8,
    pub vesting_schedule: VestingSchedule,
    pub whitelist_addresses: Option<Vec<AccountId>>,
    pub staking_requirements: Option<StakingRequirements>,
}

pub struct VestingSchedule {
    pub cliff_months: u8,
    pub vesting_months: u8,
    pub initial_release_percentage: u8,
    pub linear_release: bool,
}
```

### 1.2 Implementar Lógica de Cada Fase

#### Whitelist Phase
- ✅ Verificação de whitelist
- ✅ Aplicação de desconto 40-60%
- ✅ Vesting 6-12 meses
- ✅ Limite de alocação por usuário

#### Pre-Sale Phase  
- ✅ Acesso público ou restrito
- ✅ Desconto 15-25%
- ✅ Vesting 3-6 meses
- ✅ Validação de limites

#### Public Sale
- ✅ Sem desconto
- ✅ Vesting mínimo ou sem vesting
- ✅ First-come-first-served

#### Launchpool
- ✅ Sistema de staking
- ✅ Cálculo de rewards
- ✅ Período de lock

#### Raffle System
- ✅ Sistema de tickets
- ✅ Sorteio diário
- ✅ Distribuição de prêmios

## 📅 Sprint 2: Integração Cross-Chain (Semana 3-4)

### 2.1 Implementar Oracle Integration

```rust
#[ink(message)]
pub fn register_external_contribution(
    &mut self,
    project_id: String,
    buyer: AccountId,
    amount: Balance,
    network: String,
    tx_hash: String,
    oracle_proof: OracleProof,
) -> Result<ContributionId, Error> {
    // 1. Verificar assinatura do oráculo
    self.verify_oracle_signature(&oracle_proof)?;
    
    // 2. Verificar se transação já foi processada
    ensure!(!self.processed_txs.contains(&tx_hash), Error::DuplicateTransaction);
    
    // 3. Registrar contribuição
    let contribution = ExternalContribution {
        project_id: project_id.clone(),
        buyer,
        amount,
        network,
        tx_hash: tx_hash.clone(),
        timestamp: self.env().block_timestamp(),
        status: ContributionStatus::Pending,
    };
    
    // 4. Emitir evento
    self.env().emit_event(ExternalContributionRegistered {
        project_id,
        buyer,
        amount,
        network,
        tx_hash,
    });
    
    Ok(contribution_id)
}
```

### 2.2 Treasury Integration

```rust
#[ink(message)]
pub fn process_external_funds(
    &mut self,
    network: String,
    amount: Balance,
    tx_hash: String,
    oracle_proof: OracleProof,
) -> Result<(), Error> {
    // Verificações de segurança
    self.ensure_authorized_oracle(&oracle_proof.signer)?;
    self.verify_oracle_signature(&oracle_proof)?;
    
    // Registrar fundos externos
    self.external_funds.insert(tx_hash.clone(), ExternalFund {
        network,
        amount,
        received_at: self.env().block_timestamp(),
        status: FundStatus::Confirmed,
    });
    
    // Atualizar balanços
    self.total_funds += amount;
    
    Ok(())
}
```

## 📅 Sprint 3: Sistema de Vesting (Semana 5)

### 3.1 Vesting Contract Module

```rust
pub struct VestingPosition {
    pub beneficiary: AccountId,
    pub total_amount: Balance,
    pub released_amount: Balance,
    pub start_time: Timestamp,
    pub cliff_time: Timestamp,
    pub end_time: Timestamp,
    pub initial_release: Balance,
    pub linear_release: bool,
}

#[ink(message)]
pub fn claim_vested_tokens(&mut self) -> Result<Balance, Error> {
    let caller = self.env().caller();
    let position = self.vesting_positions.get(&caller)
        .ok_or(Error::NoVestingPosition)?;
    
    let claimable = self.calculate_claimable_amount(&position)?;
    ensure!(claimable > 0, Error::NothingToClaim);
    
    // Transferir tokens
    self.transfer_tokens(caller, claimable)?;
    
    // Atualizar posição
    position.released_amount += claimable;
    
    Ok(claimable)
}
```

## 📅 Sprint 4: Segurança e Validações (Semana 6)

### 4.1 Implementar Guards e Validações

```rust
// Rate Limiting
pub struct RateLimiter {
    pub window_size: u64,
    pub max_requests: u32,
    pub user_requests: Mapping<AccountId, Vec<Timestamp>>,
}

// Pausable Pattern
#[ink(message)]
pub fn pause(&mut self) -> Result<(), Error> {
    self.ensure_admin()?;
    self.paused = true;
    self.env().emit_event(ContractPaused {
        timestamp: self.env().block_timestamp(),
    });
    Ok(())
}

// Reentrancy Guard
pub fn ensure_not_reentrant(&mut self) -> Result<(), Error> {
    ensure!(!self.locked, Error::ReentrantCall);
    self.locked = true;
    Ok(())
}
```

### 4.2 KYC Integration

```rust
pub struct KYCStatus {
    pub user: AccountId,
    pub verified: bool,
    pub tier: KYCTier,
    pub verified_at: Timestamp,
    pub expires_at: Option<Timestamp>,
}

#[ink(message)]
pub fn update_kyc_status(
    &mut self,
    user: AccountId,
    verified: bool,
    tier: KYCTier,
) -> Result<(), Error> {
    self.ensure_kyc_provider()?;
    
    self.kyc_registry.insert(user, KYCStatus {
        user,
        verified,
        tier,
        verified_at: self.env().block_timestamp(),
        expires_at: None,
    });
    
    Ok(())
}
```

## 🧪 Plano de Testes

### Testes Unitários (Por Módulo)
1. **Phases System**: 20+ testes
   - Transições de fase
   - Cálculos de desconto
   - Validação de limites

2. **Cross-Chain**: 15+ testes
   - Verificação de assinaturas
   - Prevenção de replay attack
   - Processamento de contribuições

3. **Vesting**: 10+ testes
   - Cálculos de liberação
   - Claims múltiplos
   - Edge cases

4. **Security**: 15+ testes
   - Rate limiting
   - Pausable
   - Access control
   - Reentrancy

### Testes E2E
1. **Fluxo completo de IDO**
2. **Pagamento multi-chain**
3. **Vesting e claims**
4. **Governança e votação**

## 📊 Métricas de Entrega

| Sprint | Funcionalidade | Critério de Aceitação |
|--------|---------------|----------------------|
| 1 | Sistema de Fases | 5 fases implementadas com testes |
| 2 | Cross-Chain | Oráculos funcionais para 2+ redes |
| 3 | Vesting | Sistema completo com claims |
| 4 | Segurança | Auditoria interna passed |

## 🚦 Marcos de Validação

### Marco 1: MVP Funcional (Final Sprint 2)
- [ ] Whitelist e Venda funcionais
- [ ] Pagamento em LUNES operacional
- [ ] Testes básicos passando

### Marco 2: Sistema Completo (Final Sprint 4)
- [ ] Todas as 5 fases implementadas
- [ ] Cross-chain operacional
- [ ] Vesting funcional
- [ ] Security audit ready

### Marco 3: Production Ready
- [ ] Auditoria externa completa
- [ ] Documentação completa
- [ ] Deploy em testnet
- [ ] Stress testing passed

## 📝 Notas Importantes

1. **TDD Approach**: Escrever testes antes da implementação
2. **Gas Optimization**: Benchmark após cada sprint
3. **Documentation**: Atualizar docs conforme desenvolvimento
4. **Code Review**: PR review obrigatório para merge
