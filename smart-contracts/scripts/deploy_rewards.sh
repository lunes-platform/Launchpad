#!/bin/bash

# Deploy Script para RewardSystem
# Uso: ./deploy_rewards.sh [testnet|mainnet] [MARKETING_FUND_ADDRESS]

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuração
NETWORK=${1:-testnet}
MARKETING_FUND=${2:-"5FjB6FkU6p7q7wQ7wQ7wQ7wQ7wQ7wQ7wQ7wQ7wQ7wQ7wQ"}

# Endpoints Lunes
LUNES_TESTNET="wss://ws-test.lunes.io"
LUNES_MAINNET_PRIMARY="wss://ws.lunes.io"

if [ "$NETWORK" = "mainnet" ]; then
  WS_ENDPOINT=$LUNES_MAINNET_PRIMARY
  echo -e "${YELLOW}🚀 Deploying RewardSystem to Lunes Mainnet...${NC}"
else
  WS_ENDPOINT=$LUNES_TESTNET
  echo -e "${GREEN}🧪 Deploying RewardSystem to Lunes Testnet...${NC}"
fi
echo -e "Endpoint: $WS_ENDPOINT"

# Verificar cargo-contract
if ! command -v cargo-contract &>/dev/null; then
  echo -e "${RED}❌ cargo-contract não está instalado!${NC}"
  echo "Instale com: cargo install cargo-contract"
  exit 1
fi

# Build do contrato RewardSystem (crate separado)
echo -e "${YELLOW}📦 Building RewardSystem...${NC}"
cargo contract build --release --manifest-path contracts/reward_system/Cargo.toml

# Artefatos esperados do crate reward_system
CONTRACT_NAME="reward_system"
ARTIFACT_DIR="contracts/reward_system/target/ink"
WASM_PATH="${ARTIFACT_DIR}/${CONTRACT_NAME}.wasm"
METADATA_PATH="${ARTIFACT_DIR}/${CONTRACT_NAME}.json"

if [ ! -f "$WASM_PATH" ] || [ ! -f "$METADATA_PATH" ]; then
  echo -e "${RED}❌ Artefatos do RewardSystem não encontrados em target/ink/.${NC}"
  echo "Certifique-se de que o RewardSystem está declarado como contrato ink! no Cargo.toml e que o nome do artefato confere."
  exit 1
fi

echo -e "${YELLOW}🔍 Dry-run instantiate...${NC}"
cargo contract instantiate \
  --url "$WS_ENDPOINT" \
  --contract "$WASM_PATH" \
  --constructor new \
  --args "$MARKETING_FUND" \
  --suri //Alice \
  --value 0 \
  --gas 200000000000 \
  --dry-run

read -p $'Continuar com o deploy? (y/n) ' CONFIRM
if [ "$CONFIRM" != "y" ]; then
  echo -e "${RED}Cancelado.${NC}"
  exit 0
fi

echo -e "${GREEN}🚀 Deploying...${NC}"
OUTPUT=$(cargo contract instantiate \
  --url "$WS_ENDPOINT" \
  --contract "$WASM_PATH" \
  --constructor new \
  --args "$MARKETING_FUND" \
  --suri //Alice \
  --value 0 \
  --gas 200000000000 2>&1)

echo "$OUTPUT"
CONTRACT_ADDRESS=$(echo "$OUTPUT" | grep -o "5[a-zA-Z0-9]\+")

mkdir -p deployments
INFO_FILE="deployments/rewards_${NETWORK}_$(date +%Y%m%d_%H%M%S).json"
cat > "$INFO_FILE" <<EOF
{
  "network": "$NETWORK",
  "endpoint": "$WS_ENDPOINT",
  "contract_address": "$CONTRACT_ADDRESS",
  "marketing_fund": "$MARKETING_FUND",
  "wasm": "${WASM_PATH}",
  "metadata": "${METADATA_PATH}",
  "deployed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo -e "${GREEN}✅ Done. Info: $INFO_FILE${NC}"
