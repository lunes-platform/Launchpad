import { useState } from 'react'
import { Wallet, AlertCircle, CheckCircle, Clock, Gift } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { WhitelistInterface } from './phases/WhitelistInterface'
import { SaleInterface } from './phases/SaleInterface'
import { LaunchpoolInterface } from './phases/LaunchpoolInterface'
import { RaffleInterface } from './phases/RaffleInterface'
import { CompletedInterface } from './phases/CompletedInterface'

interface Project {
  id: string
  name: string
  currentPhase: string
  phaseEndDate: Date
  phases: Array<{
    name: string
    status: string
    discount: number
    minInvestment: number
    maxInvestment: number
    vestingPeriod: number
  }>
}

interface ParticipationSectionProps {
  project: Project
  isConnected: boolean
}

export function ParticipationSection({ project, isConnected }: ParticipationSectionProps) {
  const { connectWallet } = useWallet()
  const [isLoading, setIsLoading] = useState(false)

  const currentPhaseData = project.phases.find(phase => phase.name === project.currentPhase)
  
  // If no active phase or phase is completed
  if (!currentPhaseData || currentPhaseData.status === 'completed') {
    return <CompletedInterface project={project} />
  }

  // If user is not connected, show connect wallet prompt
  if (!isConnected) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="heading-4 mb-2">Conecte sua Carteira</h3>
          <p className="text-slate-200 mb-6 max-w-md mx-auto">
            Para participar da fase <strong>{project.currentPhase}</strong> do projeto {project.name}, 
            você precisa conectar uma carteira compatível.
          </p>
          
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="btn-primary"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Conectar Carteira
          </button>
          
          <div className="mt-6 p-4 bg-info/10 border border-info/20 rounded-button">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-info font-medium mb-1">
                  Fase Atual: {project.currentPhase}
                </p>
                <p className="text-sm text-slate-200">
                  {currentPhaseData.discount > 0 && (
                    <span className="text-success font-medium">
                      {currentPhaseData.discount}% de desconto • 
                    </span>
                  )}
                  {' '}Investimento: ${currentPhaseData.minInvestment} - ${currentPhaseData.maxInvestment}
                  {currentPhaseData.vestingPeriod > 0 && (
                    <span> • Vesting: {currentPhaseData.vestingPeriod} meses</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render appropriate interface based on current phase
  const renderPhaseInterface = () => {
    switch (project.currentPhase) {
      case 'Whitelist':
        return <WhitelistInterface project={project} />
      
      case 'Pré-Venda':
      case 'Venda Pública':
        return <SaleInterface project={project} />
      
      case 'Launchpool':
        return <LaunchpoolInterface project={project} />
      
      case 'Rifa':
        return <RaffleInterface project={project} />
      
      default:
        return <CompletedInterface project={project} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Phase Status Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              {project.currentPhase === 'Whitelist' && <Gift className="w-5 h-5 text-primary" />}
              {(project.currentPhase === 'Pré-Venda' || project.currentPhase === 'Venda Pública') && <CheckCircle className="w-5 h-5 text-primary" />}
              {project.currentPhase === 'Launchpool' && <Clock className="w-5 h-5 text-primary" />}
              {project.currentPhase === 'Rifa' && <Gift className="w-5 h-5 text-primary" />}
            </div>
            <div>
              <h3 className="font-title font-semibold text-lg">
                Fase Ativa: {project.currentPhase}
              </h3>
              <p className="text-slate-200 text-sm">
                {currentPhaseData.discount > 0 && (
                  <span className="text-success font-medium">
                    {currentPhaseData.discount}% de desconto disponível
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-slate-400">Termina em</p>
            <p className="font-medium text-primary">
              {Math.ceil((project.phaseEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Phase Interface */}
      {renderPhaseInterface()}
    </div>
  )
}
