import React, { useState } from 'react'
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Settings,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Edit,
  Eye,
  Download,
  Upload,
  Plus,
  Filter,
  Search
} from 'lucide-react'
import { Card, Button } from '@launchpad/shared-ui'
import { Badge } from '../ui/Badge'

interface ProjectManagementProps {
  projectId?: string
  className?: string
}

interface Project {
  id: string
  name: string
  description: string
  status: 'draft' | 'review' | 'active' | 'completed' | 'cancelled'
  phase: 'seed' | 'private' | 'public' | 'ido'
  totalRaised: number
  targetAmount: number
  investors: number
  maxInvestors: number
  startDate: string
  endDate: string
  tokenPrice: number
  tokenSymbol: string
  category: string
  progress: number
}

interface Investor {
  id: string
  address: string
  amount: number
  date: string
  status: 'confirmed' | 'pending' | 'refunded'
  tier: 'standard' | 'vip' | 'whale'
}

interface ProjectPhase {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  allocation: number
  minInvestment: number
  maxInvestment: number
  status: 'upcoming' | 'active' | 'completed'
  participants: number
}

/**
 * Componente de gestão de projetos para emissores
 * Permite gerenciar fases, investidores, documentos e configurações do projeto
 */
export function ProjectManagement({ projectId, className = '' }: ProjectManagementProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'investors' | 'documents' | 'settings'>('overview')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Dados mockados do projeto
  const project: Project = {
    id: 'proj-001',
    name: 'DeFi Protocol Alpha',
    description: 'Protocolo DeFi inovador com yield farming otimizado e governança descentralizada',
    status: 'active',
    phase: 'private',
    totalRaised: 750000,
    targetAmount: 2000000,
    investors: 234,
    maxInvestors: 500,
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    tokenPrice: 0.25,
    tokenSymbol: 'ALPHA',
    category: 'DeFi',
    progress: 37.5
  }

  // Fases do projeto
  const projectPhases: ProjectPhase[] = [
    {
      id: 'seed',
      name: 'Seed Round',
      description: 'Rodada inicial para investidores estratégicos',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      allocation: 500000,
      minInvestment: 10000,
      maxInvestment: 100000,
      status: 'completed',
      participants: 25
    },
    {
      id: 'private',
      name: 'Private Sale',
      description: 'Venda privada para investidores qualificados',
      startDate: '2024-02-16',

      endDate: '2024-03-15',
      allocation: 1000000,
      minInvestment: 5000,
      maxInvestment: 50000,
      status: 'active',
      participants: 156
    },
    {
      id: 'public',
      name: 'Public Sale',
      description: 'Venda pública para todos os investidores',
      startDate: '2024-03-16',
      endDate: '2024-04-15',
      allocation: 500000,
      minInvestment: 100,
      maxInvestment: 10000,
      status: 'upcoming',
      participants: 0
    }
  ]

  // Investidores recentes
  const recentInvestors: Investor[] = [
    {
      id: '1',
      address: '0x1234...5678',
      amount: 25000,
      date: '2024-01-20',
      status: 'confirmed',
      tier: 'whale'
    },
    {
      id: '2',
      address: '0x9876...4321',
      amount: 15000,
      date: '2024-01-19',
      status: 'confirmed',
      tier: 'vip'
    },
    {
      id: '3',
      address: '0x5555...7777',
      amount: 5000,
      date: '2024-01-18',
      status: 'pending',
      tier: 'standard'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      case 'upcoming': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'refunded': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'whale': return 'bg-purple-100 text-purple-700'
      case 'vip': return 'bg-yellow-100 text-yellow-700'
      case 'standard': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'phases', label: 'Fases', icon: Calendar },
    { id: 'investors', label: 'Investidores', icon: Users },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header do Projeto */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-roxo to-laranja rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-grafite">{project.name}</h2>
            <p className="text-gray-600">{project.category} • {project.tokenSymbol}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(project.status)}>
            {project.status === 'active' && 'Ativo'}
            {project.status === 'completed' && 'Concluído'}
            {project.status === 'draft' && 'Rascunho'}
            {project.status === 'review' && 'Em Análise'}
          </Badge>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Visualizar Público
          </Button>
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Captado</p>
              <p className="text-lg font-semibold text-grafite">
                ${project.totalRaised.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Meta</p>
              <p className="text-lg font-semibold text-grafite">
                ${project.targetAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Investidores</p>
              <p className="text-lg font-semibold text-grafite">
                {project.investors}/{project.maxInvestors}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Progresso</p>
              <p className="text-lg font-semibold text-grafite">{project.progress}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Navegação por Abas */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-roxo text-roxo'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Conteúdo das Abas */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-grafite mb-4">Progresso da Captação</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Captado: ${project.totalRaised.toLocaleString()}</span>
                  <span>Meta: ${project.targetAmount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-roxo to-laranja h-3 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {project.progress}% da meta atingida
                </p>
              </div>
            </Card>

            {/* Investidores Recentes */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-grafite">Investidores Recentes</h3>
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </div>
              
              <div className="space-y-3">
                {recentInvestors.map((investor, index) => (
                  <motion.div
                    key={investor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-roxo to-laranja rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {investor.address.slice(2, 4).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-grafite">{investor.address}</p>
                        <p className="text-sm text-gray-600">{investor.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getTierColor(investor.tier)} size="sm">
                        {investor.tier.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(investor.status)} size="sm">
                        {investor.status === 'confirmed' && 'Confirmado'}
                        {investor.status === 'pending' && 'Pendente'}
                        {investor.status === 'refunded' && 'Reembolsado'}
                      </Badge>
                      <p className="font-semibold text-grafite">
                        ${investor.amount.toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'phases' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-grafite">Fases do Projeto</h3>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova Fase
              </Button>
            </div>
            
            {projectPhases.map((phase, index) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-grafite">{phase.name}</h4>
                        <Badge className={getStatusColor(phase.status)}>
                          {phase.status === 'active' && 'Ativo'}
                          {phase.status === 'completed' && 'Concluído'}
                          {phase.status === 'upcoming' && 'Próximo'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{phase.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Alocação</p>
                          <p className="font-semibold">${phase.allocation.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Min. Investimento</p>
                          <p className="font-semibold">${phase.minInvestment.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Participantes</p>
                          <p className="font-semibold">{phase.participants}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Período</p>
                          <p className="font-semibold">{phase.startDate} - {phase.endDate}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'investors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-grafite">Gestão de Investidores</h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar investidor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
            
            <Card className="p-6">
              <p className="text-center text-gray-500 py-8">
                Lista detalhada de investidores será implementada aqui
              </p>
            </Card>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-grafite">Documentos do Projeto</h3>
              <Button variant="primary" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Documento
              </Button>
            </div>
            
            <Card className="p-6">
              <p className="text-center text-gray-500 py-8">
                Gestão de documentos será implementada aqui
              </p>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-grafite">Configurações do Projeto</h3>
            
            <Card className="p-6">
              <p className="text-center text-gray-500 py-8">
                Configurações do projeto serão implementadas aqui
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectManagement