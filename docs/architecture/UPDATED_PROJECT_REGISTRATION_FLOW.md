# 🔄 Fluxo de Cadastro Atualizado: Projetos Lunes + Pagamentos Multi-Chain

## 📋 Especificação Atualizada

### **Clarificação Importante:**
- ✅ **Projetos**: Apenas tokens da rede Lunes
- ✅ **Pagamentos**: Clientes podem pagar em USDT/USDC via Solana e TON
- ✅ **Carteiras**: Projetos devem cadastrar carteiras para receber fundos convertidos

## 🔄 Fluxo Atualizado (6 Etapas)

### **📋 Etapa 1: Informações Básicas** (Inalterada)
```
🚀 CADASTRO DE PROJETO - ETAPA 1/6

📋 INFORMAÇÕES BÁSICAS
├── Nome do Projeto: [Input] *obrigatório
├── Descrição: [Textarea] *obrigatório
├── Website: [URL Input]
├── Whitepaper: [URL Input]
└── Social Links: Twitter, Telegram, Discord, Medium

[Próximo: Tokenomics]
```

### **💰 Etapa 2: Tokenomics** (Inalterada)
```
💰 TOKENOMICS - ETAPA 2/6

🪙 TOKEN DA REDE LUNES
├── Nome do Token: [Input] *obrigatório
├── Símbolo: [Input] *obrigatório
├── Supply Total: [Number] *obrigatório
├── Preço por Token (USD): [Number] *obrigatório
└── Token Address (Lunes): [Input] *obrigatório

📊 DISTRIBUIÇÃO (calculada automaticamente)
├── Venda Total: 40%
├── Airdrop: 10%
├── Equipe: 20%
├── Liquidez: 15%
└── Reserva: 15%

[Próximo: Fases de Venda]
```

### **📅 Etapa 3: Fases de Venda** (Inalterada)
```
📅 FASES DE VENDA - ETAPA 3/6

🎯 CONFIGURAÇÃO DAS FASES
├── Whitelist Phase
├── Presale Phase
└── Public Sale Phase

[Próximo: Sistema de Afiliados]
```

### **🤝 Etapa 4: Sistema de Afiliados** (Inalterada)
```
🤝 SISTEMA DE AFILIADOS - ETAPA 4/6

⚙️ CONFIGURAÇÃO
├── Taxa de Comissão: 5% - 15%
├── Anti-fraude: Ativado
└── Pagamento: LUNES

[Próximo: Carteiras de Recebimento]
```

### **💳 Etapa 5: Carteiras de Recebimento** (NOVA/ATUALIZADA)
```
💳 CARTEIRAS DE RECEBIMENTO - ETAPA 5/6

🏠 CARTEIRA PRINCIPAL (OBRIGATÓRIA)
├── Rede: Lunes Network
├── Endereço: [Input] *obrigatório
├── Moeda: LUNES
└── Status: ✅ Configurada

🌐 CARTEIRAS PARA PAGAMENTOS EXTERNOS
├── 📊 Configurar quais moedas aceitar:
│   ├── ☑️ USDT via Solana
│   ├── ☑️ USDC via Solana  
│   ├── ☑️ USDT via TON
│   └── ☑️ USDC via TON

📍 ENDEREÇOS DAS CARTEIRAS
├── Solana USDT: [Input] (se marcado acima)
├── Solana USDC: [Input] (se marcado acima)
├── TON USDT: [Input] (se marcado acima)
└── TON USDC: [Input] (se marcado acima)

⚙️ CONFIGURAÇÕES DE CONVERSÃO
├── ☑️ Auto-converter para LUNES
├── Limite para conversão: [Number] USD (padrão: $1000)
└── Frequência: Diária/Semanal/Manual

💡 IMPORTANTE:
- Tokens do projeto são sempre na rede Lunes
- Clientes podem pagar em diferentes redes
- Fundos são convertidos e enviados para suas carteiras

[Próximo: Depósito de Garantia]
```

### **💰 Etapa 6: Depósito de Garantia** (Inalterada)
```
💰 DEPÓSITO DE GARANTIA - ETAPA 6/6

📊 CÁLCULO AUTOMÁTICO
├── Valor do Projeto: $400,000
├── Depósito: $40,000 (40,000 LUNES)
├── Rede: Lunes Network
└── Confirmações: 12

[Finalizar Cadastro]
```

## 🔧 Configuração Técnica Atualizada

