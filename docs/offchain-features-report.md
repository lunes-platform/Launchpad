# Relatório de Funcionalidades para Camada Off-Chain

Com base na análise da estrutura de arquivos do frontend (`frontend/apps/showcase`), este documento detalha as funcionalidades que são candidatas ideais para uma implementação off-chain, mantendo as regras de negócio críticas no smart contract.

O objetivo é usar um serviço de backend para melhorar a performance, a experiência do usuário e reduzir custos de transação (gás), sem comprometer a segurança e a descentralização da lógica principal.

### 1. Gerenciamento de Metadados de Projetos

- **Páginas Relevantes**: `CreateProjectPage.tsx`, `EditProjectPage.tsx`, `ProjectDetailPage.tsx`.
- **Dados para Off-Chain**:
    - Nome, descrição longa, e slogan do projeto.
    - Imagens (logo do projeto, banner).
    - Links para redes sociais (Twitter, Telegram, site oficial).
    - Documentos, imagens, vídeos, etc.
- **Justificativa**: Armazenar dados grandes e estáticos na blockchain é caro e ineficiente. O backend pode armazenar esses dados e fornecer um URI único para ser salvo no contrato.

### 2. Agregação de Dados e Análises

- **Páginas Relevantes**: `AnalyticsPage.tsx`, `InvestorRankingPage.tsx`, `DashboardPage.tsx`, `HomePage.tsx`.
- **Dados para Off-Chain**:
    - **Estatísticas da Plataforma**: Volume total investido, número total de projetos, total de participantes.
    - **Rankings**: Lista dos maiores investidores ou participantes mais ativos.
    - **Dados para Gráficos**: Histórico de investimentos, crescimento de usuários, etc.
- **Justificativa**: Calcular essas métricas em tempo real no frontend exigiria múltiplas chamadas ao contrato, resultando em lentidão. O backend pode ouvir os eventos do contrato, pré-calcular e armazenar esses dados agregados, e servi-los instantaneamente via API.

### 3. Busca, Filtros e Paginação

- **Páginas Relevantes**: `ProjectListingPage.tsx`, `ProjectsPage.tsx`, `RafflesPage.tsx`, `InvestmentsPage.tsx`.
- **Funcionalidades para Off-Chain**:
    - Buscar projetos por nome ou parte da descrição.
    - Filtrar projetos por status (ativo, futuro, finalizado).
    - Ordenar projetos por data de lançamento, total arrecadado, etc.
    - Paginar listas longas de projetos ou investimentos.
- **Justificativa**: Smart contracts não são otimizados para consultas complexas. Um backend com um banco de dados pode indexar os dados para oferecer uma experiência de busca e filtro rica e instantânea.

### 4. Notificações e Preferências de Usuário

- **Páginas Relevantes**: `notifications/`, `settings/`, `profile/`.
- **Dados para Off-Chain**:
    - Histórico de notificações do usuário (ex: "Seu investimento foi confirmado").
    - Preferências de notificação (ex: "Avise-me por e-mail sobre novos projetos").
    - Configurações de perfil que não afetam a lógica on-chain (ex: tema do site, idioma).
- **Justificativa**: Essas informações são específicas da experiência do usuário e não precisam da segurança ou do custo da blockchain.

### Resumo

O **smart contract** permanece como a fonte da verdade para a custódia de fundos, regras de negócio e o estado crítico dos projetos. O **serviço off-chain** atua como uma camada de aceleração e enriquecimento de dados, lidando com as funcionalidades listadas acima.
