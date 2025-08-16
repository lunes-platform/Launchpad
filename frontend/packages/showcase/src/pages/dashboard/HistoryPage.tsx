import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download,
  ExternalLink,
  DollarSign,
  Gift,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react'
import { formatCurrency, formatTokenAmount, formatDate } from '@/lib/utils'

// Mock data
const transactions = [
  {
    id: 'tx-001',
    type: 'investment',
    project: 'DeFi Protocol',
    projectLogo: '🔷',
    action: 'Investimento na Pré-Venda',
    amount: 1000,
    currency: 'USDT',
    tokensReceived: 12500,
    tokenSymbol: 'DFP',
    date: new Date('2024-01-15T14:30:00'),
    status: 'completed',
    transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
    network: 'Lunes Network',
    phase: 'Pré-Venda',
    discount: 25
  },
  {
    id: 'tx-002',
    type: 'claim',
    project: 'Gaming Metaverse',
    projectLogo: '🎮',
    action: 'Tokens Reivindicados',
    amount: 2000,
    currency: 'GMV',
    tokensReceived: 2000,
    tokenSymbol: 'GMV',
    date: new Date('2024-01-20T09:15:00'),
    status: 'completed',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
    network: 'Lunes Network',
    phase: 'Vesting',
    vestingRound: 1
  },
  {
    id: 'tx-003',
    type: 'staking',
    project: 'AI Blockchain',
    projectLogo: '🤖',
    action: 'Staking Launchpool',
    amount: 5000,
    currency: 'LUNES',
    tokensReceived: 0,
    tokenSymbol: 'LUNES',
    date: new Date('2024-01-22T16:45:00'),
    status: 'active',
    transactionHash: '0xdef1234567890abcdef1234567890abcdef123456',
    network: 'Lunes Network',
    phase: 'Launchpool',
    apr: 45.5
  },
  {
    id: 'tx-004',
    type: 'whitelist',
    project: 'Web3 Social',
    projectLogo: '🌐',
    action: 'Aprovado na Whitelist',
    amount: 0,
    currency: '',
    tokensReceived: 0,
    tokenSymbol: '',
    date: new Date('2024-01-25T11:20:00'),
    status: 'approved',
    transactionHash: '',
    network: 'Lunes Network',
    phase: 'Whitelist',
    discount: 45
  },
  {
    id: 'tx-005',
    type: 'raffle',
    project: 'DeFi Insurance',
    projectLogo: '🛡️',
    action: 'Compra de Bilhetes de Rifa',
    amount: 25,
    currency: 'USDT',
    tokensReceived: 50,
    tokenSymbol: 'tickets',
    date: new Date('2024-01-28T13:10:00'),
    status: 'completed',
    transactionHash: '0x567890abcdef1234567890abcdef1234567890ab',
    network: 'TON Network',
    phase: 'Rifa',
    ticketCount: 50
  },
  {
    id: 'tx-006',
    type: 'investment',
    project: 'Gaming Metaverse',
    projectLogo: '🎮',
    action: 'Investimento na Whitelist',
    amount: 2000,
    currency: 'USDT',
    tokensReceived: 8000,
    tokenSymbol: 'GMV',
    date: new Date('2024-01-10T10:30:00'),
    status: 'completed',
    transactionHash: '0x890abcdef1234567890abcdef1234567890abcdef',
    network: 'Lunes Network',
    phase: 'Whitelist',
    discount: 50
  },
  {
    id: 'tx-007',
    type: 'unstaking',
    project: 'AI Blockchain',
    projectLogo: '🤖',
    action: 'Unstaking Launchpool',
    amount: 2000,
    currency: 'LUNES',
    tokensReceived: 750,
    tokenSymbol: 'AIB',
    date: new Date('2024-01-30T08:45:00'),
    status: 'completed',
    transactionHash: '0xcdef1234567890abcdef1234567890abcdef12345',
    network: 'Lunes Network',
    phase: 'Launchpool',
    rewards: 750
  }
]

