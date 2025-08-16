import { DollarSign, Users, TrendingUp, Zap } from 'lucide-react'
import { formatNumber, formatCurrency } from '@/lib/utils'

const stats = [
  {
    label: 'Total Value Locked',
    value: 12500000,
    format: 'currency',
    icon: DollarSign,
    change: '+15.2%',
    changeType: 'positive' as const,
  },
  {
    label: 'Usuários Ativos',
    value: 45230,
    format: 'number',
    icon: Users,
    change: '+8.7%',
    changeType: 'positive' as const,
  },
  {
    label: 'Projetos Lançados',
    value: 127,
    format: 'number',
    icon: TrendingUp,
    change: '+12',
    changeType: 'positive' as const,
  },
  {
    label: 'Volume 24h',
    value: 2850000,
    format: 'currency',
    icon: Zap,
    change: '+23.1%',
    changeType: 'positive' as const,
  },
]

export function StatsSection() {
  const formatValue = (value: number, format: string) => {
    if (format === 'currency') {
      return formatCurrency(value)
    }
    return formatNumber(value)
  }

  return (
    <section className="py-12 border-y border-slate-600Light bg-slate-800/50">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl lg:text-3xl font-title font-bold text-white">
                  {formatValue(stat.value, stat.format)}
                </p>
                
                <p className="text-sm text-slate-200">
                  {stat.label}
                </p>
                
                <div className="flex items-center justify-center space-x-1">
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'positive' ? 'text-success' : 'text-error'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-slate-400">
                    últimos 30 dias
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
