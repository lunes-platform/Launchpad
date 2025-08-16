# 🚀 API Integration Guide - Launchpad Lunes Frontend

Este guia documenta toda a arquitetura de integração com APIs implementada no frontend do Launchpad Lunes.

## 📁 Estrutura de Arquivos

```
src/
├── types/
│   └── api.ts                 # 120+ interfaces TypeScript
├── lib/
│   ├── api.ts                # Cliente HTTP com Axios
│   └── websocket.ts          # Cliente WebSocket
└── hooks/
    ├── index.ts              # Exportações centralizadas
    ├── useApi.ts             # Hooks base para API
    ├── useAuth.ts            # Hooks de autenticação
    ├── useProjects.ts        # Hooks de projetos
    ├── useInvestments.ts     # Hooks de investimentos
    ├── useStaking.ts         # Hooks de staking/launchpool
    ├── useNotifications.ts   # Hooks de notificações
    └── useUtils.ts           # Hooks utilitários
```

## 🏗️ Arquitetura

### 1. **Sistema de Tipos TypeScript** (`/types/api.ts`)

#### **120+ Interfaces Tipadas:**
- ✅ **Entidades Core**: User, Project, Investment, Transaction
- ✅ **Staking & Launchpool**: StakingPool, UserStaking, LaunchpoolProject
- ✅ **Notificações**: Notification, NotificationPreferences
- ✅ **Admin**: AdminStats, AdminUser, AdminActions
- ✅ **Requests**: LoginRequest, InvestmentRequest, ClaimRequest
- ✅ **Filters**: ProjectFilters, InvestmentFilters, TransactionFilters
- ✅ **Responses**: ApiResponse, PaginatedResponse, ApiError
- ✅ **WebSocket**: WebSocketMessage, PriceUpdate

#### **Exemplos de Uso:**
```typescript
import { Project, InvestmentRequest, ApiResponse } from '@/types/api'

const project: Project = {
  id: 'project-1',
  name: 'DeFi Protocol',
  symbol: 'DFP',
  // ... todas as propriedades tipadas
}
```

### 2. **Cliente HTTP Avançado** (`/lib/api.ts`)

#### **Funcionalidades Implementadas:**
- ✅ **Interceptors**: Request/Response automático
- ✅ **Autenticação**: JWT com refresh token automático
- ✅ **Retry Logic**: 3 tentativas automáticas
- ✅ **Error Handling**: Tratamento centralizado de erros
- ✅ **Request Timeout**: 30 segundos por padrão
- ✅ **File Upload**: Com progress tracking
- ✅ **Download**: Com blob handling
- ✅ **Health Check**: Monitoramento da API
- ✅ **Caching**: Headers apropriados

#### **Configuração Automática:**
```typescript
import { api } from '@/lib/api'

// Métodos disponíveis
await api.get<Project[]>('/projects')
await api.post<Investment>('/investments', data)
await api.put<User>('/auth/profile', userData)
await api.delete('/investments/123')
await api.getPaginated<Project>('/projects', { page: 1, limit: 20 })
await api.uploadFile('/files/upload', file, onProgress)
```

#### **Interceptors Automáticos:**
- **Request**: Adiciona token de auth, timestamps, logs
- **Response**: Calcula tempo de resposta, logs, error handling
- **Refresh Token**: Renovação automática quando token expira

### 3. **Hooks Base** (`/hooks/useApi.ts`)

#### **4 Hooks Fundamentais:**

**`useApi`** - Para operações GET:
```typescript
const { data, loading, error, refresh } = useApi<Project[]>('/projects', {
  refreshInterval: 30000, // Refresh a cada 30s
  immediate: true,        // Executa automaticamente
})
```

**`useMutation`** - Para operações POST/PUT/DELETE:
```typescript
const { mutate, loading, error } = useMutation<Investment, InvestmentRequest>(
  (data) => api.post('/investments', data),
  {
    onSuccess: (result) => toast.success('Investimento realizado!'),
    onError: (error) => toast.error(error.message),
  }
)
```

**`usePaginated`** - Para listas paginadas:
```typescript
const { 
  data, 
  loading, 
  page, 
  totalPages, 
  nextPage, 
  prevPage, 
  updateParams 
} = usePaginated<Project>('/projects', { limit: 20 })
```

**`useInfinite`** - Para scroll infinito:
```typescript
const { 
  data, 
  loading, 
  loadMore, 
  hasMore 
} = useInfinite<Project>('/projects', { limit: 20 })
```

### 4. **Hooks Especializados**

#### **Autenticação** (`/hooks/useAuth.ts`)
```typescript
const { 
  user, 
  isAuthenticated, 
  login, 
  register, 
  logout, 
  updateProfile 
} = useAuth()

// KYC
const { kycStatus, submitKyc, submitting } = useKycStatus()

// 2FA
const { enable2FA, verify2FA, disable2FA } = use2FA()

// Sessões
const { sessions, revokeSession, revokeAllSessions } = useSession()
```

