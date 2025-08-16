import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Gift,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Target,
  Ticket,
  Info,
  Plus,
  Minus,
  ArrowRight,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Star,
  Zap,
  Trophy
} from 'lucide-react'
import { StatsCard, MetricCard } from '@/components/ui/StatsCard'
import { formatCurrency, formatTokenAmount, formatPercentage, formatTimeRemaining, formatDate } from '@/lib/utils'
import { useWallet } from '@/contexts/WalletContext'
import toast from 'react-hot-toast'

// Raffle interface
interface RaffleRound {
  id: string
  name: string
  description: string
  projectLogo: string
  projectName: string
  tokenSymbol: string

  // Round details
  roundNumber: number
  prizePool: number
  prizeValue: number // USD value
  ticketPrice: number
  maxTickets: number
  soldTickets: number

  // Timing
  startDate: Date
  endDate: Date
  drawDate: Date

  // Requirements
  minTickets: number
  maxTicketsPerUser: number
  paymentTokens: string[] // ['USDT', 'USDC', 'LUNES']

  // Status
  status: 'upcoming' | 'active' | 'drawing' | 'completed'
  isGuaranteed: boolean
  isHot: boolean

  // Winners (for completed rounds)
  winners?: Array<{
    address: string
    prize: number
    tickets: number
  }>

  // User data
  userTickets: number
  userSpent: number
}

// Mock raffle data
const raffleRounds: RaffleRound[] = [
  {
    id: 'defi-protocol-raffle-1',
    name: 'DeFi Protocol Mega Raffle',
    description: 'Ganhe $1,000 em tokens DFP no sorteio garantido de hoje!',
    projectLogo: '🔷',
    projectName: 'DeFi Protocol',
    tokenSymbol: 'DFP',
    roundNumber: 15,
    prizePool: 12500, // tokens
    prizeValue: 1000, // USD
    ticketPrice: 0.50,
    maxTickets: 5000,
    soldTickets: 3420,
    startDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
    drawDate: new Date(Date.now() + 6.5 * 60 * 60 * 1000),
    minTickets: 1,
    maxTicketsPerUser: 100,
    paymentTokens: ['USDT', 'USDC'],
    status: 'active',
    isGuaranteed: true,
    isHot: true,
    userTickets: 25,
    userSpent: 12.50
  },
  {
    id: 'gaming-metaverse-raffle-1',
    name: 'Gaming Metaverse Weekly',
    description: 'Sorteio semanal com $500 em tokens GMV para os sortudos!',
    projectLogo: '🎮',
    projectName: 'Gaming Metaverse',
    tokenSymbol: 'GMV',
    roundNumber: 8,
    prizePool: 1428, // tokens
    prizeValue: 500, // USD
    ticketPrice: 0.25,
    maxTickets: 10000,
    soldTickets: 6850,
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
    drawDate: new Date(Date.now() + 5 * 60 * 60 * 1000),
    minTickets: 2,
    maxTicketsPerUser: 50,
    paymentTokens: ['USDT', 'USDC'],
    status: 'active',
    isGuaranteed: true,
    isHot: false,
    userTickets: 10,
    userSpent: 2.50
  },
  {
    id: 'ai-blockchain-raffle-1',
    name: 'AI Blockchain Premium',
    description: 'Rifa premium com $2,000 em tokens AIB - apenas para holders LUNES!',
    projectLogo: '🤖',
    projectName: 'AI Blockchain',
    tokenSymbol: 'AIB',
    roundNumber: 3,
    prizePool: 16666, // tokens
    prizeValue: 2000, // USD
    ticketPrice: 1.00,
    maxTickets: 3000,
    soldTickets: 1250,
    startDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 18 * 60 * 60 * 1000),
    drawDate: new Date(Date.now() + 19 * 60 * 60 * 1000),
    minTickets: 5,
    maxTicketsPerUser: 200,
    paymentTokens: ['LUNES'],
    status: 'upcoming',
    isGuaranteed: true,
    isHot: true,
    userTickets: 0,
    userSpent: 0
  },
  {
    id: 'web3-social-raffle-completed',
    name: 'Web3 Social Launch Celebration',
    description: 'Rifa de lançamento finalizada com 3 ganhadores sortudos!',
    projectLogo: '🌐',
    projectName: 'Web3 Social',
    tokenSymbol: 'W3S',
    roundNumber: 1,
    prizePool: 2083, // tokens
    prizeValue: 500, // USD
    ticketPrice: 0.20,
    maxTickets: 8000,
    soldTickets: 7650,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    drawDate: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
    minTickets: 1,
    maxTicketsPerUser: 100,
    paymentTokens: ['USDT', 'USDC'],
    status: 'completed',
    isGuaranteed: true,
    isHot: false,
    userTickets: 15,
    userSpent: 3.00,
    winners: [
      { address: '0x1234...5678', prize: 833, tickets: 45 },
      { address: '0x9876...5432', prize: 833, tickets: 32 },
      { address: '0xabcd...efgh', prize: 417, tickets: 18 }
    ]
  }
]

