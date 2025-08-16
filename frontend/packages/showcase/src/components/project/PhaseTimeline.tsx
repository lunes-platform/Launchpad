import { CheckCircle, Clock, Circle } from 'lucide-react'
import { formatDate, formatTimeRemaining } from '@/lib/utils'

interface Phase {
  name: string
  status: 'completed' | 'active' | 'upcoming'
  startDate: Date
  endDate: Date
  discount: number
  allocation: number
  description: string
}

interface PhaseTimelineProps {
  phases: Phase[]
  currentPhase: string
}

const getPhaseIcon = (status: string, isActive: boolean) => {
  if (status === 'completed') {
    return <CheckCircle className="w-6 h-6 text-success" />
  }
  if (status === 'active' || isActive) {
    return <Clock className="w-6 h-6 text-primary animate-pulse" />
  }
  return <Circle className="w-6 h-6 text-slate-400" />
}

const getPhaseColor = (status: string, isActive: boolean) => {
  if (status === 'completed') {
    return 'border-success bg-success/10'
  }
  if (status === 'active' || isActive) {
    return 'border-primary bg-primary/10'
  }
  return 'border-slate-600Light bg-slate-800'
}

const getConnectorColor = (status: string) => {
  if (status === 'completed') {
    return 'bg-success'
  }
  return 'bg-borderLight'
}

export function PhaseTimeline({ phases, currentPhase }: PhaseTimelineProps) {
  return (
    <div className="card">
      <h2 className="heading-4 mb-6">Cronograma de Fases</h2>
      
      <div className="relative">
        {phases.map((phase, index) => {
          const isActive = phase.name === currentPhase
          const isLast = index === phases.length - 1
          
          return (
            <div key={phase.name} className="relative">
              {/* Connector Line */}
              {!isLast && (
                <div className="absolute left-3 top-12 w-0.5 h-16 bg-borderLight" />
              )}
              
              {/* Phase Item */}
              <div className="flex items-start space-x-4 pb-8">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {getPhaseIcon(phase.status, isActive)}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className={`border rounded-card p-4 transition-all duration-200 ${getPhaseColor(phase.status, isActive)}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <div className="flex items-center space-x-3 mb-2 md:mb-0">
                        <h3 className="font-title font-semibold text-lg">
                          {phase.name}
                        </h3>
                        {phase.discount > 0 && (
                          <span className="bg-success/20 text-success text-xs px-2 py-1 rounded-full font-medium">
                            {phase.discount}% OFF
                          </span>
                        )}
                        {isActive && (
                          <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                            ATIVO
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-slate-200">
                        {phase.status === 'active' ? (
                          <span className="text-primary font-medium">
                            Termina em {formatTimeRemaining(phase.endDate)}
                          </span>
                        ) : phase.status === 'upcoming' ? (
                          <span>
                            Inicia em {formatDate(phase.startDate)}
                          </span>
                        ) : (
                          <span className="text-success">
                            Finalizada
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-slate-200 text-sm mb-3">
                      {phase.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Período</span>
                        <span className="font-medium">
                          {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                        </span>
                      </div>
                      
                      {phase.allocation > 0 && (
                        <div>
                          <span className="text-slate-400 block">Alocação</span>
                          <span className="font-medium">
                            ${phase.allocation.toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      {phase.discount > 0 && (
                        <div>
                          <span className="text-slate-400 block">Desconto</span>
                          <span className="font-medium text-success">
                            {phase.discount}%
                          </span>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-slate-400 block">Status</span>
                        <span className={`font-medium capitalize ${
                          phase.status === 'completed' ? 'text-success' :
                          phase.status === 'active' ? 'text-primary' :
                          'text-slate-400'
                        }`}>
                          {phase.status === 'completed' ? 'Finalizada' :
                           phase.status === 'active' ? 'Ativa' :
                           'Aguardando'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
