import { useState } from 'react'
import { 
  Wallet, 
  ChevronDown, 
  LogOut, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  User,
  DollarSign,
  Settings
} from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { formatCurrency, formatTokenAmount } from '@/lib/utils'
import toast from 'react-hot-toast'

interface WalletConnectorProps {
  className?: string
  showBalance?: boolean
  variant?: 'button' | 'dropdown' | 'full'
}

export default function WalletConnector({ 
  className = '', 
  showBalance = true,
  variant = 'dropdown' 
}: WalletConnectorProps) {
  const { 
    isConnected, 
    isConnecting, 
    selectedAccount, 
    accounts,
    selectedWallet,
    availableWallets,
    balance,
    connectWallet, 
    disconnectWallet, 
    selectAccount,
    refreshBalance,
    formatAddress
  } = useWallet()
  
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleConnect = async (walletName: string) => {
    try {
      await connectWallet(walletName)
      setShowWalletModal(false)
    } catch (error) {
      console.error('Connection failed:', error)
    }
  }

  const handleRefreshBalance = async () => {
    setIsRefreshing(true)
    try {
      await refreshBalance()
    } finally {
      setIsRefreshing(false)
    }
  }

  const copyAddress = () => {
    if (selectedAccount) {
      navigator.clipboard.writeText(selectedAccount.address)
      toast.success('Endereço copiado!')
    }
  }

  // Button variant - simple connect button
  if (variant === 'button') {
    return (
      <div className={className}>
        {!isConnected ? (
          <button
            onClick={() => setShowWalletModal(true)}
            disabled={isConnecting}
            className="btn-primary"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {isConnecting ? 'Conectando...' : 'Conectar Carteira'}
          </button>
        ) : (
          <button
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            className="btn-outline relative"
          >
            <User className="w-4 h-4 mr-2" />
            {formatAddress(selectedAccount?.address || '')}
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
        )}

        {/* Wallet Selection Modal */}
        {showWalletModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-600Light rounded-card p-6 max-w-md w-full mx-4">
              <h3 className="heading-4 mb-4">Conectar Carteira</h3>
              <div className="space-y-3">
                {availableWallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => handleConnect(wallet.name)}
                    disabled={!wallet.installed || isConnecting}
                    className={`w-full p-4 rounded-button border transition-colors duration-200 ${
                      wallet.installed
                        ? 'border-slate-600Light hover:border-primary hover:bg-primary/5'
                        : 'border-slate-600Light opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{wallet.logo}</span>
                      <div className="text-left">
                        <p className="font-medium">{wallet.name}</p>
                        <p className="text-sm text-slate-200">
                          {wallet.installed ? 'Instalado' : 'Não instalado'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                className="btn-outline w-full mt-4"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Full variant - complete wallet interface
  if (variant === 'full') {
    return (
      <div className={`card ${className}`}>
        <h3 className="heading-4 mb-4">Carteira</h3>
        
        {!isConnected ? (
          <div>
            <p className="text-slate-200 mb-4">
              Conecte sua carteira para participar do launchpad
            </p>
            <button
              onClick={() => setShowWalletModal(true)}
              disabled={isConnecting}
              className="btn-primary w-full"
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isConnecting ? 'Conectando...' : 'Conectar Carteira'}
            </button>
          </div>
        ) : (
          <div>
            {/* Account Info */}
            <div className="bg-primary/10 border border-primary/20 rounded-card p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Conta Ativa</span>
                <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                  Conectado
                </span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-mono text-sm">{formatAddress(selectedAccount?.address || '')}</span>
                <button onClick={copyAddress} className="text-slate-400 hover:text-primary">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-200">
                {selectedAccount?.meta.name} • {selectedWallet}
              </p>
            </div>

            {/* Balance */}
            {showBalance && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Saldos</span>
                  <button
                    onClick={handleRefreshBalance}
                    disabled={isRefreshing}
                    className="text-slate-400 hover:text-primary"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-200">LUNES</span>
                    <span className="font-medium">{formatTokenAmount(balance.lunes, 'LUNES')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-200">USDT</span>
                    <span className="font-medium">{formatCurrency(balance.usdt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-200">USDC</span>
                    <span className="font-medium">{formatCurrency(balance.usdc)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              {accounts.length > 1 && (
                <select
                  value={selectedAccount?.address || ''}
                  onChange={(e) => {
                    const account = accounts.find(acc => acc.address === e.target.value)
                    if (account) selectAccount(account)
                  }}
                  className="input w-full"
                >
                  {accounts.map((account) => (
                    <option key={account.address} value={account.address}>
                      {account.meta.name} ({formatAddress(account.address)})
                    </option>
                  ))}
                </select>
              )}
              
              <button
                onClick={disconnectWallet}
                className="btn-outline w-full text-error border-error hover:bg-error hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Desconectar
              </button>
            </div>
          </div>
        )}

        {/* Wallet Selection Modal */}
        {showWalletModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-600Light rounded-card p-6 max-w-md w-full mx-4">
              <h3 className="heading-4 mb-4">Conectar Carteira</h3>
              <div className="space-y-3">
                {availableWallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => handleConnect(wallet.name)}
                    disabled={!wallet.installed || isConnecting}
                    className={`w-full p-4 rounded-button border transition-colors duration-200 ${
                      wallet.installed
                        ? 'border-slate-600Light hover:border-primary hover:bg-primary/5'
                        : 'border-slate-600Light opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{wallet.logo}</span>
                      <div className="text-left">
                        <p className="font-medium">{wallet.name}</p>
                        <p className="text-sm text-slate-200">
                          {wallet.installed ? 'Instalado' : 'Não instalado'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                className="btn-outline w-full mt-4"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      {!isConnected ? (
        <button
          onClick={() => setShowWalletModal(true)}
          disabled={isConnecting}
          className="btn-primary"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isConnecting ? 'Conectando...' : 'Conectar'}
        </button>
      ) : (
        <div>
          <button
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            className="btn-outline flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>{formatAddress(selectedAccount?.address || '')}</span>
            {showBalance && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                {formatTokenAmount(balance.lunes, 'LUNES')}
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Account Dropdown */}
          {showAccountDropdown && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-600Light rounded-card shadow-lg z-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Conta Conectada</span>
                  <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                    {selectedWallet}
                  </span>
                </div>
                
                <div className="bg-slate-900 rounded-button p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">{formatAddress(selectedAccount?.address || '')}</span>
                    <button onClick={copyAddress} className="text-slate-400 hover:text-primary">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-200">{selectedAccount?.meta.name}</p>
                </div>

                {showBalance && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Saldos</span>
                      <button
                        onClick={handleRefreshBalance}
                        disabled={isRefreshing}
                        className="text-slate-400 hover:text-primary"
                      >
                        <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-200">LUNES</span>
                        <span>{formatTokenAmount(balance.lunes, 'LUNES')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-200">USDT</span>
                        <span>{formatCurrency(balance.usdt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-200">USDC</span>
                        <span>{formatCurrency(balance.usdc)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-600Light pt-3">
                  <button
                    onClick={disconnectWallet}
                    className="w-full btn-outline text-error border-error hover:bg-error hover:text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Desconectar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-600Light rounded-card p-6 max-w-md w-full mx-4">
            <h3 className="heading-4 mb-4">Conectar Carteira</h3>
            <p className="text-slate-200 mb-4">
              Escolha uma carteira para conectar ao Launchpad Lunes
            </p>
            <div className="space-y-3">
              {availableWallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleConnect(wallet.name)}
                  disabled={!wallet.installed || isConnecting}
                  className={`w-full p-4 rounded-button border transition-colors duration-200 ${
                    wallet.installed
                      ? 'border-slate-600Light hover:border-primary hover:bg-primary/5'
                      : 'border-slate-600Light opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{wallet.logo}</span>
                    <div className="text-left">
                      <p className="font-medium">{wallet.name}</p>
                      <p className="text-sm text-slate-200">
                        {wallet.installed ? 'Instalado' : 'Não instalado'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowWalletModal(false)}
              className="btn-outline w-full mt-4"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showAccountDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowAccountDropdown(false)}
        />
      )}
    </div>
  )
}
