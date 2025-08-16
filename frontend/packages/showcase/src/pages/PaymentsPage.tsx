import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CreditCard,
  Wallet,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Copy,
  QrCode,
  Download,
  Upload,
  RefreshCw,
  Info,
  Settings
} from 'lucide-react'
import { StatsCard, MetricCard } from '@/components/ui/StatsCard'
import { formatCurrency, formatDate, formatTimeRemaining } from '@/lib/utils'
import { useWallet } from '@/contexts/WalletContext'
import { useApp } from '@/contexts/AppContext'
import toast from 'react-hot-toast'

// Payment interfaces
interface PaymentMethod {
  id: string
  name: string
  type: 'crypto' | 'fiat' | 'bank'
  network: string
  symbol: string
  logo: string
  fees: {
    deposit: number
    withdrawal: number
  }
  limits: {
    min: number
    max: number
    daily: number
  }
  processingTime: string
  status: 'active' | 'maintenance' | 'disabled'
}

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund'
  amount: number
  currency: string
  network: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  timestamp: Date
  txHash?: string
  address?: string
  description: string
  fees: number
}

interface PaymentStats {
  totalVolume: number
  totalTransactions: number
  successRate: number
  averageTime: string
  supportedNetworks: number
  activeUsers: number
}

// Mock payment methods
const paymentMethods: PaymentMethod[] = [
  {
    id: 'lunes-network',
    name: 'Lunes Network',
    type: 'crypto',
    network: 'Lunes',
    symbol: 'LUNES',
    logo: '🌙',
    fees: { deposit: 0, withdrawal: 0.1 },
    limits: { min: 10, max: 100000, daily: 500000 },
    processingTime: '1-2 minutos',
    status: 'active'
  },
  {
    id: 'solana-usdt',
    name: 'USDT (Solana)',
    type: 'crypto',
    network: 'Solana',
    symbol: 'USDT',
    logo: '💵',
    fees: { deposit: 0, withdrawal: 1 },
    limits: { min: 5, max: 50000, daily: 200000 },
    processingTime: '30 segundos',
    status: 'active'
  },
  {
    id: 'solana-usdc',
    name: 'USDC (Solana)',
    type: 'crypto',
    network: 'Solana',
    symbol: 'USDC',
    logo: '🔵',
    fees: { deposit: 0, withdrawal: 1 },
    limits: { min: 5, max: 50000, daily: 200000 },
    processingTime: '30 segundos',
    status: 'active'
  },
  {
    id: 'ton-usdt',
    name: 'USDT (TON)',
    type: 'crypto',
    network: 'TON',
    symbol: 'USDT',
    logo: '💎',
    fees: { deposit: 0, withdrawal: 0.5 },
    limits: { min: 10, max: 25000, daily: 100000 },
    processingTime: '1-3 minutos',
    status: 'active'
  },
  {
    id: 'ethereum-usdt',
    name: 'USDT (Ethereum)',
    type: 'crypto',
    network: 'Ethereum',
    symbol: 'USDT',
    logo: '⚡',
    fees: { deposit: 0, withdrawal: 15 },
    limits: { min: 20, max: 100000, daily: 500000 },
    processingTime: '5-15 minutos',
    status: 'maintenance'
  },
  {
    id: 'pix-brl',
    name: 'PIX (BRL)',
    type: 'fiat',
    network: 'Brazilian Banking',
    symbol: 'BRL',
    logo: '🇧🇷',
    fees: { deposit: 0, withdrawal: 2.5 },
    limits: { min: 50, max: 10000, daily: 50000 },
    processingTime: 'Instantâneo',
    status: 'active'
  }
]

