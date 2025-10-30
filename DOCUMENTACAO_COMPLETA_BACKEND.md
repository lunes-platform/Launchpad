# 📋 Documentação Completa - Backend Launchpad Lunes

## 🎯 **Visão Geral do Projeto**

O **Launchpad Lunes** é uma plataforma completa para lançamento de tokens na rede Lunes, combinando smart contracts em Rust/Ink! com um backend Node.js robusto e frontend React moderno.

### **Arquitetura Geral**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │ Smart Contracts │
│   React + TS    │◄──►│   Node.js       │◄──►│   Rust/Ink!     │
│                 │    │   Express/Fastify│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │   PostgreSQL    │
                    │   Redis Cache   │
                    └─────────────────┘
```

---

## 🏗️ **ARQUITETURA BACKEND - MONOLÍTICA MODULAR**

### **Por que Monolito ao invés de Microserviços?**

**Vantagens para este projeto:**
- ✅ **Simplicidade de desenvolvimento e deploy**
- ✅ **Menor complexidade operacional**
- ✅ **Transações ACID nativas**
- ✅ **Debugging mais fácil**
- ✅ **Menor latência entre módulos**
- ✅ **Ideal para equipes pequenas/médias**

### **Estrutura Modular Proposta**
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/           # Autenticação e autorização
│   │   ├── projects/       # Gestão de projetos
│   │   ├── users/          # Gestão de usuários
│   │   ├── blockchain/     # Interação com smart contracts
│   │   ├── analytics/      # Métricas e relatórios
│   │   ├── notifications/  # Sistema de notificações
│   │   ├── ama/           # Sistema AMA
│   │   └── admin/         # Painel administrativo
│   ├── shared/
│   │   ├── database/      # Configuração DB
│   │   ├── middleware/    # Middlewares globais
│   │   ├── utils/         # Utilitários
│   │   └── types/         # Tipos TypeScript
│   ├── config/            # Configurações
│   └── app.ts            # Aplicação principal
├── prisma/               # Schema do banco
├── tests/               # Testes
└── docs/               # Documentação
```

---

## 🗄️ **BANCO DE DADOS - POSTGRESQL**

### **Schema Principal**

