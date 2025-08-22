# Plano de Implementação On-Chain e Frontend do Launchpad

Este documento detalha o plano de reconstrução e desenvolvimento do Launchpad Lunes, com foco total na lógica de negócio on-chain e na sua respectiva implementação no frontend.

## Fase 1: Reset Estratégico e Limpeza (Concluída)

- [x] Eliminar a dependência de um backend Python/FastAPI.
- [x] Remover arquivos de contrato antigos e inconsistentes.
- [x] Limpar e reestruturar o `lib.rs` e `Cargo.toml` do workspace.
- [x] Recriar o `implementation_base.rs` com uma estrutura limpa e compatível com `ink!` 5.
- [x] Alcançar uma compilação bem-sucedida e passar os testes básicos.

## Fase 2: Reconstrução dos Contratos Core e Integração LUSDT

- [ ] **Tarefa 2.1:** Recriar o `proxy_contract.rs`.
    - [ ] Implementar a lógica de delegação (`fallback`).
    - [ ] Definir o storage para o `implementation_address` e `admin`.
    - [ ] Adicionar funções para upgrade (propor e executar).
    - [ ] Escrever testes de unidade para a lógica de delegação e upgrade.
- [ ] **Tarefa 2.2:** Recriar o `token_custody_system.rs`.
    - [ ] Definir as `structs` de armazenamento (`ProjectTokenDeposit`, `BuyerAllocation`) usando `#[ink::storage_item]`.
    - [ ] Implementar a função `deposit_project_tokens`.
    - [ ] Implementar a função `record_token_purchase` para aceitar pagamentos em tokens PSP22 (LUSDT).
    - [ ] Escrever testes de unidade (TDD) para o fluxo de custódia e compra com LUSDT.
- [ ] **Tarefa 2.3:** Integrar `proxy` e `implementation` para gerenciamento de estado.
    - [ ] Adicionar o `Mapping` de `projects` ao storage do `proxy_contract`.
    - [ ] Modificar o `implementation_base` para fazer chamadas cross-contract para o proxy para ler e escrever estado.
    - [ ] Escrever testes de integração para o fluxo de registro de projeto através do proxy.

## Fase 3: Módulo de Votação e Listagem na DEX

- [ ] **Tarefa 3.1:** Criar o módulo `listing_voting.rs`.
    - [ ] Definir a lógica e o storage para a fase de votação de um projeto.
    - [ ] Implementar a interface para interagir com o contrato de `staking` da Lunex.
- [ ] **Tarefa 3.2:** Implementar o fluxo de criação e execução de propostas.
    - [ ] Função para iniciar a votação (chamando `create_proposal` na Lunex).
    - [ ] Função para verificar o status da votação.
    - [ ] Função para finalizar a fase de votação com base no resultado.
- [ ] **Tarefa 3.3:** Escrever testes de unidade (TDD) para o módulo de votação.

## Fase 4: Criação do Pool de Liquidez

- [ ] **Tarefa 4.1:** Implementar a lógica de adição de liquidez.
    - [ ] Definir a alocação de fundos (LUSDT e token do projeto).
    - [ ] Implementar a chamada para `add_liquidity` no `Router` da Lunex.
- [ ] **Tarefa 4.2:** Escrever testes de unidade (TDD) para a criação do pool.

## Fase 5: Desenvolvimento da Interface (Frontend)

- [ ] **Tarefa 5.1:** Configuração do SDK Web3 e Conexão com Contratos.
    - [ ] Criar um pacote `@monorepo/sdk` para gerenciar ABIs e interações com os contratos.
    - [ ] Implementar a lógica de conexão com carteiras (ex: Polkadot.js, Talisman).
    - [ ] Configurar os endereços dos contratos (Proxy) em um arquivo de ambiente.
- [ ] **Tarefa 5.2:** Implementar o Fluxo de Registro de Projeto.
    - [ ] Criar a página e o formulário para submissão de novos projetos.
    - [ ] Integrar o formulário com a função `register_project` do smart contract.
- [ ] **Tarefa 5.3:** Implementar o Fluxo de Investimento.
    - [ ] Na página de detalhes do projeto, criar o componente de investimento.
    - [ ] Implementar a lógica para aprovar o LUSDT e chamar a função `record_token_purchase`.
    - [ ] Exibir o saldo de tokens adquiridos pelo usuário.
- [ ] **Tarefa 5.4:** Implementar a Interface de Governança (Votação).
    - [ ] Criar uma página de "Governança" para listar as propostas de listagem.
    - [ ] Permitir que usuários com poder de voto (`staking`) votem nas propostas.
    - [ ] Exibir o resultado das votações.
- [ ] **Tarefa 5.5:** Atualizar a UI com Status On-Chain.
    - [ ] Refatorar o `ProjectCard` e a página de detalhes para exibir dados reais dos contratos (progresso, status, etc.).
    - [ ] Adicionar indicadores visuais para cada fase do projeto (Arrecadação, Votação, Liquidez, etc.).

## Fase 6: Testes Finais e Documentação

- [ ] **Tarefa 6.1:** Escrever testes de integração (E2E) para o ciclo de vida completo de um projeto (Frontend + Smart Contract).
- [ ] **Tarefa 6.2:** Atualizar toda a documentação do projeto.
- [ ] **Tarefa 6.3:** Realizar uma revisão final de segurança com base no `SECURITY_CHECKLIST.md`.