// Mock transactions
const recentTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 500,
    currency: 'USDT',
    network: 'Solana',
    status: 'completed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    txHash: '0x1234...5678',
    address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    description: 'Depósito para investimento DeFi Protocol',
    fees: 0
  },
  {
    id: '2',
    type: 'payment',
    amount: 250,
    currency: 'LUNES',
    network: 'Lunes',
    status: 'completed',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    txHash: '0x9876...5432',
    description: 'Pagamento de bilhetes de rifa',
    fees: 0.1
  },
  {
    id: '3',
    type: 'withdrawal',
    amount: 1000,
    currency: 'USDC',
    network: 'Solana',
    status: 'processing',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    description: 'Saque de lucros',
    fees: 1
  },
  {
    id: '4',
    type: 'deposit',
    amount: 2500,
    currency: 'BRL',
    network: 'PIX',
    status: 'pending',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    description: 'Depósito via PIX',
    fees: 0
  }
]

// Mock payment stats
const paymentStats: PaymentStats = {
  totalVolume: 12500000,
  totalTransactions: 45680,
  successRate: 99.2,
  averageTime: '2.3 min',
  supportedNetworks: 5,
  activeUsers: 8420
}

export default function PaymentsPage() {
  const { selectedAccount } = useWallet()
  const { addNotification } = useApp()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDeposit = async () => {
    if (!selectedAccount || !selectedMethod || !amount) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const value = parseFloat(amount)
    if (value < selectedMethod.limits.min || value > selectedMethod.limits.max) {
      toast.error(`Valor deve estar entre ${formatCurrency(selectedMethod.limits.min)} e ${formatCurrency(selectedMethod.limits.max)}`)
      return
    }

    setIsProcessing(true)
    try {
      // Mock deposit process
      await new Promise(resolve => setTimeout(resolve, 3000))

      addNotification({
        type: 'success',
        title: 'Depósito Iniciado',
        message: `Depósito de ${formatCurrency(value)} ${selectedMethod.symbol} foi iniciado com sucesso.`
      })

      toast.success('Depósito iniciado com sucesso!')
      setAmount('')
      setAddress('')
      setSelectedMethod(null)
    } catch (error) {
      toast.error('Erro ao processar depósito')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWithdrawal = async () => {
    if (!selectedAccount || !selectedMethod || !amount || !address) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const value = parseFloat(amount)
    if (value < selectedMethod.limits.min || value > selectedMethod.limits.max) {
      toast.error(`Valor deve estar entre ${formatCurrency(selectedMethod.limits.min)} e ${formatCurrency(selectedMethod.limits.max)}`)
      return
    }

    setIsProcessing(true)
    try {
      // Mock withdrawal process
      await new Promise(resolve => setTimeout(resolve, 3000))

      addNotification({
        type: 'info',
        title: 'Saque Solicitado',
        message: `Saque de ${formatCurrency(value)} ${selectedMethod.symbol} está sendo processado.`
      })

      toast.success('Saque solicitado com sucesso!')
      setAmount('')
      setAddress('')
      setSelectedMethod(null)
    } catch (error) {
      toast.error('Erro ao processar saque')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado para a área de transferência!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/20 text-success border-success/30'
      case 'processing': return 'bg-warning/20 text-warning border-warning/30'
      case 'pending': return 'bg-info/20 text-info border-info/30'
      case 'failed': return 'bg-error/20 text-error border-error/30'
      case 'cancelled': return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
      default: return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído'
      case 'processing': return 'Processando'
      case 'pending': return 'Pendente'
      case 'failed': return 'Falhou'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  const getMethodStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30'
      case 'maintenance': return 'bg-warning/20 text-warning border-warning/30'
      case 'disabled': return 'bg-error/20 text-error border-error/30'
      default: return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
    }
  }

  const getMethodStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'maintenance': return 'Manutenção'
      case 'disabled': return 'Desabilitado'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container-custom text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Pagamentos Multi-Chain</span>
          </div>

          <h1 className="heading-1 mb-6">
            <CreditCard className="w-12 h-12 inline-block mr-4 text-primary" />
            Sistema de <span className="text-gradient">Pagamentos</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Deposite e saque fundos usando múltiplas redes blockchain e métodos de pagamento.
            Suporte para Lunes Network, Solana, TON e PIX brasileiro.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="#deposit" className="btn-primary">
              <Upload className="w-4 h-4 mr-2" />
              Fazer Depósito
            </Link>
            <Link to="#withdraw" className="btn-outline">
              <Download className="w-4 h-4 mr-2" />
              Fazer Saque
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Statistics */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              label="Volume Total"
              value={formatCurrency(paymentStats.totalVolume)}
              change={{ value: 15, period: 'últimos 30 dias' }}
              icon={DollarSign}
              color="success"
            />
            <MetricCard
              label="Transações"
              value={paymentStats.totalTransactions.toLocaleString()}
              change={{ value: 8, period: 'este mês' }}
              icon={ArrowRightLeft}
              color="primary"
            />
            <MetricCard
              label="Taxa de Sucesso"
              value={`${paymentStats.successRate}%`}
              change={{ value: 0.3, period: 'melhoria' }}
              icon={CheckCircle}
              color="info"
            />
            <MetricCard
              label="Tempo Médio"
              value={paymentStats.averageTime}
              change={{ value: -12, period: 'redução' }}
              icon={Clock}
              color="warning"
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                activeTab === 'overview'
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
              }`}
            >
              <Globe className="w-4 h-4 mr-2 inline-block" />
              Métodos de Pagamento
            </button>
            <button
              onClick={() => setActiveTab('deposit')}
              className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                activeTab === 'deposit'
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
              }`}
            >
              <Upload className="w-4 h-4 mr-2 inline-block" />
              Depósito
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                activeTab === 'withdraw'
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
              }`}
            >
              <Download className="w-4 h-4 mr-2 inline-block" />
              Saque
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                activeTab === 'history'
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
              }`}
            >
              <Clock className="w-4 h-4 mr-2 inline-block" />
              Histórico
            </button>
          </div>
        </div>
      </section>

      <div className="container-custom pb-8">
        {/* Payment Methods Overview */}
        {activeTab === 'overview' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Métodos de Pagamento Suportados</h2>
              <p className="text-slate-200">
                {paymentMethods.filter(m => m.status === 'active').length} métodos ativos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paymentMethods.map((method) => (
                <div key={method.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{method.logo}</div>
                      <div>
                        <h3 className="font-medium">{method.name}</h3>
                        <p className="text-sm text-slate-200">{method.network}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getMethodStatusColor(method.status)}`}>
                      {getMethodStatusLabel(method.status)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-200">Taxa de Depósito:</span>
                      <span className="font-medium">
                        {method.fees.deposit === 0 ? 'Grátis' : `${formatCurrency(method.fees.deposit)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-200">Taxa de Saque:</span>
                      <span className="font-medium">
                        {method.fees.withdrawal === 0 ? 'Grátis' : `${formatCurrency(method.fees.withdrawal)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-200">Limites:</span>
                      <span className="font-medium">
                        {formatCurrency(method.limits.min)} - {formatCurrency(method.limits.max)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-200">Tempo:</span>
                      <span className="font-medium">{method.processingTime}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-600Light">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMethod(method)
                          setActiveTab('deposit')
                        }}
                        disabled={method.status !== 'active'}
                        className="btn-primary flex-1 text-sm disabled:opacity-50"
                      >
                        Depositar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMethod(method)
                          setActiveTab('withdraw')
                        }}
                        disabled={method.status !== 'active'}
                        className="btn-outline flex-1 text-sm disabled:opacity-50"
                      >
                        Sacar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deposit Section */}
        {activeTab === 'deposit' && (
          <div id="deposit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Fazer Depósito</h2>
              {!selectedAccount && (
                <p className="text-slate-200">Conecte sua carteira para continuar</p>
              )}
            </div>

            {!selectedAccount ? (
              <div className="card text-center py-12">
                <Wallet className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="heading-4 mb-2">Carteira Não Conectada</h3>
                <p className="text-slate-200 mb-6">
                  Conecte sua carteira para fazer depósitos na plataforma
                </p>
                <button className="btn-primary">
                  <Wallet className="w-4 h-4 mr-2" />
                  Conectar Carteira
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Method Selection */}
                <div className="lg:col-span-1">
                  <div className="card">
                    <h3 className="heading-4 mb-4">Selecionar Método</h3>
                    <div className="space-y-2">
                      {paymentMethods.filter(m => m.status === 'active').map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method)}
                          className={`w-full p-3 rounded-button border transition-colors duration-200 ${
                            selectedMethod?.id === method.id
                              ? 'border-primary bg-primary/10'
                              : 'border-slate-600Light hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{method.logo}</span>
                            <div className="text-left">
                              <p className="font-medium">{method.name}</p>
                              <p className="text-xs text-slate-200">{method.network}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Deposit Form */}
                <div className="lg:col-span-2">
                  <div className="card">
                    <h3 className="heading-4 mb-4">Detalhes do Depósito</h3>

                    {selectedMethod ? (
                      <div className="space-y-6">
                        {/* Method Info */}
                        <div className="bg-info/10 border border-info/20 rounded-card p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-2xl">{selectedMethod.logo}</span>
                            <div>
                              <h4 className="font-medium">{selectedMethod.name}</h4>
                              <p className="text-sm text-slate-200">{selectedMethod.network}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-200">Taxa:</span>
                              <span className="ml-2 font-medium">
                                {selectedMethod.fees.deposit === 0 ? 'Grátis' : formatCurrency(selectedMethod.fees.deposit)}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-200">Tempo:</span>
                              <span className="ml-2 font-medium">{selectedMethod.processingTime}</span>
                            </div>
                          </div>
                        </div>

                        {/* Amount Input */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Valor do Depósito</label>
                          <div className="relative">
                            <input
                              type="number"
                              placeholder="0.00"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="input pr-16"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-200">
                              {selectedMethod.symbol}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-200 mt-1">
                            <span>Mín: {formatCurrency(selectedMethod.limits.min)}</span>
                            <span>Máx: {formatCurrency(selectedMethod.limits.max)}</span>
                          </div>
                        </div>

                        {/* Deposit Address (for crypto) */}
                        {selectedMethod.type === 'crypto' && (
                          <div className="bg-slate-800 border border-slate-600Light rounded-card p-4">
                            <h4 className="font-medium mb-2">Endereço de Depósito</h4>
                            <div className="flex items-center space-x-2 mb-2">
                              <code className="flex-1 bg-slate-900 p-2 rounded text-sm font-mono">
                                LunesDepositAddress123456789ABCDEF
                              </code>
                              <button
                                onClick={() => copyToClipboard('LunesDepositAddress123456789ABCDEF')}
                                className="btn-outline p-2"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-slate-200">
                              Envie apenas {selectedMethod.symbol} para este endereço na rede {selectedMethod.network}
                            </p>
                          </div>
                        )}

                        {/* PIX Instructions */}
                        {selectedMethod.id === 'pix-brl' && (
                          <div className="bg-slate-800 border border-slate-600Light rounded-card p-4">
                            <h4 className="font-medium mb-2">Instruções PIX</h4>
                            <div className="space-y-2 text-sm">
                              <p>1. Use a chave PIX: <code className="bg-slate-900 px-2 py-1 rounded">pix@launchpadlunes.com</code></p>
                              <p>2. Valor exato: <strong>{amount ? formatCurrency(parseFloat(amount)) : 'R$ 0,00'}</strong></p>
                              <p>3. Inclua seu ID de usuário na descrição</p>
                            </div>
                          </div>
                        )}

                        {/* Submit Button */}
                        <button
                          onClick={handleDeposit}
                          disabled={!amount || isProcessing || parseFloat(amount) < selectedMethod.limits.min}
                          className="btn-primary w-full disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Processando...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Confirmar Depósito
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-200">Selecione um método de pagamento para continuar</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Withdrawal Section */}
        {activeTab === 'withdraw' && (
          <div id="withdraw">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Fazer Saque</h2>
              {!selectedAccount && (
                <p className="text-slate-200">Conecte sua carteira para continuar</p>
              )}
            </div>

            {!selectedAccount ? (
              <div className="card text-center py-12">
                <Wallet className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="heading-4 mb-2">Carteira Não Conectada</h3>
                <p className="text-slate-200 mb-6">
                  Conecte sua carteira para fazer saques da plataforma
                </p>
                <button className="btn-primary">
                  <Wallet className="w-4 h-4 mr-2" />
                  Conectar Carteira
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Method Selection */}
                <div className="lg:col-span-1">
                  <div className="card">
                    <h3 className="heading-4 mb-4">Selecionar Método</h3>
                    <div className="space-y-2">
                      {paymentMethods.filter(m => m.status === 'active').map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method)}
                          className={`w-full p-3 rounded-button border transition-colors duration-200 ${
                            selectedMethod?.id === method.id
                              ? 'border-primary bg-primary/10'
                              : 'border-slate-600Light hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{method.logo}</span>
                            <div className="text-left">
                              <p className="font-medium">{method.name}</p>
                              <p className="text-xs text-slate-200">{method.network}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Withdrawal Form */}
                <div className="lg:col-span-2">
                  <div className="card">
                    <h3 className="heading-4 mb-4">Detalhes do Saque</h3>

                    {selectedMethod ? (
                      <div className="space-y-6">
                        {/* Method Info */}
                        <div className="bg-warning/10 border border-warning/20 rounded-card p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-2xl">{selectedMethod.logo}</span>
                            <div>
                              <h4 className="font-medium">{selectedMethod.name}</h4>
                              <p className="text-sm text-slate-200">{selectedMethod.network}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-200">Taxa:</span>
                              <span className="ml-2 font-medium">
                                {selectedMethod.fees.withdrawal === 0 ? 'Grátis' : formatCurrency(selectedMethod.fees.withdrawal)}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-200">Tempo:</span>
                              <span className="ml-2 font-medium">{selectedMethod.processingTime}</span>
                            </div>
                          </div>
                        </div>

                        {/* Amount Input */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Valor do Saque</label>
                          <div className="relative">
                            <input
                              type="number"
                              placeholder="0.00"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="input pr-16"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-200">
                              {selectedMethod.symbol}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-200 mt-1">
                            <span>Mín: {formatCurrency(selectedMethod.limits.min)}</span>
                            <span>Máx: {formatCurrency(selectedMethod.limits.max)}</span>
                          </div>
                        </div>

                        {/* Destination Address */}
                        {selectedMethod.type === 'crypto' && (
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Endereço de Destino ({selectedMethod.network})
                            </label>
                            <input
                              type="text"
                              placeholder={`Endereço ${selectedMethod.network}...`}
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="input"
                            />
                            <p className="text-xs text-slate-200 mt-1">
                              Verifique cuidadosamente o endereço. Transações não podem ser revertidas.
                            </p>
                          </div>
                        )}

                        {/* PIX Details */}
                        {selectedMethod.id === 'pix-brl' && (
                          <div>
                            <label className="block text-sm font-medium mb-2">Chave PIX</label>
                            <input
                              type="text"
                              placeholder="CPF, e-mail, telefone ou chave aleatória"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="input"
                            />
                            <p className="text-xs text-slate-200 mt-1">
                              Insira sua chave PIX para receber o saque
                            </p>
                          </div>
                        )}

                        {/* Fee Calculation */}
                        {amount && selectedMethod && (
                          <div className="bg-slate-800 border border-slate-600Light rounded-card p-4">
                            <h4 className="font-medium mb-3">Resumo do Saque</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-200">Valor solicitado:</span>
                                <span>{formatCurrency(parseFloat(amount))} {selectedMethod.symbol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-200">Taxa de saque:</span>
                                <span>{formatCurrency(selectedMethod.fees.withdrawal)} {selectedMethod.symbol}</span>
                              </div>
                              <hr className="border-slate-600Light" />
                              <div className="flex justify-between font-medium">
                                <span>Valor a receber:</span>
                                <span className="text-success">
                                  {formatCurrency(parseFloat(amount) - selectedMethod.fees.withdrawal)} {selectedMethod.symbol}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Submit Button */}
                        <button
                          onClick={handleWithdrawal}
                          disabled={!amount || !address || isProcessing || parseFloat(amount) < selectedMethod.limits.min}
                          className="btn-primary w-full disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Processando...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Confirmar Saque
                            </>
                          )}
                        </button>

                        {/* Security Notice */}
                        <div className="bg-error/10 border border-error/20 rounded-card p-4">
                          <div className="flex items-start space-x-2">
                            <Shield className="w-4 h-4 text-error mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="font-medium text-error mb-1">Aviso de Segurança</p>
                              <p className="text-slate-200">
                                Verifique cuidadosamente todos os dados antes de confirmar.
                                Transações blockchain não podem ser revertidas.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Download className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-200">Selecione um método de saque para continuar</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transaction History */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Histórico de Transações</h2>
              <div className="flex items-center space-x-2">
                <button className="btn-outline text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </button>
                <button className="btn-outline text-sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </button>
              </div>
            </div>

            <div className="card">
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-card">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'deposit' ? 'bg-success/20' :
                        transaction.type === 'withdrawal' ? 'bg-error/20' :
                        transaction.type === 'payment' ? 'bg-primary/20' : 'bg-info/20'
                      }`}>
                        {transaction.type === 'deposit' ? <Upload className="w-4 h-4 text-success" /> :
                         transaction.type === 'withdrawal' ? <Download className="w-4 h-4 text-error" /> :
                         transaction.type === 'payment' ? <CreditCard className="w-4 h-4 text-primary" /> :
                         <ArrowRightLeft className="w-4 h-4 text-info" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">
                            {transaction.type === 'deposit' ? 'Depósito' :
                             transaction.type === 'withdrawal' ? 'Saque' :
                             transaction.type === 'payment' ? 'Pagamento' : 'Reembolso'}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(transaction.status)}`}>
                            {getStatusLabel(transaction.status)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-200">{transaction.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1">
                          <span>{formatDate(transaction.timestamp)}</span>
                          <span>•</span>
                          <span>{transaction.network}</span>
                          {transaction.txHash && (
                            <>
                              <span>•</span>
                              <a
                                href={`https://explorer.${transaction.network.toLowerCase()}.com/tx/${transaction.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primaryLight flex items-center space-x-1"
                              >
                                <span>{transaction.txHash}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.type === 'deposit' || transaction.type === 'refund' ? 'text-success' : 'text-error'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}
                        {formatCurrency(transaction.amount)} {transaction.currency}
                      </p>
                      {transaction.fees > 0 && (
                        <p className="text-xs text-slate-200">
                          Taxa: {formatCurrency(transaction.fees)} {transaction.currency}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {recentTransactions.length === 0 && (
                <div className="text-center py-16">
                  <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="heading-4 mb-2">Nenhuma transação encontrada</h3>
                  <p className="text-slate-200">
                    Suas transações aparecerão aqui após fazer depósitos ou saques.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Info */}
        <div className="mt-16">
          <div className="card bg-info/10 border-info/20">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-info mb-2">Sistema de Pagamentos Multi-Chain</h4>
                <ul className="text-sm text-slate-200 space-y-1">
                  <li>• <strong>Múltiplas Redes:</strong> Suporte para Lunes, Solana, TON e PIX brasileiro</li>
                  <li>• <strong>Taxas Baixas:</strong> Taxas competitivas e depósitos gratuitos</li>
                  <li>• <strong>Processamento Rápido:</strong> Transações processadas em minutos</li>
                  <li>• <strong>Segurança:</strong> Todas as transações são verificadas e seguras</li>
                  <li>• <strong>Suporte 24/7:</strong> Equipe disponível para ajudar com problemas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
