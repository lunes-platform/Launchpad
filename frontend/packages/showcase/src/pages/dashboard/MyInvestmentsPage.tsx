import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Gift,
  ExternalLink,
  Filter,
  Search,
  Calendar,
  Target,
  Award
} from 'lucide-react'
import { formatCurrency, formatTokenAmount, formatPercentage, formatDate, formatTimeRemaining } from '@/lib/utils'

// Mock data
const investments = [
  {
    id: 'defi-protocol',
    name: 'DeFi Protocol',
    logo: '🔷',
    phase: 'Pré-Venda',
    status: 'active',
    investmentDate: new Date('2024-01-15'),
    invested: 1000,
    currentValue: 1250,
    tokens: 12500,
    symbol: 'DFP',
    price: 0.08,
    currentPrice: 0.10,
    nextVesting: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    vestingProgress: 25,
    totalVestingPeriod: 12,
    claimedTokens: 3125,
    pendingTokens: 9375,
    tier: 'S',
    network: 'Lunes'
  },
  {
    id: 'gaming-metaverse',
    name: 'Gaming Metaverse',
    logo: '🎮',
    phase: 'Whitelist',
    status: 'vesting',
    investmentDate: new Date('2024-01-10'),
    invested: 2000,
    currentValue: 2800,
    tokens: 8000,
    symbol: 'GMV',
    price: 0.25,
    currentPrice: 0.35,
    nextVesting: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    vestingProgress: 50,
    totalVestingPeriod: 6,
    claimedTokens: 4000,
    pendingTokens: 4000,
    tier: 'A',
    network: 'Lunes'
  },
  {
    id: 'ai-blockchain',
    name: 'AI Blockchain',
    logo: '🤖',
    phase: 'Launchpool',
    status: 'completed',
    investmentDate: new Date('2024-01-05'),
    invested: 0,
    currentValue: 450,
    tokens: 1500,
    symbol: 'AIB',
    price: 0,
    currentPrice: 0.30,
    nextVesting: null,
    vestingProgress: 100,
    totalVestingPeriod: 0,
    claimedTokens: 1500,
    pendingTokens: 0,
    tier: 'S',
    network: 'Lunes'
  },
  {
    id: 'web3-social',
    name: 'Web3 Social',
    logo: '🌐',
    phase: 'Venda Pública',
    status: 'active',
    investmentDate: new Date('2024-01-20'),
    invested: 500,
    currentValue: 480,
    tokens: 2000,
    symbol: 'W3S',
    price: 0.25,
    currentPrice: 0.24,
    nextVesting: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    vestingProgress: 0,
    totalVestingPeriod: 3,
    claimedTokens: 0,
    pendingTokens: 2000,
    tier: 'B',
    network: 'Lunes'
  }
]

const filterOptions = [
  { id: 'all', label: 'Todos', count: investments.length },
  { id: 'active', label: 'Ativos', count: investments.filter(i => i.status === 'active').length },
  { id: 'vesting', label: 'Em Vesting', count: investments.filter(i => i.status === 'vesting').length },
  { id: 'completed', label: 'Finalizados', count: investments.filter(i => i.status === 'completed').length }
]

const sortOptions = [
  { id: 'date', label: 'Data de Investimento' },
  { id: 'value', label: 'Valor Atual' },
  { id: 'gains', label: 'Ganhos' },
  { id: 'name', label: 'Nome do Projeto' }
]

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'S': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
    case 'A': return 'bg-gradient-to-r from-primary to-primaryLight text-white'
    case 'B': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
    case 'C': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    default: return 'bg-textMuted text-white'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-primary/20 text-primary border-primary/30'
    case 'vesting': return 'bg-warning/20 text-warning border-warning/30'
    case 'completed': return 'bg-success/20 text-success border-success/30'
    default: return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'Ativo'
    case 'vesting': return 'Em Vesting'
    case 'completed': return 'Finalizado'
    default: return status
  }
}