export default function RafflePage() {
  const { selectedAccount } = useWallet()
  const [selectedRaffle, setSelectedRaffle] = useState<string | null>(null)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [selectedPaymentToken, setSelectedPaymentToken] = useState('USDT')
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [activeTab, setActiveTab] = useState('active')

  // Mock user balances
  const userBalances = {
    USDT: 500,
    USDC: 300,
    LUNES: 15000
  }

  // Filter raffles by status
  const activeRaffles = raffleRounds.filter(raffle => raffle.status === 'active')
  const upcomingRaffles = raffleRounds.filter(raffle => raffle.status === 'upcoming')
  const completedRaffles = raffleRounds.filter(raffle => raffle.status === 'completed')

  // Calculate statistics
  const totalPrizeValue = raffleRounds.reduce((sum, raffle) => sum + raffle.prizeValue, 0)
  const totalParticipants = raffleRounds.reduce((sum, raffle) => sum + raffle.soldTickets, 0)
  const userTotalTickets = raffleRounds.reduce((sum, raffle) => sum + raffle.userTickets, 0)
  const userTotalSpent = raffleRounds.reduce((sum, raffle) => sum + raffle.userSpent, 0)

  const handlePurchaseTickets = async (raffleId: string) => {
    if (!selectedAccount) {
      toast.error('Conecte sua carteira primeiro')
      return
    }

    const raffle = raffleRounds.find(r => r.id === raffleId)
    if (!raffle) return

    const totalCost = ticketQuantity * raffle.ticketPrice
    const userBalance = userBalances[selectedPaymentToken as keyof typeof userBalances]

    if (totalCost > userBalance) {
      toast.error(`Saldo insuficiente de ${selectedPaymentToken}`)
      return
    }

    if (ticketQuantity < raffle.minTickets) {
      toast.error(`Mínimo de ${raffle.minTickets} bilhetes`)
      return
    }

    if (raffle.userTickets + ticketQuantity > raffle.maxTicketsPerUser) {
      toast.error(`Máximo de ${raffle.maxTicketsPerUser} bilhetes por usuário`)
      return
    }

    if (raffle.soldTickets + ticketQuantity > raffle.maxTickets) {
      toast.error('Não há bilhetes suficientes disponíveis')
      return
    }

    setIsPurchasing(true)
    try {
      // Mock purchase process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update raffle data
      raffle.userTickets += ticketQuantity
      raffle.userSpent += totalCost
      raffle.soldTickets += ticketQuantity

      toast.success(`${ticketQuantity} bilhete(s) comprado(s) com sucesso!`)
      setTicketQuantity(1)
      setSelectedRaffle(null)
    } catch (error) {
      toast.error('Erro ao comprar bilhetes')
    } finally {
      setIsPurchasing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30'
      case 'upcoming': return 'bg-info/20 text-info border-info/30'
      case 'drawing': return 'bg-warning/20 text-warning border-warning/30'
      case 'completed': return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
      default: return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'upcoming': return 'Em Breve'
      case 'drawing': return 'Sorteando'
      case 'completed': return 'Finalizado'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container-custom text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Sorteios Diários Garantidos</span>
          </div>

          <h1 className="heading-1 mb-6">
            <Gift className="w-12 h-12 inline-block mr-4 text-primary" />
            Rifas <span className="text-gradient">LUNES</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Participe de sorteios diários garantidos e ganhe tokens de projetos inovadores.
            Bilhetes a partir de $0.50 com prêmios de até $2,000 em tokens!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="#active-raffles" className="btn-primary">
              <Ticket className="w-4 h-4 mr-2" />
              Ver Rifas Ativas
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
              label="Prêmios Totais"
              value={formatCurrency(totalPrizeValue)}
              change={{ value: 25, period: 'esta semana' }}
              icon={Trophy}
              color="success"
            />
            <MetricCard
              label="Rifas Ativas"
              value={activeRaffles.length}
              change={{ value: 1, period: 'nova hoje' }}
              icon={Gift}
              color="primary"
            />
            <MetricCard
              label="Bilhetes Vendidos"
              value={totalParticipants.toLocaleString()}
              change={{ value: 18, period: 'últimas 24h' }}
              icon={Ticket}
              color="info"
            />
            <MetricCard
              label="Taxa de Vitória"
              value="12.5%"
              change={{ value: 3, period: 'média mensal' }}
              icon={Star}
              color="warning"
            />
          </div>

          {/* User Dashboard */}
          {selectedAccount && (
            <div className="card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="heading-4 mb-2">Seus Bilhetes</h3>
                  <div className="flex items-center space-x-6 text-sm text-slate-200">
                    <span>Bilhetes Ativos: {userTotalTickets}</span>
                    <span>•</span>
                    <span>Gasto Total: {formatCurrency(userTotalSpent)}</span>
                    <span>•</span>
                    <span>Saldo USDT: {formatCurrency(userBalances.USDT)}</span>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-2xl font-bold text-primary mb-1">
                    {userTotalTickets}
                  </p>
                  <p className="text-sm text-slate-200">Bilhetes Ativos</p>
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
            <Gift className="w-4 h-4 mr-2 inline-block" />
            Rifas Ativas ({activeRaffles.length})
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
            Em Breve ({upcomingRaffles.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
              activeTab === 'completed'
                ? 'bg-primary text-white'
                : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
            }`}
          >
            <Trophy className="w-4 h-4 mr-2 inline-block" />
            Finalizadas ({completedRaffles.length})
          </button>
        </div>

        {/* Active Raffles */}
        {activeTab === 'active' && (
          <div id="active-raffles">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Rifas Ativas</h2>
              <p className="text-slate-200">
                {activeRaffles.length} rifas disponíveis
              </p>
            </div>

            <div className="space-y-6">
              {activeRaffles.map((raffle) => {
                const ticketProgress = (raffle.soldTickets / raffle.maxTickets) * 100
                const timeRemaining = formatTimeRemaining(raffle.endDate)

                return (
                  <div key={raffle.id} className="card">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="text-4xl">{raffle.projectLogo}</div>
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="heading-4">{raffle.name}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(raffle.status)}`}>
                                {getStatusLabel(raffle.status)}
                              </span>
                              {raffle.isHot && (
                                <span className="bg-error text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                  🔥 HOT
                                </span>
                              )}
                              {raffle.isGuaranteed && (
                                <span className="bg-success text-white text-xs px-2 py-1 rounded-full">
                                  ✓ GARANTIDO
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-slate-200 mb-3">
                              <span>Round #{raffle.roundNumber}</span>
                              <span>•</span>
                              <span>Prêmio: {formatCurrency(raffle.prizeValue)}</span>
                              <span>•</span>
                              <span>Termina em {timeRemaining}</span>
                            </div>

                            <p className="text-slate-200 mb-4">{raffle.description}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Bilhetes Vendidos</p>
                                <p className="font-medium">{raffle.soldTickets.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Preço do Bilhete</p>
                                <p className="font-medium">{formatCurrency(raffle.ticketPrice)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Prêmio Total</p>
                                <p className="font-medium">{formatTokenAmount(raffle.prizePool, raffle.tokenSymbol)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Sorteio</p>
                                <p className="font-medium">{formatDate(raffle.drawDate)}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ticket Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Bilhetes Vendidos</span>
                            <span>{formatPercentage(ticketProgress)}</span>
                          </div>
                          <div className="w-full bg-borderLight rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(ticketProgress, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-slate-200 mt-1">
                            <span>{raffle.soldTickets.toLocaleString()} vendidos</span>
                            <span>Máx: {raffle.maxTickets.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* User Tickets */}
                        {selectedAccount && raffle.userTickets > 0 && (
                          <div className="bg-primary/10 border border-primary/20 rounded-card p-4 mb-4">
                            <h4 className="font-medium mb-2">Seus Bilhetes</h4>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-xs text-slate-200 mb-1">Bilhetes</p>
                                <p className="font-bold text-primary">{raffle.userTickets}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-200 mb-1">Gasto</p>
                                <p className="font-bold text-success">{formatCurrency(raffle.userSpent)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-200 mb-1">Chance</p>
                                <p className="font-bold text-warning">
                                  {formatPercentage((raffle.userTickets / raffle.soldTickets) * 100)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Purchase Section */}
                      <div className="lg:w-80">
                        <div className="bg-slate-800 border border-slate-600Light rounded-card p-6">
                          {!selectedAccount ? (
                            <div className="text-center">
                              <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
                              <h4 className="font-medium mb-2">Conecte sua Carteira</h4>
                              <p className="text-sm text-slate-200 mb-4">
                                Conecte sua carteira para comprar bilhetes
                              </p>
                              <button className="btn-primary w-full">
                                Conectar Carteira
                              </button>
                            </div>
                          ) : (
                            <>
                              <h4 className="font-medium mb-4">Comprar Bilhetes</h4>

                              {/* Payment Token Selection */}
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Token de Pagamento</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {raffle.paymentTokens.map((token) => (
                                    <button
                                      key={token}
                                      onClick={() => setSelectedPaymentToken(token)}
                                      className={`p-2 rounded-button text-sm font-medium transition-colors duration-200 ${
                                        selectedPaymentToken === token
                                          ? 'bg-primary text-white'
                                          : 'bg-slate-900 border border-slate-600Light hover:bg-slate-800'
                                      }`}
                                    >
                                      {token}
                                    </button>
                                  ))}
                                </div>
                                <p className="text-xs text-slate-200 mt-1">
                                  Saldo: {formatCurrency(userBalances[selectedPaymentToken as keyof typeof userBalances])} {selectedPaymentToken}
                                </p>
                              </div>

                              {/* Quantity Selection */}
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Quantidade de Bilhetes</label>
                                <div className="flex items-center space-x-2 mb-2">
                                  <button
                                    onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                                    className="btn-outline p-2"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <input
                                    type="number"
                                    min={raffle.minTickets}
                                    max={raffle.maxTicketsPerUser}
                                    value={ticketQuantity}
                                    onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="input text-center flex-1"
                                  />
                                  <button
                                    onClick={() => setTicketQuantity(Math.min(raffle.maxTicketsPerUser, ticketQuantity + 1))}
                                    className="btn-outline p-2"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="flex justify-between text-xs text-slate-200 mb-3">
                                  <span>Min: {raffle.minTickets}</span>
                                  <span>Max: {raffle.maxTicketsPerUser}</span>
                                </div>
                              </div>

                              {/* Cost Summary */}
                              <div className="bg-primary/10 border border-primary/20 rounded-card p-4 mb-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">Total:</span>
                                  <span className="text-lg font-bold text-primary">
                                    {formatCurrency(ticketQuantity * raffle.ticketPrice)} {selectedPaymentToken}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-200 mt-1">
                                  <span>{ticketQuantity} bilhete(s)</span>
                                  <span>Chance: {formatPercentage((ticketQuantity / raffle.maxTickets) * 100)}</span>
                                </div>
                              </div>

                              {/* Purchase Button */}
                              <button
                                onClick={() => {
                                  setSelectedRaffle(raffle.id)
                                  handlePurchaseTickets(raffle.id)
                                }}
                                disabled={isPurchasing || ticketQuantity < raffle.minTickets}
                                className="btn-primary w-full disabled:opacity-50"
                              >
                                {isPurchasing && selectedRaffle === raffle.id ? (
                                  'Comprando...'
                                ) : (
                                  <>
                                    <Ticket className="w-4 h-4 mr-2" />
                                    Comprar Bilhetes
                                  </>
                                )}
                              </button>

                              {/* Quick Buy Options */}
                              <div className="grid grid-cols-3 gap-2 mt-3">
                                {[5, 10, 25].map((qty) => (
                                  <button
                                    key={qty}
                                    onClick={() => setTicketQuantity(Math.min(qty, raffle.maxTicketsPerUser))}
                                    className="btn-outline text-xs py-2"
                                  >
                                    {qty}x
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {activeRaffles.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="heading-4 mb-2">Nenhuma rifa ativa</h3>
                <p className="text-slate-200">
                  Não há rifas ativas no momento. Verifique as próximas rifas.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upcoming Raffles */}
        {activeTab === 'upcoming' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Rifas em Breve</h2>
              <p className="text-slate-200">
                {upcomingRaffles.length} rifas programadas
              </p>
            </div>

            <div className="space-y-6">
              {upcomingRaffles.map((raffle) => (
                <div key={raffle.id} className="card opacity-75">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="text-4xl">{raffle.projectLogo}</div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="heading-4">{raffle.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(raffle.status)}`}>
                              {getStatusLabel(raffle.status)}
                            </span>
                            {raffle.isHot && (
                              <span className="bg-error text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                🔥 HOT
                              </span>
                            )}
                            {raffle.isGuaranteed && (
                              <span className="bg-success text-white text-xs px-2 py-1 rounded-full">
                                ✓ GARANTIDO
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-slate-200 mb-3">
                            <span>Round #{raffle.roundNumber}</span>
                            <span>•</span>
                            <span>Prêmio: {formatCurrency(raffle.prizeValue)}</span>
                            <span>•</span>
                            <span>Inicia em {formatTimeRemaining(raffle.startDate)}</span>
                          </div>

                          <p className="text-slate-200 mb-4">{raffle.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Prêmio Total</p>
                              <p className="font-medium">{formatTokenAmount(raffle.prizePool, raffle.tokenSymbol)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Preço do Bilhete</p>
                              <p className="font-medium">{formatCurrency(raffle.ticketPrice)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Máx. Bilhetes</p>
                              <p className="font-medium">{raffle.maxTickets.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Pagamento</p>
                              <p className="font-medium">{raffle.paymentTokens.join(', ')}</p>
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
                          Esta rifa será aberta em {formatDate(raffle.startDate)}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-200">Min. Bilhetes:</span>
                            <span className="font-medium">{raffle.minTickets}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-200">Max. por Usuário:</span>
                            <span className="font-medium">{raffle.maxTicketsPerUser}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-200">Sorteio:</span>
                            <span className="font-medium">{formatDate(raffle.drawDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {upcomingRaffles.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="heading-4 mb-2">Nenhuma rifa programada</h3>
                <p className="text-slate-200">
                  Não há rifas programadas no momento. Fique atento aos anúncios.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Completed Raffles */}
        {activeTab === 'completed' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Rifas Finalizadas</h2>
              <p className="text-slate-200">
                {completedRaffles.length} rifas concluídas
              </p>
            </div>

            <div className="space-y-6">
              {completedRaffles.map((raffle) => (
                <div key={raffle.id} className="card">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="text-4xl">{raffle.projectLogo}</div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="heading-4">{raffle.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(raffle.status)}`}>
                              {getStatusLabel(raffle.status)}
                            </span>
                            <span className="bg-success text-white text-xs px-2 py-1 rounded-full">
                              ✓ SORTEADO
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-slate-200 mb-3">
                            <span>Round #{raffle.roundNumber}</span>
                            <span>•</span>
                            <span>Prêmio: {formatCurrency(raffle.prizeValue)}</span>
                            <span>•</span>
                            <span>Sorteado em {formatDate(raffle.drawDate)}</span>
                          </div>

                          <p className="text-slate-200 mb-4">{raffle.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Bilhetes Vendidos</p>
                              <p className="font-medium">{raffle.soldTickets.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Arrecadado</p>
                              <p className="font-medium">{formatCurrency(raffle.soldTickets * raffle.ticketPrice)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Ganhadores</p>
                              <p className="font-medium">{raffle.winners?.length || 0}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Taxa de Sucesso</p>
                              <p className="font-medium">{formatPercentage((raffle.soldTickets / raffle.maxTickets) * 100)}</p>
                            </div>
                          </div>

                          {/* User Participation */}
                          {selectedAccount && raffle.userTickets > 0 && (
                            <div className="bg-info/10 border border-info/20 rounded-card p-4 mb-4">
                              <h4 className="font-medium mb-2">Sua Participação</h4>
                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <p className="text-xs text-slate-200 mb-1">Bilhetes</p>
                                  <p className="font-bold text-info">{raffle.userTickets}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-200 mb-1">Gasto</p>
                                  <p className="font-bold text-info">{formatCurrency(raffle.userSpent)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-200 mb-1">Resultado</p>
                                  <p className="font-bold text-error">Não ganhou</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Winners Section */}
                    <div className="lg:w-80">
                      <div className="bg-slate-800 border border-slate-600Light rounded-card p-6">
                        <h4 className="font-medium mb-4 flex items-center">
                          <Trophy className="w-4 h-4 mr-2 text-warning" />
                          Ganhadores
                        </h4>

                        {raffle.winners && raffle.winners.length > 0 ? (
                          <div className="space-y-3">
                            {raffle.winners.map((winner, index) => (
                              <div key={index} className="bg-warning/10 border border-warning/20 rounded-card p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-warning">
                                    #{index + 1} Lugar
                                  </span>
                                  <span className="text-xs text-slate-200">
                                    {winner.tickets} bilhetes
                                  </span>
                                </div>
                                <div className="text-sm font-mono text-slate-200 mb-1">
                                  {winner.address}
                                </div>
                                <div className="text-lg font-bold text-warning">
                                  {formatTokenAmount(winner.prize, raffle.tokenSymbol)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-slate-200">
                            <p className="text-sm">Nenhum ganhador registrado</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {completedRaffles.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="heading-4 mb-2">Nenhuma rifa finalizada</h3>
                <p className="text-slate-200">
                  Ainda não há rifas finalizadas para exibir.
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
                <h4 className="font-medium text-info mb-2">Como Funcionam as Rifas</h4>
                <ul className="text-sm text-slate-200 space-y-1">
                  <li>• <strong>Sorteios Garantidos:</strong> Todos os sorteios têm ganhadores garantidos</li>
                  <li>• <strong>Preços Acessíveis:</strong> Bilhetes a partir de $0.50 para máxima participação</li>
                  <li>• <strong>Prêmios Fixos:</strong> Valores em USD convertidos para tokens no preço final</li>
                  <li>• <strong>Múltiplos Pagamentos:</strong> Aceita USDT, USDC e LUNES</li>
                  <li>• <strong>Transparência Total:</strong> Todos os sorteios são verificáveis on-chain</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
