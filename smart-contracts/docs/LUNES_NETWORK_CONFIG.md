# 🌙 Configuração da Rede Lunes

## Endpoints WebSocket

### Rede de Teste (Testnet)
```
wss://ws-test.lunes.io
```

### Rede Principal (Mainnet)
```
wss://ws.lunes.io
wss://ws-lunes-main-01.lunes.io
wss://ws-lunes-main-02.lunes.io
wss://ws-archive.lunes.io
```

## Configuração para Deploy

### 1. Arquivo de Configuração
Criar arquivo `.env` na raiz do projeto:

```env
# Rede de Teste
LUNES_WS_TESTNET=wss://ws-test.lunes.io

# Rede Principal (usar um dos endpoints)
LUNES_WS_MAINNET=wss://ws.lunes.io
# Alternativas:
# LUNES_WS_MAINNET=wss://ws-lunes-main-01.lunes.io
# LUNES_WS_MAINNET=wss://ws-lunes-main-02.lunes.io
# LUNES_WS_MAINNET=wss://ws-archive.lunes.io

# Configuração de Conta
DEPLOYER_SEED=//Alice  # Substituir pela seed real em produção
```

### 2. Script de Deploy

```bash
#!/bin/bash
# deploy_lunes.sh

# Selecionar rede
NETWORK=${1:-testnet}

if [ "$NETWORK" = "mainnet" ]; then
    WS_ENDPOINT=$LUNES_WS_MAINNET
    echo "🚀 Deploying to Lunes Mainnet..."
else
    WS_ENDPOINT=$LUNES_WS_TESTNET
    echo "🧪 Deploying to Lunes Testnet..."
fi

# Build do contrato
cargo contract build --release

# Deploy
cargo contract instantiate \
    --url $WS_ENDPOINT \
    --constructor new \
    --args "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" \
    --suri $DEPLOYER_SEED \
    --value 0 \
    --gas 200000000000 \
    --proof-size 2097152
```

## Características da Rede Lunes

### Especificações Técnicas
- **Consensus**: GRANDPA + BABE
- **Block Time**: ~6 segundos
- **Finality**: ~30 segundos
- **Native Token**: LUNES
- **Decimals**: 12
- **Smart Contracts**: ink! (Substrate Contracts Pallet)

### Gas e Fees
- **Weight Base Fee**: Calculado dinamicamente
- **Length Fee**: Baseado no tamanho da transação
- **Tip**: Opcional para priorização

### Limites de Contrato
- **Max Code Size**: 2MB
- **Max Storage Size**: 16MB por contrato
- **Max Memory**: 128MB durante execução

## Integração com o Launchpad

### 1. Configuração do Provider

```rust
// lib.rs
pub const LUNES_DECIMALS: u8 = 12;
pub const BLOCK_TIME: u64 = 6000; // 6 segundos em ms

// Configuração de rede
pub struct LunesConfig {
    pub endpoint: &'static str,
    pub is_testnet: bool,
}

impl LunesConfig {
    pub fn testnet() -> Self {
        Self {
            endpoint: "wss://ws-test.lunes.io",
            is_testnet: true,
        }
    }
    
    pub fn mainnet() -> Self {
        Self {
            endpoint: "wss://ws.lunes.io",
            is_testnet: false,
        }
    }
}
```

### 2. Ajustes no Sistema de Fases

Como estamos usando apenas a rede Lunes, podemos simplificar:

- ✅ Remover sistema de oráculos para outras chains
- ✅ Remover verificação de transações externas
- ✅ Focar em otimizações específicas para Lunes
- ✅ Usar LUNES como token nativo de pagamento

## Scripts Úteis

### Verificar Saldo

```bash
# check_balance.sh
#!/bin/bash
ACCOUNT=$1
NETWORK=${2:-testnet}

if [ "$NETWORK" = "mainnet" ]; then
    WS_ENDPOINT=$LUNES_WS_MAINNET
else
    WS_ENDPOINT=$LUNES_WS_TESTNET
fi

polkadot-js-api query.system.account $ACCOUNT \
    --ws $WS_ENDPOINT
```

### Monitorar Eventos

```bash
# monitor_events.sh
#!/bin/bash
CONTRACT=$1
NETWORK=${2:-testnet}

if [ "$NETWORK" = "mainnet" ]; then
    WS_ENDPOINT=$LUNES_WS_MAINNET
else
    WS_ENDPOINT=$LUNES_WS_TESTNET
fi

polkadot-js-api query.system.events \
    --ws $WS_ENDPOINT \
    --filter $CONTRACT
```

## Segurança

### Boas Práticas para Lunes

1. **Sempre testar na testnet primeiro**
2. **Usar múltiplos endpoints em produção para redundância**
3. **Implementar retry logic para conexões WebSocket**
4. **Monitorar gas costs específicos da Lunes**
5. **Validar todas as transações antes de enviar**

### Exemplo de Conexão Resiliente

```javascript
const endpoints = [
    'wss://ws.lunes.io',
    'wss://ws-lunes-main-01.lunes.io',
    'wss://ws-lunes-main-02.lunes.io'
];

async function connectToLunes() {
    for (const endpoint of endpoints) {
        try {
            const provider = new WsProvider(endpoint);
            await provider.isReady;
            console.log(`✅ Connected to ${endpoint}`);
            return provider;
        } catch (error) {
            console.log(`❌ Failed to connect to ${endpoint}`);
        }
    }
    throw new Error('Failed to connect to any Lunes endpoint');
}
```

## Próximos Passos

1. Configurar ambiente de desenvolvimento com Lunes testnet
2. Adaptar testes para usar endpoints Lunes
3. Criar scripts de deploy automatizados
4. Implementar monitoramento de eventos específicos
5. Otimizar gas costs para a rede Lunes
