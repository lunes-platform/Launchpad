import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Coins,
  AlertCircle,
  Filter,
  Download,
  Bell,
  CheckCircle,
  Info,
  Search,
  Grid3X3,
  List,
  GitBranch,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PieChart,
} from 'lucide-react';
import { Card, Button, Input } from '@launchpad/shared-ui';
import { Badge } from '../components/ui/Badge';
import { FadeIn } from '../components/animations/FadeIn';
import { ScaleIn } from '../components/animations/ScaleIn';

/**
 * Página de Cronograma de Recompensas
 * Exibe distribuições automáticas, pools de recompensas e métricas
 */

// Interfaces
interface RewardPool {
  id: string;
  name: string;
  category: 'staking' | 'project_buy' | 'participation' | 'top_investors' | 'top_engagers';
  totalAmount: number;
  currency: 'LUNES' | 'LUSDT';
  distributedAmount: number;
  participantsCount: number;
  lastDistribution: Date;
  nextDistribution: Date;
  distributionInterval: number; // em dias
  isActive: boolean;
}

interface DistributionEvent {
  id: string;
  poolId: string;
  scheduledDate: Date;
  amount: number;
  currency: 'LUNES' | 'LUSDT';
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
  eligibleUsers: number;
  category: string;
}

interface PlatformMetrics {
  totalUsers: number;
  totalParticipants: number;
  totalProjects: number;
  totalInvestments: number;
  totalRewardsDistributed: number;
  activeStakers: number;
}

