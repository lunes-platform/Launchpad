import { Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Gift,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Bell,
  Settings,
  ExternalLink
} from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { formatCurrency, formatTokenAmount, formatPercentage, formatDate } from '@/lib/utils'
import { MyInvestmentsPage } from './dashboard/MyInvestmentsPage'
import { ClaimTokensPage } from './dashboard/ClaimTokensPage'
import { WalletsPage } from './dashboard/WalletsPage'
import { HistoryPage } from './dashboard/HistoryPage'
import { AirdropClaimsPage } from './dashboard/AirdropClaimsPage'
import { UserSettingsPage } from './dashboard/UserSettingsPage'

// Mock data - em produção viria da API
const mockUserData = {
  totalInvested: 15750.00,
  totalValue: 18920.50,
  totalGains: 3170.50,
  gainsPercentage: 20.13,
  activeInvestments: 8,
  completedInvestments: 12,
  pendingClaims: 4,
  totalClaimed: 8450.00,
  lunesBalance: 25000.00,
  stakingRewards: 1250.30,
}

const recentActivities = [
  {
    id: 1,
    type: 'investment',
    project: 'DeFi Protocol',
    action: 'Investimento na Pré-Venda',
    amount: 1000,
    currency: 'USDT',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: 2,
    type: 'claim',
    project: 'Gaming Metaverse',
    action: 'Tokens Reivindicados',
    amount: 500,
    currency: 'GMV',
    date: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: 3,
    type: 'staking',
    project: 'AI Blockchain',
    action: 'Staking Launchpool',
    amount: 5000,
    currency: 'LUNES',
    date: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 4,
    type: 'whitelist',
    project: 'Web3 Social',
    action: 'Aprovado na Whitelist',
    amount: 0,
    currency: '',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'approved'
  }
]

const activeInvestments = [
  {
    id: 'defi-protocol',
    name: 'DeFi Protocol',
    logo: '🔷',
    phase: 'Pré-Venda',
    invested: 1000,
    currentValue: 1250,
    tokens: 12500,
    symbol: 'DFP',
    nextVesting: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    vestingProgress: 25
  },
  {
    id: 'gaming-metaverse',
    name: 'Gaming Metaverse',
    logo: '🎮',
    phase: 'Finalizado',
    invested: 2000,
    currentValue: 2800,
    tokens: 8000,
    symbol: 'GMV',
    nextVesting: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    vestingProgress: 50
  },
  {
    id: 'ai-blockchain',
    name: 'AI Blockchain',
    logo: '🤖',
    phase: 'Launchpool',
    invested: 0,
    currentValue: 450,
    tokens: 1500,
    symbol: 'AIB',
    nextVesting: null,
    vestingProgress: 0
  }
]

