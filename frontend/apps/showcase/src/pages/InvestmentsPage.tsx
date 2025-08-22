import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Eye,
  Download,
  Bell,
  X,
} from 'lucide-react';
import { useUserInvestments } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import { formatUtils } from '../lib/utils';
import { InvestmentDetailsModal } from '../components/modals/InvestmentDetailsModal';

/**
 * Página de Investimentos - Exibe dados básicos dos investimentos do usuário
 * Focada em informações essenciais sem gráficos complexos
 */
export default function InvestmentsPage() {
  console.log('🚀 InvestmentsPage: Componente iniciado');
  
  const { user } = useAuth();
  console.log('👤 InvestmentsPage: User data:', user);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'performance'>('date');
  const [expandedInvestment, setExpandedInvestment] = useState<string | null>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);

  // Hook para buscar investimentos do usuário
  const {
    data: investments,
    isLoading,
    error,
  } = useUserInvestments(user?.walletAddress || '');

  // Debug: Log para verificar se o componente está sendo renderizado
  console.log('📊 InvestmentsPage renderizado:', { user, isLoading, error, investments });

  // Dados mockados para demonstração
  const mockInvestments = [
    {
      id: '1',
      projectName: 'LunesDAO',
      projectLogo: '/images/projects/lunesdao.png',
      totalInvested: 5000,
      currentValue: 6250,
      pnl: 1250,
      pnlPercentage: 25,
      status: 'active',
      vestingStatus: 'partial',
      claimableAmount: 312.5,
      nextVestingDate: '2024-02-15',
      investmentDate: '2024-01-01',
      phases: ['Seed', 'Private'],
      tokenSymbol: 'LDAO',
      totalTokens: 1250,
      vestedTokens: 312.5,
      vestingSchedule: [
        { date: '2024-01-15', amount: 312.5, status: 'claimed', percentage: 25 },
        { date: '2024-02-15', amount: 312.5, status: 'available', percentage: 25 },
        { date: '2024-03-15', amount: 312.5, status: 'locked', percentage: 25 },
        { date: '2024-04-15', amount: 312.5, status: 'locked', percentage: 25 },
      ],
    },
    {
      id: '2',
      projectName: 'LunesSwap',
      projectLogo: '/images/projects/lunesswap.png',
      totalInvested: 2500,
      currentValue: 2125,
      pnl: -375,
      pnlPercentage: -15,
      status: 'active',
      vestingStatus: 'locked',
      claimableAmount: 0,
      nextVestingDate: '2024-03-01',
      investmentDate: '2024-01-15',
      phases: ['Public'],
      tokenSymbol: 'LSWAP',
      totalTokens: 850,
      vestedTokens: 0,
      vestingSchedule: [
        { date: '2024-03-01', amount: 170, status: 'locked', percentage: 20 },
        { date: '2024-04-01', amount: 170, status: 'locked', percentage: 20 },
        { date: '2024-05-01', amount: 170, status: 'locked', percentage: 20 },
        { date: '2024-06-01', amount: 170, status: 'locked', percentage: 20 },
        { date: '2024-07-01', amount: 170, status: 'locked', percentage: 20 },
      ],
    },
    {
      id: '3',
      projectName: 'LunesNFT',
      projectLogo: '/images/projects/lunesnft.png',
      totalInvested: 1000,
      currentValue: 1000,
      pnl: 0,
      pnlPercentage: 0,
      status: 'completed',
      vestingStatus: 'completed',
      claimableAmount: 0,
      nextVestingDate: null,
      investmentDate: '2023-12-01',
      phases: ['IDO'],
      tokenSymbol: 'LNFT',
      totalTokens: 500,
      vestedTokens: 500,
      vestingSchedule: [
        { date: '2023-12-15', amount: 500, status: 'claimed', percentage: 100 },
      ],
    },
  ];

  // Estatísticas gerais
  const totalStats = {
    totalInvested: mockInvestments.reduce((sum, inv) => sum + inv.totalInvested, 0),
    currentValue: mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0),
    totalPnl: mockInvestments.reduce((sum, inv) => sum + inv.pnl, 0),
    activeInvestments: mockInvestments.filter(inv => inv.status === 'active').length,
    totalClaimable: mockInvestments.reduce((sum, inv) => sum + inv.claimableAmount, 0),
  };

  const totalPnlPercentage = (totalStats.totalPnl / totalStats.totalInvested) * 100;

  // Filtrar e ordenar investimentos
  const filteredInvestments = mockInvestments
    .filter(investment => {
      const matchesSearch = investment.projectName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || investment.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.currentValue - a.currentValue;
        case 'performance':
          return b.pnlPercentage - a.pnlPercentage;
        case 'date':
        default:
          return new Date(b.investmentDate).getTime() - new Date(a.investmentDate).getTime();
      }
    });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-verde-500/20 text-verde-400 border-verde-500/30',
      completed: 'bg-azul-500/20 text-azul-400 border-azul-500/30',
      cancelled: 'bg-vermelho-500/20 text-vermelho-400 border-vermelho-500/30',
    };
    
    const labels = {
      active: 'Ativo',
      completed: 'Concluído',
      cancelled: 'Cancelado',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getVestingBadge = (vestingStatus: string) => {
    const styles = {
      locked: 'bg-amarelo-500/20 text-amarelo-400 border-amarelo-500/30',
      partial: 'bg-roxo-500/20 text-roxo-400 border-roxo-500/30',
      completed: 'bg-verde-500/20 text-verde-400 border-verde-500/30',
    };
    
    const labels = {
      locked: 'Bloqueado',
      partial: 'Parcial',
      completed: 'Liberado',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[vestingStatus as keyof typeof styles]}`}>
        {labels[vestingStatus as keyof typeof labels]}
      </span>
    );
  };

  const getVestingStatusBadge = (status: string) => {
    const styles = {
      claimed: 'bg-verde-500/20 text-verde-400 border-verde-500/30',
      available: 'bg-azul-500/20 text-azul-400 border-azul-500/30',
      locked: 'bg-grafite-500/20 text-grafite-400 border-grafite-500/30',
    };
    
    const labels = {
      claimed: 'Resgatado',
      available: 'Disponível',
      locked: 'Bloqueado',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const renderVestingSchedule = (investment: any) => {
    if (!investment.vestingSchedule) return null;

    return (
      <div className="mt-6 pt-6 border-t border-grafite-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-roxo-400" />
          Cronograma de Vesting
        </h4>
        
        <div className="grid gap-3">
          {investment.vestingSchedule.map((vesting: any, index: number) => {
            const vestingDate = new Date(vesting.date);
            const isUpcoming = vestingDate > new Date() && vesting.status === 'locked';
            const isNext = isUpcoming && index === investment.vestingSchedule.findIndex((v: any) => v.status === 'locked');
            
            return (
              <div 
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isNext ? 'bg-roxo-500/10 border-roxo-500/30' : 'bg-grafite-700/50 border-grafite-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    vesting.status === 'claimed' ? 'bg-verde-400' :
                    vesting.status === 'available' ? 'bg-azul-400' : 'bg-grafite-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {vestingDate.toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-grafite-400">
                      {vesting.percentage}% do total
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {formatUtils.currency(vesting.amount)} {investment.tokenSymbol}
                    </p>
                    {isNext && (
                      <p className="text-xs text-roxo-400">
                        Próximo resgate
                      </p>
                    )}
                  </div>
                  {getVestingStatusBadge(vesting.status)}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Resumo do Vesting */}
        <div className="mt-4 grid grid-cols-3 gap-4 p-4 bg-grafite-700/30 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-grafite-400 mb-1">Total de Tokens</p>
            <p className="text-sm font-semibold text-white">
              {formatUtils.currency(investment.totalTokens)} {investment.tokenSymbol}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-grafite-400 mb-1">Já Resgatado</p>
            <p className="text-sm font-semibold text-verde-400">
              {formatUtils.currency(investment.vestedTokens)} {investment.tokenSymbol}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-grafite-400 mb-1">Disponível Agora</p>
            <p className="text-sm font-semibold text-azul-400">
              {formatUtils.currency(investment.claimableAmount)} {investment.tokenSymbol}
            </p>
          </div>
        </div>
      </div>
    );
  };



  // Função para calcular próximos vencimentos
  const getUpcomingVestings = () => {
    const upcoming: any[] = [];
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    filteredInvestments.forEach(investment => {
      investment.vestingSchedule?.forEach((vesting: any) => {
        const vestingDate = new Date(vesting.date);
        if (vesting.status === 'pending' && vestingDate >= now && vestingDate <= nextWeek) {
          upcoming.push({
            ...vesting,
            projectName: investment.projectName,
            tokenSymbol: investment.tokenSymbol,
            investmentId: investment.id
          });
        }
      });
    });

    return upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const upcomingVestings = getUpcomingVestings();





  // Comentando temporariamente as condições de loading e error para usar dados mockados
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-grafite-900 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-roxo-500 mx-auto mb-4"></div>
  //         <p className="text-grafite-300">Carregando investimentos...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-grafite-900 flex items-center justify-center">
  //       <div className="text-center">
  //         <p className="text-vermelho-400 mb-4">Erro ao carregar investimentos</p>
  //         <button 
  //           onClick={() => window.location.reload()}
  //           className="px-4 py-2 bg-roxo-600 text-white rounded-lg hover:bg-roxo-700 transition-colors"
  //         >
  //           Tentar Novamente
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-grafite-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Meus Investimentos</h1>
          <p className="text-grafite-300">
            Acompanhe o desempenho dos seus investimentos na plataforma Lunes
          </p>
        </div>

        {/* Notificações de Vencimentos Próximos */}
        {showNotifications && upcomingVestings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-azul-500/20 to-roxo-500/20 border border-azul-400/30 rounded-lg p-4 mb-8"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-azul-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Próximos Vencimentos de Vesting
                  </h3>
                  <div className="space-y-2">
                    {upcomingVestings.slice(0, 3).map((vesting, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-white font-medium">{vesting.projectName}</span>
                          <span className="text-grafite-400 ml-2">
                            {new Date(vesting.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <span className="text-azul-400 font-semibold">
                          {formatUtils.currency(vesting.amount)} {vesting.tokenSymbol}
                        </span>
                      </div>
                    ))}
                    {upcomingVestings.length > 3 && (
                      <p className="text-xs text-grafite-400">
                        +{upcomingVestings.length - 3} outros vencimentos
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-grafite-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-grafite-800 rounded-xl p-6 border border-grafite-700"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-azul-400" />
              <span className="text-xs text-grafite-400">Total Investido</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatUtils.currency(totalStats.totalInvested)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-grafite-800 rounded-xl p-6 border border-grafite-700"
          >
            <div className="flex items-center justify-between mb-2">
              <PieChart className="h-5 w-5 text-verde-400" />
              <span className="text-xs text-grafite-400">Valor Atual</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatUtils.currency(totalStats.currentValue)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-grafite-800 rounded-xl p-6 border border-grafite-700"
          >
            <div className="flex items-center justify-between mb-2">
              {totalStats.totalPnl >= 0 ? (
                <TrendingUp className="h-5 w-5 text-verde-400" />
              ) : (
                <TrendingDown className="h-5 w-5 text-vermelho-400" />
              )}
              <span className="text-xs text-grafite-400">P&L Total</span>
            </div>
            <p className={`text-2xl font-bold ${
              totalStats.totalPnl >= 0 ? 'text-verde-400' : 'text-vermelho-400'
            }`}>
              {totalStats.totalPnl >= 0 ? '+' : ''}{formatUtils.currency(totalStats.totalPnl)}
            </p>
            <p className={`text-sm ${
              totalStats.totalPnl >= 0 ? 'text-verde-400' : 'text-vermelho-400'
            }`}>
              {totalPnlPercentage >= 0 ? '+' : ''}{formatUtils.percentage(totalPnlPercentage)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y:20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-grafite-800 rounded-xl p-6 border border-grafite-700"
          >
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-roxo-400" />
              <span className="text-xs text-grafite-400">Ativos</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {totalStats.activeInvestments}
            </p>
            <p className="text-sm text-grafite-400">investimentos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-grafite-800 rounded-xl p-6 border border-grafite-700"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-amarelo-400" />
              <span className="text-xs text-grafite-400">Disponível</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatUtils.currency(totalStats.totalClaimable)}
            </p>
            <p className="text-sm text-grafite-400">para resgate</p>
          </motion.div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-grafite-800 rounded-xl p-6 border border-grafite-700 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-grafite-400" />
                <input
                  type="text"
                  placeholder="Buscar por projeto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-grafite-700 border border-grafite-600 rounded-lg text-white placeholder-grafite-400 focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtro por Status */}
            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-grafite-700 border border-grafite-600 rounded-lg text-white focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="completed">Concluídos</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>

            {/* Ordenação */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'value' | 'performance')}
                className="w-full px-3 py-2 bg-grafite-700 border border-grafite-600 rounded-lg text-white focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
              >
                <option value="date">Data de Investimento</option>
                <option value="value">Valor Atual</option>
                <option value="performance">Performance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Investimentos */}
        <div className="space-y-4">
          {filteredInvestments.length === 0 ? (
            <div className="bg-grafite-800 rounded-xl p-12 border border-grafite-700 text-center">
              <PieChart className="h-12 w-12 text-grafite-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum investimento encontrado</h3>
              <p className="text-grafite-400 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Você ainda não possui investimentos na plataforma'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button className="px-6 py-3 bg-roxo-600 text-white rounded-lg hover:bg-roxo-700 transition-colors">
                  Explorar Projetos
                </button>
              )}
            </div>
          ) : (
            filteredInvestments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-grafite-800 rounded-xl p-6 border border-grafite-700 hover:border-grafite-600 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Informações do Projeto */}
                  <div className="flex items-center gap-4 lg:flex-1">
                    <div className="w-12 h-12 bg-grafite-700 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-roxo-400">
                        {investment.projectName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {investment.projectName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(investment.status)}
                        {getVestingBadge(investment.vestingStatus)}
                      </div>
                      <p className="text-sm text-grafite-400 mt-1">
                        Fases: {investment.phases.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Métricas Financeiras */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:flex-1">
                    <div>
                      <p className="text-xs text-grafite-400 mb-1">Investido</p>
                      <p className="text-sm font-semibold text-white">
                        {formatUtils.currency(investment.totalInvested)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-grafite-400 mb-1">Valor Atual</p>
                      <p className="text-sm font-semibold text-white">
                        {formatUtils.currency(investment.currentValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-grafite-400 mb-1">P&L</p>
                      <div className="flex items-center gap-1">
                        {investment.pnl >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-verde-400" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-vermelho-400" />
                        )}
                        <p className={`text-sm font-semibold ${
                          investment.pnl >= 0 ? 'text-verde-400' : 'text-vermelho-400'
                        }`}>
                          {investment.pnl >= 0 ? '+' : ''}{formatUtils.currency(investment.pnl)}
                        </p>
                      </div>
                      <p className={`text-xs ${
                        investment.pnl >= 0 ? 'text-verde-400' : 'text-vermelho-400'
                      }`}>
                        {investment.pnlPercentage >= 0 ? '+' : ''}{formatUtils.percentage(investment.pnlPercentage)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-grafite-400 mb-1">Disponível</p>
                      <p className="text-sm font-semibold text-white">
                        {formatUtils.currency(investment.claimableAmount)}
                      </p>
                      {investment.nextVestingDate && (
                        <p className="text-xs text-grafite-400">
                          Próximo: {new Date(investment.nextVestingDate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setExpandedInvestment(
                        expandedInvestment === investment.id ? null : investment.id
                      )}
                      className="p-2 text-grafite-400 hover:text-roxo-400 hover:bg-roxo-500/10 rounded-lg transition-colors"
                      title="Ver cronograma de vesting"
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                    <button 
                            onClick={() => {
                              setSelectedInvestment(investment);
                              setShowInvestmentModal(true);
                            }}
                            className="p-2 text-grafite-400 hover:text-azul-400 hover:bg-azul-500/10 rounded-lg transition-colors"
                            title="Ver detalhes do investimento"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                    <button className="p-2 text-grafite-400 hover:text-verde-400 hover:bg-verde-500/10 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                    {investment.claimableAmount > 0 && (
                            <button 
                              onClick={() => {
                                setSelectedInvestment(investment);
                                setShowInvestmentModal(true);
                              }}
                              className="px-3 py-1.5 bg-roxo-500 hover:bg-roxo-600 text-white text-sm font-medium rounded-lg transition-colors"
                              title={`Resgatar ${formatUtils.currency(investment.claimableAmount)} ${investment.tokenSymbol}`}
                            >
                              Resgatar
                            </button>
                          )}
                  </div>
                </div>

                {/* Cronograma de Vesting Expandido */}
                {expandedInvestment === investment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderVestingSchedule(investment)}
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Detalhes do Investimento */}
      <InvestmentDetailsModal
        isOpen={showInvestmentModal}
        onClose={() => {
          setShowInvestmentModal(false);
          setSelectedInvestment(null);
        }}
        investment={selectedInvestment}
        onClaimTokens={async (investment) => {
          console.log('Processando resgate de tokens:', investment);
          // Aqui seria implementada a lógica de resgate
          // Por enquanto, apenas simula o processo
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log('Resgate processado com sucesso!');
        }}
      />
    </div>
  );
}