```sql
-- Usuários e Autenticação
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(50),
    kyc_status VARCHAR(20) DEFAULT 'pending',
    kyc_data JSONB,
    tier INTEGER DEFAULT 1, -- 1=Bronze, 2=Silver, 3=Gold, 4=Platinum
    is_vip BOOLEAN DEFAULT false,
    is_banned BOOLEAN DEFAULT false,
    daily_limit DECIMAL(20,8) DEFAULT 1000,
    project_limit DECIMAL(20,8) DEFAULT 10000,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Projetos
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_hash VARCHAR(66) UNIQUE NOT NULL, -- Hash do smart contract
    owner_id UUID REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    description TEXT,
    total_supply DECIMAL(20,8),
    token_price DECIMAL(20,8),
    fundraising_goal DECIMAL(20,8),
    
    -- Links e documentação
    website VARCHAR(255),
    twitter VARCHAR(255),
    telegram VARCHAR(255),
    discord VARCHAR(255),
    github VARCHAR(255),
    whitepaper VARCHAR(255),
    roadmap VARCHAR(255),
    
    -- SafeGuard
    safeguard_hash VARCHAR(66),
    listing_fee DECIMAL(20,8),
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, active, completed, cancelled
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Fases dos Projetos
CREATE TABLE project_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    phase_type INTEGER NOT NULL, -- 0=Whitelist, 1=PreSale, 2=PublicSale, 3=Launchpool, 4=Raffle
    start_block BIGINT,
    end_block BIGINT,
    allocation DECIMAL(20,8),
    sold DECIMAL(20,8) DEFAULT 0,
    min_investment DECIMAL(20,8),
    max_investment DECIMAL(20,8),
    max_per_user DECIMAL(20,8),
    price_per_token DECIMAL(20,8),
    discount_percent INTEGER DEFAULT 0,
    
    -- Vesting
    cliff_days INTEGER DEFAULT 0,
    total_days INTEGER DEFAULT 0,
    initial_release_percent INTEGER DEFAULT 100,
    
    -- Configurações
    requires_whitelist BOOLEAN DEFAULT false,
    requires_kyc BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Participações dos Usuários
CREATE TABLE user_participations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    phase_type INTEGER,
    total_invested DECIMAL(20,8) DEFAULT 0,
    tokens_allocated DECIMAL(20,8) DEFAULT 0,
    tokens_claimed DECIMAL(20,8) DEFAULT 0,
    vesting_start_block BIGINT,
    last_claim_block BIGINT,
    payment_currency INTEGER, -- 0=LUNES, 1=LUSDT
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, project_id, phase_type)
);

-- Staking
CREATE TABLE user_stakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(20,8) NOT NULL,
    staked_at TIMESTAMP DEFAULT NOW(),
    unstaked_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Launchpool
CREATE TABLE launchpool_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    total_allocation DECIMAL(20,8),
    price_per_token_cents INTEGER,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    min_stake_required DECIMAL(20,8),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Raffle
CREATE TABLE raffle_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    total_allocation DECIMAL(20,8),
    price_per_token_cents INTEGER,
    ticket_price DECIMAL(20,8),
    max_tickets_per_user INTEGER,
    num_winners INTEGER,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    requires_kyc BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active', -- active, drawing, completed
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE raffle_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raffle_id UUID REFERENCES raffle_configs(id),
    user_id UUID REFERENCES users(id),
    tickets_purchased INTEGER DEFAULT 0,
    total_paid DECIMAL(20,8) DEFAULT 0,
    is_winner BOOLEAN DEFAULT false,
    allocation_claimed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(raffle_id, user_id)
);

-- Sistema AMA
CREATE TABLE amas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    youtube_url VARCHAR(255),
    scheduled_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, live, completed, cancelled
    moderator_id UUID REFERENCES users(id),
    is_paid BOOLEAN DEFAULT false,
    price DECIMAL(10,2) DEFAULT 200, -- USD
    total_votes INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ama_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ama_id UUID REFERENCES amas(id),
    user_id UUID REFERENCES users(id),
    question TEXT NOT NULL,
    is_answered BOOLEAN DEFAULT false,
    lunes_amount DECIMAL(20,8) DEFAULT 0.5,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ama_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ama_id UUID REFERENCES amas(id),
    user_id UUID REFERENCES users(id),
    lunes_amount DECIMAL(20,8) DEFAULT 0.5,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(ama_id, user_id)
);

-- Analytics e Métricas
CREATE TABLE platform_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE DEFAULT CURRENT_DATE,
    total_users INTEGER DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    total_projects INTEGER DEFAULT 0,
    total_investments BIGINT DEFAULT 0,
    total_volume_lunes DECIMAL(20,8) DEFAULT 0,
    total_volume_lusdt DECIMAL(20,8) DEFAULT 0,
    active_stakers INTEGER DEFAULT 0,
    total_staked_amount DECIMAL(20,8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(date)
);

-- Transações Blockchain
CREATE TABLE blockchain_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tx_hash VARCHAR(66) UNIQUE NOT NULL,
    block_number BIGINT,
    from_address VARCHAR(42),
    to_address VARCHAR(42),
    method_name VARCHAR(50),
    parameters JSONB,
    status VARCHAR(20), -- pending, confirmed, failed
    gas_used BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    confirmed_at TIMESTAMP
);

-- Notificações
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL, -- email, push, sms
    title VARCHAR(200),
    message TEXT,
    data JSONB,
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para Performance
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_projects_hash ON projects(project_hash);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_participations_user_project ON user_participations(user_id, project_id);
CREATE INDEX idx_stakes_user_active ON user_stakes(user_id, is_active);
CREATE INDEX idx_transactions_hash ON blockchain_transactions(tx_hash);
CREATE INDEX idx_transactions_status ON blockchain_transactions(status);
CREATE INDEX idx_notifications_user_status ON notifications(user_id, status);
```