function DashboardOverview() {
  const { isConnected, selectedAccount, connectWallet } = useWallet()
  const [timeRange, setTimeRange] = useState('7d')

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container-custom section-padding">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <h1 className="heading-2 mb-4">Conecte sua Carteira</h1>
            <p className="text-slate-200 mb-8 max-w-md mx-auto">
              Para acessar seu dashboard e acompanhar seus investimentos,
              você precisa conectar uma carteira compatível.
            </p>
            <button onClick={connectWallet} className="btn-primary">
              Conectar Carteira
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-600Light">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="heading-2 mb-2">
                Bem-vindo de volta! 👋
              </h1>
              <p className="text-slate-200">
                Acompanhe seus investimentos e recompensas na plataforma Launchpad Lunes
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input py-2 px-3"
              >
                <option value="24h">Últimas 24h</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
              </select>

              <Link to="/dashboard/configuracoes" className="btn-outline">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Investido */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-success flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +12.5%
              </span>
            </div>
            <p className="text-2xl font-bold mb-1">{formatCurrency(mockUserData.totalInvested)}</p>
            <p className="text-sm text-slate-200">Total Investido</p>
          </div>

          {/* Valor Atual */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <span className="text-xs text-success flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +{formatPercentage(mockUserData.gainsPercentage)}
              </span>
            </div>
            <p className="text-2xl font-bold mb-1">{formatCurrency(mockUserData.totalValue)}</p>
            <p className="text-sm text-slate-200">Valor Atual</p>
          </div>

          {/* Ganhos */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-warning" />
              </div>
              <span className="text-xs text-success">
                +{formatCurrency(mockUserData.totalGains)}
              </span>
            </div>
            <p className="text-2xl font-bold mb-1 text-success">
              +{formatPercentage(mockUserData.gainsPercentage)}
            </p>
            <p className="text-sm text-slate-200">Ganhos Totais</p>
          </div>

          {/* Tokens Pendentes */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-info" />
              </div>
              <span className="text-xs text-info">
                {mockUserData.pendingClaims} pendentes
              </span>
            </div>
            <p className="text-2xl font-bold mb-1">{formatCurrency(mockUserData.totalClaimed)}</p>
            <p className="text-sm text-slate-200">Tokens Reivindicados</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/dashboard/meus-investimentos" className="card-hover group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors duration-200">
                  Meus Investimentos
                </p>
                <p className="text-sm text-slate-200">
                  {mockUserData.activeInvestments} ativos
                </p>
              </div>
            </div>
          </Link>

          <Link to="/dashboard/tokens-a-reivindicar" className="card-hover group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors duration-200">
                  Reivindicar Tokens
                </p>
                <p className="text-sm text-slate-200">
                  {mockUserData.pendingClaims} disponíveis
                </p>
              </div>
            </div>
          </Link>

          <Link to="/projetos" className="card-hover group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors duration-200">
                  Novos Projetos
                </p>
                <p className="text-sm text-slate-200">
                  Explorar oportunidades
                </p>
              </div>
            </div>
          </Link>

          <Link to="/launchpool" className="card-hover group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors duration-200">
                  Launchpool
                </p>
                <p className="text-sm text-slate-200">
                  Staking ativo
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Investments & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Investments */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="heading-4">Investimentos Ativos</h3>
                <Link to="/dashboard/meus-investimentos" className="btn-outline text-sm">
                  Ver Todos
                </Link>
              </div>

              <div className="space-y-4">
                {activeInvestments.slice(0, 3).map((investment) => (
                  <Link
                    key={investment.id}
                    to={`/dashboard/meus-investimentos/${investment.id}`}
                    className="block p-4 bg-slate-800 hover:bg-slate-800Hover border border-slate-600Light rounded-button transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{investment.logo}</div>
                        <div>
                          <h4 className="font-medium">{investment.name}</h4>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-slate-200">{investment.phase}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-primary">
                              {formatTokenAmount(investment.tokens, investment.symbol)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(investment.currentValue)}
                        </p>
                        <p className={`text-sm ${
                          investment.currentValue > investment.invested
                            ? 'text-success'
                            : 'text-error'
                        }`}>
                          {investment.currentValue > investment.invested ? '+' : ''}
                          {formatCurrency(investment.currentValue - investment.invested)}
                        </p>
                      </div>
                    </div>

                    {investment.vestingProgress > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Vesting Progress</span>
                          <span>{investment.vestingProgress}%</span>
                        </div>
                        <div className="w-full bg-borderLight rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${investment.vestingProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="heading-4">Atividade Recente</h3>
                <Link to="/dashboard/historico" className="btn-outline text-sm">
                  Ver Histórico
                </Link>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-slate-800 border border-slate-600Light rounded-button">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'investment' ? 'bg-primary/20' :
                      activity.type === 'claim' ? 'bg-success/20' :
                      activity.type === 'staking' ? 'bg-warning/20' :
                      'bg-info/20'
                    }`}>
                      {activity.type === 'investment' && <DollarSign className="w-5 h-5 text-primary" />}
                      {activity.type === 'claim' && <Gift className="w-5 h-5 text-success" />}
                      {activity.type === 'staking' && <Clock className="w-5 h-5 text-warning" />}
                      {activity.type === 'whitelist' && <Users className="w-5 h-5 text-info" />}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-slate-200">{activity.project}</p>
                    </div>

                    <div className="text-right">
                      {activity.amount > 0 && (
                        <p className="font-medium">
                          {formatTokenAmount(activity.amount, activity.currency)}
                        </p>
                      )}
                      <p className="text-xs text-slate-400">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Portfolio Summary */}
            <div className="card">
              <h4 className="font-medium mb-4">Resumo do Portfólio</h4>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-200">Saldo LUNES</span>
                  <span className="font-medium">
                    {formatTokenAmount(mockUserData.lunesBalance, 'LUNES')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-200">Recompensas Staking</span>
                  <span className="font-medium text-success">
                    +{formatTokenAmount(mockUserData.stakingRewards, 'LUNES')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-200">Investimentos Ativos</span>
                  <span className="font-medium">{mockUserData.activeInvestments}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-200">Projetos Finalizados</span>
                  <span className="font-medium">{mockUserData.completedInvestments}</span>
                </div>
              </div>

              <Link to="/dashboard/carteiras" className="btn-outline w-full mt-4">
                <Wallet className="w-4 h-4 mr-2" />
                Gerenciar Carteiras
              </Link>
            </div>

            {/* Notifications */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <Bell className="w-4 h-4 text-primary" />
                <h4 className="font-medium">Notificações</h4>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-button">
                  <p className="text-sm font-medium text-primary">Nova liberação de tokens</p>
                  <p className="text-xs text-slate-200">Gaming Metaverse - 25% disponível</p>
                </div>

                <div className="p-3 bg-success/10 border border-success/20 rounded-button">
                  <p className="text-sm font-medium text-success">Whitelist aprovada</p>
                  <p className="text-xs text-slate-200">Web3 Social - Você foi aprovado!</p>
                </div>

                <div className="p-3 bg-warning/10 border border-warning/20 rounded-button">
                  <p className="text-sm font-medium text-warning">Novo projeto</p>
                  <p className="text-xs text-slate-200">DeFi Insurance - Whitelist aberta</p>
                </div>
              </div>

              <Link to="/dashboard/historico" className="text-sm text-primary hover:text-primaryLight transition-colors duration-200 mt-3">
                Ver todas as notificações
              </Link>
            </div>

            {/* Quick Links */}
            <div className="card">
              <h4 className="font-medium mb-4">Links Úteis</h4>

              <div className="space-y-2">
                <Link
                  to="/docs"
                  className="flex items-center justify-between p-2 hover:bg-slate-800 rounded-button transition-colors duration-200"
                >
                  <span className="text-sm">Documentação</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </Link>

                <Link
                  to="/como-participar"
                  className="flex items-center justify-between p-2 hover:bg-slate-800 rounded-button transition-colors duration-200"
                >
                  <span className="text-sm">Como Participar</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </Link>

                <Link
                  to="/governance"
                  className="flex items-center justify-between p-2 hover:bg-slate-800 rounded-button transition-colors duration-200"
                >
                  <span className="text-sm">Governança</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </Link>

                <Link
                  to="/treasury"
                  className="flex items-center justify-between p-2 hover:bg-slate-800 rounded-button transition-colors duration-200"
                >
                  <span className="text-sm">Treasury</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Routes>
      <Route path="/" element={<DashboardOverview />} />
      <Route path="/meus-investimentos" element={<MyInvestmentsPage />} />
      <Route path="/meus-investimentos/:id" element={<MyInvestmentsPage />} />
      <Route path="/tokens-a-reivindicar" element={<ClaimTokensPage />} />
      <Route path="/carteiras" element={<WalletsPage />} />
      <Route path="/historico" element={<HistoryPage />} />
      <Route path="/airdrop-claims" element={<AirdropClaimsPage />} />
      <Route path="/configuracoes" element={<UserSettingsPage />} />
    </Routes>
  )
}
