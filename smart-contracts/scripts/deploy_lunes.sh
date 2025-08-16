#!/bin/bash

# Deploy Script para Rede Lunes
# Uso: ./deploy_lunes.sh [testnet|mainnet]

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuração de rede
NETWORK=${1:-testnet}

# Endpoints Lunes
LUNES_TESTNET="wss://ws-test.lunes.io"
LUNES_MAINNET_PRIMARY="wss://ws.lunes.io"
LUNES_MAINNET_BACKUP1="wss://ws-lunes-main-01.lunes.io"
LUNES_MAINNET_BACKUP2="wss://ws-lunes-main-02.lunes.io"

# Selecionar endpoint
if [ "$NETWORK" = "mainnet" ]; then
    WS_ENDPOINT=$LUNES_MAINNET_PRIMARY
    echo -e "${YELLOW}🚀 Deploying to Lunes Mainnet...${NC}"
    echo -e "${YELLOW}Primary endpoint: $WS_ENDPOINT${NC}"
else
    WS_ENDPOINT=$LUNES_TESTNET
    echo -e "${GREEN}🧪 Deploying to Lunes Testnet...${NC}"
    echo -e "${GREEN}Endpoint: $WS_ENDPOINT${NC}"
fi

# Verificar se cargo-contract está instalado
if ! command -v cargo-contract &> /dev/null; then
    echo -e "${RED}❌ cargo-contract não está instalado!${NC}"
    echo "Instale com: cargo install cargo-contract"
    exit 1
fi

# Build do contrato
echo -e "\n${YELLOW}📦 Building contract...${NC}"
cargo contract build --release

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Obter informações do contrato
CONTRACT_NAME="phases_system_lunes"
WASM_PATH="target/ink/${CONTRACT_NAME}.wasm"
METADATA_PATH="target/ink/${CONTRACT_NAME}.json"

# Verificar arquivos
if [ ! -f "$WASM_PATH" ]; then
    echo -e "${RED}❌ WASM file not found at $WASM_PATH${NC}"
    exit 1
fi

if [ ! -f "$METADATA_PATH" ]; then
    echo -e "${RED}❌ Metadata file not found at $METADATA_PATH${NC}"
    exit 1
fi

# Tamanho do contrato
WASM_SIZE=$(du -h "$WASM_PATH" | cut -f1)
echo -e "${GREEN}✅ Contract built successfully!${NC}"
echo -e "   Size: $WASM_SIZE"

# Parâmetros do construtor
ADMIN_ACCOUNT=${ADMIN_ACCOUNT:-"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"}
PLATFORM_FEE=${PLATFORM_FEE:-250} # 2.5%

echo -e "\n${YELLOW}📝 Constructor parameters:${NC}"
echo -e "   Admin: $ADMIN_ACCOUNT"
echo -e "   Platform Fee: $PLATFORM_FEE ($(echo "scale=1; $PLATFORM_FEE/100" | bc)%)"

# Deploy
echo -e "\n${YELLOW}🚀 Deploying contract...${NC}"

# Criar comando de deploy
DEPLOY_CMD="cargo contract instantiate \
    --url $WS_ENDPOINT \
    --contract $WASM_PATH \
    --constructor new \
    --args $ADMIN_ACCOUNT $PLATFORM_FEE \
    --suri //Alice \
    --value 0 \
    --gas 200000000000 \
    --proof-size 2097152"

# Modo dry-run primeiro
echo -e "\n${YELLOW}🔍 Running dry-run...${NC}"
eval "$DEPLOY_CMD --dry-run"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Dry-run failed!${NC}"
    exit 1
fi

# Perguntar confirmação
echo -e "\n${YELLOW}Continue with deployment? (y/n)${NC}"
read -r CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo -e "${RED}❌ Deployment cancelled${NC}"
    exit 0
fi

# Deploy real
echo -e "\n${GREEN}🚀 Executing deployment...${NC}"
DEPLOY_OUTPUT=$(eval "$DEPLOY_CMD" 2>&1)

# Extrair endereço do contrato
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -o "Contract.*" | grep -o "5[a-zA-Z0-9]*")

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo -e "${RED}❌ Failed to extract contract address${NC}"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

# Salvar informações do deploy
DEPLOY_INFO="smart-contracts/deployments/lunes_${NETWORK}_$(date +%Y%m%d_%H%M%S).json"
mkdir -p smart-contracts/deployments

cat > "$DEPLOY_INFO" << EOF
{
  "network": "$NETWORK",
  "endpoint": "$WS_ENDPOINT",
  "contract_address": "$CONTRACT_ADDRESS",
  "admin": "$ADMIN_ACCOUNT",
  "platform_fee": $PLATFORM_FEE,
  "deployed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "wasm_hash": "$(sha256sum $WASM_PATH | cut -d' ' -f1)",
  "contract_size": "$WASM_SIZE"
}
EOF

echo -e "\n${GREEN}✅ Contract deployed successfully!${NC}"
echo -e "${GREEN}📍 Contract Address: $CONTRACT_ADDRESS${NC}"
echo -e "${GREEN}📄 Deploy info saved to: $DEPLOY_INFO${NC}"

# Verificar contrato na chain
echo -e "\n${YELLOW}🔍 Verifying contract on chain...${NC}"

# Criar script de verificação
cat > "verify_contract.js" << 'EOF'
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { ContractPromise } = require('@polkadot/api-contract');

async function main() {
    const provider = new WsProvider(process.argv[2]);
    const api = await ApiPromise.create({ provider });
    
    const contractAddress = process.argv[3];
    const metadata = require(process.argv[4]);
    
    const contract = new ContractPromise(api, metadata, contractAddress);
    
    // Verificar se o contrato existe
    const contractInfo = await api.query.contracts.contractInfoOf(contractAddress);
    
    if (contractInfo.isSome) {
        console.log('✅ Contract verified on chain!');
        console.log('Contract Info:', contractInfo.toHuman());
    } else {
        console.log('❌ Contract not found on chain');
    }
    
    await api.disconnect();
}

main().catch(console.error);
EOF

# Executar verificação se node estiver disponível
if command -v node &> /dev/null && [ -f "package.json" ]; then
    node verify_contract.js "$WS_ENDPOINT" "$CONTRACT_ADDRESS" "$METADATA_PATH"
fi

rm -f verify_contract.js

echo -e "\n${GREEN}🎉 Deployment complete!${NC}"
