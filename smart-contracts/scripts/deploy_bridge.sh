#!/bin/bash

# Script de Deploy do Bridge System USDT → LUSDT
# 
# Este script compila e faz deploy do sistema de bridge na rede Lunes
# Inclui validação, testes e configuração pós-deploy

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
CONTRACT_NAME="bridge_system"
BUILD_DIR="target/ink"
DEPLOY_DIR="deployments"

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "Cargo.toml" ]; then
    error "Execute este script no diretório raiz do projeto smart-contracts"
    exit 1
fi

# Função para verificar dependências
check_dependencies() {
    log "Verificando dependências..."
    
    if ! command -v cargo &> /dev/null; then
        error "Cargo não encontrado. Instale Rust primeiro."
        exit 1
    fi
    
    if ! command -v cargo-contract &> /dev/null; then
        error "cargo-contract não encontrado. Instale com: cargo install cargo-contract --force --locked"
        exit 1
    fi
    
    log "✓ Dependências verificadas"
}

# Função para limpar builds anteriores
clean_build() {
    log "Limpando builds anteriores..."
    cargo clean
    log "✓ Build limpo"
}

# Função para compilar o contrato
build_contract() {
    log "Compilando contrato $CONTRACT_NAME..."
    
    # Compilar em modo release
    cargo contract build --release
    
    if [ $? -eq 0 ]; then
        log "✓ Contrato compilado com sucesso"
    else
        error "Falha na compilação do contrato"
        exit 1
    fi
}

# Função para executar testes
run_tests() {
    log "Executando testes do bridge system..."
    
    cargo test bridge_system::tests --lib
    
    if [ $? -eq 0 ]; then
        log "✓ Todos os testes passaram"
    else
        error "Alguns testes falharam"
        exit 1
    fi
}

# Função para validar o contrato
validate_contract() {
    log "Validando contrato..."
    
    # Verificar se o arquivo .contract foi gerado
    if [ ! -f "$BUILD_DIR/$CONTRACT_NAME.contract" ]; then
        error "Arquivo .contract não encontrado"
        exit 1
    fi
    
    # Verificar tamanho do contrato
    CONTRACT_SIZE=$(stat -f%z "$BUILD_DIR/$CONTRACT_NAME.contract" 2>/dev/null || stat -c%s "$BUILD_DIR/$CONTRACT_NAME.contract" 2>/dev/null)
    log "Tamanho do contrato: ${CONTRACT_SIZE} bytes"
    
    if [ "$CONTRACT_SIZE" -gt 5242880 ]; then # 5MB
        warn "Contrato muito grande (${CONTRACT_SIZE} bytes). Considere otimizar."
    fi
    
    log "✓ Contrato validado"
}

# Função para preparar deploy
prepare_deploy() {
    log "Preparando deploy..."
    
    # Criar diretório de deploy se não existir
    mkdir -p "$DEPLOY_DIR"
    
    # Copiar arquivos necessários
    cp "$BUILD_DIR/$CONTRACT_NAME.contract" "$DEPLOY_DIR/"
    cp "$BUILD_DIR/$CONTRACT_NAME.wasm" "$DEPLOY_DIR/"
    cp "$BUILD_DIR/metadata.json" "$DEPLOY_DIR/"
    
    log "✓ Deploy preparado"
}

# Função para mostrar informações do deploy
show_deploy_info() {
    log "=== INFORMAÇÕES DO DEPLOY ==="
    
    echo ""
    echo "📁 Arquivos gerados:"
    echo "  • $DEPLOY_DIR/$CONTRACT_NAME.contract"
    echo "  • $DEPLOY_DIR/$CONTRACT_NAME.wasm"
    echo "  • $DEPLOY_DIR/metadata.json"
    
    echo ""
    echo "🔧 Configurações do Bridge:"
    echo "  • Taxa do Bridge: 1%"
    echo "  • Depósito mínimo: $1 USDT"
    echo "  • Depósito máximo: $1,000,000 USDT"
    echo "  • Limite diário: $10,000,000 USDT"
    echo "  • Multi-sig: 2/3 confirmações"
    echo "  • Timelock: 1 hora"
    
    echo ""
    echo "🌐 Endereços importantes:"
    echo "  • USDT Solana: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    echo "  • LUSDT Lunes: [Será configurado após deploy]"
    
    echo ""
    echo "📋 Próximos passos:"
    echo "  1. Deploy na testnet primeiro"
    echo "  2. Configurar endereços de admin"
    echo "  3. Configurar contrato LUSDT"
    echo "  4. Testar funcionalidades"
    echo "  5. Deploy na mainnet"
    
    echo ""
    log "Deploy concluído com sucesso!"
}

# Função principal
main() {
    echo ""
    log "🚀 Iniciando deploy do Bridge System USDT → LUSDT"
    echo ""
    
    # Verificar argumentos
    if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
        echo "Uso: $0 [testnet|mainnet]"
        echo ""
        echo "Opções:"
        echo "  testnet  - Deploy na testnet (padrão)"
        echo "  mainnet  - Deploy na mainnet"
        echo "  --help   - Mostrar esta ajuda"
        exit 0
    fi
    
    # Definir rede
    NETWORK=${1:-testnet}
    
    if [ "$NETWORK" != "testnet" ] && [ "$NETWORK" != "mainnet" ]; then
        error "Rede inválida. Use 'testnet' ou 'mainnet'"
        exit 1
    fi
    
    info "Rede selecionada: $NETWORK"
    
    # Executar etapas
    check_dependencies
    clean_build
    build_contract
    run_tests
    validate_contract
    prepare_deploy
    show_deploy_info
    
    echo ""
    log "🎉 Deploy do Bridge System concluído!"
    log "Acesse: http://localhost:3000/bridge para testar o portal"
}

# Executar função principal
main "$@"
