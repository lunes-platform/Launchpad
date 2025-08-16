import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Target,
  Gift,
  Info,
  Plus,
  Minus,
  ArrowRight,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import { StatsCard, MetricCard, ProgressStatsCard } from '@/components/ui/StatsCard'
import { formatCurrency, formatTokenAmount, formatPercentage, formatTimeRemaining, formatDate } from '@/lib/utils'
import { useWallet } from '@/contexts/WalletContext'
import toast from 'react-hot-toast'

// Launchpool interface
interface LaunchpoolProject {
  id: string
  name: string
  logo: string
  description: string
  tokenSymbol: string
  category: string
  tier: 'S' | 'A' | 'B' | 'C'

  // Pool details
  totalRewards: number
  dailyRewards: number
  apy: number
  duration: number // days
  startDate: Date
  endDate: Date

  // Staking details
  stakingToken: string // LUNES
  minStake: number
  maxStake: number
  totalStaked: number
  stakingCap: number
  participants: number

  // User data
  userStaked: number
  userRewards: number
  userDailyRewards: number

  // Status
  status: 'upcoming' | 'active' | 'ended'
  isHot: boolean

  // Project links
  socialLinks: {
    website?: string
    twitter?: string
    discord?: string
  }
}

// Mock launchpool data
const launchpools: LaunchpoolProject[] = [
  {
    id: 'defi-protocol-pool',
    name: 'DeFi Protocol',
    logo: '🔷',
    description: 'Faça staking de LUNES e ganhe tokens DFP do protocolo DeFi mais inovador.',
    tokenSymbol: 'DFP',
    category: 'DeFi',
    tier: 'S',
    totalRewards: 1000000,
    dailyRewards: 50000,
    apy: 125,
    duration: 20,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    stakingToken: 'LUNES',
    minStake: 100,
    maxStake: 50000,
    totalStaked: 2500000,
    stakingCap: 5000000,
    participants: 1420,
    userStaked: 5000,
    userRewards: 125.5,
    userDailyRewards: 12.5,
    status: 'active',
    isHot: true,
    socialLinks: {
      website: 'https://defiprotocol.io',
      twitter: 'https://twitter.com/defiprotocol'
    }
  },
  {
    id: 'gaming-metaverse-pool',
    name: 'Gaming Metaverse',
    logo: '🎮',
    description: 'Stake LUNES para ganhar tokens GMV e participar do futuro dos jogos Web3.',
    tokenSymbol: 'GMV',
    category: 'Gaming',
    tier: 'A',
    totalRewards: 750000,
    dailyRewards: 25000,
    apy: 89,
    duration: 30,
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    stakingToken: 'LUNES',
    minStake: 250,
    maxStake: 25000,
    totalStaked: 1800000,
    stakingCap: 3000000,
    participants: 890,
    userStaked: 2500,
    userRewards: 89.2,
    userDailyRewards: 8.9,
    status: 'active',
    isHot: false,
    socialLinks: {
      website: 'https://gamingmv.com',
      twitter: 'https://twitter.com/gamingmv'
    }
  },
  {
    id: 'ai-blockchain-pool',
    name: 'AI Blockchain',
    logo: '🤖',
    description: 'Participe do launchpool do projeto de IA mais promissor do mercado.',
    tokenSymbol: 'AIB',
    category: 'Infrastructure',
    tier: 'S',
    totalRewards: 2000000,
    dailyRewards: 100000,
    apy: 156,
    duration: 20,
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    stakingToken: 'LUNES',
    minStake: 500,
    maxStake: 100000,
    totalStaked: 0,
    stakingCap: 8000000,
    participants: 0,
    userStaked: 0,
    userRewards: 0,
    userDailyRewards: 0,
    status: 'upcoming',
    isHot: true,
    socialLinks: {
      website: 'https://aiblockchain.tech',
      twitter: 'https://twitter.com/aiblockchain'
    }
  },
  {
    id: 'web3-social-pool',
    name: 'Web3 Social',
    logo: '🌐',
    description: 'Launchpool finalizado com distribuição completa de tokens W3S.',
    tokenSymbol: 'W3S',
    category: 'Social',
    tier: 'B',
    totalRewards: 500000,
    dailyRewards: 25000,
    apy: 78,
    duration: 20,
    startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    stakingToken: 'LUNES',
    minStake: 100,
    maxStake: 10000,
    totalStaked: 1200000,
    stakingCap: 2000000,
    participants: 650,
    userStaked: 0,
    userRewards: 45.8,
    userDailyRewards: 0,
    status: 'ended',
    isHot: false,
    socialLinks: {
      website: 'https://web3social.app',
      twitter: 'https://twitter.com/web3social'
    }
  }
]

