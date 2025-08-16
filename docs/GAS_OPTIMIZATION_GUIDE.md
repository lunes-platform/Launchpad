# 🚀 Guia de Otimização de Gas para Contratos ink!

## Visão Geral

Este guia apresenta as melhores práticas para desenvolvimento de contratos ink! eficientes em gas, baseado nas otimizações implementadas no projeto Launchpad Lunes e nas melhores práticas da indústria.

## 🎯 Princípios Fundamentais

### 1. **Gas-First Design**
- Projete pensando em gas desde o início
- Priorize operações de baixo custo
- Minimize acessos ao storage
- Use estruturas de dados eficientes

### 2. **Storage Optimization**
- Separe dados por frequência de acesso
- Use lazy loading para dados raramente acessados
- Prefira tipos primitivos a estruturas complexas
- Implemente compactação de dados

### 3. **Algorithmic Efficiency**
- Prefira O(1) a O(n) sempre que possível
- Valide entradas na ordem de complexidade crescente
- Use early returns para falhas rápidas
- Minimize loops e iterações

## 📊 Técnicas de Otimização

### 1. Estruturas de Dados Eficientes

#### ✅ Use IDs Numéricos
```rust
// ❌ Ineficiente: String IDs
projects: Mapping<String, ProjectInfo>

// ✅ Eficiente: Numeric IDs
projects: Mapping<u64, ProjectInfo>
```

#### ✅ Arrays Fixos vs Strings Dinâmicas
```rust
// ❌ Ineficiente: String dinâmica
pub name: String,

// ✅ Eficiente: Array fixo
pub name: [u8; 64],
```

#### ✅ Enums Compactos
```rust
// ✅ Representação explícita de 1 byte
#[repr(u8)]
pub enum Status {
    Pending = 0,
    Active = 1,
    Completed = 2,
}
```

#### ✅ Flags Bitwise
```rust
// ❌ Múltiplos booleanos
pub is_paused: bool,
pub has_deposit: bool,
pub is_verified: bool,

// ✅ Flags compactas
pub flags: u8,  // 8 estados em 1 byte

// Uso:
const PAUSED_FLAG: u8 = 0x01;
const DEPOSIT_FLAG: u8 = 0x02;
const VERIFIED_FLAG: u8 = 0x04;

fn is_paused(&self) -> bool {
    self.flags & PAUSED_FLAG != 0
}
```

### 2. Storage Layout Otimizado

#### ✅ Lazy Loading
```rust
use ink::storage::Lazy;

#[ink(storage)]
pub struct Contract {
    // Dados frequentes (hot data)
    counter: u64,
    owner: AccountId,
    
    // Dados raros (cold data) - lazy loaded
    config: Lazy<Config>,
    metadata: Mapping<u64, Lazy<Metadata>>,
}
```

#### ✅ Separação por Frequência de Acesso
```rust
// Estrutura principal (dados críticos)
pub struct ProjectCore {
    pub id: u64,
    pub owner: AccountId,
    pub status: Status,
    pub created_at: u64,
}

// Metadados (dados secundários)
pub struct ProjectMetadata {
    pub name: [u8; 64],
    pub description: [u8; 256],
    pub extra_data: Vec<u8>,
}
```

#### ✅ Mapping vs Vec
```rust
// ❌ Busca linear O(n)
approvers: Vec<AccountId>

// ✅ Acesso direto O(1)
approvers: Mapping<AccountId, bool>
```

### 3. Algoritmos Eficientes

#### ✅ Validações Ordenadas
```rust
#[ink(message)]
pub fn expensive_operation(&mut self, data: Vec<u8>) -> Result<()> {
    // 1. Verificações rápidas primeiro
    if data.is_empty() {
        return Err(Error::InvalidInput);
    }
    
    // 2. Verificações de estado
    self.ensure_not_paused()?;
    
    // 3. Verificações de storage
    if self.exists(&key) {
        return Err(Error::AlreadyExists);
    }
    
    // 4. Validações complexas por último
    self.validate_complex_data(&data)?;
    
    // 5. Operações custosas
    self.process_data(data)
}
```

#### ✅ Early Returns
```rust
// ✅ Falha rápida
fn validate_input(&self, input: &Input) -> Result<()> {
    if input.is_empty() { return Err(Error::Empty); }
    if input.len() > MAX_SIZE { return Err(Error::TooLarge); }
    if !input.is_valid() { return Err(Error::Invalid); }
    Ok(())
}
```

#### ✅ Batch Operations
```rust
// ✅ Operações em lote
#[ink(message)]
pub fn batch_update(&mut self, updates: Vec<(u64, Status)>) -> Result<()> {
    // Validar tudo primeiro
    for (id, _) in &updates {
        if !self.projects.contains(id) {
            return Err(Error::NotFound);
        }
    }
    
    // Aplicar todas as mudanças
    for (id, status) in updates {
        let mut project = self.projects.get(&id).unwrap();
        project.status = status;
        self.projects.insert(&id, &project);
    }
    
    Ok(())
}
```

### 4. Minimização de Clones

#### ✅ Referências vs Clones
```rust
// ❌ Clone desnecessário
let project = self.projects.get(&id).unwrap().clone();
process_project(project);

// ✅ Usar referência quando possível
let project = self.projects.get(&id).unwrap();
process_project(&project);
```

#### ✅ Movimentação de Dados
```rust
// ✅ Mover em vez de clonar
fn transfer_ownership(&mut self, from: AccountId, to: AccountId, data: LargeData) {
    self.owners.remove(&from);
    self.owners.insert(&to, &data); // Move, não clona
}
```

