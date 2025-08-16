import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Wallet, 
  Plus, 
  Settings, 
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { formatTokenAmount, formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

// Mock data
const connectedWallets = [
  {
    id: 'subwallet-1',
    name: 'SubWallet Principal',
    type: 'SubWallet',
    address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    balance: {
      lunes: 25000.50,
      usdt: 1250.75,
      staked: 5000.00
    },
    isActive: true,
    isDefault: true,
    network: 'Lunes Network',
    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'connected'
  },
  {
    id: 'polkadot-1',
    name: 'Polkadot.js Secundária',
    type: 'Polkadot.js',
    address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    balance: {
      lunes: 8750.25,
      usdt: 0,
      staked: 2500.00
    },
    isActive: false,
    isDefault: false,
    network: 'Lunes Network',
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: 'connected'
  },
  {
    id: 'subwallet-2',
    name: 'SubWallet Trading',
    type: 'SubWallet',
    address: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
    balance: {
      lunes: 12500.00,
      usdt: 500.00,
      staked: 0
    },
    isActive: false,
    isDefault: false,
    network: 'Lunes Network',
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    status: 'disconnected'
  }
]

const supportedWallets = [
  {
    id: 'subwallet',
    name: 'SubWallet',
    description: 'Carteira Web3 completa para Polkadot',
    icon: '🔷',
    downloadUrl: 'https://subwallet.app/',
    isRecommended: true,
    features: ['Multi-chain', 'Staking', 'DeFi', 'NFTs']
  },
  {
    id: 'polkadot-js',
    name: 'Polkadot.js',
    description: 'Extensão oficial do Polkadot',
    icon: '🟣',
    downloadUrl: 'https://polkadot.js.org/extension/',
    isRecommended: false,
    features: ['Oficial', 'Simples', 'Segura']
  }
]

export function WalletsPage() {
  const { selectedAccount, connectWallet, disconnectWallet } = useWallet()
  const [showBalances, setShowBalances] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [refreshingWallet, setRefreshingWallet] = useState<string | null>(null)

  const totalBalance = connectedWallets.reduce((sum, wallet) => 
    sum + wallet.balance.lunes + wallet.balance.usdt, 0
  )
  const totalStaked = connectedWallets.reduce((sum, wallet) => 
    sum + wallet.balance.staked, 0
  )

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
      toast.success('Carteira conectada com sucesso!')
    } catch (error) {
      toast.error('Erro ao conectar carteira')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectWallet = async (walletId: string) => {
    try {
      await disconnectWallet()
      toast.success('Carteira desconectada')
    } catch (error) {
      toast.error('Erro ao desconectar carteira')
    }
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.success('Endereço copiado!')
  }

  const handleRefreshBalance = async (walletId: string) => {
    setRefreshingWallet(walletId)
    try {
      // Mock refresh
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Saldo atualizado!')
    } catch (error) {
      toast.error('Erro ao atualizar saldo')
    } finally {
      setRefreshingWallet(null)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'SubWallet': return '🔷'
      case 'Polkadot.js': return '🟣'
      default: return '💼'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-success/20 text-success border-success/30'
      case 'disconnected': return 'bg-error/20 text-error border-error/30'
      default: return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectada'
      case 'disconnected': return 'Desconectada'
      default: return status
    }
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
              <h1 className="heading-2 mb-2">Gerenciar Carteiras</h1>
              <p className="text-slate-200">
                Conecte e gerencie suas carteiras para participar da plataforma
              </p>
            </div>
            
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="btn-primary disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isConnecting ? 'Conectando...' : 'Conectar Nova Carteira'}
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
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-2xl font-bold mb-1">
              {showBalances ? formatCurrency(totalBalance) : '••••••'}
            </p>
            <p className="text-sm text-slate-200">Saldo Total</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-warning" />
              </div>
              <span className="text-xs text-slate-400">Em Staking</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {showBalances ? formatTokenAmount(totalStaked, 'LUNES') : '••••••'}
            </p>
            <p className="text-sm text-slate-200">Total em Staking</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <span className="text-xs text-success">Ativas</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {connectedWallets.filter(w => w.status === 'connected').length}
            </p>
            <p className="text-sm text-slate-200">Carteiras Conectadas</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-info" />
              </div>
              <span className="text-xs text-slate-400">Total</span>
            </div>
            <p className="text-2xl font-bold mb-1">{connectedWallets.length}</p>
            <p className="text-sm text-slate-200">Carteiras Cadastradas</p>
          </div>
        </div>

        {/* Connected Wallets */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="heading-4">Carteiras Conectadas</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="btn-ghost text-sm"
              >
                {showBalances ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showBalances ? 'Ocultar Saldos' : 'Mostrar Saldos'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {connectedWallets.map((wallet) => (
              <div key={wallet.id} className="p-6 bg-slate-800 border border-slate-600Light rounded-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{getWalletIcon(wallet.type)}</div>
                    
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-title font-semibold text-lg">{wallet.name}</h4>
                        {wallet.isDefault && (
                          <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-medium">
                            PRINCIPAL
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(wallet.status)}`}>
                          {getStatusLabel(wallet.status)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-slate-200">
                        <span>{wallet.type}</span>
                        <span>•</span>
                        <span>{wallet.network}</span>
                        <span>•</span>
                        <button
                          onClick={() => handleCopyAddress(wallet.address)}
                          className="flex items-center space-x-1 hover:text-primary transition-colors duration-200"
                        >
                          <span>{formatAddress(wallet.address)}</span>
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Balances */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">LUNES</p>
                        <p className="font-medium">
                          {showBalances ? formatTokenAmount(wallet.balance.lunes, 'LUNES') : '••••••'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 mb-1">USDT</p>
                        <p className="font-medium">
                          {showBalances ? formatCurrency(wallet.balance.usdt) : '••••••'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 mb-1">Staking</p>
                        <p className="font-medium text-warning">
                          {showBalances ? formatTokenAmount(wallet.balance.staked, 'LUNES') : '••••••'}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRefreshBalance(wallet.id)}
                        disabled={refreshingWallet === wallet.id}
                        className="btn-ghost p-2 disabled:opacity-50"
                        title="Atualizar saldo"
                      >
                        <RefreshCw className={`w-4 h-4 ${refreshingWallet === wallet.id ? 'animate-spin' : ''}`} />
                      </button>

                      <a
                        href={`https://explorer.lunes.io/account/${wallet.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost p-2"
                        title="Ver no explorer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {!wallet.isDefault && (
                        <button
                          onClick={() => handleDisconnectWallet(wallet.id)}
                          className="btn-ghost p-2 text-error hover:bg-error/10"
                          title="Desconectar carteira"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Wallets */}
        <div className="card mb-8">
          <h3 className="heading-4 mb-6">Carteiras Suportadas</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportedWallets.map((wallet) => (
              <div key={wallet.id} className="p-6 bg-slate-800 border border-slate-600Light rounded-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{wallet.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-lg">{wallet.name}</h4>
                        {wallet.isRecommended && (
                          <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                            Recomendado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-200">{wallet.description}</p>
                    </div>
                  </div>

                  <a
                    href={wallet.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primaryLight transition-colors duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {wallet.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-1"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <a
                  href={wallet.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full"
                >
                  Baixar {wallet.name}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Security Tips */}
        <div className="card bg-info/10 border-info/20">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-info mb-2">Dicas de Segurança</h4>
              <ul className="text-sm text-slate-200 space-y-1">
                <li>• Nunca compartilhe sua seed phrase ou chaves privadas</li>
                <li>• Sempre verifique o endereço antes de confirmar transações</li>
                <li>• Use carteiras de hardware para grandes quantias</li>
                <li>• Mantenha suas extensões sempre atualizadas</li>
                <li>• Desconfie de sites suspeitos que pedem acesso à carteira</li>
                <li>• Faça backup seguro de suas informações de recuperação</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