export default function LaunchpoolPage() {
  const { selectedAccount } = useWallet()
  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [isStaking, setIsStaking] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [activeTab, setActiveTab] = useState('active')

  // Mock user balance
  const userLunesBalance = 25000

  // Filter pools by status
  const activePools = launchpools.filter(pool => pool.status === 'active')
  const upcomingPools = launchpools.filter(pool => pool.status === 'upcoming')
  const endedPools = launchpools.filter(pool => pool.status === 'ended')

  // Calculate total statistics
  const totalValueLocked = launchpools.reduce((sum, pool) => sum + pool.totalStaked, 0)
  const totalParticipants = launchpools.reduce((sum, pool) => sum + pool.participants, 0)
  const userTotalStaked = launchpools.reduce((sum, pool) => sum + pool.userStaked, 0)
  const userTotalRewards = launchpools.reduce((sum, pool) => sum + pool.userRewards, 0)

  const handleStake = async (poolId: string) => {
    if (!selectedAccount) {
      toast.error('Conecte sua carteira primeiro')
      return
    }

    const pool = launchpools.find(p => p.id === poolId)
    if (!pool) return

    const amount = parseFloat(stakeAmount)
    if (!amount || amount < pool.minStake) {
      toast.error(`Stake mínimo: ${formatTokenAmount(pool.minStake, 'LUNES')}`)
      return
    }

    if (amount > pool.maxStake) {
      toast.error(`Stake máximo: ${formatTokenAmount(pool.maxStake, 'LUNES')}`)
      return
    }

    if (amount > userLunesBalance) {
      toast.error('Saldo insuficiente')
      return
    }

    setIsStaking(true)
    try {
      // Mock staking process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update pool data (in real app, this would come from blockchain)
      pool.userStaked += amount
      pool.totalStaked += amount

      toast.success(`${formatTokenAmount(amount, 'LUNES')} em stake com sucesso!`)
      setStakeAmount('')
      setSelectedPool(null)
    } catch (error) {
      toast.error('Erro ao fazer stake')
    } finally {
      setIsStaking(false)
    }
  }

  const handleUnstake = async (poolId: string) => {
    const pool = launchpools.find(p => p.id === poolId)
    if (!pool) return

    const amount = parseFloat(unstakeAmount)
    if (!amount || amount > pool.userStaked) {
      toast.error('Valor inválido para unstake')
      return
    }

    setIsUnstaking(true)
    try {
      // Mock unstaking process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update pool data
      pool.userStaked -= amount
      pool.totalStaked -= amount

      toast.success(`${formatTokenAmount(amount, 'LUNES')} retirado com sucesso!`)
      setUnstakeAmount('')
      setSelectedPool(null)
    } catch (error) {
      toast.error('Erro ao retirar stake')
    } finally {
      setIsUnstaking(false)
    }
  }

  const handleClaimRewards = async (poolId: string) => {
    const pool = launchpools.find(p => p.id === poolId)
    if (!pool || pool.userRewards === 0) return

    setIsClaiming(true)
    try {
      // Mock claiming process
      await new Promise(resolve => setTimeout(resolve, 2000))

      const rewards = pool.userRewards
      pool.userRewards = 0

      toast.success(`${formatTokenAmount(rewards, pool.tokenSymbol)} reivindicado!`)
    } catch (error) {
      toast.error('Erro ao reivindicar recompensas')
    } finally {
      setIsClaiming(false)
    }
  }

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
      case 'active': return 'bg-success/20 text-success border-success/30'
      case 'upcoming': return 'bg-info/20 text-info border-info/30'
      case 'ended': return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
      default: return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'upcoming': return 'Em Breve'
      case 'ended': return 'Finalizado'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container-custom text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Ganhe Tokens Fazendo Stake</span>
          </div>

          <h1 className="heading-1 mb-6">
            <Zap className="w-12 h-12 inline-block mr-4 text-primary" />
            Launchpool <span className="text-gradient">LUNES</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Faça staking dos seus tokens LUNES e ganhe tokens de projetos inovadores.
            Sem risco de perda permanente - você mantém seus LUNES e ganha recompensas extras.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="#active-pools" className="btn-primary">
              <Target className="w-4 h-4 mr-2" />
              Ver Pools Ativos
            </Link>
            <Link to="/como-participar" className="btn-outline">
              <Info className="w-4 h-4 mr-2" />
              Como Funciona
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              label="Total Value Locked"
              value={formatCurrency(totalValueLocked)}
              change={{ value: 15, period: 'últimos 7 dias' }}
              icon={DollarSign}
              color="success"
            />
            <MetricCard
              label="Pools Ativos"
              value={activePools.length}
              change={{ value: 2, period: 'novos esta semana' }}
              icon={Zap}
              color="primary"
            />
            <MetricCard
              label="Participantes"
              value={totalParticipants.toLocaleString()}
              change={{ value: 8, period: 'crescimento mensal' }}
              icon={Users}
              color="info"
            />
            <MetricCard
              label="APY Médio"
              value="118%"
              change={{ value: 12, period: 'últimos 30 dias' }}
              icon={TrendingUp}
              color="warning"
            />
          </div>

          {/* User Dashboard */}
          {selectedAccount && (
            <div className="card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="heading-4 mb-2">Seu Dashboard</h3>
                  <div className="flex items-center space-x-6 text-sm text-slate-200">
                    <span>Saldo: {formatTokenAmount(userLunesBalance, 'LUNES')}</span>
                    <span>•</span>
                    <span>Em Stake: {formatTokenAmount(userTotalStaked, 'LUNES')}</span>
                    <span>•</span>
                    <span>Recompensas: {formatTokenAmount(userTotalRewards, '')}</span>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-2xl font-bold text-primary mb-1">
                    {formatTokenAmount(userTotalRewards, '')}
                  </p>
                  <p className="text-sm text-slate-200">Recompensas Totais</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="container-custom pb-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
              activeTab === 'active'
                ? 'bg-primary text-white'
                : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
            }`}
          >
            <Zap className="w-4 h-4 mr-2 inline-block" />
            Pools Ativos ({activePools.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
              activeTab === 'upcoming'
                ? 'bg-primary text-white'
                : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
            }`}
          >
            <Clock className="w-4 h-4 mr-2 inline-block" />
            Em Breve ({upcomingPools.length})
          </button>
          <button
            onClick={() => setActiveTab('ended')}
            className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
              activeTab === 'ended'
                ? 'bg-primary text-white'
                : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
            }`}
          >
            <CheckCircle className="w-4 h-4 mr-2 inline-block" />
            Finalizados ({endedPools.length})
          </button>
        </div>

        {/* Active Pools */}
        {activeTab === 'active' && (
          <div id="active-pools">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Pools Ativos</h2>
              <p className="text-slate-200">
                {activePools.length} pools disponíveis
              </p>
            </div>

            <div className="space-y-6">
              {activePools.map((pool) => {
                const stakingProgress = (pool.totalStaked / pool.stakingCap) * 100

                return (
                  <div key={pool.id} className="card">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="text-4xl">{pool.logo}</div>
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="heading-4">{pool.name}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(pool.tier)}`}>
                                Tier {pool.tier}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(pool.status)}`}>
                                {getStatusLabel(pool.status)}
                              </span>
                              {pool.isHot && (
                                <span className="bg-error text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                  🔥 HOT
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-slate-200 mb-3">
                              <span>Categoria: {pool.category}</span>
                              <span>•</span>
                              <span>APY: {pool.apy}%</span>
                              <span>•</span>
                              <span>Termina em {formatTimeRemaining(pool.endDate)}</span>
                            </div>

                            <p className="text-slate-200 mb-4">{pool.description}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Total em Stake</p>
                                <p className="font-medium">{formatTokenAmount(pool.totalStaked, 'LUNES')}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Recompensas Diárias</p>
                                <p className="font-medium">{formatTokenAmount(pool.dailyRewards, pool.tokenSymbol)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Participantes</p>
                                <p className="font-medium">{pool.participants.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Duração</p>
                                <p className="font-medium">{pool.duration} dias</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Staking Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Capacidade do Pool</span>
                            <span>{formatPercentage(stakingProgress)}</span>
                          </div>
                          <div className="w-full bg-borderLight rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(stakingProgress, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-slate-200 mt-1">
                            <span>{formatTokenAmount(pool.totalStaked, 'LUNES')}</span>
                            <span>Cap: {formatTokenAmount(pool.stakingCap, 'LUNES')}</span>
                          </div>
                        </div>

                        {/* User Position */}
                        {selectedAccount && pool.userStaked > 0 && (
                          <div className="bg-primary/10 border border-primary/20 rounded-card p-4 mb-4">
                            <h4 className="font-medium mb-2">Sua Posição</h4>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-xs text-slate-200 mb-1">Em Stake</p>
                                <p className="font-bold text-primary">{formatTokenAmount(pool.userStaked, 'LUNES')}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-200 mb-1">Recompensas</p>
                                <p className="font-bold text-success">{formatTokenAmount(pool.userRewards, pool.tokenSymbol)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-200 mb-1">Por Dia</p>
                                <p className="font-bold text-warning">{formatTokenAmount(pool.userDailyRewards, pool.tokenSymbol)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Staking Section */}
                      <div className="lg:w-80">
                        <div className="bg-slate-800 border border-slate-600Light rounded-card p-6">
                          {!selectedAccount ? (
                            <div className="text-center">
                              <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
                              <h4 className="font-medium mb-2">Conecte sua Carteira</h4>
                              <p className="text-sm text-slate-200 mb-4">
                                Conecte sua carteira para participar do launchpool
                              </p>
                              <button className="btn-primary w-full">
                                Conectar Carteira
                              </button>
                            </div>
                          ) : (
                            <>
                              <h4 className="font-medium mb-4">Participar do Pool</h4>

                              {/* Stake Section */}
                              <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Fazer Stake</label>
                                <div className="flex space-x-2 mb-2">
                                  <input
                                    type="number"
                                    placeholder="0.00"
                                    value={selectedPool === pool.id ? stakeAmount : ''}
                                    onChange={(e) => {
                                      setSelectedPool(pool.id)
                                      setStakeAmount(e.target.value)
                                    }}
                                    className="input flex-1"
                                  />
                                  <button
                                    onClick={() => {
                                      setSelectedPool(pool.id)
                                      setStakeAmount(userLunesBalance.toString())
                                    }}
                                    className="btn-outline text-sm px-3"
                                  >
                                    MAX
                                  </button>
                                </div>
                                <div className="flex justify-between text-xs text-slate-200 mb-3">
                                  <span>Min: {formatTokenAmount(pool.minStake, 'LUNES')}</span>
                                  <span>Max: {formatTokenAmount(pool.maxStake, 'LUNES')}</span>
                                </div>
                                <button
                                  onClick={() => handleStake(pool.id)}
                                  disabled={isStaking || !stakeAmount || selectedPool !== pool.id}
                                  className="btn-primary w-full disabled:opacity-50"
                                >
                                  {isStaking && selectedPool === pool.id ? (
                                    'Fazendo Stake...'
                                  ) : (
                                    <>
                                      <Plus className="w-4 h-4 mr-2" />
                                      Fazer Stake
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Unstake Section */}
                              {pool.userStaked > 0 && (
                                <div className="mb-6">
                                  <label className="block text-sm font-medium mb-2">Retirar Stake</label>
                                  <div className="flex space-x-2 mb-2">
                                    <input
                                      type="number"
                                      placeholder="0.00"
                                      value={selectedPool === pool.id ? unstakeAmount : ''}
                                      onChange={(e) => {
                                        setSelectedPool(pool.id)
                                        setUnstakeAmount(e.target.value)
                                      }}
                                      className="input flex-1"
                                    />
                                    <button
                                      onClick={() => {
                                        setSelectedPool(pool.id)
                                        setUnstakeAmount(pool.userStaked.toString())
                                      }}
                                      className="btn-outline text-sm px-3"
                                    >
                                      MAX
                                    </button>
                                  </div>
                                  <p className="text-xs text-slate-200 mb-3">
                                    Disponível: {formatTokenAmount(pool.userStaked, 'LUNES')}
                                  </p>
                                  <button
                                    onClick={() => handleUnstake(pool.id)}
                                    disabled={isUnstaking || !unstakeAmount || selectedPool !== pool.id}
                                    className="btn-outline w-full disabled:opacity-50"
                                  >
                                    {isUnstaking && selectedPool === pool.id ? (
                                      'Retirando...'
                                    ) : (
                                      <>
                                        <Minus className="w-4 h-4 mr-2" />
                                        Retirar Stake
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}

                              {/* Claim Rewards */}
                              {pool.userRewards > 0 && (
                                <div>
                                  <div className="bg-success/10 border border-success/20 rounded-card p-4 mb-3">
                                    <div className="text-center">
                                      <p className="text-sm text-slate-200 mb-1">Recompensas Disponíveis</p>
                                      <p className="text-xl font-bold text-success">
                                        {formatTokenAmount(pool.userRewards, pool.tokenSymbol)}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleClaimRewards(pool.id)}
                                    disabled={isClaiming}
                                    className="btn-success w-full disabled:opacity-50"
                                  >
                                    {isClaiming ? (
                                      'Reivindicando...'
                                    ) : (
                                      <>
                                        <Gift className="w-4 h-4 mr-2" />
                                        Reivindicar Recompensas
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {activePools.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="heading-4 mb-2">Nenhum pool ativo</h3>
                <p className="text-slate-200">
                  Não há pools ativos no momento. Verifique os próximos lançamentos.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upcoming Pools */}
        {activeTab === 'upcoming' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Pools em Breve</h2>
              <p className="text-slate-200">
                {upcomingPools.length} pools chegando
              </p>
            </div>

            <div className="space-y-6">
              {upcomingPools.map((pool) => (
                <div key={pool.id} className="card opacity-75">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="text-4xl">{pool.logo}</div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="heading-4">{pool.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(pool.tier)}`}>
                              Tier {pool.tier}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(pool.status)}`}>
                              {getStatusLabel(pool.status)}
                            </span>
                            {pool.isHot && (
                              <span className="bg-error text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                🔥 HOT
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-slate-200 mb-3">
                            <span>Categoria: {pool.category}</span>
                            <span>•</span>
                            <span>APY Estimado: {pool.apy}%</span>
                            <span>•</span>
                            <span>Inicia em {formatTimeRemaining(pool.startDate)}</span>
                          </div>

                          <p className="text-slate-200 mb-4">{pool.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Recompensas Totais</p>
                              <p className="font-medium">{formatTokenAmount(pool.totalRewards, pool.tokenSymbol)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Recompensas Diárias</p>
                              <p className="font-medium">{formatTokenAmount(pool.dailyRewards, pool.tokenSymbol)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Capacidade</p>
                              <p className="font-medium">{formatTokenAmount(pool.stakingCap, 'LUNES')}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Duração</p>
                              <p className="font-medium">{pool.duration} dias</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-80">
                      <div className="bg-slate-800 border border-slate-600Light rounded-card p-6 text-center">
                        <Clock className="w-12 h-12 text-info mx-auto mb-4" />
                        <h4 className="font-medium mb-2">Em Breve</h4>
                        <p className="text-sm text-slate-200 mb-4">
                          Este pool será aberto em {formatDate(pool.startDate)}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-200">Stake Mínimo:</span>
                            <span className="font-medium">{formatTokenAmount(pool.minStake, 'LUNES')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-200">Stake Máximo:</span>
                            <span className="font-medium">{formatTokenAmount(pool.maxStake, 'LUNES')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {upcomingPools.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="heading-4 mb-2">Nenhum pool programado</h3>
                <p className="text-slate-200">
                  Não há pools programados no momento. Fique atento aos anúncios.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Ended Pools */}
        {activeTab === 'ended' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Pools Finalizados</h2>
              <p className="text-slate-200">
                {endedPools.length} pools concluídos
              </p>
            </div>

            <div className="space-y-6">
              {endedPools.map((pool) => (
                <div key={pool.id} className="card opacity-75">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="text-4xl">{pool.logo}</div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="heading-4">{pool.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(pool.tier)}`}>
                              Tier {pool.tier}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(pool.status)}`}>
                              {getStatusLabel(pool.status)}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-slate-200 mb-3">
                            <span>Categoria: {pool.category}</span>
                            <span>•</span>
                            <span>APY Final: {pool.apy}%</span>
                            <span>•</span>
                            <span>Finalizado em {formatDate(pool.endDate)}</span>
                          </div>

                          <p className="text-slate-200 mb-4">{pool.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Total Distribuído</p>
                              <p className="font-medium">{formatTokenAmount(pool.totalRewards, pool.tokenSymbol)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Total em Stake</p>
                              <p className="font-medium">{formatTokenAmount(pool.totalStaked, 'LUNES')}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Participantes</p>
                              <p className="font-medium">{pool.participants.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Duração</p>
                              <p className="font-medium">{pool.duration} dias</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-80">
                      <div className="bg-slate-800 border border-slate-600Light rounded-card p-6 text-center">
                        <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                        <h4 className="font-medium mb-2">Pool Finalizado</h4>
                        <p className="text-sm text-slate-200 mb-4">
                          Todas as recompensas foram distribuídas
                        </p>
                        {pool.userRewards > 0 && (
                          <div className="bg-success/10 border border-success/20 rounded-card p-3">
                            <p className="text-xs text-slate-200 mb-1">Suas Recompensas</p>
                            <p className="font-bold text-success">
                              {formatTokenAmount(pool.userRewards, pool.tokenSymbol)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {endedPools.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="heading-4 mb-2">Nenhum pool finalizado</h3>
                <p className="text-slate-200">
                  Ainda não há pools finalizados para exibir.
                </p>
              </div>
            )}
          </div>
        )}

        {/* How It Works */}
        <div className="mt-16">
          <div className="card bg-info/10 border-info/20">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-info mb-2">Como Funciona o Launchpool</h4>
                <ul className="text-sm text-slate-200 space-y-1">
                  <li>• <strong>Stake LUNES:</strong> Faça staking dos seus tokens LUNES em pools ativos</li>
                  <li>• <strong>Ganhe Recompensas:</strong> Receba tokens de projetos diariamente</li>
                  <li>• <strong>Sem Risco:</strong> Seus LUNES ficam seguros e podem ser retirados a qualquer momento</li>
                  <li>• <strong>APY Atrativo:</strong> Ganhe rendimentos competitivos enquanto apoia novos projetos</li>
                  <li>• <strong>Flexibilidade:</strong> Entre e saia dos pools quando quiser</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