---

## 🔧 **STACK TECNOLÓGICO**

### **Backend Core**
```json
{
  "runtime": "Node.js 20+",
  "language": "TypeScript",
  "framework": "Fastify", 
  "orm": "Prisma",
  "database": "PostgreSQL 15+",
  "cache": "Redis 7+",
  "queue": "BullMQ",
  "validation": "Zod",
  "auth": "JWT + Passport",
  "testing": "Jest + Supertest",
  "docs": "Swagger/OpenAPI"
}
```

### **Dependências Principais**
```json
{
  "dependencies": {
    "fastify": "^4.24.3",
    "prisma": "^5.7.1",
    "@prisma/client": "^5.7.1",
    "redis": "^4.6.10",
    "bullmq": "^4.15.4",
    "jsonwebtoken": "^9.0.2",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "zod": "^3.22.4",
    "web3": "^4.3.0",
    "@polkadot/api": "^10.11.2",
    "nodemailer": "^6.9.7",
    "winston": "^3.11.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "rate-limiter-flexible": "^3.0.8"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.10.4",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.2"
  }
}
```

---

## 📁 **ESTRUTURA DETALHADA DOS MÓDULOS**

### **1. Módulo de Autenticação (`/modules/auth/`)**

```typescript
// auth/auth.service.ts
export class AuthService {
  async authenticateWallet(signature: string, message: string): Promise<AuthResult>
  async generateJWT(userId: string): Promise<string>
  async validateJWT(token: string): Promise<User>
  async refreshToken(refreshToken: string): Promise<string>
  async logout(userId: string): Promise<void>
}

// auth/auth.controller.ts
export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply)
  async refresh(request: FastifyRequest, reply: FastifyReply)
  async logout(request: FastifyRequest, reply: FastifyReply)
  async profile(request: FastifyRequest, reply: FastifyReply)
}

// auth/auth.middleware.ts
export const authenticateJWT = async (request: FastifyRequest, reply: FastifyReply)
export const requireRole = (roles: string[]) => async (request: FastifyRequest, reply: FastifyReply)
```

### **2. Módulo de Usuários (`/modules/users/`)**

```typescript
// users/user.service.ts
export class UserService {
  async createUser(walletAddress: string): Promise<User>
  async getUserByWallet(walletAddress: string): Promise<User | null>
  async updateProfile(userId: string, data: UpdateUserDto): Promise<User>
  async updateKYC(userId: string, kycData: KYCData): Promise<User>
  async getUserAnalytics(userId: string): Promise<UserAnalytics>
  async updateUserLimits(userId: string, limits: UserLimits): Promise<User>
}

// users/user.controller.ts
export class UserController {
  async getProfile(request: FastifyRequest, reply: FastifyReply)
  async updateProfile(request: FastifyRequest, reply: FastifyReply)
  async submitKYC(request: FastifyRequest, reply: FastifyReply)
  async getAnalytics(request: FastifyRequest, reply: FastifyReply)
}
```

### **3. Módulo de Projetos (`/modules/projects/`)**

```typescript
// projects/project.service.ts
export class ProjectService {
  async createProject(data: CreateProjectDto): Promise<Project>
  async getProject(id: string): Promise<Project | null>
  async updateProject(id: string, data: UpdateProjectDto): Promise<Project>
  async approveProject(id: string, adminId: string): Promise<Project>
  async getProjectPhases(projectId: string): Promise<ProjectPhase[]>
  async configurePhase(projectId: string, phaseData: PhaseConfigDto): Promise<ProjectPhase>
  async getProjectAnalytics(projectId: string): Promise<ProjectAnalytics>
}

// projects/project.controller.ts
export class ProjectController {
  async create(request: FastifyRequest, reply: FastifyReply)
  async getById(request: FastifyRequest, reply: FastifyReply)
  async update(request: FastifyRequest, reply: FastifyReply)
  async list(request: FastifyRequest, reply: FastifyReply)
  async getPhases(request: FastifyRequest, reply: FastifyReply)
  async configurePhase(request: FastifyRequest, reply: FastifyReply)
}
```