const filterOptions = [
  { id: 'all', label: 'Todas', count: transactions.length },
  { id: 'investment', label: 'Investimentos', count: transactions.filter(t => t.type === 'investment').length },
  { id: 'claim', label: 'Reivindicações', count: transactions.filter(t => t.type === 'claim').length },
  { id: 'staking', label: 'Staking', count: transactions.filter(t => t.type === 'staking' || t.type === 'unstaking').length },
  { id: 'whitelist', label: 'Whitelist', count: transactions.filter(t => t.type === 'whitelist').length },
  { id: 'raffle', label: 'Rifas', count: transactions.filter(t => t.type === 'raffle').length }
]

const sortOptions = [
  { id: 'date-desc', label: 'Mais Recentes' },
  { id: 'date-asc', label: 'Mais Antigas' },
  { id: 'amount-desc', label: 'Maior Valor' },
  { id: 'amount-asc', label: 'Menor Valor' },
  { id: 'project', label: 'Projeto A-Z' }
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'investment': return <DollarSign className="w-5 h-5 text-primary" />
    case 'claim': return <Gift className="w-5 h-5 text-success" />
    case 'staking': return <TrendingUp className="w-5 h-5 text-warning" />
    case 'unstaking': return <TrendingUp className="w-5 h-5 text-info" />
    case 'whitelist': return <Users className="w-5 h-5 text-info" />
    case 'raffle': return <Gift className="w-5 h-5 text-accent" />
    default: return <Clock className="w-5 h-5 text-slate-400" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'investment': return 'bg-primary/20'
    case 'claim': return 'bg-success/20'
    case 'staking': return 'bg-warning/20'
    case 'unstaking': return 'bg-info/20'
    case 'whitelist': return 'bg-info/20'
    case 'raffle': return 'bg-accent/20'
    default: return 'bg-textMuted/20'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-success/20 text-success border-success/30'
    case 'active': return 'bg-primary/20 text-primary border-primary/30'
    case 'approved': return 'bg-info/20 text-info border-info/30'
    case 'pending': return 'bg-warning/20 text-warning border-warning/30'
    case 'failed': return 'bg-error/20 text-error border-error/30'
    default: return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed': return 'Concluída'
    case 'active': return 'Ativa'
    case 'approved': return 'Aprovada'
    case 'pending': return 'Pendente'
    case 'failed': return 'Falhou'
    default: return status
  }
}

