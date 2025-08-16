
# Documento de Requisitos de Software: Launchpad Lunes (Arquitetura On-Chain)

**Versão:** 2.0
**Data:** (Data Atual)
**Autor:** Equipe Lunes

## 1. Introdução

### 1.1. Propósito
... (sem alteração)

### 1.2. Escopo do Produto
A Launchpad Lunes permitirá que projetos realizem ofertas iniciais de tokens (IDOs) através de várias fases. Toda a lógica de negócio, gerenciamento de fases, pagamentos e distribuição de tokens será executada de forma descentralizada através de **smart contracts desenvolvidos em ink! 5.x** na blockchain Lunes. A plataforma suportará pagamentos em LUNES e em USDT (via redes TON e Solana), cujas transações serão verificadas on-chain por meio de um sistema de **oráculos ou pontes (bridges)**.

### 1.3. Definições, Acrônimos e Abreviações
* ... (sem alteração)

### 1.4. Metodologia de Desenvolvimento
O desenvolvimento de todos os componentes (Smart Contracts e Frontend) seguirá a metodologia de **Desenvolvimento Orientado a Testes (TDD)** para garantir a máxima qualidade e segurança.

## 2. Descrição Geral

### 2.1. Perspectiva do Produto
... (sem alteração)

### 2.2. Funções do Produto (Visão Geral)
* Gerenciamento on-chain das fases de lançamento (Whitelist, Pré-venda, Venda, Launchpool, Loteria).
* Pagamentos em LUNES (nativo) e USDT (cross-chain via oráculos).
* Gerenciamento de tesouraria e custódia de tokens via smart contracts.
* ... (restante sem alteração)

### 2.3. Características dos Usuários
... (sem alteração)

### 2.4. Restrições Gerais
* ... (sem alteração)

### 2.5. Suposições e Dependências
* Existência de **oráculos ou pontes (bridges) confiáveis** para verificar pagamentos em USDT nas redes TON e Solana e submeter provas válidas aos smart contracts na rede Lunes.
* ... (restante sem alteração)

3. Requisitos Específicos

3.1. Requisitos Funcionais (RF)

### 3.1.1. Módulo de Gerenciamento de Projetos (Frontend Admin e Smart Contracts)
- **RF-ADM-001**: O sistema deve permitir que Administradores (contas com `ADMIN_ROLE`) configurem novos projetos através de transações para o smart contract de registro, definindo parâmetros como metadados, tokenomics, e opções de pagamento (LUNES, USDT-TON, USDT-Solana).
- **RF-ADM-002**: O sistema deve permitir que Administradores configurem as fases de cada projeto (Whitelist, Venda, etc.) e o cronograma de vesting diretamente nos smart contracts.
* ...

### 3.1.2. Módulo de Interação do Usuário (Frontend)
*   RF-USR-005: O sistema deve permitir que usuários participem da Venda enviando tokens de pagamento (**LUNES diretamente para o smart contract; USDT para endereços específicos em TON/Solana, com a transação sendo posteriormente verificada on-chain**).
*   **(NOVO) RF-USR-010: O frontend deve exibir os endereços de depósito para USDT (TON/Solana) e instruções claras para o usuário.**
* ...

### 3.1.3. Módulo de Smart Contracts (ink! 5.x - Rede Lunes)
* ...
*   RF-SC-002 (IDO/Venda SC - Lunes):
    * ...
    *   **Deve ter uma função `register_external_contribution` que só pode ser chamada por um oráculo confiável. Esta função receberá uma prova de pagamento (ex: hash da transação, valor, endereço do comprador) e registrará a contribuição em USDT.**
    * ...
*   **(NOVO) RF-SC-005 (Treasury SC - Lunes):**
    * ...
    *   **RF-SC-005.2: Deve ter uma função `process_external_funds` (chamável por oráculo) para registrar o recebimento de fundos equivalentes em USDT, baseada em provas válidas.**
    * ...