### **4. Módulo Blockchain (`/modules/blockchain/`)**

```typescript
// blockchain/web3.service.ts
export class Web3Service {
  async connectToLunes(): Promise<void>
  async getContractInstance(address: string): Promise<Contract>
  async callContractMethod(method: string, params: any[]): Promise<any>
  async sendTransaction(method: string, params: any[], from: string): Promise<string>
  async estimateGas(method: string, params: any[]): Promise<number>
  async getTransactionReceipt(txHash: string): Promise<TransactionReceipt>
}

// blockchain/event-monitor.service.ts
export class EventMonitorService {
  async startMonitoring(): Promise<void>
  async subscribeToEvent(eventName: string, callback: Function): Promise<void>
  async handleInvestmentEvent(event: InvestmentEvent): Promise<void>
  async handleStakingEvent(event: StakingEvent): Promise<void>
  async handlePhaseEvent(event: PhaseEvent): Promise<void>
}

// blockchain/transaction-queue.service.ts
export class TransactionQueueService {
  async queueTransaction(tx: QueuedTransaction): Promise<string>
  async processQueue(): Promise<void>
  async retryFailedTransaction(txId: string): Promise<void>
  async getTransactionStatus(txId: string): Promise<TransactionStatus>
}
```

### **5. Módulo Analytics (`/modules/analytics/`)**

```typescript
// analytics/analytics.service.ts
export class AnalyticsService {
  async getPlatformMetrics(): Promise<PlatformMetrics>
  async getUserAnalytics(userId: string): Promise<UserAnalytics>
  async getProjectAnalytics(projectId: string): Promise<ProjectAnalytics>
  async getRevenueAnalytics(): Promise<RevenueAnalytics>
  async updateDailyMetrics(): Promise<void>
  async generateReport(type: string, params: any): Promise<Report>
}

// analytics/analytics.controller.ts
export class AnalyticsController {
  async getPlatformDashboard(request: FastifyRequest, reply: FastifyReply)
  async getUserDashboard(request: FastifyRequest, reply: FastifyReply)
  async getProjectDashboard(request: FastifyRequest, reply: FastifyReply)
  async exportReport(request: FastifyRequest, reply: FastifyReply)
}
```

### **6. Módulo Notificações (`/modules/notifications/`)**

```typescript
// notifications/notification.service.ts
export class NotificationService {
  async sendEmail(to: string, template: string, data: any): Promise<void>
  async sendPushNotification(userId: string, message: PushMessage): Promise<void>
  async sendSMS(phone: string, message: string): Promise<void>
  async createNotification(notification: CreateNotificationDto): Promise<Notification>
  async markAsRead(notificationId: string): Promise<void>
  async getUserNotifications(userId: string): Promise<Notification[]>
}

// notifications/notification.controller.ts
export class NotificationController {
  async getUserNotifications(request: FastifyRequest, reply: FastifyReply)
  async markAsRead(request: FastifyRequest, reply: FastifyReply)
  async updatePreferences(request: FastifyRequest, reply: FastifyReply)
}
```

### **7. Módulo AMA (`/modules/ama/`)**

