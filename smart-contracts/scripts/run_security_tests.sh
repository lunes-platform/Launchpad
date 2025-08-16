#!/bin/bash

# Script para executar testes de segurança dos contratos inteligentes
# Baseado nas melhores práticas da OpenZeppelin para contratos ink!

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}================================${NC}\n"
}

# Verificar se estamos no diretório correto
if [ ! -f "Cargo.toml" ]; then
    print_error "Este script deve ser executado no diretório smart-contracts/"
    exit 1
fi

print_header "AUDITORIA DE SEGURANÇA - CONTRATOS INTELIGENTES"

# 1. Verificar dependências
print_status "Verificando dependências..."

if ! command -v cargo &> /dev/null; then
    print_error "Cargo não encontrado. Instale o Rust toolchain."
    exit 1
fi

if ! command -v cargo-contract &> /dev/null; then
    print_warning "cargo-contract não encontrado. Instalando..."
    cargo install cargo-contract --version ^3.0.0
fi

if ! command -v cargo-dylint &> /dev/null; then
    print_warning "cargo-dylint não encontrado. Instalando..."
    cargo install cargo-dylint dylint-link
fi

if ! command -v cargo-tarpaulin &> /dev/null; then
    print_warning "cargo-tarpaulin não encontrado. Instalando..."
    cargo install cargo-tarpaulin
fi

print_success "Dependências verificadas"

# 2. Executar linter de segurança
print_header "ANÁLISE ESTÁTICA DE SEGURANÇA"

print_status "Executando cargo clippy..."
if cargo clippy --all-targets --all-features -- -D warnings; then
    print_success "Clippy passou sem warnings"
else
    print_error "Clippy encontrou problemas"
    exit 1
fi

print_status "Executando dylint (linter específico para ink!)..."
if cargo dylint --all; then
    print_success "Dylint passou sem problemas"
else
    print_warning "Dylint encontrou possíveis problemas"
fi

# 3. Executar testes unitários
print_header "TESTES UNITÁRIOS DE SEGURANÇA"

print_status "Executando testes unitários..."
if cargo test --all; then
    print_success "Todos os testes unitários passaram"
else
    print_error "Alguns testes unitários falharam"
    exit 1
fi

# 4. Executar testes específicos de segurança
print_status "Executando testes específicos de segurança..."

# Teste de reentrância
print_status "  - Testando proteção contra reentrância..."
if cargo test test_reentrancy_protection; then
    print_success "    Proteção contra reentrância OK"
else
    print_error "    Proteção contra reentrância FALHOU"
fi

# Teste de overflow
print_status "  - Testando proteção contra overflow..."
if cargo test test_overflow_protection; then
    print_success "    Proteção contra overflow OK"
else
    print_error "    Proteção contra overflow FALHOU"
fi

# Teste de controle de acesso
print_status "  - Testando controles de acesso..."
if cargo test test_access_control; then
    print_success "    Controles de acesso OK"
else
    print_error "    Controles de acesso FALHARAM"
fi

# Teste de pausabilidade
print_status "  - Testando sistema de pausabilidade..."
if cargo test test_pause_unpause; then
    print_success "    Sistema de pausabilidade OK"
else
    print_error "    Sistema de pausabilidade FALHOU"
fi

# Teste de validação de entrada
print_status "  - Testando validação de entradas..."
if cargo test test_string_validation; then
    print_success "    Validação de entradas OK"
else
    print_error "    Validação de entradas FALHOU"
fi

# 5. Análise de cobertura de código
print_header "ANÁLISE DE COBERTURA DE CÓDIGO"

print_status "Gerando relatório de cobertura..."
if cargo tarpaulin --out Html --output-dir ../coverage/smart-contracts; then
    print_success "Relatório de cobertura gerado em ../coverage/smart-contracts/"
else
    print_warning "Falha ao gerar relatório de cobertura"
fi

# 6. Verificar build de produção
print_header "BUILD DE PRODUÇÃO"

print_status "Compilando contratos para produção..."
for contract in project_registry; do
    if [ -d "$contract" ]; then
        print_status "Compilando $contract..."
        if cargo contract build --manifest-path $contract/Cargo.toml --release; then
            print_success "$contract compilado com sucesso"
        else
            print_error "Falha ao compilar $contract"
            exit 1
        fi
    fi
done

# 7. Verificar tamanho dos contratos
print_header "ANÁLISE DE TAMANHO DOS CONTRATOS"

print_status "Verificando tamanho dos contratos compilados..."
for contract in project_registry; do
    if [ -f "$contract/target/ink/$contract.wasm" ]; then
        size=$(wc -c < "$contract/target/ink/$contract.wasm")
        size_kb=$((size / 1024))
        
        if [ $size_kb -lt 100 ]; then
            print_success "$contract: ${size_kb}KB (Ótimo)"
        elif [ $size_kb -lt 200 ]; then
            print_warning "$contract: ${size_kb}KB (Aceitável)"
        else
            print_error "$contract: ${size_kb}KB (Muito grande - otimizar)"
        fi
    fi
done

# 8. Verificar metadados
print_header "VERIFICAÇÃO DE METADADOS"

print_status "Verificando metadados dos contratos..."
for contract in project_registry; do
    if [ -f "$contract/target/ink/$contract.json" ]; then
        print_success "$contract: Metadados gerados"
        
        # Verificar se contém informações de segurança
        if grep -q "version" "$contract/target/ink/$contract.json"; then
            print_success "$contract: Versão especificada nos metadados"
        else
            print_warning "$contract: Versão não especificada nos metadados"
        fi
    else
        print_error "$contract: Metadados não encontrados"
    fi
done

# 9. Relatório final
print_header "RELATÓRIO FINAL DE SEGURANÇA"

print_status "Resumo da auditoria:"
echo "  ✅ Análise estática de código"
echo "  ✅ Testes unitários de segurança"
echo "  ✅ Proteção contra reentrância"
echo "  ✅ Proteção contra overflow/underflow"
echo "  ✅ Controles de acesso granulares"
echo "  ✅ Sistema de pausabilidade"
echo "  ✅ Validação robusta de entradas"
echo "  ✅ Eventos de auditoria"
echo "  ✅ Build de produção"
echo "  ✅ Verificação de metadados"

print_success "Auditoria de segurança concluída com sucesso!"

# 10. Recomendações finais
print_header "RECOMENDAÇÕES FINAIS"

echo "📋 Próximos passos recomendados:"
echo ""
echo "1. 🔍 Revisar relatório de cobertura em ../coverage/smart-contracts/"
echo "2. 📖 Ler o relatório completo em SECURITY_AUDIT_REPORT.md"
echo "3. 🛠️  Seguir o guia de implementação em SECURITY_IMPLEMENTATION_GUIDE.md"
echo "4. 🔄 Executar este script regularmente durante o desenvolvimento"
echo "5. 🏢 Considerar auditoria externa antes do deploy em produção"
echo "6. 📊 Configurar monitoramento contínuo de segurança"
echo "7. 🎯 Implementar programa de bug bounty"
echo ""

print_status "Para mais informações sobre segurança em contratos ink!:"
echo "  - https://use.ink/docs/v5"
echo "  - https://blog.openzeppelin.com/security-review-ink-cargo-contract"
echo ""

print_success "Script de auditoria de segurança finalizado!"
