import { useState } from 'react'
import { CheckCircle, AlertCircle, Gift, Clock, DollarSign } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

interface WhitelistInterfaceProps {
  project: {
    id: string
    name: string
    phases: Array<{
      name: string
      discount: number
      minInvestment: number
      maxInvestment: number
      vestingPeriod: number
    }>
  }
}

export function WhitelistInterface({ project }: WhitelistInterfaceProps) {
  const { selectedAccount } = useWallet()
  const [isWhitelisted, setIsWhitelisted] = useState(false) // Mock - would check API
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  
  const whitelistPhase = project.phases.find(phase => phase.name === 'Whitelist')
  
  if (!whitelistPhase) return null

  const handleApplyWhitelist = async () => {
    setIsApplying(true)
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setHasApplied(true)
      toast.success('Aplicação para whitelist enviada com sucesso!')
    } catch (error) {
      toast.error('Erro ao aplicar para whitelist')
    } finally {
      setIsApplying(false)
    }
  }

  // If user is already whitelisted
  if (isWhitelisted) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          
          <h3 className="heading-4 mb-2 text-success">Você está na Whitelist!</h3>
          <p className="text-slate-200 mb-6">
            Parabéns! Você foi aprovado para participar da fase Whitelist com desconto exclusivo.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-success/10 border border-success/20 rounded-button p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Gift className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Desconto</span>
              </div>
              <p className="text-2xl font-bold text-success">{whitelistPhase.discount}%</p>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-button p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Investimento</span>
              </div>
              <p className="text-sm font-medium">
                ${whitelistPhase.minInvestment} - ${whitelistPhase.maxInvestment}
              </p>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 rounded-button p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-warning">Vesting</span>
              </div>
              <p className="text-sm font-medium">
                {whitelistPhase.vestingPeriod} meses
              </p>
            </div>
          </div>
          
          <button className="btn-primary">
            Investir Agora
          </button>
        </div>
      </div>
    )
  }

  // If user has already applied
  if (hasApplied) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-warning" />
          </div>
          
          <h3 className="heading-4 mb-2">Aplicação Enviada</h3>
          <p className="text-slate-200 mb-6">
            Sua aplicação para a whitelist foi enviada com sucesso. 
            Aguarde a análise da equipe do projeto.
          </p>
          
          <div className="bg-info/10 border border-info/20 rounded-button p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-info font-medium mb-1">
                  Próximos Passos
                </p>
                <p className="text-sm text-slate-200">
                  • A análise pode levar até 48 horas<br/>
                  • Você receberá uma notificação por email<br/>
                  • Acompanhe o status na sua dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Application form
  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
          <Gift className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="heading-4">Aplicar para Whitelist</h3>
          <p className="text-slate-200 text-sm">
            Ganhe acesso exclusivo com {whitelistPhase.discount}% de desconto
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-success/10 border border-success/20 rounded-button p-4">
          <h4 className="font-medium text-success mb-2">Desconto Exclusivo</h4>
          <p className="text-sm text-slate-200">
            {whitelistPhase.discount}% de desconto no preço final dos tokens
          </p>
        </div>
        
        <div className="bg-primary/10 border border-primary/20 rounded-button p-4">
          <h4 className="font-medium text-primary mb-2">Garantia de Alocação</h4>
          <p className="text-sm text-slate-200">
            Alocação garantida para participantes aprovados
          </p>
        </div>
        
        <div className="bg-warning/10 border border-warning/20 rounded-button p-4">
          <h4 className="font-medium text-warning mb-2">Acesso Antecipado</h4>
          <p className="text-sm text-slate-200">
            Participe antes da pré-venda e venda pública
          </p>
        </div>
        
        <div className="bg-info/10 border border-info/20 rounded-button p-4">
          <h4 className="font-medium text-info mb-2">Vesting Preferencial</h4>
          <p className="text-sm text-slate-200">
            Cronograma de vesting de {whitelistPhase.vestingPeriod} meses
          </p>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-slate-800 border border-slate-600Light rounded-button p-4 mb-6">
        <h4 className="font-medium mb-3">Requisitos para Whitelist</h4>
        <ul className="space-y-2 text-sm text-slate-200">
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
            <span>Carteira conectada e verificada</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
            <span>Investimento mínimo: {formatCurrency(whitelistPhase.minInvestment)}</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
            <span>Investimento máximo: {formatCurrency(whitelistPhase.maxInvestment)}</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
            <span>Concordar com os termos do projeto</span>
          </li>
        </ul>
      </div>

      {/* Connected Account */}
      <div className="bg-info/10 border border-info/20 rounded-button p-4 mb-6">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-info" />
          <div>
            <p className="text-sm font-medium text-info">Carteira Conectada</p>
            <p className="text-sm text-slate-200">
              {selectedAccount?.meta.name} ({selectedAccount?.address.slice(0, 8)}...{selectedAccount?.address.slice(-6)})
            </p>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApplyWhitelist}
        disabled={isApplying}
        className="btn-primary w-full"
      >
        {isApplying ? 'Enviando Aplicação...' : 'Aplicar para Whitelist'}
      </button>

      <p className="text-xs text-slate-400 text-center mt-4">
        Ao aplicar, você concorda com os termos e condições do projeto.
        A aprovação está sujeita à análise da equipe.
      </p>
    </div>
  )
}