```typescript
// ama/ama.service.ts
export class AMAService {
  async createAMA(data: CreateAMADto): Promise<AMA>
  async getAMA(id: string): Promise<AMA | null>
  async updateAMA(id: string, data: UpdateAMADto): Promise<AMA>
  async submitQuestion(amaId: string, userId: string, question: string): Promise<AMAQuestion>
  async voteForAMA(amaId: string, userId: string): Promise<AMAVote>
  async getAMAQuestions(amaId: string): Promise<AMAQuestion[]>
  async processAMAPayment(amaId: string, userId: string, type: string): Promise<AMAPayment>
}

// ama/ama.controller.ts
export class AMAController {
  async create(request: FastifyRequest, reply: FastifyReply)
  async getById(request: FastifyRequest, reply: FastifyReply)
  async list(request: FastifyRequest, reply: FastifyReply)
  async submitQuestion(request: FastifyRequest, reply: FastifyReply)
  async vote(request: FastifyRequest, reply: FastifyReply)
  async getQuestions(request: FastifyRequest, reply: FastifyReply)
}
```

---

## 🔄 **INTEGRAÇÃO COM SMART CONTRACTS**

### **Eventos Monitorados**

```typescript
// Eventos do contrato que precisam ser monitorados
const MONITORED_EVENTS = {
  InvestmentMade: {
    handler: 'handleInvestmentEvent',
    fields: ['investor', 'project_id', 'phase_type', 'payment_currency', 'payment_amount', 'tokens_allocated']
  },
  TokensClaimed: {
    handler: 'handleClaimEvent',
    fields: ['user', 'project_id', 'amount', 'remaining_vested']
  },
  Staked: {
    handler: 'handleStakeEvent',
    fields: ['user', 'amount', 'new_total']
  },
  Unstaked: {
    handler: 'handleUnstakeEvent',
    fields: ['user', 'amount', 'remaining']
  },
  PhaseConfigured: {
    handler: 'handlePhaseConfigEvent',
    fields: ['project_id', 'phase_type', 'allocation', 'discount', 'vesting_days']
  },
  LaunchpoolPurchase: {
    handler: 'handleLaunchpoolPurchaseEvent',
    fields: ['user', 'project_id', 'token_amount', 'payment_amount', 'currency']
  },
  RaffleTicketPurchased: {
    handler: 'handleRaffleTicketEvent',
    fields: ['user', 'project_id', 'tickets', 'total_cost']
  }
};
```

### **Sincronização de Estado**

```typescript
// blockchain/sync.service.ts
export class SyncService {
  async syncUserParticipation(userAddress: string, projectHash: string): Promise<void> {
    // Busca dados do smart contract
    const contractData = await this.web3Service.getUserParticipation(userAddress, projectHash);
    
    // Atualiza banco de dados local
    await this.prisma.userParticipation.upsert({
      where: { user_wallet_project: { userWallet: userAddress, projectHash } },
      update: {
        totalInvested: contractData.total_invested,
        tokensAllocated: contractData.tokens_allocated,
        tokensClaimed: contractData.tokens_claimed,
        lastClaimBlock: contractData.last_claim
      },
      create: {
        // ... dados de criação
      }
    });
  }

  async syncProjectPhases(projectHash: string): Promise<void> {
    // Sincroniza todas as fases do projeto
    for (let phaseType = 0; phaseType <= 4; phaseType++) {
      const phaseData = await this.web3Service.getPhaseConfig(projectHash, phaseType);
      if (phaseData) {
        await this.updatePhaseInDatabase(projectHash, phaseType, phaseData);
      }
    }
  }
}
```

---

## 🛡️ **SEGURANÇA E VALIDAÇÕES**

### **Middleware de Segurança**

```typescript
// shared/middleware/security.middleware.ts
export const securityMiddleware = {
  // Rate Limiting
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: 'Muitas tentativas, tente novamente em 15 minutos'
  }),

  // Validação de entrada
  validateInput: (schema: ZodSchema) => async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validatedData = schema.parse(request.body);
      request.body = validatedData;
    } catch (error) {
      reply.code(400).send({ error: 'Dados inválidos', details: error.errors });
    }
  },

  // Sanitização
  sanitizeInput: async (request: FastifyRequest, reply: FastifyReply) => {
    // Remove caracteres perigosos
    // Valida tipos de dados
    // Limita tamanho de strings
  },

  // CORS
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
  }
};
```

