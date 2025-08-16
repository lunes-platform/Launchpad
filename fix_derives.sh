#!/bin/bash

# Script para corrigir derives StorageLayout para ink! 5.1.x

echo "Corrigindo derives StorageLayout para ink! 5.1.x..."

# Remover todos os derives antigos
find . -name "*.rs" -exec sed -i '' '/^[[:space:]]*#\[ink::storage_derive(StorageLayout)\]/d' {} \;

# Adicionar imports necessários nos arquivos que precisam
files_to_fix=(
    "governance_system.rs"
    "smart_fund_treasury.rs" 
    "sales_revenue_system.rs"
    "multi_chain_bridge.rs"
    "proxy_monitoring.rs"
    "web3_connection_tdd.rs"
    "token_custody_system.rs"
    "implementation_base.rs"
    "migration_system.rs"
    "compatibility_layer.rs"
    "proxy_contract.rs"
    "treasury_integration.rs"
    "sales_integration.rs"
    "governance_integration.rs"
)

for file in "${files_to_fix[@]}"; do
    if [ -f "$file" ]; then
        echo "Processando $file..."
        
        # Adicionar import se não existir
        if ! grep -q "use ink::storage::traits::StorageLayout" "$file"; then
            # Encontrar a linha com outros imports ink e adicionar após
            sed -i '' '/use ink::/a\
    use ink::storage::traits::StorageLayout;
' "$file"
        fi
        
        # Adicionar derives corretos para structs e enums que precisam
        sed -i '' 's/#\[derive(Debug, Clone, PartialEq, Eq)\]/#[derive(Debug, Clone, PartialEq, Eq, StorageLayout)]/g' "$file"
    fi
done

echo "Correção concluída!"