export function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedSort, setSelectedSort] = useState('date-desc')
  const [dateRange, setDateRange] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.action.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || 
                         transaction.type === selectedFilter ||
                         (selectedFilter === 'staking' && (transaction.type === 'staking' || transaction.type === 'unstaking'))
    
    let matchesDate = true
    if (dateRange !== 'all') {
      const now = new Date()
      const transactionDate = new Date(transaction.date)
      switch (dateRange) {
        case '7d':
          matchesDate = (now.getTime() - transactionDate.getTime()) <= 7 * 24 * 60 * 60 * 1000
          break
        case '30d':
          matchesDate = (now.getTime() - transactionDate.getTime()) <= 30 * 24 * 60 * 60 * 1000
          break
        case '90d':
          matchesDate = (now.getTime() - transactionDate.getTime()) <= 90 * 24 * 60 * 60 * 1000
          break
      }
    }
    
    return matchesSearch && matchesFilter && matchesDate
  })

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (selectedSort) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'amount-desc':
        return b.amount - a.amount
      case 'amount-asc':
        return a.amount - b.amount
      case 'project':
        return a.project.localeCompare(b.project)
      default:
        return 0
    }
  })

  const handleExportHistory = () => {
    // Mock export functionality
    const csvContent = [
      ['Data', 'Projeto', 'Ação', 'Valor', 'Moeda', 'Status', 'Hash'],
      ...sortedTransactions.map(tx => [
        formatDate(tx.date),
        tx.project,
        tx.action,
        tx.amount.toString(),
        tx.currency,
        getStatusLabel(tx.status),
        tx.transactionHash
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'historico-transacoes.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

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
              <h1 className="heading-2 mb-2">Histórico de Transações</h1>
              <p className="text-slate-200">
                Acompanhe todas as suas atividades na plataforma
              </p>
            </div>
            
            <button
              onClick={handleExportHistory}
              className="btn-outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Histórico
            </button>
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
            <p className="text-2xl font-bold mb-1">
              {transactions.filter(t => t.type === 'investment').length}
            </p>
            <p className="text-sm text-slate-200">Investimentos</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-success" />
              </div>
              <span className="text-xs text-slate-400">Total</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {transactions.filter(t => t.type === 'claim').length}
            </p>
            <p className="text-sm text-slate-200">Reivindicações</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <span className="text-xs text-slate-400">Ativo</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {transactions.filter(t => t.status === 'active').length}
            </p>
            <p className="text-sm text-slate-200">Operações Ativas</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-info" />
              </div>
              <span className="text-xs text-slate-400">Este Mês</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {transactions.filter(t => {
                const now = new Date()
                const txDate = new Date(t.date)
                return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()
              }).length}
            </p>
            <p className="text-sm text-slate-200">Transações</p>
          </div>
        </div>

        {/* Filters */}
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
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="input py-2 px-3"
              >
                <option value="all">Todos os períodos</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
              </select>

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
              placeholder="Buscar por projeto ou ação..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12 w-full"
            />
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {sortedTransactions.map((transaction) => (
            <div key={transaction.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(transaction.type)}`}>
                    {getTypeIcon(transaction.type)}
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{transaction.projectLogo}</div>

                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-medium text-lg">{transaction.action}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(transaction.status)}`}>
                          {getStatusLabel(transaction.status)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-slate-200">
                        <span>{transaction.project}</span>
                        <span>•</span>
                        <span>{transaction.phase}</span>
                        <span>•</span>
                        <span>{transaction.network}</span>
                        <span>•</span>
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  {/* Transaction Details */}
                  <div className="text-right">
                    {transaction.amount > 0 && (
                      <p className="font-medium text-lg">
                        {transaction.type === 'investment' || transaction.type === 'raffle' ? '-' : '+'}
                        {transaction.currency ? formatTokenAmount(transaction.amount, transaction.currency) : formatCurrency(transaction.amount)}
                      </p>
                    )}

                    {transaction.tokensReceived > 0 && (
                      <p className="text-sm text-success">
                        +{formatTokenAmount(transaction.tokensReceived, transaction.tokenSymbol)}
                      </p>
                    )}

                    {/* Additional Info */}
                    {transaction.discount && (
                      <p className="text-xs text-success">
                        {transaction.discount}% desconto
                      </p>
                    )}

                    {transaction.apr && (
                      <p className="text-xs text-warning">
                        APR: {transaction.apr}%
                      </p>
                    )}

                    {transaction.vestingRound && (
                      <p className="text-xs text-info">
                        Vesting {transaction.vestingRound}
                      </p>
                    )}

                    {transaction.ticketCount && (
                      <p className="text-xs text-accent">
                        {transaction.ticketCount} bilhetes
                      </p>
                    )}

                    {transaction.rewards && (
                      <p className="text-xs text-success">
                        +{formatTokenAmount(transaction.rewards, transaction.tokenSymbol)} recompensas
                      </p>
                    )}
                  </div>

                  {/* Transaction Hash Link */}
                  {transaction.transactionHash && (
                    <a
                      href={`https://explorer.lunes.io/tx/${transaction.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost p-2"
                      title="Ver transação no explorer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedTransactions.length === 0 && (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="heading-4 mb-2">Nenhuma transação encontrada</h3>
            <p className="text-slate-200 mb-6">
              {searchQuery || selectedFilter !== 'all' || dateRange !== 'all'
                ? 'Tente ajustar os filtros ou termo de busca.'
                : 'Você ainda não realizou nenhuma transação na plataforma.'
              }
            </p>
            <Link to="/projetos" className="btn-primary">
              <DollarSign className="w-4 h-4 mr-2" />
              Explorar Projetos
            </Link>
          </div>
        )}

        {/* Pagination (Mock) */}
        {sortedTransactions.length > 0 && (
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button className="btn-ghost px-3 py-2" disabled>
                Anterior
              </button>
              <span className="px-3 py-2 bg-primary text-white rounded-button">1</span>
              <button className="btn-ghost px-3 py-2">2</button>
              <button className="btn-ghost px-3 py-2">3</button>
              <button className="btn-ghost px-3 py-2">
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