### **Validações de Negócio**

```typescript
// shared/validators/business.validators.ts
export class BusinessValidators {
  static async validateInvestmentLimits(userId: string, amount: number): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const dailySpent = await this.getDailySpent(userId);
    
    return dailySpent + amount <= user.dailyLimit;
  }

  static async validatePhaseActive(projectId: string, phaseType: number): Promise<boolean> {
    const phase = await prisma.projectPhase.findFirst({
      where: { projectId, phaseType, active: true }
    });
    
    if (!phase) return false;
    
    const currentBlock = await web3Service.getCurrentBlock();
    return currentBlock >= phase.startBlock && currentBlock <= phase.endBlock;
  }

  static async validateKYCRequired(userId: string, projectId: string, phaseType: number): Promise<boolean> {
    const phase = await prisma.projectPhase.findFirst({
      where: { projectId, phaseType }
    });
    
    if (!phase?.requiresKyc) return true;
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user?.kycStatus === 'approved';
  }
}
```

---

## 📊 **SISTEMA DE CACHE E PERFORMANCE**

### **Estratégia de Cache Redis**

```typescript
// shared/cache/cache.service.ts
export class CacheService {
  private redis: Redis;

  // Cache de dados frequentemente acessados
  async cacheUserProfile(userId: string, data: User): Promise<void> {
    await this.redis.setex(`user:${userId}`, 3600, JSON.stringify(data)); // 1 hora
  }

  async getCachedUserProfile(userId: string): Promise<User | null> {
    const cached = await this.redis.get(`user:${userId}`);
    return cached ? JSON.parse(cached) : null;
  }

  // Cache de métricas da plataforma
  async cachePlatformMetrics(data: PlatformMetrics): Promise<void> {
    await this.redis.setex('platform:metrics', 300, JSON.stringify(data)); // 5 minutos
  }

  // Cache de preços de tokens
  async cacheTokenPrices(prices: TokenPrices): Promise<void> {
    await this.redis.setex('prices:tokens', 60, JSON.stringify(prices)); // 1 minuto
  }

  // Invalidação de cache
  async invalidateUserCache(userId: string): Promise<void> {
    await this.redis.del(`user:${userId}`);
  }
}
```

### **Otimizações de Banco de Dados**

```sql
-- Índices compostos para queries frequentes
CREATE INDEX idx_user_participations_lookup ON user_participations(user_id, project_id, phase_type);
CREATE INDEX idx_projects_status_created ON projects(status, created_at DESC);
CREATE INDEX idx_stakes_user_active_amount ON user_stakes(user_id, is_active, amount DESC);

-- Particionamento por data para tabelas grandes
CREATE TABLE blockchain_transactions_2024 PARTITION OF blockchain_transactions
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Views materializadas para analytics
CREATE MATERIALIZED VIEW daily_platform_stats AS
SELECT 
    date_trunc('day', created_at) as date,
    COUNT(*) as daily_users,
    SUM(total_invested) as daily_volume
FROM user_participations 
GROUP BY date_trunc('day', created_at);

-- Refresh automático das views
CREATE OR REPLACE FUNCTION refresh_daily_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW daily_platform_stats;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔄 **SISTEMA DE FILAS E JOBS**

### **Processamento Assíncrono com BullMQ**

```typescript
// shared/queues/queue.service.ts
export class QueueService {
  private emailQueue: Queue;
  private blockchainQueue: Queue;
  private analyticsQueue: Queue;

  constructor() {
    this.emailQueue = new Queue('email', { connection: redisConnection });
    this.blockchainQueue = new Queue('blockchain', { connection: redisConnection });
    this.analyticsQueue = new Queue('analytics', { connection: redisConnection });
  }

  // Jobs de email
  async sendEmail(to: string, template: string, data: any): Promise<void> {
    await this.emailQueue.add('send-email', { to, template, data });
  }

