import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Landmark,
  TrendingUp,
  DollarSign,
  Users,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Target,
  Award,
  Calendar,
  Info,
  ExternalLink,
  RefreshCw,
  Download,
  Eye,
  Lock
} from 'lucide-react'
import { StatsCard, MetricCard, ProgressStatsCard } from '@/components/ui/StatsCard'
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils'
import { useApp } from '@/contexts/AppContext'
import { useWallet } from '@/contexts/WalletContext'

// Treasury interfaces
interface TreasuryAsset {
  symbol: string
  name: string
  balance: number
  value: number
  allocation: number
  change24h: number
  logo: string
}

interface TreasuryTransaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'investment' | 'return' | 'airdrop'
  amount: number
  asset: string
  description: string
  timestamp: Date
  txHash: string
  status: 'completed' | 'pending' | 'failed'
}

interface InvestmentPosition {
  id: string
  projectName: string
  projectLogo: string
  amount: number
  currentValue: number
  roi: number
  allocation: number
  status: 'active' | 'completed' | 'pending'
  investmentDate: Date
}

// Mock treasury data
const treasuryAssets: TreasuryAsset[] = [
  {
    symbol: 'LUNES',
    name: 'Lunes Token',
    balance: 2500000,
    value: 1875000,
    allocation: 45.2,
    change24h: 3.2,
    logo: '🌙'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    balance: 850000,
    value: 850000,
    allocation: 20.5,
    change24h: 0.1,
    logo: '💵'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 650000,
    value: 650000,
    allocation: 15.7,
    change24h: -0.2,
    logo: '🔵'
  },
  {
    symbol: 'DFP',
    name: 'DeFi Protocol',
    balance: 125000,
    value: 312500,
    allocation: 7.5,
    change24h: 12.8,
    logo: '🔷'
  },
  {
    symbol: 'GMV',
    name: 'Gaming Metaverse',
    balance: 85000,
    value: 297500,
    allocation: 7.2,
    change24h: -2.1,
    logo: '🎮'
  },
  {
    symbol: 'AIB',
    name: 'AI Blockchain',
    balance: 45000,
    value: 157500,
    allocation: 3.8,
    change24h: 8.5,
    logo: '🤖'
  }
]

const recentTransactions: TreasuryTransaction[] = [
  {
    id: '1',
    type: 'airdrop',
    amount: 50000,
    asset: 'DFP',
    description: 'Airdrop automático de 40% dos tokens DFP',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    txHash: '0x1234...5678',
    status: 'completed'
  },
  {
    id: '2',
    type: 'investment',
    amount: 500000,
    asset: 'USDT',
    description: 'Investimento no projeto AI Blockchain',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    txHash: '0x9876...5432',
    status: 'completed'
  },
  {
    id: '3',
    type: 'return',
    amount: 125000,
    asset: 'GMV',
    description: 'Retorno do investimento Gaming Metaverse',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    txHash: '0xabcd...efgh',
    status: 'completed'
  },
  {
    id: '4',
    type: 'deposit',
    amount: 250000,
    asset: 'LUNES',
    description: 'Depósito de receitas da plataforma',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    txHash: '0xijkl...mnop',
    status: 'completed'
  }
]

const investmentPositions: InvestmentPosition[] = [
  {
    id: '1',
    projectName: 'DeFi Protocol',
    projectLogo: '🔷',
    amount: 750000,
    currentValue: 1125000,
    roi: 50,
    allocation: 18.2,
    status: 'active',
    investmentDate: new Date('2024-01-15')
  },
  {
    id: '2',
    projectName: 'Gaming Metaverse',
    projectLogo: '🎮',
    amount: 500000,
    currentValue: 650000,
    roi: 30,
    allocation: 10.5,
    status: 'active',
    investmentDate: new Date('2024-01-20')
  },
  {
    id: '3',
    projectName: 'AI Blockchain',
    projectLogo: '🤖',
    amount: 600000,
    currentValue: 900000,
    roi: 50,
    allocation: 14.5,
    status: 'active',
    investmentDate: new Date('2024-02-01')
  },
  {
    id: '4',
    projectName: 'Web3 Social',
    projectLogo: '🌐',
    amount: 300000,
    currentValue: 360000,
    roi: 20,
    allocation: 5.8,
    status: 'completed',
    investmentDate: new Date('2023-12-10')
  }
]