export function MyInvestmentsPage() {
  const { id } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedSort, setSelectedSort] = useState('date')
  const [showFilters, setShowFilters] = useState(false)

  // Se tem ID, mostrar detalhes do investimento específico
  if (id) {
    const investment = investments.find(inv => inv.id === id)
    
    if (!investment) {
      return (
        <div className="min-h-screen bg-slate-900">
          <div className="container-custom section-padding">
            <div className="text-center">
              <h1 className="heading-2 mb-4">Investimento não encontrado</h1>
              <Link to="/dashboard/meus-investimentos" className="btn-primary">
                Voltar para Investimentos
              </Link>
            </div>
          </div>
        </div>
      )
    }

    const gains = investment.currentValue - investment.invested
    const gainsPercentage = investment.invested > 0 ? (gains / investment.invested) * 100 : 0

    return (
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <div className="bg-slate-800/50 border-b border-slate-600Light">
          <div className="container-custom py-8">
            <Link
              to="/dashboard/meus-investimentos"
              className="inline-flex items-center space-x-2 text-slate-200 hover:text-primary transition-colors duration-200 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para Investimentos</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start space-x-6">
                <div className="text-6xl">{investment.logo}</div>
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <h1 className="heading-2">{investment.name}</h1>
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${getTierColor(investment.tier)}`}>
                      Tier {investment.tier}
                    </span>
                    <span className={`text-sm px-3 py-1 rounded-full border font-medium ${getStatusColor(investment.status)}`}>
                      {getStatusLabel(investment.status)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-200">
                    <span>Fase: {investment.phase}</span>
                    <span>•</span>
                    <span>Investido em {formatDate(investment.investmentDate)}</span>
                    <span>•</span>
                    <span>{investment.network} Network</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/projetos/${investment.id}`}
                className="btn-outline flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver Projeto</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-slate-400">Investido</span>
              </div>
              <p className="text-2xl font-bold mb-1">{formatCurrency(investment.invested)}</p>
              <p className="text-sm text-slate-200">
                {formatTokenAmount(investment.tokens, investment.symbol)} tokens
              </p>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <span className={`text-xs flex items-center ${gains >= 0 ? 'text-success' : 'text-error'}`}>
                  {gains >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {formatPercentage(Math.abs(gainsPercentage))}
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">{formatCurrency(investment.currentValue)}</p>
              <p className={`text-sm ${gains >= 0 ? 'text-success' : 'text-error'}`}>
                {gains >= 0 ? '+' : ''}{formatCurrency(gains)}
              </p>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 text-warning" />
                </div>
                <span className="text-xs text-slate-400">Reivindicados</span>
              </div>
              <p className="text-2xl font-bold mb-1">
                {formatTokenAmount(investment.claimedTokens, investment.symbol)}
              </p>
              <p className="text-sm text-slate-200">
                {formatPercentage(investment.vestingProgress)} liberado
              </p>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-info" />
                </div>
                <span className="text-xs text-slate-400">Pendentes</span>
              </div>
              <p className="text-2xl font-bold mb-1">
                {formatTokenAmount(investment.pendingTokens, investment.symbol)}
              </p>
              <p className="text-sm text-slate-200">
                {investment.nextVesting ? formatTimeRemaining(investment.nextVesting) : 'Finalizado'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Vesting Schedule */}
              {investment.totalVestingPeriod > 0 && (
                <div className="card">
                  <h3 className="heading-4 mb-6">Cronograma de Vesting</h3>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-200">Progresso do Vesting</span>
                      <span className="font-medium">{formatPercentage(investment.vestingProgress)}</span>
                    </div>
                    <div className="w-full bg-borderLight rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary to-primaryLight h-3 rounded-full transition-all duration-500"
                        style={{ width: `${investment.vestingProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Mock vesting schedule */}
                  <div className="space-y-3">
                    {Array.from({ length: investment.totalVestingPeriod }, (_, i) => {
                      const percentage = 100 / investment.totalVestingPeriod
                      const isReleased = (i + 1) * percentage <= investment.vestingProgress
                      const releaseDate = new Date(investment.investmentDate)
                      releaseDate.setMonth(releaseDate.getMonth() + i + 1)
                      
                      return (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-3 border rounded-button ${
                            isReleased
                              ? 'border-success/30 bg-success/10'
                              : 'border-slate-600Light bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isReleased ? 'bg-success/20' : 'bg-textMuted/20'
                            }`}>
                              {isReleased ? (
                                <Gift className="w-4 h-4 text-success" />
                              ) : (
                                <Clock className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                Liberação {i + 1} - {formatPercentage(percentage)}
                              </p>
                              <p className="text-sm text-slate-200">
                                {formatDate(releaseDate)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium">
                              {formatTokenAmount((investment.tokens * percentage) / 100, investment.symbol)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isReleased
                                ? 'bg-success/20 text-success'
                                : 'bg-textMuted/20 text-slate-400'
                            }`}>
                              {isReleased ? 'Liberado' : 'Pendente'}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {investment.pendingTokens > 0 && (
                    <Link
                      to="/dashboard/tokens-a-reivindicar"
                      className="btn-primary w-full mt-6"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Reivindicar Tokens Disponíveis
                    </Link>
                  )}
                </div>
              )}

              {/* Investment Details */}
              <div className="card">
                <h3 className="heading-4 mb-6">Detalhes do Investimento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-200">Preço de Compra:</span>
                      <span className="font-medium">{formatCurrency(investment.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-200">Preço Atual:</span>
                      <span className="font-medium">{formatCurrency(investment.currentPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-200">Tokens Comprados:</span>
                      <span className="font-medium">{formatTokenAmount(investment.tokens, investment.symbol)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-200">Fase de Participação:</span>
                      <span className="font-medium">{investment.phase}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-200">Data do Investimento:</span>
                      <span className="font-medium">{formatDate(investment.investmentDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-200">Período de Vesting:</span>
                      <span className="font-medium">
                        {investment.totalVestingPeriod > 0 ? `${investment.totalVestingPeriod} meses` : 'Sem vesting'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-200">Network:</span>
                      <span className="font-medium">{investment.network}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-200">Tier do Projeto:</span>
                      <span className={`text-sm px-2 py-1 rounded-full font-medium ${getTierColor(investment.tier)}`}>
                        Tier {investment.tier}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card">
                <h4 className="font-medium mb-4">Ações Rápidas</h4>
                
                <div className="space-y-3">
                  {investment.pendingTokens > 0 && (
                    <Link to="/dashboard/tokens-a-reivindicar" className="btn-primary w-full">
                      <Gift className="w-4 h-4 mr-2" />
                      Reivindicar Tokens
                    </Link>
                  )}
                  
                  <Link to={`/projetos/${investment.id}`} className="btn-outline w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver Projeto
                  </Link>
                  
                  <button className="btn-ghost w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Lembrete
                  </button>
                </div>
              </div>

              {/* Performance */}
              <div className="card">
                <h4 className="font-medium mb-4">Performance</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-200">ROI:</span>
                    <span className={`font-medium ${gains >= 0 ? 'text-success' : 'text-error'}`}>
                      {gains >= 0 ? '+' : ''}{formatPercentage(gainsPercentage)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-200">Ganho/Perda:</span>
                    <span className={`font-medium ${gains >= 0 ? 'text-success' : 'text-error'}`}>
                      {gains >= 0 ? '+' : ''}{formatCurrency(gains)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-200">Valorização:</span>
                    <span className={`font-medium ${investment.currentPrice >= investment.price ? 'text-success' : 'text-error'}`}>
                      {investment.currentPrice >= investment.price ? '+' : ''}
                      {formatPercentage(((investment.currentPrice - investment.price) / investment.price) * 100)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="card">
                <h4 className="font-medium mb-4">Avaliação de Risco</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200 text-sm">Tier do Projeto:</span>
                    <span className={`text-sm px-2 py-1 rounded-full font-medium ${getTierColor(investment.tier)}`}>
                      {investment.tier}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200 text-sm">Liquidez:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-2 bg-borderLight rounded-full">
                        <div className="w-8 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Média</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200 text-sm">Volatilidade:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-2 bg-borderLight rounded-full">
                        <div className="w-6 h-2 bg-warning rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Baixa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Lista de investimentos
  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = investment.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || investment.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  const sortedInvestments = [...filteredInvestments].sort((a, b) => {
    switch (selectedSort) {
      case 'date':
        return new Date(b.investmentDate).getTime() - new Date(a.investmentDate).getTime()
      case 'value':
        return b.currentValue - a.currentValue
      case 'gains':
        return (b.currentValue - b.invested) - (a.currentValue - a.invested)
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const totalInvested = investments.reduce((sum, inv) => sum + inv.invested, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalGains = totalCurrentValue - totalInvested
  const totalGainsPercentage = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-600Light">
        <div className="container-custom py-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-slate-200 hover:text-primary transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="heading-2 mb-2">Meus Investimentos</h1>
              <p className="text-slate-200">
                Acompanhe todos os seus investimentos e performance na plataforma
              </p>
            </div>

            <Link to="/projetos" className="btn-primary">
              <Target className="w-4 h-4 mr-2" />
              Explorar Projetos
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-slate-400">Total</span>
            </div>
            <p className="text-2xl font-bold mb-1">{formatCurrency(totalInvested)}</p>
            <p className="text-sm text-slate-200">Investido</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <span className={`text-xs flex items-center ${totalGains >= 0 ? 'text-success' : 'text-error'}`}>
                {totalGains >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {formatPercentage(Math.abs(totalGainsPercentage))}
              </span>
            </div>
            <p className="text-2xl font-bold mb-1">{formatCurrency(totalCurrentValue)}</p>
            <p className="text-sm text-slate-200">Valor Atual</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-warning" />
              </div>
              <span className={`text-xs ${totalGains >= 0 ? 'text-success' : 'text-error'}`}>
                {totalGains >= 0 ? '+' : ''}{formatCurrency(totalGains)}
              </span>
            </div>
            <p className={`text-2xl font-bold mb-1 ${totalGains >= 0 ? 'text-success' : 'text-error'}`}>
              {totalGains >= 0 ? '+' : ''}{formatPercentage(totalGainsPercentage)}
            </p>
            <p className="text-sm text-slate-200">Ganhos/Perdas</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-info" />
              </div>
              <span className="text-xs text-slate-400">{investments.length} total</span>
            </div>
            <p className="text-2xl font-bold mb-1">{investments.filter(i => i.status === 'active').length}</p>
            <p className="text-sm text-slate-200">Investimentos Ativos</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedFilter(option.id)}
                  className={`px-4 py-2 rounded-button font-medium transition-colors duration-200 ${
                    selectedFilter === option.id
                      ? 'bg-primary text-white'
                      : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
                  }`}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </button>

              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="input py-2 px-3"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12 w-full"
            />
          </div>
        </div>

        {/* Investments List */}
        <div className="space-y-4">
          {sortedInvestments.map((investment) => {
            const gains = investment.currentValue - investment.invested
            const gainsPercentage = investment.invested > 0 ? (gains / investment.invested) * 100 : 0

            return (
              <Link
                key={investment.id}
                to={`/dashboard/meus-investimentos/${investment.id}`}
                className="card-hover group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{investment.logo}</div>

                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-title font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                          {investment.name}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(investment.tier)}`}>
                          Tier {investment.tier}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(investment.status)}`}>
                          {getStatusLabel(investment.status)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-slate-200">
                        <span>Fase: {investment.phase}</span>
                        <span>•</span>
                        <span>{formatTokenAmount(investment.tokens, investment.symbol)}</span>
                        <span>•</span>
                        <span>{formatDate(investment.investmentDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Investido</p>
                        <p className="font-medium">{formatCurrency(investment.invested)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 mb-1">Valor Atual</p>
                        <p className="font-medium">{formatCurrency(investment.currentValue)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 mb-1">Ganho/Perda</p>
                        <p className={`font-medium ${gains >= 0 ? 'text-success' : 'text-error'}`}>
                          {gains >= 0 ? '+' : ''}{formatCurrency(gains)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 mb-1">ROI</p>
                        <p className={`font-medium ${gains >= 0 ? 'text-success' : 'text-error'}`}>
                          {gains >= 0 ? '+' : ''}{formatPercentage(gainsPercentage)}
                        </p>
                      </div>
                    </div>

                    {investment.vestingProgress > 0 && investment.vestingProgress < 100 && (
                      <div className="min-w-32">
                        <p className="text-xs text-slate-400 mb-1">Vesting</p>
                        <div className="w-full bg-borderLight rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${investment.vestingProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-200 mt-1">
                          {formatPercentage(investment.vestingProgress)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {sortedInvestments.length === 0 && (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="heading-4 mb-2">Nenhum investimento encontrado</h3>
            <p className="text-slate-200 mb-6">
              {searchQuery || selectedFilter !== 'all'
                ? 'Tente ajustar os filtros ou termo de busca.'
                : 'Você ainda não fez nenhum investimento na plataforma.'
              }
            </p>
            <Link to="/projetos" className="btn-primary">
              <Target className="w-4 h-4 mr-2" />
              Explorar Projetos
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