  // Jobs de blockchain
  async processTransaction(txData: TransactionData): Promise<void> {
    await this.blockchainQueue.add('process-tx', txData, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 }
    });
  }

  // Jobs de analytics
  async updateMetrics(): Promise<void> {
    await this.analyticsQueue.add('update-metrics', {}, {
      repeat: { cron: '0 * * * *' } // A cada hora
    });
  }
}

// Workers para processar os jobs
export class QueueWorkers {
  static async processEmailJob(job: Job): Promise<void> {
    const { to, template, data } = job.data;
    await emailService.send(to, template, data);
  }

  static async processBlockchainJob(job: Job): Promise<void> {
    const txData = job.data;
    await blockchainService.processTransaction(txData);
  }

  static async processAnalyticsJob(job: Job): Promise<void> {
    await analyticsService.updateDailyMetrics();
  }
}
```

---

## 📈 **MONITORAMENTO E OBSERVABILIDADE**

### **Logging Estruturado**

```typescript
// shared/logger/logger.service.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'launchpad-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Middleware de logging
export const loggingMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  const start = Date.now();
  
  reply.addHook('onSend', async () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration,
      userAgent: request.headers['user-agent'],
      ip: request.ip
    });
  });
};
```

### **Métricas de Performance**

```typescript
// shared/metrics/metrics.service.ts
export class MetricsService {
  private static instance: MetricsService;
  private metrics: Map<string, any> = new Map();

  // Métricas de API
  recordAPICall(endpoint: string, method: string, duration: number, statusCode: number): void {
    const key = `api_${method}_${endpoint}`;
    this.updateMetric(key, { duration, statusCode, timestamp: Date.now() });
  }

  // Métricas de blockchain
  recordBlockchainCall(method: string, success: boolean, duration: number): void {
    const key = `blockchain_${method}`;
    this.updateMetric(key, { success, duration, timestamp: Date.now() });
  }

  // Métricas de negócio
  recordInvestment(amount: number, currency: string, projectId: string): void {
    this.updateMetric('investments', { amount, currency, projectId, timestamp: Date.now() });
  }

  // Export para Prometheus
  getPrometheusMetrics(): string {
    // Formata métricas no formato Prometheus
    return this.formatForPrometheus();
  }
}
```

---

## 🚀 **DEPLOYMENT E DEVOPS**

### **Docker Configuration**

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm ci --only=production

# Copiar código
COPY . .

# Build da aplicação
RUN npm run build

# Usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001
USER backend

EXPOSE 3000

CMD ["npm", "start"]
```

### **Docker Compose**

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/launchpad
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: launchpad
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

---

## 📋 **ROADMAP DE IMPLEMENTAÇÃO**

### **🎯 FASE 1: FUNDAÇÃO (3-4 semanas)**

#### **Semana 1: Setup Inicial**
- [ ] Configuração do projeto Node.js + TypeScript
- [ ] Setup do banco PostgreSQL + Prisma
- [ ] Configuração Redis + BullMQ
- [ ] Estrutura básica de módulos
- [ ] Sistema de logging
- [ ] Testes unitários básicos

#### **Semana 2: Autenticação e Usuários**
- [ ] Módulo de autenticação JWT
- [ ] Integração com carteiras Web3
- [ ] CRUD de usuários
- [ ] Sistema de permissões
- [ ] Middleware de segurança
- [ ] Validações de entrada

#### **Semana 3: Projetos e Fases**
- [ ] CRUD de projetos
- [ ] Sistema de fases (Whitelist, PreSale, etc.)
- [ ] Validações de negócio
- [ ] Upload de documentos
- [ ] Sistema de aprovação

#### **Semana 4: Integração Blockchain Básica**
- [ ] Conexão com rede Lunes
- [ ] Integração com smart contracts
- [ ] Monitoramento de eventos básico
- [ ] Sincronização de dados
- [ ] Testes de integração

### **🎯 FASE 2: FUNCIONALIDADES CORE (4-5 semanas)**

#### **Semana 5-6: Sistema de Investimentos**
- [ ] Processamento de investimentos
- [ ] Sistema de vesting
- [ ] Cálculo de alocações
- [ ] Histórico de transações
- [ ] Relatórios de participação

#### **Semana 7-8: Staking e Launchpool**
- [ ] Sistema de staking LUNES
- [ ] Configuração de launchpools
- [ ] Cálculo de alocações por stake
- [ ] Compras via launchpool
- [ ] Dashboard de staking

#### **Semana 9: Sistema de Raffle**
- [ ] Configuração de rifas
- [ ] Compra de tickets
- [ ] Sistema de sorteio
- [ ] Distribuição de prêmios
- [ ] Histórico de rifas

### **🎯 FASE 3: ANALYTICS E AMA (3-4 semanas)**

#### **Semana 10-11: Sistema Analytics**
- [ ] Métricas da plataforma
- [ ] Analytics de usuários
- [ ] Analytics de projetos
- [ ] Dashboards em tempo real
- [ ] Exportação de relatórios

#### **Semana 12-13: Sistema AMA**
- [ ] CRUD de AMAs
- [ ] Sistema de perguntas e votos
- [ ] Integração com pagamentos LUNES
- [ ] Moderação de conteúdo
- [ ] Interface de transmissão

### **🎯 FASE 4: OTIMIZAÇÃO E PRODUÇÃO (2-3 semanas)**

#### **Semana 14-15: Performance e Segurança**
- [ ] Otimização de queries
- [ ] Cache avançado
- [ ] Rate limiting
- [ ] Auditoria de segurança
- [ ] Testes de carga

#### **Semana 16: Deploy e Monitoramento**
- [ ] Configuração de produção
- [ ] CI/CD pipeline
- [ ] Monitoramento e alertas
- [ ] Backup e recovery
- [ ] Documentação final

---

## 🔧 **COMANDOS E SCRIPTS**

### **Scripts de Desenvolvimento**

```json
{
  "scripts": {
    "dev": "nodemon src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "ts-node prisma/seed.ts",
    "db:reset": "prisma migrate reset",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts"
  }
}
```

### **Variáveis de Ambiente**

```bash
# .env
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/launchpad"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"

# Blockchain
LUNES_RPC_URL="wss://rpc.lunes.io"
CONTRACT_ADDRESS="0x..."
PRIVATE_KEY="0x..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Storage
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_BUCKET_NAME="launchpad-files"
AWS_REGION="us-east-1"

# External APIs
KYC_API_KEY="your-kyc-provider-key"
PRICE_ORACLE_API="your-price-api-key"
```

---

## 📚 **CONCLUSÃO**

Esta documentação apresenta uma arquitetura **monolítica modular** robusta e escalável para o backend do Launchpad Lunes. A escolha por monolito ao invés de microserviços é estratégica para este projeto, oferecendo:

### **✅ Vantagens da Arquitetura Proposta:**

1. **Simplicidade Operacional** - Um único deploy, um banco de dados, logs centralizados
2. **Performance Superior** - Sem latência de rede entre módulos
3. **Transações ACID** - Consistência de dados garantida
4. **Debugging Facilitado** - Stack trace completo, logs unificados
5. **Desenvolvimento Ágil** - Refatoração fácil, testes integrados
6. **Custo Reduzido** - Menos infraestrutura, menos complexidade

### **🎯 Próximos Passos:**

1. **Setup do ambiente de desenvolvimento**
2. **Implementação da Fase 1 (Fundação)**
3. **Testes de integração com smart contracts**
4. **Deploy em ambiente de staging**
5. **Testes de carga e performance**

A arquitetura está preparada para escalar horizontalmente quando necessário, e pode evoluir para microserviços no futuro se o crescimento da plataforma justificar a complexidade adicional.

**🚀 Com esta base sólida, o Launchpad Lunes terá um backend robusto, seguro e performático para suportar o crescimento da plataforma!**