#### **Projetos** (`/hooks/useProjects.ts`)
```typescript
// Lista de projetos com filtros
const { 
  data: projects, 
  activeProjects, 
  upcomingProjects, 
  updateFilters 
} = useProjects({ category: 'DeFi', status: 'active' })

// Projeto específico
const { 
  project, 
  currentPhase, 
  nextPhase, 
  progress 
} = useProject(projectId)

// Investir em projeto
const { invest, investing } = useProjectInvestment(projectId)

// Whitelist
const { 
  joinWhitelist, 
  checkWhitelist, 
  whitelistStatus 
} = useProjectWhitelist(projectId)

// Estatísticas
const { stats } = useProjectStats()

// Busca
const { search, results, searching } = useProjectSearch()

// Preços em tempo real
const { prices, getProjectPrice } = useProjectPrices(['project-1', 'project-2'])
```

#### **Investimentos** (`/hooks/useInvestments.ts`)
```typescript
// Meus investimentos
const { 
  data: investments,
  activeInvestments,
  totalInvested,
  totalGains,
  gainsPercentage 
} = useInvestments()

// Investimento específico
const { 
  investment, 
  nextVesting, 
  vestingProgress, 
  claimableAmount 
} = useInvestment(investmentId)

// Reivindicar tokens
const { claimTokens, claiming } = useTokenClaiming()

// Tokens disponíveis para claim
const { 
  claimable, 
  claimAll, 
  claimingAll 
} = useClaimableTokens()

// ROI tracking
const { 
  roi, 
  bestPerformer, 
  worstPerformer 
} = useROITracking()

// Alertas
const { 
  alerts, 
  createAlert, 
  deleteAlert 
} = useInvestmentAlerts()

// Diversificação do portfólio
const { diversification } = usePortfolioDiversification()
```

#### **Staking & Launchpool** (`/hooks/useStaking.ts`)
```typescript
// Pools de staking
const { 
  pools, 
  activePools, 
  getPoolById 
} = useStakingPools()

// Pool específico
const { pool } = useStakingPool(poolId)

// Meu staking
const { 
  activeStaking, 
  totalStaked, 
  totalRewards, 
  estimatedDailyRewards 
} = useUserStaking()

// Ações de staking
const { 
  stake, 
  unstake, 
  claimRewards, 
  staking,
  unstaking,
  claiming 
} = useStakingActions()

// Projetos Launchpool
const { 
  projects: launchpoolProjects, 
  activeProjects: activeLaunchpool 
} = useLaunchpoolProjects()

// Calculadora de staking
const { calculateRewards } = useStakingCalculator()

// Analíticas
const { analytics, updateTimeRange } = useStakingAnalytics('30d')
```

#### **Notificações** (`/hooks/useNotifications.ts`)
```typescript
// Lista de notificações
const { 
  data: notifications,
  unreadNotifications,
  unreadCount,
  urgentCount,
  updateFilters 
} = useNotifications()

// Ações
const { 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} = useNotificationActions()

// Preferências
const { 
  preferences, 
  updatePreferences, 
  toggleNotificationType 
} = useNotificationPreferences()

// Push notifications
const { 
  isSupported, 
  isSubscribed, 
  subscribe, 
  unsubscribe 
} = usePushNotifications()

// In-app notifications
const { 
  notifications: inAppNotifications, 
  addNotification, 
  dismissNotification 
} = useInAppNotifications()
```

### 5. **Utilitários** (`/hooks/useUtils.ts`)

#### **20+ Hooks Utilitários:**
```typescript
// Armazenamento
const [value, setValue, removeValue] = useLocalStorage('key', defaultValue)
const [sessionValue, setSessionValue] = useSessionStorage('key', defaultValue)

// Debounce
const debouncedValue = useDebounce(searchTerm, 500)
const debouncedCallback = useDebouncedCallback(callback, 500)

// UI
const { days, hours, minutes, seconds, formatted } = useCountdown(targetDate)
const { ref, isIntersecting } = useIntersectionObserver()
const { copy, copied } = useClipboard()

// Responsividade
const { width, height, isMobile, isTablet, isDesktop } = useWindowSize()
const isMobileDevice = useMediaQuery('(max-width: 768px)')

// Favoritos
const { 
  favorites, 
  isFavorite, 
  addFavorite, 
  toggleFavorite 
} = useFavorites<Project>('favorite-projects')

// URL
const { 
  getParam, 
  setParam, 
  setParams, 
  clearParams 
} = useQueryParams()

// Estado
const { value, toggle, setTrue, setFalse } = useToggle(false)
```

### 6. **WebSocket Real-time** (`/lib/websocket.ts`)

#### **Funcionalidades:**
- ✅ **Auto-reconnect**: Reconexão automática com backoff exponencial
- ✅ **Heartbeat**: Keep-alive automático
- ✅ **Subscriptions**: Sistema de eventos pub/sub
- ✅ **Type Safety**: Mensagens tipadas
- ✅ **Error Handling**: Tratamento robusto de erros
- ✅ **Debug Mode**: Logs detalhados em desenvolvimento