### **Estrutura de Carteiras do Projeto**
```rust
ProjectWallets {
    lunes_wallet: AccountId,                    // OBRIGATÓRIO - Carteira principal
    solana_usdt_wallet: Option<String>,         // OPCIONAL - Para receber USDT via Solana
    solana_usdc_wallet: Option<String>,         // OPCIONAL - Para receber USDC via Solana
    ton_usdt_wallet: Option<String>,            // OPCIONAL - Para receber USDT via TON
    ton_usdc_wallet: Option<String>,            // OPCIONAL - Para receber USDC via TON
    auto_convert_to_lunes: bool,                // Converter automaticamente para LUNES
    conversion_threshold: Balance,              // Limite mínimo para conversão ($1000)
}
```

### **Configuração de Vendas Atualizada**
```rust
ProjectSalesConfig {
    project_id: "defi-revolution-2024",
    project_owner: project_owner_address,
    project_token_network: "lunes",             // SEMPRE Lunes para tokens
    accepted_payment_currencies: vec![
        "LUNES",                                // Sempre aceito
        "USDT",                                 // Se configurou carteiras USDT
        "USDC",                                 // Se configurou carteiras USDC
    ],
    accepted_payment_networks: vec![
        "lunes",                                // Sempre suportado
        "solana",                               // Se configurou carteiras Solana
        "ton",                                  // Se configurou carteiras TON
    ],
    revenue_wallets: project_wallets,           // Carteiras configuradas
    token_price_usd: 1_000_000,                // $0.001
    affiliate_commission_rate: 1000,            // 10%
}
```

## 💰 Fluxo de Pagamento Atualizado

### **Cenário 1: Pagamento em LUNES (Direto)**
```
1. 👤 Cliente escolhe pagar em LUNES
2. 💳 Paga na rede Lunes diretamente
3. 🪙 Recebe tokens imediatamente
4. 💰 Projeto recebe LUNES na carteira principal
5. 📊 Distribuição automática de taxas
```

### **Cenário 2: Pagamento em USDT via Solana**
```
1. 👤 Cliente escolhe pagar em USDT (Solana)
2. 💳 Paga USDT na rede Solana
3. 🔄 Bridge processa cross-chain
4. 💱 Sistema converte USDT → LUNES (se auto-convert ativo)
5. 💰 Projeto recebe na carteira configurada:
   ├── USDT direto (se auto-convert desabilitado)
   └── LUNES convertido (se auto-convert habilitado)
6. 🪙 Cliente recebe tokens Lunes
7. 📊 Distribuição automática de taxas
```

### **Cenário 3: Pagamento em USDC via TON**
```
1. 👤 Cliente escolhe pagar em USDC (TON)
2. 💳 Paga USDC na rede TON
3. 🔄 Bridge processa cross-chain
4. 💱 Sistema converte USDC → LUNES (se configurado)
5. 💰 Projeto recebe na carteira TON USDC
6. 🪙 Cliente recebe tokens Lunes
7. 📊 Distribuição automática de taxas
```

## 🔧 Interface de Configuração de Carteiras

### **Tela de Configuração**
```
💳 CONFIGURAÇÃO DE CARTEIRAS DE RECEBIMENTO

🏠 CARTEIRA PRINCIPAL LUNES
├── Endereço: [5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY]
├── Status: ✅ Válida
└── Função: Receber LUNES e tokens do projeto

🌐 ACEITAR PAGAMENTOS EXTERNOS?
├── ☑️ Sim, quero aceitar USDT/USDC de outras redes
└── ☐ Não, apenas LUNES na rede Lunes

📍 CARTEIRAS PARA PAGAMENTOS EXTERNOS
┌─────────────────────────────────────────────────────────┐
│ 🔵 SOLANA NETWORK                                       │
├─────────────────────────────────────────────────────────┤
│ ☑️ Aceitar USDT via Solana                              │
│ Carteira USDT: [Input field]                           │
│ ☑️ Aceitar USDC via Solana                              │
│ Carteira USDC: [Input field]                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 💎 TON NETWORK                                          │
├─────────────────────────────────────────────────────────┤
│ ☑️ Aceitar USDT via TON                                 │
│ Carteira USDT: [Input field]                           │
│ ☑️ Aceitar USDC via TON                                 │
│ Carteira USDC: [Input field]                           │
└─────────────────────────────────────────────────────────┘

⚙️ CONFIGURAÇÕES DE CONVERSÃO
├── ☑️ Auto-converter tudo para LUNES
├── Limite para conversão: [$1,000] USD
├── Frequência: [Diária ▼]
└── Taxa de conversão: Mercado + 0.5%

💡 RESUMO DA CONFIGURAÇÃO
├── Moedas aceitas: LUNES, USDT, USDC
├── Redes aceitas: Lunes, Solana, TON
├── Carteiras configuradas: 5/5
└── Auto-conversão: ✅ Ativada

[Salvar Configuração]
```

