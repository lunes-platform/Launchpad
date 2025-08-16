import { 
  BarChart3,
  Users,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function AdminDashboardPage() {
  // Mock data - em produção viria de APIs
  const stats = {
    totalProjects: 47,
    activeProjects: 12,
    totalUsers: 25847,
    totalRaised: 12500000,
    monthlyGrowth: 23,
    pendingApprovals: 8,
    securityAlerts: 2,
    systemUptime: 99.9
  }

  const recentProjects = [
    {
      id: 1,
      name: 'DeFi Protocol',
      status: 'active',
      phase: 'presale',
      raised: 2500000,
      target: 5000000,
      participants: 3420,
      endDate: '2024-02-15'
    },
    {
      id: 2,
      name: 'Gaming Metaverse',
      status: 'review',
      phase: 'whitelist',
      raised: 1800000,
      target: 3000000,
      participants: 2150,
      endDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'AI Blockchain',
      status: 'pending',
      phase: 'preparation',
      raised: 0,
      target: 6000000,
      participants: 0,
      endDate: '2024-03-01'
    }
  ]

  const pendingActions = [
    {
      type: 'project_approval',
      title: 'Novo projeto aguardando aprovação',
      description: 'BlockChain Analytics - Revisão técnica necessária',
      priority: 'high',
      time: '2 horas atrás'
    },
    {
      type: 'kyc_review',
      title: 'Verificações KYC pendentes',
      description: '15 usuários aguardando aprovação',
      priority: 'medium',
      time: '4 horas atrás'
    },
    {
      type: 'security_alert',
      title: 'Tentativas de login suspeitas',
      description: 'Multiple failed login attempts from IP 192.168.1.100',
      priority: 'high',
      time: '6 horas atrás'
    }
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success'
      case 'review': return 'text-warning'
      case 'pending': return 'text-info'
      default: return 'text-slate-400'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'badge-success'
      case 'review': return 'badge-warning'
      case 'pending': return 'badge-primary'
      default: return 'badge'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error'
      case 'medium': return 'text-warning'
      case 'low': return 'text-info'
      default: return 'text-slate-400'
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-2 mb-2">Dashboard Administrativo</h1>
          <p className="text-slate-200">Visão geral da plataforma e métricas importantes</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.totalProjects}</p>
                <p className="text-slate-200 text-sm">Total de Projetos</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-success mr-1">+{stats.activeProjects}</span>
              <span className="text-slate-200">ativos</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-info" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-slate-200 text-sm">Usuários Totais</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-success mr-1">+{stats.monthlyGrowth}%</span>
              <span className="text-slate-200">este mês</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRaised)}</p>
                <p className="text-slate-200 text-sm">Total Arrecadado</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-success mr-1">+15%</span>
              <span className="text-slate-200">vs mês anterior</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                <p className="text-slate-200 text-sm">Pendentes</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-warning mr-1">{stats.securityAlerts}</span>
              <span className="text-slate-200">alertas de segurança</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Projects */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-4">Projetos Recentes</h2>
              <Link to="/admin/projetos" className="text-primary text-sm hover:underline">
                Ver todos
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="bg-slate-800/50 rounded-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{project.name}</h3>
                    <span className={getStatusBadge(project.status)}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-200">Arrecadado:</span>
                      <span className="ml-2 font-medium">{formatCurrency(project.raised)}</span>
                    </div>
                    <div>
                      <span className="text-slate-200">Participantes:</span>
                      <span className="ml-2 font-medium">{project.participants}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso</span>
                      <span>{Math.round((project.raised / project.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${Math.min((project.raised / project.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Actions */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-4">Ações Pendentes</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-200">{pendingActions.length} pendentes</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {pendingActions.map((action, index) => (
                <div key={index} className="bg-slate-800/50 rounded-card p-4 border-l-4 border-l-primary">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-sm">{action.title}</h3>
                        <span className={`text-xs ${getPriorityColor(action.priority)}`}>
                          {action.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-200 text-sm mb-2">{action.description}</p>
                      <span className="text-slate-400 text-xs">{action.time}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link to="/admin/projetos">
                        <button className="btn-outline btn-sm">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link to="/admin/usuarios">
                        <button className="btn-outline btn-sm">
                          <Clock className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <h2 className="heading-4 mb-6">Status do Sistema</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-semibold mb-1">Uptime</h3>
              <p className="text-2xl font-bold text-success">{stats.systemUptime}%</p>
              <p className="text-slate-200 text-sm">Últimos 30 dias</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-8 h-8 text-info" />
              </div>
              <h3 className="font-semibold mb-1">Performance</h3>
              <p className="text-2xl font-bold text-info">98.5%</p>
              <p className="text-slate-200 text-sm">Response time &lt; 200ms</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-warning" />
              </div>
              <h3 className="font-semibold mb-1">Segurança</h3>
              <p className="text-2xl font-bold text-warning">{stats.securityAlerts}</p>
              <p className="text-slate-200 text-sm">Alertas ativos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
