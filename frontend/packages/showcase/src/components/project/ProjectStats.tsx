import { TrendingUp, Users, DollarSign, Clock, Target, Award } from 'lucide-react'
import { formatCurrency, formatNumber, formatPercentage, formatTimeRemaining } from '@/lib/utils'

interface ProjectStatsProps {
  project: {
    totalRaised: number
    targetRaise: number
    participants: number
    tier: string
    network: string
    phaseEndDate: Date
    currentPhase: string
  }
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'S':
      return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
    case 'A':
      return 'bg-gradient-to-r from-primary to-primaryLight text-white'
    case 'B':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
    case 'C':
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    default:
      return 'bg-textMuted text-white'
  }
}

export function ProjectStats({ project }: ProjectStatsProps) {
  const progressPercentage = (project.totalRaised / project.targetRaise) * 100
  const timeRemaining = formatTimeRemaining(project.phaseEndDate)

  return (
    <div className="space-y-6">
      {/* Main Stats Card */}
      <div className="card">
        <h3 className="heading-4 mb-6">Estatísticas do Projeto</h3>
        
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-200">Progresso da Arrecadação</span>
            <span className="text-sm font-medium">{formatPercentage(progressPercentage)}</span>
          </div>
          <div className="w-full bg-borderLight rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-primary to-primaryLight h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>{formatCurrency(project.totalRaised)}</span>
            <span>{formatCurrency(project.targetRaise)}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-600Light">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-success" />
              </div>
              <span className="text-slate-200">Arrecadado</span>
            </div>
            <span className="font-semibold text-lg">{formatCurrency(project.totalRaised)}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-600Light">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <span className="text-slate-200">Meta</span>
            </div>
            <span className="font-semibold text-lg">{formatCurrency(project.targetRaise)}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-600Light">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-info/20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-info" />
              </div>
              <span className="text-slate-200">Participantes</span>
            </div>
            <span className="font-semibold text-lg">{formatNumber(project.participants)}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <span className="text-slate-200">Tempo Restante</span>
            </div>
            <span className="font-semibold text-lg text-primary">{timeRemaining}</span>
          </div>
        </div>
      </div>

      {/* Project Classification */}
      <div className="card">
        <h4 className="font-medium mb-4">Classificação</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-200">Tier</span>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${getTierColor(project.tier)}`}>
              Tier {project.tier}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-200">Network</span>
            <span className="font-medium">{project.network}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-200">Fase Atual</span>
            <span className="font-medium text-primary">{project.currentPhase}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h4 className="font-medium mb-4">Ações Rápidas</h4>
        
        <div className="space-y-3">
          <button className="w-full btn-primary text-sm py-2">
            Participar Agora
          </button>
          
          <button className="w-full btn-outline text-sm py-2">
            Adicionar aos Favoritos
          </button>
          
          <button className="w-full btn-ghost text-sm py-2">
            Compartilhar Projeto
          </button>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="card">
        <h4 className="font-medium mb-4">Avaliação de Risco</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-200 text-sm">Segurança</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-borderLight rounded-full">
                <div className="w-14 h-2 bg-success rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-success">Alto</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-200 text-sm">Liquidez</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-borderLight rounded-full">
                <div className="w-12 h-2 bg-primary rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-primary">Médio</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-200 text-sm">Volatilidade</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-borderLight rounded-full">
                <div className="w-10 h-2 bg-warning rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-warning">Médio</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-info/10 border border-info/20 rounded-button">
          <p className="text-xs text-info">
            Esta avaliação é baseada em análise automatizada e não constitui aconselhamento financeiro.
          </p>
        </div>
      </div>
    </div>
  )
}
