# 🚀 Sistema de Pagamentos Unificado - Launchpad Lunes (Ecossistema Lunes)

## ✅ **Visão Geral Simplificada**

O sistema de pagamentos do Launchpad Lunes será **exclusivamente focado no ecossistema Lunes**, utilizando a moeda nativa **LUNES** e a stablecoin **LUSDT** como os únicos meios de pagamento para participação nos projetos.

Esta abordagem elimina a complexidade e os riscos de segurança associados a pontes cross-chain e oráculos, resultando em um sistema mais **seguro, eficiente e robusto**.

## ⛓️ **Ativos Suportados**

1.  **LUNES (Nativo):**
    - **Uso:** Pagamento de taxas de transação e, opcionalmente, para participação em projetos que optem por aceitar a moeda nativa.
    - **Integração:** Direta, via `transferred_value` nas chamadas de contrato.

2.  **LUSDT (Token PSP22):**
    - **Uso:** Principal moeda para investimento nos projetos do Launchpad, oferecendo estabilidade de valor.
    - **Integração:** A interação será feita através da interface padrão de tokens **PSP22**, utilizando chamadas `transfer_from` após o usuário `approve` (aprovar) o gasto.

## 🏛️ **Arquitetura On-Chain**

A lógica de pagamento é totalmente contida dentro dos smart contracts do Launchpad, sem dependências externas.

1.  **Contrato de Implementação (`implementation_base.rs`):**
    - Define as regras de cada projeto, incluindo qual ativo (`LUNES` ou `LUSDT`) será aceito para a venda de tokens.

2.  **Contrato de Custódia (`token_custody_system.rs`):**
    - **Recebe e armazena** os fundos (LUNES ou LUSDT) pagos pelos investidores de forma segura durante as fases de venda.
    - **Gerencia a liberação** dos fundos para o projeto (em caso de sucesso) ou o reembolso para os investidores (em caso de falha).

3.  **Contrato Proxy (`proxy_contract.rs`):**
    - Atua como o ponto de entrada único e estável para todas as interações, garantindo que o estado (como os saldos em custódia) seja preservado durante as atualizações da lógica de negócio.

## 🔄 **Fluxo de Pagamento (Exemplo com LUSDT)**

1.  **Aprovação (Approval):** O investidor, através da interface do dApp, faz uma chamada ao contrato LUSDT para `approve` (aprovar) que o `Contrato de Custódia` possa gastar a quantia que ele deseja investir.
2.  **Investimento:** O investidor interage com o `Contrato Proxy`, que delega a chamada para o `Contrato de Implementação`. A função de investimento é executada.
3.  **Transferência:** O `Contrato de Implementação` chama o `Contrato de Custódia`. Este, por sua vez, chama `transfer_from` no contrato LUSDT para transferir os fundos aprovados da carteira do investidor para o endereço do `Contrato de Custódia`.
4.  **Registro:** A alocação de tokens do projeto para o investidor é registrada no estado do contrato.
5.  **Custódia:** Os fundos LUSDT permanecem seguros no `Contrato de Custódia` até o final da venda.

## 🛡️ **Vantagens da Simplificação**

-   **Segurança Aumentada:** Elimina completamente os vetores de ataque relacionados a pontes cross-chain e manipulação de oráculos.
-   **Eficiência e Custo Reduzido:** Transações são mais rápidas e baratas, pois ocorrem em uma única rede.
-   **Manutenção Simplificada:** A base de código é menor e menos complexa, facilitando auditorias e futuras atualizações.
-   **Experiência do Usuário (UX) Aprimorada:** O processo de investimento se torna mais direto e intuitivo para os usuários do ecossistema Lunes.