### 5. Otimizações de Tipos

#### ✅ Tipos Primitivos
```rust
// ✅ Prefira tipos primitivos
pub timestamp: u64,      // vs SystemTime
pub amount: u128,        // vs BigDecimal
pub count: u32,          // vs usize quando apropriado
```

#### ✅ Packed Structs
```rust
// ✅ Estrutura compacta e alinhada
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CompactData {
    pub id: u64,           // 8 bytes
    pub owner: AccountId,  // 32 bytes
    pub amount: u128,      // 16 bytes
    pub timestamp: u64,    // 8 bytes
    pub status: u8,        // 1 byte
    pub flags: u8,         // 1 byte
    // Total: 66 bytes (bem alinhado)
}
```

## 🔍 Ferramentas de Análise

### 1. Medição de Gas
```rust
#[cfg(test)]
mod gas_tests {
    use super::*;
    
    #[ink::test]
    fn measure_gas_usage() {
        let mut contract = Contract::new();
        
        // Medir gas antes
        let gas_before = ink::env::test::recorded_gas_consumption();
        
        // Operação a ser medida
        let result = contract.expensive_operation();
        
        // Medir gas depois
        let gas_after = ink::env::test::recorded_gas_consumption();
        let gas_used = gas_after - gas_before;
        
        println!("Gas usado: {}", gas_used);
        assert!(gas_used < MAX_EXPECTED_GAS);
    }
}
```

### 2. Profiling de Storage
```rust
// Contar acessos ao storage
fn profile_storage_access(&self) -> (u32, u32) {
    let reads = self.storage_reads_count();
    let writes = self.storage_writes_count();
    (reads, writes)
}
```

### 3. Benchmarking Automatizado
```bash
#!/bin/bash
# Script para benchmark automático

cargo test --release bench_ -- --nocapture | grep "Gas usado" > gas_report.txt
```

## 📋 Checklist de Otimização

### Estruturas de Dados
- [ ] IDs numéricos em vez de strings
- [ ] Arrays fixos para dados de tamanho limitado
- [ ] Enums com representação explícita
- [ ] Flags bitwise para múltiplos booleanos
- [ ] Estruturas alinhadas e compactas

### Storage
- [ ] Lazy loading para dados raramente acessados
- [ ] Separação por frequência de acesso
- [ ] Mapping para acesso O(1)
- [ ] Minimização de campos de storage

### Algoritmos
- [ ] Validações em ordem de complexidade
- [ ] Early returns para falhas
- [ ] Operações em lote quando apropriado
- [ ] Minimização de loops

### Tipos e Memória
- [ ] Tipos primitivos quando possível
- [ ] Minimização de clones
- [ ] Referências em vez de ownership
- [ ] Estruturas packed

## 🎯 Padrões Recomendados

### 1. Padrão Core + Metadata
```rust
// Dados principais (acesso frequente)
pub struct EntityCore {
    pub id: u64,
    pub owner: AccountId,
    pub status: u8,
    pub created_at: u64,
}

// Metadados (acesso raro)
pub struct EntityMetadata {
    pub name: [u8; 64],
    pub description: [u8; 256],
    pub extra: Vec<u8>,
}

#[ink(storage)]
pub struct Contract {
    entities: Mapping<u64, EntityCore>,
    metadata: Mapping<u64, Lazy<EntityMetadata>>,
}
```

### 2. Padrão de Validação Eficiente
```rust
fn validate_and_execute(&mut self, input: Input) -> Result<()> {
    // 1. Validações rápidas
    self.quick_validations(&input)?;
    
    // 2. Verificações de estado
    self.state_checks()?;
    
    // 3. Validações de storage
    self.storage_validations(&input)?;
    
    // 4. Execução
    self.execute(input)
}
```

### 3. Padrão de Acesso Lazy
```rust
fn get_metadata(&self, id: u64) -> Result<EntityMetadata> {
    self.metadata
        .get(&id)
        .and_then(|lazy| lazy.get())
        .ok_or(Error::NotFound)
}
```

## 🚨 Armadilhas Comuns

### ❌ Evite
```rust
// String IDs
projects: Mapping<String, Project>

// Clones desnecessários
let data = self.data.clone();

// Loops desnecessários
for item in large_vec.iter() {
    if item.id == target_id {
        return Some(item);
    }
}

// Validações custosas primeiro
fn validate(&self, data: &LargeData) -> Result<()> {
    self.expensive_validation(data)?;  // ❌ Custoso primeiro
    if data.is_empty() {               // ❌ Rápido depois
        return Err(Error::Empty);
    }
    Ok(())
}
```

### ✅ Prefira
```rust
// IDs numéricos
projects: Mapping<u64, Project>

// Referências
let data = &self.data;

// Acesso direto
self.index.get(&target_id)

// Validações rápidas primeiro
fn validate(&self, data: &LargeData) -> Result<()> {
    if data.is_empty() {               // ✅ Rápido primeiro
        return Err(Error::Empty);
    }
    self.expensive_validation(data)?;  // ✅ Custoso depois
    Ok(())
}
```

## 📊 Métricas de Sucesso

### KPIs de Performance
- **Tamanho do Contrato**: < 50KB
- **Gas por Transação**: Redução de 30%+
- **Tempo de Execução**: < 100ms
- **Storage Efficiency**: < 10 campos principais

### Monitoramento Contínuo
- Dashboard de gas em tempo real
- Alertas para degradação de performance
- Benchmarks automatizados no CI/CD
- Profiling regular de hotspots

---

**💡 Lembre-se**: Otimização é um processo contínuo. Meça, otimize, valide e repita!
