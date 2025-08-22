import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  Rocket,
  Shield,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Permission, hasPermission } from '../types/auth';
import { useNavigate } from 'react-router-dom';

// Icon components
const PlusIcon = ({ className, ...props }: { className?: string }) => {
  return <Plus className={className} {...props} />;
};

const SearchIcon = ({ className, ...props }: { className?: string }) => {
  return <Search className={className} {...props} />;
};

const FilterIcon = ({ className, ...props }: { className?: string }) => {
  return <Filter className={className} {...props} />;
};

const GridIcon = ({ className, ...props }: { className?: string }) => {
  return <Grid className={className} {...props} />;
};

const ListIcon = ({ className, ...props }: { className?: string }) => {
  return <List className={className} {...props} />;
};

const ChevronDownIcon = ({ className, ...props }: { className?: string }) => {
  return <ChevronDown className={className} {...props} />;
};

const RocketIcon = ({ className, ...props }: { className?: string }) => {
  return <Rocket className={className} {...props} />;
};

const ShieldIcon = ({ className, ...props }: { className?: string }) => {
  return <Shield className={className} {...props} />;
};

const ClockIcon = ({ className, ...props }: { className?: string }) => {
  return <Clock className={className} {...props} />;
};

const DollarSignIcon = ({ className, ...props }: { className?: string }) => {
  return <DollarSign className={className} {...props} />;
};

// Mock data
const mockProjects = [
  {
    id: '1',
    name: 'DeFi Protocol Alpha',
    description: 'Protocolo descentralizado para empréstimos e yield farming com garantias inovadoras.',
    tokenSymbol: 'DPA',
    targetAmount: '500000',
    status: 'draft',
    safeguardHash: 'sg_abc123...def456',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2', 
    name: 'GameFi Revolution',
    description: 'Plataforma de jogos blockchain com NFTs e economia play-to-earn sustentável.',
    tokenSymbol: 'GFR',
    targetAmount: '750000',
    status: 'pending',
    safeguardHash: 'sg_xyz789...abc123',
    createdAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    name: 'Green Energy DAO',
    description: 'DAO focada em financiamento de projetos de energia renovável através de blockchain.',
    tokenSymbol: 'GED',
    targetAmount: '1000000',
    status: 'live',
    safeguardHash: 'sg_def456...xyz789',
    createdAt: '2024-01-05T09:15:00Z',
  },
];

export function ProjectListingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'pending' | 'live'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Verificar se o usuário pode criar projetos
  const canCreateProject = hasPermission(user, Permission.CREATE_PROJECT);
  


  // Filtrar projetos baseado na busca e filtros
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tokenSymbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Labels e cores para status
  const statusLabels = {
    draft: 'Rascunho',
    pending: 'Pendente',
    live: 'Ativo',
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-grafite-700 dark:text-grafite-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    live: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <RocketIcon className="w-8 h-8 text-lunes-500" />
              <div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  Meus Projetos
                </h1>
                <p className="text-grafite-300 max-w-2xl">
                  Gerencie seus projetos no Lunes Launchpad
                </p>
              </div>
            </div>
            
            {canCreateProject && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-4 py-2 bg-lunes-500 hover:bg-lunes-600 text-white font-medium rounded-lg transition-colors"
                onClick={() => navigate('/criar-projeto')}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Novo Projeto
              </motion.button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="bg-grafite-800 rounded-lg shadow-sm border border-grafite-600 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar projetos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-grafite-600 bg-grafite-700 text-white placeholder-grafite-400 rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-grafite-600 bg-grafite-700 text-white rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent"
                >
                  <option value="all">Todos os Status</option>
                  <option value="draft">Rascunho</option>
                  <option value="pending">Pendente</option>
                  <option value="live">Ativo</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-grafite-600 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-lunes-500 text-white' : 'bg-grafite-700 text-grafite-300'}`}
                  >
                    <GridIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-lunes-500 text-white' : 'bg-grafite-700 text-grafite-300'}`}
                  >
                    <ListIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="mb-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-grafite-700 rounded-full flex items-center justify-center">
                <RocketIcon className="w-12 h-12 text-grafite-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {searchQuery || filterStatus !== 'all' ? 'Nenhum projeto encontrado' : 'Nenhum projeto criado'}
              </h3>
              <p className="text-grafite-300 mb-6">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Tente ajustar os filtros ou termo de busca'
                  : 'Comece criando seu primeiro projeto no Lunes Launchpad'
                }
              </p>
              {canCreateProject && (!searchQuery && filterStatus === 'all') && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-6 py-3 bg-lunes-500 hover:bg-lunes-600 text-white font-medium rounded-lg transition-colors"
                  onClick={() => navigate('/criar-projeto')}
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Criar Primeiro Projeto
                </motion.button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  className="bg-grafite-800 rounded-lg shadow-sm border border-grafite-600 p-6 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => {
                    navigate(`/editar-projeto/${project.id}`);
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-grafite-300 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status as keyof typeof statusColors]}`}>
                      {statusLabels[project.status as keyof typeof statusLabels]}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-grafite-400">Token:</span>
                      <span className="font-medium text-white">{project.tokenSymbol}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-grafite-400">Meta:</span>
                      <span className="font-medium text-white">
                        ${parseInt(project.targetAmount).toLocaleString()} LUSD
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-grafite-400">SafeGuard:</span>
                      <div className="flex items-center space-x-1">
                        <ShieldIcon className="w-4 h-4 text-green-500" />
                        <span className="font-mono text-xs text-grafite-300">
                          {project.safeguardHash}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-grafite-400">Criado em:</span>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4 text-grafite-400" />
                        <span className="text-grafite-300">
                          {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-grafite-600">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-grafite-400">
                        Clique para editar
                      </span>
                      <div className="flex items-center space-x-2">
                        {project.status === 'live' && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium">Ativo</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectListingPage;