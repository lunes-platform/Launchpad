import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  TrendingUp, 
  Users, 
  Target,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Star,
  ChevronDown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Progress } from '@/components/ui/Progress'
import { mockProjects, mockProjectCategories, mockPlatformStats } from '@/data/mockData'
import { formatCurrency, formatTimeRemaining, formatPercentage } from '@/lib/utils'
import { Project } from '@/types/api'
import { useWallet } from '@/contexts/WalletContext'

type ViewMode = 'grid' | 'list'
type SortBy = 'name' | 'raised' | 'participants' | 'created'
type FilterCategory = 'all' | 'DeFi' | 'Gaming' | 'Infrastructure' | 'NFT' | 'AI'
type FilterStatus = 'all' | 'active' | 'whitelist' | 'completed'

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('created')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  // Apply category filter from URL on initial load
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl && mockProjectCategories.some(c => c.name === categoryFromUrl)) {
      setFilterCategory(categoryFromUrl as FilterCategory)
    }
  }, [searchParams])

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = mockProjects.filter(project => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.symbol.toLowerCase().includes(searchTerm.toLowerCase())

      // Category filter
      const matchesCategory = filterCategory === 'all' || project.category === filterCategory

      // Status filter
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus

      return matchesSearch && matchesCategory && matchesStatus
    })

    // Sort projects
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'raised':
          comparison = a.metrics.totalRaised - b.metrics.totalRaised
          break
        case 'participants':
          comparison = a.metrics.participantsCount - b.metrics.participantsCount
          break
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [searchTerm, sortBy, sortOrder, filterCategory, filterStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'whitelist': return 'warning'
      case 'completed': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'whitelist': return 'Whitelist'
      case 'completed': return 'Finalizado'
      default: return status
    }
  }

  const ProjectGridCard = ({ project }: { project: Project }) => (
    <Card className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{project.logo}</div>
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-slate-200">{project.symbol}</p>
            </div>
          </div>
          <Badge variant={getStatusColor(project.status) as any}>
            {getStatusLabel(project.status)}
          </Badge>
        </div>
        
        <p className="text-sm text-slate-200 line-clamp-2 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" size="sm">{project.category}</Badge>
          <Badge variant="outline" size="sm">{project.network}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progresso</span>
            <span className="font-semibold">
              {formatCurrency(project.metrics.totalRaised)}
            </span>
          </div>
          <Progress 
            value={project.metrics.totalRaised} 
            max={5000000}
            variant="primary"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="font-semibold text-primary">
              {project.metrics.participantsCount.toLocaleString()}
            </div>
            <div className="text-xs text-slate-200">Participantes</div>
          </div>
          <div>
            <div className="font-semibold text-success">
              ${project.phases[0]?.tokenPrice || 0}
            </div>
            <div className="text-xs text-slate-200">Preço Token</div>
          </div>
        </div>

        {/* Current Phase */}
        {project.status === 'active' && (
          <div className="bg-primary/10 rounded-card p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Fase Atual:</span>
              <span className="text-primary">
                {project.phases.find(p => p.status === 'active')?.name || 'Pré-Venda'}
              </span>
            </div>
          </div>
        )}

        {/* CTA */}
        <Link to={`/projetos/${project.id}`}>
          <Button 
            fullWidth 
            variant="outline" 
            className="group-hover:bg-primary group-hover:text-white transition-all duration-300"
          >
            Ver Detalhes
          </Button>
        </Link>
      </CardContent>
    </Card>
  )

  const ProjectListCard = ({ project }: { project: Project }) => (
    <Card className="group hover:shadow-card transition-all duration-200">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="text-4xl">{project.logo}</div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <Badge variant={getStatusColor(project.status) as any} size="sm">
                  {getStatusLabel(project.status)}
                </Badge>
                <Badge variant="outline" size="sm">{project.category}</Badge>
              </div>
              
              <p className="text-slate-200 text-sm line-clamp-1 mb-3">
                {project.description}
              </p>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-success" />
                  <span className="font-medium">{formatCurrency(project.metrics.totalRaised)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{project.metrics.participantsCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4 text-warning" />
                  <span>${project.phases[0]?.tokenPrice || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-slate-200 mb-1">Progresso</div>
              <div className="w-32">
                <Progress 
                  value={project.metrics.totalRaised} 
                  max={5000000}
                  variant="primary"
                  size="sm"
                />
              </div>
            </div>
            
            <Link to={`/projetos/${project.id}`}>
              <Button variant="outline">
                Ver Projeto
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-2 mb-4">Explore Projetos</h1>
          <p className="text-slate-200">
            Descubra as melhores oportunidades de investimento em projetos cripto verificados
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xl font-bold">{mockPlatformStats.totalProjects}</div>
              <div className="text-sm text-slate-200">Total de Projetos</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="text-xl font-bold">{mockPlatformStats.activeProjects}</div>
              <div className="text-sm text-slate-200">Projetos Ativos</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-5 h-5 text-warning" />
              </div>
              <div className="text-xl font-bold">{formatCurrency(mockPlatformStats.totalRaised)}</div>
              <div className="text-sm text-slate-200">Total Levantado</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5 text-info" />
              </div>
              <div className="text-xl font-bold">{mockPlatformStats.totalParticipants.toLocaleString()}</div>
              <div className="text-sm text-slate-200">Investidores</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  leftIcon={<Search className="w-4 h-4" />}
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('active')}
                >
                  Ativos
                </Button>
                <Button
                  variant={filterStatus === 'whitelist' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('whitelist')}
                >
                  Whitelist
                </Button>
              </div>

              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-slate-600Light">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Categoria</label>
                    <select
                      className="input w-full"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
                    >
                      <option value="all">Todas as categorias</option>
                      {mockProjectCategories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Ordenar por</label>
                    <select
                      className="input w-full"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                    >
                      <option value="created">Mais recentes</option>
                      <option value="raised">Valor levantado</option>
                      <option value="participants">Participantes</option>
                      <option value="name">Nome</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Ordem</label>
                    <select
                      className="input w-full"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    >
                      <option value="desc">Decrescente</option>
                      <option value="asc">Crescente</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-slate-200">
            Mostrando {filteredProjects.length} de {mockProjects.length} projetos
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
              <p className="text-slate-200">
                Tente ajustar os filtros ou termos de busca
              </p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectGridCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <ProjectListCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}