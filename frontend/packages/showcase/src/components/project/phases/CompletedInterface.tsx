import { CheckCircle, Clock, TrendingUp, Users, Gift } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency, formatTokenAmount, formatDate } from '@/lib/utils'

interface CompletedInterfaceProps {
  project: {
    id: string
    name: string
    totalRaised: number
    participants: number
  }
}

// Mock vesting data
const vestingSchedule = [
  { date: new Date('2024-02-15'), percentage: 25, status: 'released' },
  { date: new Date('2024-05-15'), percentage: 25, status: 'upcoming' },
  { date: new Date('2024-08-15'), percentage: 25, status: 'upcoming' },
  { date: new Date('2024-11-15'), percentage: 25, status: 'upcoming' },
]

const projectResults = {
  totalRaised: 2100000,
  totalParticipants: 3421,
  averageInvestment: 614,
  successRate: 105, // 105% of target
  distributionDate: new Date('2024-01-30'),
}

export function CompletedInterface({ project }: CompletedInterfaceProps) {
  const releasedTokens = vestingSchedule
    .filter(v => v.status === 'released')
    .reduce((sum, v) => sum + v.percentage, 0)

  const nextVesting = vestingSchedule.find(v => v.status === 'upcoming')

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <div className="card bg-gradient-to-r from-success/10 to-primary/10 border-success/30">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          
          <h3 className="heading-4 mb-2 text-success">Projeto Finalizado com Sucesso!</h3>
          <p className="text-slate-200 mb-6 max-w-2xl mx-auto">
            O projeto {project.name} foi concluído com sucesso, superando a meta de arrecadação. 
            Os tokens estão sendo distribuídos conforme o cronograma de vesting.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-success/10 border border-success/20 rounded-button p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Arrecadado</span>
              </div>
              <p className="text-xl font-bold">{formatCurrency(projectResults.totalRaised)}</p>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-button p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Participantes</span>
              </div>
              <p className="text-xl font-bold">{projectResults.totalParticipants.toLocaleString()}</p>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 rounded-button p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Gift className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-warning">Taxa de Sucesso</span>
              </div>
              <p className="text-xl font-bold text-success">{projectResults.successRate}%</p>
            </div>
            
            <div className="bg-info/10 border border-info/20 rounded-button p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-info" />
                <span className="text-sm font-medium text-info">Investimento Médio</span>
              </div>
              <p className="text-xl font-bold">{formatCurrency(projectResults.averageInvestment)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vesting Schedule */}
      <div className="card">
        <h4 className="heading-4 mb-6">Cronograma de Vesting</h4>
        
        <div className="space-y-4">
          {vestingSchedule.map((vesting, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 border rounded-button ${
                vesting.status === 'released'
                  ? 'border-success/30 bg-success/10'
                  : 'border-slate-600Light bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  vesting.status === 'released'
                    ? 'bg-success/20'
                    : 'bg-textMuted/20'
                }`}>
                  {vesting.status === 'released' ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                
                <div>
                  <p className="font-medium">
                    Liberação {index + 1} - {vesting.percentage}%
                  </p>
                  <p className="text-sm text-slate-200">
                    {formatDate(vesting.date)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                  vesting.status === 'released'
                    ? 'bg-success/20 text-success'
                    : 'bg-textMuted/20 text-slate-400'
                }`}>
                  {vesting.status === 'released' ? 'Liberado' : 'Aguardando'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-200">Tokens Liberados</span>
            <span className="font-medium">{releasedTokens}% de 100%</span>
          </div>
          <div className="w-full bg-borderLight rounded-full h-3">
            <div
              className="bg-gradient-to-r from-success to-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${releasedTokens}%` }}
            />
          </div>
        </div>

        {/* Next Vesting */}
        {nextVesting && (
          <div className="mt-6 bg-info/10 border border-info/20 rounded-button p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-info" />
              <div>
                <p className="text-sm font-medium text-info">
                  Próxima Liberação: {nextVesting.percentage}%
                </p>
                <p className="text-sm text-slate-200">
                  {formatDate(nextVesting.date)} - {Math.ceil((nextVesting.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias restantes
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="card">
        <h4 className="font-medium mb-4">Próximos Passos</h4>
        <div className="space-y-3">
          <Link
            to="/dashboard/meus-investimentos"
            className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-800Hover border border-slate-600Light rounded-button transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Ver Meus Investimentos</p>
                <p className="text-sm text-slate-200">
                  Acompanhe todos os seus investimentos e vesting
                </p>
              </div>
            </div>
            <span className="text-primary">→</span>
          </Link>
          
          <Link
            to="/dashboard/tokens-a-reivindicar"
            className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-800Hover border border-slate-600Light rounded-button transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Gift className="w-5 h-5 text-success" />
              <div>
                <p className="font-medium">Reivindicar Tokens</p>
                <p className="text-sm text-slate-200">
                  Reivindique tokens liberados do cronograma de vesting
                </p>
              </div>
            </div>
            <span className="text-success">→</span>
          </Link>
          
          <Link
            to="/projetos"
            className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-800Hover border border-slate-600Light rounded-button transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-info" />
              <div>
                <p className="font-medium">Explorar Novos Projetos</p>
                <p className="text-sm text-slate-200">
                  Descubra outros projetos disponíveis na plataforma
                </p>
              </div>
            </div>
            <span className="text-info">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