## 📊 Dashboard do Projeto Atualizado

### **Visão de Carteiras e Pagamentos**
```
💳 GESTÃO DE CARTEIRAS - DeFi Revolution 2024

🏠 CARTEIRA PRINCIPAL (LUNES)
├── Endereço: 5GrwvaEF...utQY
├── Saldo: 125,000 LUNES
├── Recebido hoje: 15,000 LUNES
└── Status: ✅ Ativa

🌐 CARTEIRAS DE PAGAMENTO EXTERNO
├── Solana USDT: 9WzDXw...8Qv2
│   ├── Saldo: 25,000 USDT
│   ├── Recebido hoje: 5,000 USDT
│   └── Próxima conversão: 2h
├── Solana USDC: 7Np5Yt...3Kx9
│   ├── Saldo: 18,000 USDC
│   ├── Recebido hoje: 3,000 USDC
│   └── Próxima conversão: 2h
├── TON USDT: EQD4FP...9Xm1
│   ├── Saldo: 12,000 USDT
│   ├── Recebido hoje: 2,000 USDT
│   └── Próxima conversão: 2h
└── TON USDC: EQB8Kx...7Yz3
    ├── Saldo: 8,000 USDC
    ├── Recebido hoje: 1,000 USDC
    └── Próxima conversão: 2h

💰 RESUMO FINANCEIRO (24h)
├── Total recebido: $26,000
├── LUNES direto: $15,000 (58%)
├── Cross-chain: $11,000 (42%)
├── Conversões pendentes: $8,000
└── Taxa de conversão média: 0.52%

🔄 CONVERSÕES AUTOMÁTICAS
├── Próxima execução: 1h 45min
├── Valor a converter: $8,000
├── Taxa estimada: 0.5%
├── LUNES a receber: ~15,680 LUNES
└── [Executar Conversão Agora]
```

## 🎯 Validações e Regras

### **Validações de Carteiras**
```rust
fn validate_wallet_configuration(wallets: &ProjectWallets) -> Result<()> {
    // 1. Carteira Lunes é obrigatória
    ✅ lunes_wallet deve ser válido
    
    // 2. Pelo menos uma carteira externa (se aceitar pagamentos externos)
    ✅ Se aceitar USDT/USDC, deve ter pelo menos uma carteira configurada
    
    // 3. Validar formato dos endereços
    ✅ Endereços Solana: Base58, 32-44 caracteres
    ✅ Endereços TON: EQ format, 48 caracteres
    
    // 4. Não permitir carteiras duplicadas
    ✅ Cada carteira deve ser única
    
    // 5. Validar configurações de conversão
    ✅ Threshold mínimo: $100
    ✅ Threshold máximo: $100,000
}
```

### **Regras de Negócio**
```rust
BusinessRules {
    // Tokens sempre na rede Lunes
    project_token_network: "lunes",
    
    // Pagamentos aceitos
    payment_networks: ["lunes", "solana", "ton"],
    payment_currencies: ["LUNES", "USDT", "USDC"],
    
    // Conversão automática
    min_conversion_threshold: 100_000_000,      // $100
    max_conversion_threshold: 100_000_000_000,  // $100k
    conversion_fee: 50,                         // 0.5%
    
    // Limites de carteiras
    max_wallets_per_currency: 1,               // 1 carteira por moeda/rede
    required_lunes_wallet: true,               // Sempre obrigatório
}
```

## 🚀 Benefícios da Atualização

### **Para Projetos:**
- 🎯 **Tokens sempre na Lunes** (rede nativa)
- 💰 **Aceitar pagamentos globais** (USDT/USDC)
- 🔄 **Conversão automática** para LUNES
- 📊 **Gestão unificada** de múltiplas carteiras
- 💱 **Proteção cambial** com conversão automática

### **Para Clientes:**
- 🌐 **Pagar com stablecoins** (USDT/USDC)
- 🔗 **Usar redes preferidas** (Solana/TON)
- 🪙 **Receber tokens Lunes** (padrão do ecossistema)
- ⚡ **Transações rápidas** via bridge

### **Para o Launchpad:**
- 📈 **Maior volume** com pagamentos multi-chain
- 🏦 **1% automático** para Smart Fund
- 🤝 **Crescimento viral** via afiliados
- 🛡️ **Segurança enterprise** mantida

**Sistema atualizado para refletir perfeitamente a especificação: projetos Lunes + pagamentos multi-chain!** 🚀