* ...

### 3.1.4. Módulo de Oráculos e Integração Cross-Chain
- **RF-ORC-001**: Um ou mais serviços de oráculo (off-chain) devem monitorar as redes TON e Solana para confirmação de pagamentos em USDT nos endereços designados.
- **RF-ORC-002**: Após a confirmação de um pagamento em USDT, o oráculo deve construir uma prova assinada e submetê-la à função `register_external_contribution` ou `process_external_funds` no smart contract correspondente na rede Lunes.
- **RF-ORC-003**: O smart contract deve validar a assinatura do oráculo e a integridade da prova antes de registrar a contribuição.

**(REMOVIDO) Seção 3.1.5 e 3.1.6**

3.2. Requisitos Não Funcionais (RNF)
### 3.2.1. Segurança (RNF-SEG)
* RNF-SEG-001: Todos os smart contracts devem ser auditados...
* (NOVO) RNF-SEG-006: Deve haver um processo seguro para o gerenciamento das chaves privadas dos oráculos e das carteiras que receberão USDT nas redes TON e Solana.
* (NOVO) RNF-SEG-007: A comunicação entre o oráculo e os smart contracts Lunes deve ser resistente a ataques de replay, utilizando nonces ou timestamps.

### 3.2.2. Desempenho (RNF-DES)
     *   ...(sem alteração)

  **3.2.3. Escalabilidade (RNF-ESC)**
     *   ...(sem alteração)

  **3.2.4. Usabilidade (RNF-USA)**
     *   RNF-USA-001: ... **O processo de pagamento com USDT em diferentes redes deve ser claro, com instruções precisas sobre endereços e confirmações.**
     *   ...

### 3.2.5. Confiabilidade e Disponibilidade (RNF-CON)
* ...(sem alteração)
* **(NOVO) RNF-CON-004: O sistema de oráculos de monitoramento de pagamentos nas redes TON e Solana deve ser altamente confiável e resiliente para evitar perda de registros de contribuição.**

### 3.2.6. Manutenibilidade (RNF-MAN)
* RNF-MAN-001: O código dos smart contracts e do frontend deve ser bem documentado... **A adoção de TDD auxiliará na manutenibilidade e na redução de regressões.**
* ...

## 3.3. Requisitos de Interface Externa
* ...
* (NOVO) RIE-005 (Rede TON): O sistema de oráculos deve interagir com nós da rede TON para monitorar transações de USDT.
* (NOVO) RIE-006 (Rede Solana): O sistema de oráculos deve interagir com nós da rede Solana para monitorar transações de USDT (SPL Token).

## 4. Arquitetura e Stack Tecnológico
* **Lógica de Negócio**: Smart Contracts ink! 5.x
* **Frontend**: Monorepo com React, Vite e PNPM.
* **Integração Cross-Chain**: Serviços de Oráculo (a serem definidos, ex: Chainlink, Acurast, ou um serviço customizado).
* ...

## 5. Critérios de Aceitação (Exemplos de Alto Nível)
* Um usuário pode pagar por uma alocação usando LUNES, ou USDT (TON/Solana), e o sistema (via oráculo) registra corretamente a contribuição no smart contract.
* ...
* (REMOVIDO) Critério sobre API para Fundo de Investimento.

## 6. Riscos e Desafios (Preliminares)
* Complexidade da gestão de fundos multi-chain e da segurança dos oráculos.
* Sincronização e atomicidade entre o pagamento em uma rede externa e o registro on-chain na rede Lunes via oráculo.
* ...
* (REMOVIDO) Riscos sobre a segurança da API.

## 7. Considerações Futuras (Pós-MVP)
* Automatização completa da ponte de fundos USDT (TON/Solana) para a rede Lunes.
* ...
* Mecanismos de "dispute resolution" para pagamentos não confirmados ou problemas de transação entre redes, possivelmente envolvendo múltiplos oráculos.