export default function TreasuryPage() {
  const { platformStats } = useApp()
  const { selectedAccount } = useWallet()
  const [activeTab, setActiveTab] = useState('overview')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calculate treasury statistics
  const totalValue = treasuryAssets.reduce((sum, asset) => sum + asset.value, 0)
  const totalInvestments = investmentPositions.reduce((sum, pos) => sum + pos.currentValue, 0)
  const totalROI = investmentPositions.reduce((sum, pos) => sum + pos.roi, 0) / investmentPositions.length
  const activePositions = investmentPositions.filter(pos => pos.status === 'active').length

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownRight className="w-4 h-4 text-success" />
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-error" />
      case 'investment': return <Target className="w-4 h-4 text-primary" />
      case 'return': return <TrendingUp className="w-4 h-4 text-success" />
      case 'airdrop': return <Award className="w-4 h-4 text-warning" />
      default: return <DollarSign className="w-4 h-4 text-slate-400" />
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'Depósito'
      case 'withdrawal': return 'Saque'
      case 'investment': return 'Investimento'
      case 'return': return 'Retorno'
      case 'airdrop': return 'Airdrop'
      default: return type
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container-custom text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
            <Landmark className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Smart Fund Treasury</span>
          </div>

          <h1 className="heading-1 mb-6">
            <Landmark className="w-12 h-12 inline-block mr-4 text-primary" />
            Treasury <span className="text-gradient">LUNES</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Acompanhe o Smart Fund Treasury da plataforma com transparência total.
            Gestão profissional de ativos, investimentos estratégicos e distribuição automática de airdrops.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="#portfolio" className="btn-primary">
              <PieChart className="w-4 h-4 mr-2" />
              Ver Portfolio
            </Link>
            <Link to="/docs/treasury" className="btn-outline">
              <Info className="w-4 h-4 mr-2" />
              Como Funciona
            </Link>
          </div>
        </div>
      </section>

      {/* Treasury Statistics */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-3">Visão Geral do Treasury</h2>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-outline flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              label="Valor Total"
              value={formatCurrency(totalValue)}
              change={{ value: 8.5, period: 'últimos 30 dias' }}
              icon={Landmark}
              color="primary"
            />
            <MetricCard
              label="Investimentos Ativos"
              value={formatCurrency(totalInvestments)}
              change={{ value: 12.3, period: 'este mês' }}
              icon={Target}
              color="success"
            />
            <MetricCard
              label="ROI Médio"
              value={`${totalROI.toFixed(1)}%`}
              change={{ value: 5.2, period: 'performance' }}
              icon={TrendingUp}
              color="warning"
            />
            <MetricCard
              label="Posições Ativas"
              value={activePositions}
              change={{ value: 2, period: 'novos projetos' }}
              icon={PieChart}
              color="info"
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                activeTab === 'overview'
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
              }`}
            >
              <PieChart className="w-4 h-4 mr-2 inline-block" />
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('investments')}
              className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                activeTab === 'investments'
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
              }`}
            >
              <Target className="w-4 h-4 mr-2 inline-block" />
              Investimentos
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                activeTab === 'transactions'
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2 inline-block" />
              Transações
            </button>
          </div>
        </div>
      </section>

      <div className="container-custom pb-8">
        {/* Portfolio Overview */}
        {activeTab === 'overview' && (
          <div id="portfolio">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Composição do Portfolio</h2>
              <p className="text-slate-200">
                Valor total: {formatCurrency(totalValue)}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Asset Allocation */}
              <div className="lg:col-span-2">
                <div className="card">
                  <h3 className="heading-4 mb-6">Ativos do Treasury</h3>
                  <div className="space-y-4">
                    {treasuryAssets.map((asset) => (
                      <div key={asset.symbol} className="flex items-center justify-between p-4 bg-slate-800 rounded-card">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{asset.logo}</div>
                          <div>
                            <h4 className="font-medium">{asset.symbol}</h4>
                            <p className="text-sm text-slate-200">{asset.name}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(asset.value)}</p>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-slate-200">{formatPercentage(asset.allocation)}</span>
                            <span className={`${asset.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                              {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Allocation Chart Placeholder */}
              <div className="card">
                <h3 className="heading-4 mb-6">Distribuição de Ativos</h3>
                <div className="space-y-3">
                  {treasuryAssets.slice(0, 5).map((asset) => (
                    <div key={asset.symbol}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{asset.symbol}</span>
                        <span>{formatPercentage(asset.allocation)}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                          style={{ width: `${asset.allocation}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-info/10 border border-info/20 rounded-card">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-info mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-info mb-1">Diversificação</p>
                      <p className="text-slate-200">
                        Portfolio bem diversificado com {treasuryAssets.length} ativos diferentes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Investment Positions */}
        {activeTab === 'investments' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Posições de Investimento</h2>
              <p className="text-slate-200">
                {investmentPositions.length} investimentos
              </p>
            </div>

            <div className="space-y-6">
              {investmentPositions.map((position) => (
                <div key={position.id} className="card">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{position.projectLogo}</div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="heading-4">{position.projectName}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                            position.status === 'active'
                              ? 'bg-success/20 text-success border-success/30'
                              : position.status === 'completed'
                              ? 'bg-info/20 text-info border-info/30'
                              : 'bg-warning/20 text-warning border-warning/30'
                          }`}>
                            {position.status === 'active' ? 'Ativo' :
                             position.status === 'completed' ? 'Finalizado' : 'Pendente'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-slate-200 mb-3">
                          <span>Investido em {formatDate(position.investmentDate)}</span>
                          <span>•</span>
                          <span>Alocação: {formatPercentage(position.allocation)}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Investimento</p>
                            <p className="font-medium">{formatCurrency(position.amount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Valor Atual</p>
                            <p className="font-medium">{formatCurrency(position.currentValue)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">ROI</p>
                            <p className={`font-medium ${position.roi >= 0 ? 'text-success' : 'text-error'}`}>
                              {position.roi >= 0 ? '+' : ''}{position.roi}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Lucro/Prejuízo</p>
                            <p className={`font-medium ${position.currentValue >= position.amount ? 'text-success' : 'text-error'}`}>
                              {formatCurrency(position.currentValue - position.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-48">
                      <div className="bg-slate-800 border border-slate-600 rounded-card p-4 text-center">
                        <p className="text-sm text-slate-200 mb-2">Performance</p>
                        <p className={`text-2xl font-bold ${position.roi >= 0 ? 'text-success' : 'text-error'}`}>
                          {position.roi >= 0 ? '+' : ''}{position.roi}%
                        </p>
                        <div className="mt-3">
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${position.roi >= 0 ? 'bg-success' : 'bg-error'}`}
                              style={{ width: `${Math.min(Math.abs(position.roi), 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {activeTab === 'transactions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Transações Recentes</h2>
              <div className="flex items-center space-x-2">
                <button className="btn-outline text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </button>
              </div>
            </div>

            <div className="card">
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-card">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{getTransactionLabel(transaction.type)}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            transaction.status === 'completed'
                              ? 'bg-success/20 text-success'
                              : transaction.status === 'pending'
                              ? 'bg-warning/20 text-warning'
                              : 'bg-error/20 text-error'
                          }`}>
                            {transaction.status === 'completed' ? 'Concluído' :
                             transaction.status === 'pending' ? 'Pendente' : 'Falhou'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-200">{transaction.description}</p>
                        <p className="text-xs text-slate-400">{formatDate(transaction.timestamp)}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(transaction.amount)} {transaction.asset}
                      </p>
                      <a
                        href={`https://explorer.lunes.io/tx/${transaction.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:text-primaryLight flex items-center space-x-1"
                      >
                        <span>{transaction.txHash}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Treasury Info */}
        <div className="mt-16">
          <div className="card bg-info/10 border-info/20">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-info mb-2">Sobre o Smart Fund Treasury</h4>
                <ul className="text-sm text-slate-200 space-y-1">
                  <li>• <strong>Gestão Profissional:</strong> Ativos gerenciados por equipe especializada</li>
                  <li>• <strong>Transparência Total:</strong> Todas as transações são públicas e verificáveis</li>
                  <li>• <strong>Diversificação:</strong> Portfolio diversificado para reduzir riscos</li>
                  <li>• <strong>Airdrops Automáticos:</strong> 40% dos tokens de projetos são distribuídos automaticamente</li>
                  <li>• <strong>Governança:</strong> Decisões importantes são votadas pela comunidade</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
