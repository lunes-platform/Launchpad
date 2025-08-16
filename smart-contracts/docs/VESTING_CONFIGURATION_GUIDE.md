# 📅 Guia de Configuração de Vesting - Launchpad Lunes

## Visão Geral

O sistema de vesting permite que os tokens comprados sejam liberados gradualmente ao longo do tempo, protegendo o projeto contra vendas massivas (dump) e incentivando holders de longo prazo.

## Componentes do Vesting

### 1. **Liberação Inicial (TGE - Token Generation Event)**
- Percentual liberado imediatamente após a compra
- Exemplo: 10% = comprador recebe 10% dos tokens na hora

### 2. **Cliff Period**
- Período de espera obrigatório antes de começar a liberação gradual
- Durante o cliff, apenas a liberação inicial está disponível
- Exemplo: 30 dias = nenhum token adicional por 1 mês

### 3. **Período de Vesting**
- Duração total do vesting (incluindo cliff)
- Após o cliff, liberação linear até o fim
- Exemplo: 365 dias = liberação completa em 1 ano

## Configurações Recomendadas por Fase

### 🏷️ Whitelist (Early Investors)
```rust
VestingConfig {
    cliff_days: 30,              // 1 mês de cliff
    total_days: 365,             // 12 meses total
    initial_release_percent: 10, // 10% no TGE
}
```
- **Razão**: Investidores iniciais recebem maior desconto mas com vesting mais longo

### 💰 Pre-Sale
```rust
VestingConfig {
    cliff_days: 0,               // Sem cliff
    total_days: 180,             // 6 meses total
    initial_release_percent: 20, // 20% no TGE
}
```
- **Razão**: Balanço entre liquidez e proteção do projeto

### 🌐 Public Sale
```rust
VestingConfig {
    cliff_days: 0,               // Sem cliff
    total_days: 90,              // 3 meses total
    initial_release_percent: 30, // 30% no TGE
}
```
- **Razão**: Venda pública com vesting mais curto para atrair investidores

### 🎯 Launchpool (Staking Rewards)
```rust
VestingConfig {
    cliff_days: 0,               // Sem cliff
    total_days: 30,              // 1 mês total
    initial_release_percent: 50, // 50% no TGE
}
```
- **Razão**: Recompensas de staking com liberação rápida

### 🎲 Raffle (Lottery)
```rust
VestingConfig {
    cliff_days: 0,               // Sem cliff
    total_days: 0,               // Sem vesting
    initial_release_percent: 100,// 100% no TGE
}
```
- **Razão**: Tokens de sorteio geralmente sem restrições

## Exemplos de Cronogramas

### Exemplo 1: Vesting Conservador (Whitelist)
- **Total comprado**: 10,000 tokens
- **Configuração**: 10% TGE, 30 dias cliff, 365 dias total

| Período | Tokens Liberados | Total Acumulado |
|---------|------------------|-----------------|
| Dia 0 (TGE) | 1,000 | 1,000 (10%) |
| Dia 30 (Fim Cliff) | 0 | 1,000 (10%) |
| Dia 60 | 300 | 1,300 (13%) |
| Dia 180 | 2,455 | 3,455 (34.5%) |
| Dia 365 (Final) | 10,000 | 10,000 (100%) |

### Exemplo 2: Vesting Moderado (Pre-Sale)
- **Total comprado**: 5,000 tokens
- **Configuração**: 20% TGE, sem cliff, 180 dias total

| Período | Tokens Liberados | Total Acumulado |
|---------|------------------|-----------------|
| Dia 0 (TGE) | 1,000 | 1,000 (20%) |
| Dia 30 | 666 | 1,666 (33.3%) |
| Dia 90 | 2,000 | 3,000 (60%) |
| Dia 180 (Final) | 5,000 | 5,000 (100%) |

## Cálculos de Vesting

### Fórmula de Liberação Linear

```
Tokens Liberados = Liberação Inicial + 
    ((Total - Liberação Inicial) × (Dias desde Cliff) / (Dias de Vesting após Cliff))
```

### Conversão de Tempo
- 1 dia = 14,400 blocos (na rede Lunes com blocos de 6s)
- 1 semana = 100,800 blocos
- 1 mês (30 dias) = 432,000 blocos
- 1 ano (365 dias) = 5,256,000 blocos

## Implementação Prática

### 1. Criar Fase com Vesting
```rust
contract.create_phase_with_vesting(
    project_id,
    0, // PhaseType::Whitelist
    current_block,
    duration_blocks,
    allocation,
    min_investment,
    max_investment,
    token_price,
    50, // 50% discount
    VestingConfig {
        cliff_days: 30,
        total_days: 365,
        initial_release_percent: 10,
    },
    true, // whitelist only
)
```

### 2. Verificar Tokens Disponíveis
```rust
let claimable = contract.get_claimable_amount(
    user_account,
    project_id,
    phase_type
);
```

### 3. Sacar Tokens Liberados
```rust
let claimed = contract.claim_vested_tokens(
    project_id,
    phase_type
)?;
```

## Considerações Importantes

### Para Projetos
1. **Proteção contra Dump**: Vesting mais longo = menor pressão de venda
2. **Liquidez**: Balancear entre proteção e atratividade
3. **Diferenciação**: Cada fase pode ter vesting diferente
4. **Transparência**: Comunicar claramente os termos

### Para Investidores
1. **Planejamento**: Entender quando terá acesso aos tokens
2. **Liquidez**: Considerar necessidade de liquidez antes de investir
3. **Valor**: Avaliar se o desconto compensa o período de espera
4. **Tracking**: Acompanhar liberações e fazer claims

## Simulador de Vesting

Use a função `calculate_vesting_schedule` para simular:

```rust
let schedule = contract.calculate_vesting_schedule(
    10000, // total tokens
    VestingConfig {
        cliff_days: 30,
        total_days: 365,
        initial_release_percent: 10,
    }
);

// Retorna array de (dia, tokens_liberados)
// [(0, 1000), (30, 1000), (60, 1300), ...]
```

## FAQ

**P: Posso alterar o vesting depois de criado?**
R: Não, o vesting é imutável após a criação da fase para garantir segurança aos investidores.

**P: O que acontece se eu não fizer claim?**
R: Os tokens continuam acumulando. Você pode fazer claim a qualquer momento após liberados.

**P: Posso fazer claim parcial?**
R: Não, cada claim saca todos os tokens disponíveis no momento.

**P: O vesting continua se o projeto falhar?**
R: Sim, o vesting é um contrato independente e continua funcionando.

## Melhores Práticas

1. **Teste na Testnet**: Sempre simule o vesting completo antes do mainnet
2. **Documentação Clara**: Publique os termos de vesting antes da venda
3. **Suporte ao Usuário**: Forneça ferramentas para tracking de vesting
4. **Auditoria**: Valide os cálculos de vesting com auditores externos
