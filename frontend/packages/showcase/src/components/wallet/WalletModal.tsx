import { useState } from 'react'
import { X, Wallet, ExternalLink, AlertCircle } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const walletOptions = [
  {
    id: 'subwallet',
    name: 'SubWallet',
    description: 'Carteira Web3 completa para Polkadot',
    icon: '🔷',
    downloadUrl: 'https://subwallet.app/',
    isRecommended: true,
  },
  {
    id: 'polkadot-js',
    name: 'Polkadot.js',
    description: 'Extensão oficial do Polkadot',
    icon: '🟣',
    downloadUrl: 'https://polkadot.js.org/extension/',
    isRecommended: false,
  },
]

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { connectWallet } = useWallet()

  if (!isOpen) return null

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
      onClose()
    } catch (error) {
      console.error('Error connecting wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 border border-slate-600Light rounded-card p-6 w-full max-w-md mx-4 shadow-soft animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-4">Conectar Carteira</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-200 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info */}
        <div className="bg-info/10 border border-info/20 rounded-button p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-info font-medium mb-1">
                Primeira vez aqui?
              </p>
              <p className="text-sm text-slate-200">
                Você precisará de uma carteira compatível com Polkadot para participar dos lançamentos.
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Options */}
        <div className="space-y-3 mb-6">
          {walletOptions.map((wallet) => (
            <div
              key={wallet.id}
              className="border border-slate-600Light rounded-button p-4 hover:border-primary/30 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{wallet.icon}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-white">
                        {wallet.name}
                      </h3>
                      {wallet.isRecommended && (
                        <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                          Recomendado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-200">
                      {wallet.description}
                    </p>
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
            </div>
          ))}
        </div>

        {/* Connect Button */}
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet className="w-4 h-4" />
          <span>
            {isConnecting ? 'Conectando...' : 'Conectar Carteira'}
          </span>
        </button>

        {/* Footer */}
        <p className="text-xs text-slate-400 text-center mt-4">
          Ao conectar sua carteira, você concorda com nossos{' '}
          <a href="/termos-servico" className="text-primary hover:underline">
            Termos de Serviço
          </a>{' '}
          e{' '}
          <a href="/politica-privacidade" className="text-primary hover:underline">
            Política de Privacidade
          </a>
          .
        </p>
      </div>
    </div>
  )
}