#### **Hook de WebSocket:**
```typescript
const { 
  isConnected, 
  connectionState, 
  subscribe, 
  unsubscribe, 
  send 
} = useWebSocket({ autoConnect: true, authToken })

// Inscrever em eventos
useEffect(() => {
  const priceSubscription = subscribe('price_update', (data: PriceUpdate) => {
    console.log('Preço atualizado:', data)
  })

  const notificationSubscription = subscribe('notification', (notification) => {
    toast(notification.message)
  })

  return () => {
    unsubscribe(priceSubscription)
    unsubscribe(notificationSubscription)
  }
}, [subscribe, unsubscribe])
```

## 🎯 Padrões de Uso

### **1. Carregamento de Dados**
```typescript
function ProjectsList() {
  const { data: projects, loading, error } = useProjects({
    category: 'DeFi',
    status: 'active'
  })

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

### **2. Mutações com Feedback**
```typescript
function InvestmentForm({ projectId }: { projectId: string }) {
  const { invest, investing, error } = useProjectInvestment(projectId)

  const handleSubmit = async (data: InvestmentFormData) => {
    try {
      await invest({
        phaseId: data.phaseId,
        amount: data.amount,
        currency: data.currency,
        walletAddress: data.walletAddress,
        signature: data.signature,
      })
      // Toast de sucesso é mostrado automaticamente
    } catch (error) {
      // Toast de erro é mostrado automaticamente
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulário */}
      <Button loading={investing}>
        Investir
      </Button>
    </form>
  )
}
```

### **3. Paginação**
```typescript
function ProjectsPage() {
  const { 
    data: projects, 
    loading, 
    page, 
    totalPages, 
    nextPage, 
    prevPage,
    updateParams 
  } = usePaginated<Project>('/projects')

  return (
    <div>
      <ProjectFilters onFilter={updateParams} />
      
      <ProjectGrid projects={projects} loading={loading} />
      
      <Pagination 
        page={page}
        totalPages={totalPages}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </div>
  )
}
```

### **4. Real-time Updates**
```typescript
function Dashboard() {
  const { data: investments, refresh } = useInvestments()
  const { subscribe, unsubscribe } = useWebSocket()

  useEffect(() => {
    const investmentSub = subscribe('investment_update', (data) => {
      if (data.type === 'new_investment' || data.type === 'tokens_claimed') {
        refresh() // Atualiza a lista de investimentos
      }
    })

    const priceSub = subscribe('price_update', (priceData: PriceUpdate) => {
      // Atualiza preços em tempo real
      updateProjectPrices(priceData)
    })

    return () => {
      unsubscribe(investmentSub)
      unsubscribe(priceSub)
    }
  }, [subscribe, unsubscribe, refresh])

  return <DashboardContent investments={investments} />
}
```

## 🔧 Configuração

### **Variáveis de Ambiente**
```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001/ws

# Push Notifications
REACT_APP_VAPID_PUBLIC_KEY=your-vapid-public-key

# Debug
REACT_APP_DEBUG_API=true
```

### **Inicialização**
```typescript
// src/App.tsx
import { AuthProvider } from '@/hooks/useAuth'
import { WalletProvider } from '@/contexts/WalletContext'

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        {/* Sua aplicação */}
      </WalletProvider>
    </AuthProvider>
  )
}
```

## 📊 Métricas e Monitoramento

### **Performance**
- ✅ **Request Timing**: Logs automáticos de tempo de resposta
- ✅ **Error Tracking**: Centralização de erros
- ✅ **Cache Strategy**: Cache inteligente com invalidação
- ✅ **Bundle Size**: Código tree-shakeable

### **User Experience**
- ✅ **Loading States**: Skeletons e spinners automáticos
- ✅ **Error Feedback**: Toast notifications automáticas
- ✅ **Optimistic Updates**: UI atualizada antes da confirmação
- ✅ **Offline Support**: Detecção de status online/offline

## 🚀 Próximos Passos

### **Implementações Futuras:**
1. **Service Worker**: Cache offline avançado
2. **Background Sync**: Sincronização em background
3. **Data Persistence**: IndexedDB para dados offline
4. **Performance Monitoring**: Métricas detalhadas
5. **A/B Testing**: Framework para testes
6. **Analytics**: Tracking de eventos de usuário

---

## 📚 Recursos Adicionais

- **TypeScript**: 100% tipado para máxima segurança
- **React Query**: Padrões similares para migração futura
- **SWR Compatibility**: Fácil migração se necessário
- **Testing**: Hooks preparados para testes unitários
- **Documentation**: JSDoc completo em todos os hooks

Esta arquitetura garante uma base sólida, escalável e maintível para o frontend do Launchpad Lunes, pronta para integração com qualquer backend REST ou GraphQL.