export function RewardsSchedulePage() {
  // Estados
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('week');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [viewMode, setViewMode] = useState<string>('grid');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Dados mockados
  const mockPools: RewardPool[] = [
    {
      id: '1',
      name: 'Pool de Staking LUNES',
      category: 'staking',
      totalAmount: 100000,
      currency: 'LUNES',
      distributedAmount: 75000,
      participantsCount: 1250,
      lastDistribution: new Date('2024-01-15'),
      nextDistribution: new Date('2024-02-15'),
      distributionInterval: 30,
      isActive: true,
    },
    {
      id: '2',
      name: 'Recompensas por Compra de Projetos',
      category: 'project_buy',
      totalAmount: 50000,
      currency: 'LUSDT',
      distributedAmount: 30000,
      participantsCount: 850,
      lastDistribution: new Date('2024-01-10'),
      nextDistribution: new Date('2024-02-10'),
      distributionInterval: 30,
      isActive: true,
    },
    {
      id: '3',
      name: 'Top Investidores',
      category: 'top_investors',
      totalAmount: 25000,
      currency: 'LUNES',
      distributedAmount: 15000,
      participantsCount: 100,
      lastDistribution: new Date('2024-01-01'),
      nextDistribution: new Date('2024-03-01'),
      distributionInterval: 60,
      isActive: true,
    },
  ];

  const mockDistributions: DistributionEvent[] = [
    {
      id: '1',
      poolId: '1',
      scheduledDate: new Date('2024-02-15'),
      amount: 25000,
      currency: 'LUNES',
      status: 'scheduled',
      eligibleUsers: 1250,
      category: 'Staking',
    },
    {
      id: '2',
      poolId: '2',
      scheduledDate: new Date('2024-02-10'),
      amount: 20000,
      currency: 'LUSDT',
      status: 'scheduled',
      eligibleUsers: 850,
      category: 'Project Buy',
    },
    {
      id: '3',
      poolId: '1',
      scheduledDate: new Date('2024-01-15'),
      amount: 25000,
      currency: 'LUNES',
      status: 'completed',
      eligibleUsers: 1200,
      category: 'Staking',
    },
  ];

  const mockMetrics: PlatformMetrics = {
    totalUsers: 15420,
    totalParticipants: 8750,
    totalProjects: 45,
    totalInvestments: 2500000,
    totalRewardsDistributed: 750000,
    activeStakers: 3200,
  };

  // Simular carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filtrar distribuições
  const filteredDistributions = mockDistributions
    .filter(distribution => {
      const matchesSearch = distribution.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || distribution.category.toLowerCase().includes(selectedCategory);
      const matchesStatus = selectedStatus === 'all' || distribution.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'date') {
        return (a.scheduledDate.getTime() - b.scheduledDate.getTime()) * order;
      }
      if (sortBy === 'amount') {
        return (a.amount - b.amount) * order;
      }
      return 0;
    });

  // Estatísticas das distribuições
  const distributionStats = {
    total: mockDistributions.length,
    scheduled: mockDistributions.filter(d => d.status === 'scheduled').length,
    completed: mockDistributions.filter(d => d.status === 'completed').length,
    totalAmount: mockDistributions.reduce((sum, d) => sum + d.amount, 0),
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      staking: 'bg-roxo-claro text-roxo-800 dark:bg-roxo-900 dark:text-roxo-300',
      project_buy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      participation: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      top_investors: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      top_engagers: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-roxo-claro text-roxo-800 dark:bg-roxo-900 dark:text-roxo-300',
      processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-grafite-50 to-white dark:from-grafite-900 dark:to-grafite-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-roxo"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-grafite-50 to-white dark:from-grafite-900 dark:to-grafite-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <FadeIn>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-grafite-900 dark:text-white mb-2">
                  Cronograma de Recompensas
                </h1>
                <p className="text-grafite-600 dark:text-grafite-300">
                  Acompanhe as distribuições automáticas e pools de recompensas da plataforma
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Notificações
                </Button>
              </div>
            </div>

            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <ScaleIn delay={0.1}>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-grafite-600 dark:text-grafite-400">
                        Total Distribuído
                      </p>
                      <p className="text-2xl font-bold text-grafite-900 dark:text-white">
                        {formatCurrency(mockMetrics.totalRewardsDistributed, 'LUNES')}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </Card>
              </ScaleIn>

              <ScaleIn delay={0.2}>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-grafite-600 dark:text-grafite-400">
                        Participantes Ativos
                      </p>
                      <p className="text-2xl font-bold text-grafite-900 dark:text-white">
                        {mockMetrics.totalParticipants.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </Card>
              </ScaleIn>

              <ScaleIn delay={0.3}>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-grafite-600 dark:text-grafite-400">
                        Próximas Distribuições
                      </p>
                      <p className="text-2xl font-bold text-grafite-900 dark:text-white">
                        {distributionStats.scheduled}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </Card>
              </ScaleIn>

              <ScaleIn delay={0.4}>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-grafite-600 dark:text-grafite-400">
                        Stakers Ativos
                      </p>
                      <p className="text-2xl font-bold text-grafite-900 dark:text-white">
                        {mockMetrics.activeStakers.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <Coins className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </Card>
              </ScaleIn>
            </div>
          </div>
        </FadeIn>

        {/* Filtros e Controles */}
        <FadeIn delay={0.2}>
          <Card className="p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grafite-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por categoria ou pool..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-grafite-200 dark:border-grafite-700 rounded-lg bg-white dark:bg-grafite-800 text-grafite-900 dark:text-white"
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="staking">Staking</option>
                  <option value="project">Project Buy</option>
                  <option value="participation">Participation</option>
                  <option value="investors">Top Investors</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-grafite-200 dark:border-grafite-700 rounded-lg bg-white dark:bg-grafite-800 text-grafite-900 dark:text-white"
                >
                  <option value="all">Todos os Status</option>
                  <option value="scheduled">Agendado</option>
                  <option value="processing">Processando</option>
                  <option value="completed">Concluído</option>
                  <option value="failed">Falhou</option>
                </select>

                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-grafite-200 dark:border-grafite-700 rounded-lg bg-white dark:bg-grafite-800 text-grafite-900 dark:text-white"
                >
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mês</option>
                  <option value="quarter">Este Trimestre</option>
                  <option value="year">Este Ano</option>
                </select>

                {/* Modo de Visualização */}
                <div className="flex border border-grafite-200 dark:border-grafite-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-roxo text-white' : 'bg-white dark:bg-grafite-800 text-grafite-600 dark:text-grafite-400'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-roxo text-white' : 'bg-white dark:bg-grafite-800 text-grafite-600 dark:text-grafite-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`p-2 ${viewMode === 'timeline' ? 'bg-roxo text-white' : 'bg-white dark:bg-grafite-800 text-grafite-600 dark:text-grafite-400'}`}
                  >
                    <GitBranch className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </FadeIn>

        {/* Pools de Recompensas */}
        <FadeIn delay={0.3}>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-grafite-900 dark:text-white mb-6">
              Pools de Recompensas Ativas
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockPools.map((pool, index) => (
                <ScaleIn key={pool.id} delay={0.1 * index}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-grafite-900 dark:text-white mb-2">
                          {pool.name}
                        </h3>
                        <Badge className={getCategoryColor(pool.category)}>
                          {pool.category.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div className={`p-2 rounded-lg ${
                        pool.isActive 
                          ? 'bg-green-100 dark:bg-green-900' 
                          : 'bg-gray-100 dark:bg-gray-900'
                      }`}>
                        <Coins className={`w-5 h-5 ${
                          pool.isActive 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-grafite-600 dark:text-grafite-400">
                          Total do Pool
                        </span>
                        <span className="font-semibold text-grafite-900 dark:text-white">
                          {formatCurrency(pool.totalAmount, pool.currency)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-grafite-600 dark:text-grafite-400">
                          Distribuído
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(pool.distributedAmount, pool.currency)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-grafite-600 dark:text-grafite-400">
                          Participantes
                        </span>
                        <span className="font-semibold text-grafite-900 dark:text-white">
                          {pool.participantsCount.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-grafite-600 dark:text-grafite-400">
                          Próxima Distribuição
                        </span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {formatDate(pool.nextDistribution)}
                        </span>
                      </div>

                      {/* Barra de Progresso */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-grafite-600 dark:text-grafite-400">Progresso</span>
                          <span className="text-grafite-900 dark:text-white">
                            {Math.round((pool.distributedAmount / pool.totalAmount) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-grafite-200 dark:bg-grafite-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-roxo to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(pool.distributedAmount / pool.totalAmount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </ScaleIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Cronograma de Distribuições */}
        <FadeIn delay={0.4}>
          <div>
            <h2 className="text-2xl font-bold text-grafite-900 dark:text-white mb-6">
              Cronograma de Distribuições
            </h2>

            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDistributions.map((distribution, index) => (
                  <ScaleIn key={distribution.id} delay={0.1 * index}>
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-grafite-900 dark:text-white mb-2">
                            {distribution.category}
                          </h3>
                          <Badge className={getStatusColor(distribution.status)}>
                            {distribution.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-grafite-900 dark:text-white">
                            {formatCurrency(distribution.amount, distribution.currency)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-grafite-400" />
                          <span className="text-sm text-grafite-600 dark:text-grafite-400">
                            {formatDate(distribution.scheduledDate)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-grafite-400" />
                          <span className="text-sm text-grafite-600 dark:text-grafite-400">
                            {distribution.eligibleUsers.toLocaleString()} usuários elegíveis
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-grafite-200 dark:border-grafite-700">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </Card>
                  </ScaleIn>
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-grafite-50 dark:bg-grafite-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-grafite-500 dark:text-grafite-400 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-grafite-500 dark:text-grafite-400 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-grafite-500 dark:text-grafite-400 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-grafite-500 dark:text-grafite-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-grafite-500 dark:text-grafite-400 uppercase tracking-wider">
                          Usuários
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-grafite-500 dark:text-grafite-400 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-grafite-900 divide-y divide-grafite-200 dark:divide-grafite-700">
                      {filteredDistributions.map((distribution) => (
                        <motion.tr
                          key={distribution.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="hover:bg-grafite-50 dark:hover:bg-grafite-800 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-grafite-900 dark:text-white">
                              {distribution.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-grafite-600 dark:text-grafite-400">
                              {formatDate(distribution.scheduledDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-grafite-900 dark:text-white">
                              {formatCurrency(distribution.amount, distribution.currency)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(distribution.status)}>
                              {distribution.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-grafite-600 dark:text-grafite-400">
                              {distribution.eligibleUsers.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {viewMode === 'timeline' && (
              <Card className="p-6">
                <div className="space-y-6">
                  {filteredDistributions.map((distribution, index) => (
                    <motion.div
                      key={distribution.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-4 h-4 rounded-full ${
                          distribution.status === 'completed' 
                            ? 'bg-green-500' 
                            : distribution.status === 'scheduled'
                            ? 'bg-blue-500'
                            : distribution.status === 'processing'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}></div>
                        {index < filteredDistributions.length - 1 && (
                          <div className="w-0.5 h-16 bg-grafite-200 dark:bg-grafite-700 ml-1.5 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-grafite-900 dark:text-white">
                            {distribution.category}
                          </h3>
                          <Badge className={getStatusColor(distribution.status)}>
                            {distribution.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-grafite-600 dark:text-grafite-400 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(distribution.scheduledDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {formatCurrency(distribution.amount, distribution.currency)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {distribution.eligibleUsers.toLocaleString()} usuários
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export default RewardsSchedulePage;