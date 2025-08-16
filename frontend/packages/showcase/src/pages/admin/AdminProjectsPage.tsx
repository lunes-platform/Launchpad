import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  MoreVertical,
  Target,
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react'

// Mock data
const mockProjects = [
  {
    id: 'defi-protocol',
    name: 'DeFi Protocol',
    logo: '🔷',
    status: 'active',
    phase: 'presale',
    raised: 2500000,
    target: 5000000,
    participants: 3420,
    startDate: '2024-01-10',
    endDate: '2024-02-15',
    category: 'DeFi'
  },
  {
    id: 'gaming-metaverse',
    name: 'Gaming Metaverse',
    logo: '🎮',
    status: 'review',
    phase: 'whitelist',
    raised: 1800000,
    target: 3000000,
    participants: 2150,
    startDate: '2024-01-15',
    endDate: '2024-02-20',
    category: 'Gaming'
  },
  {
    id: 'ai-blockchain',
    name: 'AI Blockchain',
    logo: '🤖',
    status: 'pending',
    phase: 'preparation',
    raised: 0,
    target: 6000000,
    participants: 0,
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    category: 'AI'
  }
]

export function AdminProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [phaseFilter, setPhaseFilter] = useState('all')

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesPhase = phaseFilter === 'all' || project.phase === phaseFilter
    return matchesSearch && matchesStatus && matchesPhase
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'badge-success'
      case 'review': return 'badge-warning'
      case 'pending': return 'badge-primary'
      case 'completed': return 'badge-info'
      case 'cancelled': return 'badge-error'
      default: return 'badge'
    }
  }

  const getPhaseBadge = (phase: string) => {
    switch (phase) {
      case 'whitelist': return 'badge-primary'
      case 'presale': return 'badge-warning'
      case 'public': return 'badge-success'
      case 'launchpool': return 'badge-info'
      case 'completed': return 'badge'
      default: return 'badge'
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="heading-2 mb-2">Gerenciar Projetos</h1>
            <p className="text-slate-200">Administre todos os projetos da plataforma</p>
          </div>
          <Link to="/admin/projetos/novo" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Link>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativo</option>
                <option value="review">Em Revisão</option>
                <option value="pending">Pendente</option>
                <option value="completed">Finalizado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            {/* Phase Filter */}
            <div>
              <select
                value={phaseFilter}
                onChange={(e) => setPhaseFilter(e.target.value)}
                className="input"
              >
                <option value="all">Todas as Fases</option>
                <option value="preparation">Preparação</option>
                <option value="whitelist">Whitelist</option>
                <option value="presale">Pré-venda</option>
                <option value="public">Venda Pública</option>
                <option value="launchpool">Launchpool</option>
                <option value="completed">Finalizado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-slate-200">Projeto</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-200">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-200">Fase</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-200">Progresso</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-200">Participantes</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-200">Período</th>
                  <th className="text-right py-4 px-6 font-medium text-slate-200">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => (
                  <tr key={project.id} className={index !== filteredProjects.length - 1 ? 'border-b border-slate-600' : ''}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{project.logo}</span>
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-slate-200">{project.category}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className={getStatusBadge(project.status)}>
                        {project.status}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className={getPhaseBadge(project.phase)}>
                        {project.phase}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{formatCurrency(project.raised)}</span>
                          <span className="text-slate-200">
                            {Math.round((project.raised / project.target) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${Math.min((project.raised / project.target) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-200">
                          Meta: {formatCurrency(project.target)}
                        </p>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{project.participants.toLocaleString()}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div className="flex items-center space-x-1 mb-1">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{formatDate(project.startDate)}</span>
                        </div>
                        <div className="text-slate-200">
                          até {formatDate(project.endDate)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <Link 
                          to={`/projetos/${project.id}`}
                          className="btn-ghost btn-sm"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          to={`/admin/projetos/${project.id}/editar`}
                          className="btn-ghost btn-sm"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="btn-ghost btn-sm" title="Mais opções">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="heading-4 text-slate-400 mb-2">Nenhum projeto encontrado</h3>
              <p className="text-slate-400 mb-6">Tente ajustar os filtros ou criar um novo projeto</p>
              <Link to="/admin/projetos/novo" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Projeto
              </Link>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="card text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{filteredProjects.length}</p>
              <p className="text-slate-200 text-sm">Projetos</p>
            </div>
            
            <div className="card text-center">
              <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {formatCurrency(filteredProjects.reduce((sum, p) => sum + p.raised, 0))}
              </p>
              <p className="text-slate-200 text-sm">Total Arrecadado</p>
            </div>
            
            <div className="card text-center">
              <Users className="w-8 h-8 text-info mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {filteredProjects.reduce((sum, p) => sum + p.participants, 0).toLocaleString()}
              </p>
              <p className="text-slate-200 text-sm">Participantes</p>
            </div>
            
            <div className="card text-center">
              <Calendar className="w-8 h-8 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {filteredProjects.filter(p => p.status === 'active').length}
              </p>
              <p className="text-slate-200 text-sm">Ativos</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
