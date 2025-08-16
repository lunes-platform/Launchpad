import { useState } from 'react'
import { DollarSign, CreditCard, Wallet, AlertCircle, Calculator } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { formatCurrency, formatTokenAmount } from '@/lib/utils'
import toast from 'react-hot-toast'

interface SaleInterfaceProps {
  project: {
    id: string
    name: string
    currentPhase: string
    phases: Array<{
      name: string
      discount: number
      minInvestment: number
      maxInvestment: number
      vestingPeriod: number
    }>
  }
}

const paymentMethods = [
  { id: 'lunes', name: 'LUNES', network: 'Lunes Network', icon: '🌙', color: 'primary' },
  { id: 'usdt-ton', name: 'USDT', network: 'TON Network', icon: '💎', color: 'blue-500' },
  { id: 'usdt-solana', name: 'USDT', network: 'Solana Network', icon: '☀️', color: 'purple-500' },
]

export function SaleInterface({ project }: SaleInterfaceProps) {
  const { selectedAccount } = useWallet()
  const [selectedPayment, setSelectedPayment] = useState('lunes')
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [isInvesting, setIsInvesting] = useState(false)
  
  const currentPhaseData = project.phases.find(phase => phase.name === project.currentPhase)
  
  if (!currentPhaseData) return null

  // Mock token price calculation
  const baseTokenPrice = 0.10 // $0.10 per token
  const discountedPrice = baseTokenPrice * (1 - currentPhaseData.discount / 100)
  const tokensReceived = investmentAmount ? parseFloat(investmentAmount) / discountedPrice : 0

  const handleInvest = async () => {
    if (!investmentAmount || parseFloat(investmentAmount) < currentPhaseData.minInvestment) {
      toast.error(`Investimento mínimo: ${formatCurrency(currentPhaseData.minInvestment)}`)
      return
    }

    if (parseFloat(investmentAmount) > currentPhaseData.maxInvestment) {
      toast.error(`Investimento máximo: ${formatCurrency(currentPhaseData.maxInvestment)}`)
      return
    }

    setIsInvesting(true)
    
    try {
      // Mock investment process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success('Investimento realizado com sucesso!')
      setInvestmentAmount('')
    } catch (error) {
      toast.error('Erro ao processar investimento')
    } finally {
      setIsInvesting(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="heading-4">Investir - {project.currentPhase}</h3>
          <p className="text-slate-200 text-sm">
            {currentPhaseData.discount > 0 && (
              <span className="text-success font-medium">
                {currentPhaseData.discount}% de desconto • 
              </span>
            )}
            Preço: {formatCurrency(discountedPrice)} por token
          </p>
        </div>
      </div>

      {/* Phase Benefits */}
      {currentPhaseData.discount > 0 && (
        <div className="bg-success/10 border border-success/20 rounded-button p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Calculator className="w-4 h-4 text-success" />
            <span className="font-medium text-success">Desconto Ativo</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400 block">Preço Original</span>
              <span className="font-medium line-through">{formatCurrency(baseTokenPrice)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Preço com Desconto</span>
              <span className="font-medium text-success">{formatCurrency(discountedPrice)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Método de Pagamento</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              className={`p-4 border rounded-button transition-all duration-200 ${
                selectedPayment === method.id
                  ? 'border-primary bg-primary/10'
                  : 'border-slate-600Light hover:border-primary/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <div className="text-left">
                  <p className="font-medium">{method.name}</p>
                  <p className="text-xs text-slate-200">{method.network}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Investment Amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Valor do Investimento (USD)</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            placeholder="0.00"
            min={currentPhaseData.minInvestment}
            max={currentPhaseData.maxInvestment}
            step="0.01"
            className="input pl-10 w-full"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Mínimo: {formatCurrency(currentPhaseData.minInvestment)}</span>
          <span>Máximo: {formatCurrency(currentPhaseData.maxInvestment)}</span>
        </div>
      </div>

      {/* Investment Summary */}
      {investmentAmount && parseFloat(investmentAmount) > 0 && (
        <div className="bg-slate-800 border border-slate-600Light rounded-button p-4 mb-6">
          <h4 className="font-medium mb-3">Resumo do Investimento</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-200">Valor Investido:</span>
              <span className="font-medium">{formatCurrency(parseFloat(investmentAmount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-200">Preço por Token:</span>
              <span className="font-medium">{formatCurrency(discountedPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-200">Tokens Recebidos:</span>
              <span className="font-medium text-primary">
                {formatTokenAmount(tokensReceived, project.name.split(' ')[0].toUpperCase())}
              </span>
            </div>
            {currentPhaseData.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-200">Economia:</span>
                <span className="font-medium text-success">
                  {formatCurrency(tokensReceived * (baseTokenPrice - discountedPrice))}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-200">Método de Pagamento:</span>
              <span className="font-medium">
                {paymentMethods.find(m => m.id === selectedPayment)?.name}
              </span>
            </div>
            {currentPhaseData.vestingPeriod > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-200">Período de Vesting:</span>
                <span className="font-medium">{currentPhaseData.vestingPeriod} meses</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vesting Info */}
      {currentPhaseData.vestingPeriod > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-button p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-warning font-medium mb-1">
                Cronograma de Vesting
              </p>
              <p className="text-sm text-slate-200">
                Os tokens serão liberados gradualmente ao longo de {currentPhaseData.vestingPeriod} meses. 
                Você poderá acompanhar e reivindicar seus tokens na sua dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invest Button */}
      <button
        onClick={handleInvest}
        disabled={!investmentAmount || parseFloat(investmentAmount) < currentPhaseData.minInvestment || isInvesting}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isInvesting ? (
          'Processando Investimento...'
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Investir {investmentAmount ? formatCurrency(parseFloat(investmentAmount)) : ''}
          </>
        )}
      </button>

      <p className="text-xs text-slate-400 text-center mt-4">
        Ao investir, você concorda com os termos e condições do projeto.
        Transações são irreversíveis após confirmação.
      </p>
    </div>
  )
}
