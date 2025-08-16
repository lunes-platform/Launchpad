#!/bin/bash

# Script para adicionar StorageLayout derives para todas as estruturas que precisam

echo "Adicionando StorageLayout derives..."

# Lista de arquivos e estruturas que precisam do derive
declare -A files_structs=(
    ["migration_system.rs"]="MigrationRecord"
    ["compatibility_layer.rs"]="VersionConfig"
    ["proxy_monitoring.rs"]="HealthStatus AlertThresholds"
    ["token_custody_system.rs"]="ProjectTokenDeposit BuyerAllocation AirdropCampaign"
    ["governance_system.rs"]="VotingSession VoterSubmission VoterProfile ReputationWeight ProjectPerformance SuccessMetrics VerificationStatus SybilScore"
    ["web3_connection_tdd.rs"]="WalletSession KYCThresholds"
)

for file in "${!files_structs[@]}"; do
    if [ -f "$file" ]; then
        echo "Processando $file..."
        structs=${files_structs[$file]}
        
        for struct in $structs; do
            echo "  Adicionando StorageLayout para $struct"
            
            # Procurar pela definição da struct e adicionar o derive
            sed -i '' "/pub struct $struct {/i\\
#[cfg_attr(feature = \"std\", derive(ink::storage::traits::StorageLayout))]
" "$file"
            
            # Também para enums
            sed -i '' "/pub enum $struct {/i\\
#[cfg_attr(feature = \"std\", derive(ink::storage::traits::StorageLayout))]
" "$file"
        done
    fi
done

echo "StorageLayout derives adicionados!"
