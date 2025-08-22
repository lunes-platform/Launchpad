import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Users,
  Star,
  Activity,
  Briefcase,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Calendar,
  Target,
  Zap,
  Shield,
  Award,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  Moon,
  Sun,
  Wallet,
  Plus,
  RefreshCw,
  TrendingDown,
  Bell,
  Settings,
  ChevronDown,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Crown
} from "lucide-react";

/**
 * Dashboard Unificado - Design Premium com Glassmorphism
 * 
 * Arquitetura moderna seguindo o design system do projeto:
 * - Background gradiente escuro premium
 * - Cards com glassmorphism e backdrop-blur
 * - Animações suaves com Framer Motion
 * - Paleta de cores consistente (grafite, roxo, verde, laranja)
 * - Layout responsivo e acessível
 */
export default function UnifiedDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dados mockados com estrutura mais robusta para dashboard moderno
  const statsData = {
    totalInvestments: {
      value: 2847650,
      change: 12.5,
      trend: 'up' as const,
    },
    totalProfit: {
      value: 485320,
      change: 8.3,
      trend: 'up' as const,
    },
    activeProjects: {
      value: 24,
      change: -2.1,
      trend: 'down' as const,
    },
    vipStatus: {
      level: '4',
      points: 15420,
      nextLevel: 20000,
    },
    vipBenefits: {
      cashback: 2.5,
      bonusRate: 15,
      prioritySupport: true
    },
    monthlyGrowth: 12.5,
    portfolioValue: 3332970,
    pendingReturns: 125750,
    riskScore: 6.8
  };

  const recentProjects = [
    {
      id: '1',
      name: 'LunesSwap Protocol',
      symbol: 'LSP',
      investment: 5000,
      currentValue: 6250,
      change: 25.0,
      status: 'active' as const,
      phase: 'sale' as const,
      progress: 68,
      daysLeft: 45,
      trend: 'up' as const
    },
    {
      id: '2',
      name: 'DeFi Yield Farm',
      symbol: 'DYF',
      investment: 2500,
      currentValue: 2875,
      change: 15.0,
      status: 'active' as const,
      phase: 'whitelist' as const,
      progress: 82,
      daysLeft: 23,
      trend: 'up' as const
    },
    {
      id: '3',
      name: 'NFT Marketplace',
      symbol: 'NFTM',
      investment: 1000,
      currentValue: 950,
      change: -5.0,
      status: 'completed' as const,
      phase: 'distribution' as const,
      progress: 100,
      daysLeft: 0,
      trend: 'stable' as const
    },
    {
      id: '4',
      name: 'BlockChain Ventures',
      symbol: 'BCV',
      investment: 3000,
      currentValue: 2775,
      change: -7.5,
      status: 'active' as const,
      phase: 'sale' as const,
      progress: 35,
      daysLeft: 120,
      trend: 'down' as const
    },
  ];

  // Variantes de animação otimizadas para performance
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
  };

  const cardVariants: Variants = {
    hidden: { scale: 0.96, opacity: 0, y: 10 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.01,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  // Função para alternar modo escuro
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Função para refresh dos dados
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-grafite-950 via-grafite-900 to-grafite-950' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 pointer-events-none ${
        isDarkMode 
          ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]'
          : 'bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]'
      }`} />
      
      {/* Header Moderno */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 dark:bg-grafite-800/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-grafite-700/50 sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Status */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-roxo-600 to-laranja-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-roxo-600 to-laranja-600 bg-clip-text text-transparent">
                  Dashboard Unificado
                </h1>
              </div>
              
              <div className="hidden sm:flex items-center space-x-2 bg-verde-50 dark:bg-verde-900/20 border border-verde-200 dark:border-verde-800 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-verde-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-verde-700 dark:text-verde-400">Dados em tempo real</span>
              </div>
            </div>
            
            {/* Controles do Header */}
            <div className="flex items-center space-x-3">
              {/* Seletor de Período */}
              <div className="relative">
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="appearance-none bg-white/80 dark:bg-grafite-700/80 border border-slate-200 dark:border-grafite-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-roxo-500 focus:border-transparent transition-all"
                >
                  <option value="7d">7 dias</option>
                  <option value="30d">30 dias</option>
                  <option value="90d">90 dias</option>
                  <option value="1y">1 ano</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              
              {/* Botão de Refresh */}
              <motion.button 
                onClick={handleRefresh}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-slate-600 dark:text-grafite-300 hover:text-roxo-600 dark:hover:text-roxo-400 hover:bg-roxo-50 dark:hover:bg-roxo-900/20 rounded-lg transition-all"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
              
              {/* Toggle Dark Mode */}
              <motion.button 
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-slate-600 dark:text-grafite-300 hover:text-roxo-600 dark:hover:text-roxo-400 hover:bg-roxo-50 dark:hover:bg-roxo-900/20 rounded-lg transition-all"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
              
              {/* Notificações */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-slate-600 dark:text-grafite-300 hover:text-roxo-600 dark:hover:text-roxo-400 hover:bg-roxo-50 dark:hover:bg-roxo-900/20 rounded-lg transition-all"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </motion.button>
              
              {/* Configurações */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-slate-600 dark:text-grafite-300 hover:text-roxo-600 dark:hover:text-roxo-400 hover:bg-roxo-50 dark:hover:bg-roxo-900/20 rounded-lg transition-all"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
      
      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Dashboard
                  </h1>
                  <p className="text-grafite-300 text-lg">
                    Acompanhe seus investimentos e projetos em tempo real
                  </p>
                </div>
                
                {/* Period Selector */}
                <div className="flex items-center gap-2 bg-grafite-800/50 backdrop-blur-md rounded-xl p-1 border border-grafite-700/50">
                  {(['7d', '30d', '90d'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedPeriod === period
                          ? 'bg-roxo-600 text-white shadow-lg'
                          : 'text-grafite-300 hover:text-white hover:bg-grafite-700/50'
                      }`}
                    >
                      {period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : period === '90d' ? '90 dias' : '1 ano'}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Stats Cards - Design Moderno Aprimorado */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {[
                  {
                    title: 'Total Investido',
                    value: formatCurrency(statsData.totalInvestments.value),
                    change: statsData.totalInvestments.change,
                    icon: DollarSign,
                    color: 'roxo',
                    description: 'Capital total aplicado',
                    trend: statsData.totalInvestments.trend
                  },
                  {
                    title: 'Lucro Total',
                    value: formatCurrency(statsData.totalProfit.value),
                    change: statsData.totalProfit.change,
                    icon: TrendingUp,
                    color: 'verde',
                    description: 'Retorno acumulado',
                    trend: statsData.totalProfit.trend
                  },
                  {
                    title: 'Projetos Ativos',
                    value: statsData.activeProjects.value.toString(),
                    change: statsData.activeProjects.change,
                    icon: Briefcase,
                    color: 'laranja',
                    description: 'Em andamento',
                    trend: statsData.activeProjects.change >= 0 ? 'up' : 'down'
                  },
                  {
                    title: 'ROI Médio',
                    value: `${statsData.monthlyGrowth.toFixed(1)}%`,
                    change: 2.3,
                    icon: Target,
                    color: 'roxo',
                    description: 'Retorno sobre investimento',
                    trend: 'up'
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                    className="group relative overflow-hidden bg-grafite-800/40 backdrop-blur-xl rounded-2xl p-6 border border-grafite-700/50 hover:border-grafite-600/70 transition-all duration-300 hover:shadow-2xl"
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${
                      stat.color === 'roxo' ? 'from-roxo-500 to-roxo-600' :
                      stat.color === 'verde' ? 'from-verde-500 to-verde-600' :
                      stat.color === 'laranja' ? 'from-laranja-500 to-laranja-600' :
                      'from-blue-500 to-blue-600'
                    }`} />
                    
                    {/* Header do Card */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                        stat.color === 'roxo' ? 'from-roxo-500/20 to-roxo-600/20 group-hover:from-roxo-500/30 group-hover:to-roxo-600/30' :
                        stat.color === 'verde' ? 'from-verde-500/20 to-verde-600/20 group-hover:from-verde-500/30 group-hover:to-verde-600/30' :
                        stat.color === 'laranja' ? 'from-laranja-500/20 to-laranja-600/20 group-hover:from-laranja-500/30 group-hover:to-laranja-600/30' :
                        'from-blue-500/20 to-blue-600/20 group-hover:from-blue-500/30 group-hover:to-blue-600/30'
                      }`}>
                        <stat.icon className={`w-5 h-5 ${
                          stat.color === 'roxo' ? 'text-roxo-400' :
                          stat.color === 'verde' ? 'text-verde-400' :
                          stat.color === 'laranja' ? 'text-laranja-400' :
                          'text-blue-400'
                        }`} />
                      </div>
                      
                      {/* Indicador de Mudança */}
                      <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                        stat.change >= 0 
                          ? 'bg-verde-500/20 text-verde-400 border border-verde-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {stat.change >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span>{formatPercentage(Math.abs(stat.change))}</span>
                      </div>
                    </div>
                    
                    {/* Conteúdo Principal */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-grafite-400">
                        {stat.title}
                      </h3>
                      <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                        {stat.value}
                      </p>
                      <p className="text-xs text-grafite-500">
                        {stat.description}
                      </p>
                    </div>
                    
                    {/* Mini Gráfico de Tendência */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-1">
                        {[...Array(7)].map((_, i) => {
                          const height = stat.trend === 'up' 
                            ? Math.floor(Math.random() * 3) + 2 + i * 0.3
                            : stat.trend === 'down'
                            ? Math.floor(Math.random() * 3) + 4 - i * 0.3
                            : Math.floor(Math.random() * 3) + 2;
                          
                          return (
                            <div
                              key={i}
                              className={`w-1 rounded-full transition-all duration-300 ${
                                stat.trend === 'up' 
                                  ? 'bg-verde-400' 
                                  : stat.trend === 'down'
                                  ? 'bg-red-400'
                                  : 'bg-grafite-500'
                              }`}
                              style={{ height: `${Math.max(height, 8)}px` }}
                            />
                          );
                        })}
                      </div>
                      <span className="text-xs text-grafite-500">
                        {selectedPeriod === '7d' ? '7d' : selectedPeriod === '30d' ? '30d' : selectedPeriod === '90d' ? '90d' : '1a'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* VIP Status Section - Design Moderno */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="relative overflow-hidden bg-gradient-to-r from-laranja-500/10 via-roxo-500/10 to-laranja-500/10 backdrop-blur-xl rounded-2xl p-6 border border-laranja-500/30 hover:border-laranja-400/50 transition-all duration-300 group">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.1),transparent_50%)] opacity-50" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)] opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="p-3 bg-gradient-to-r from-laranja-500/20 to-roxo-500/20 rounded-xl border border-laranja-500/30">
                          <Award className="w-6 h-6 text-laranja-300" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-laranja-500 to-roxo-500 rounded-full flex items-center justify-center">
                          <Star className="w-2 h-2 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Status VIP</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-laranja-400 font-semibold">Nível {statsData.vipStatus.level}</span>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${
                                  i < parseInt(statsData.vipStatus.level) 
                                    ? 'text-laranja-400 fill-current' 
                                    : 'text-grafite-600'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-grafite-400 mb-1">Próximo nível em</p>
                      <p className="text-lg font-bold text-white">
                        {(statsData.vipStatus.nextLevel - statsData.vipStatus.points).toLocaleString()} pts
                      </p>
                    </div>
                  </div>
                  
                  {/* Barra de Progresso Moderna */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-grafite-300 font-medium">Progresso para Nível {parseInt(statsData.vipStatus.level) + 1}</span>
                      <span className="text-white font-semibold">
                        {Math.round((statsData.vipStatus.points / statsData.vipStatus.nextLevel) * 100)}%
                      </span>
                    </div>
                    <div className="relative w-full bg-grafite-700/50 rounded-full h-4 overflow-hidden">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-laranja-500 via-roxo-500 to-laranja-600 rounded-full shadow-lg"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${(statsData.vipStatus.points / statsData.vipStatus.nextLevel) * 100}%` 
                        }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </div>
                    <div className="flex justify-between text-xs text-grafite-500 mt-2">
                      <span>{statsData.vipStatus.points.toLocaleString()} pontos</span>
                      <span>{statsData.vipStatus.nextLevel.toLocaleString()} pontos</span>
                    </div>
                  </div>
                  
                  {/* Benefícios VIP */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-verde-500/10 border border-verde-500/20 rounded-xl p-4 text-center group-hover:bg-verde-500/15 transition-colors">
                      <div className="w-8 h-8 bg-verde-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Wallet className="w-4 h-4 text-verde-400" />
                      </div>
                      <p className="text-2xl font-bold text-verde-400 mb-1">{statsData.vipBenefits.cashback}%</p>
                      <p className="text-grafite-400 text-sm font-medium">Cashback</p>
                    </div>
                    
                    <div className="bg-roxo-500/10 border border-roxo-500/20 rounded-xl p-4 text-center group-hover:bg-roxo-500/15 transition-colors">
                      <div className="w-8 h-8 bg-roxo-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Zap className="w-4 h-4 text-roxo-400" />
                      </div>
                      <p className="text-2xl font-bold text-roxo-400 mb-1">{statsData.vipBenefits.bonusRate}%</p>
                      <p className="text-grafite-400 text-sm font-medium">Bônus Extra</p>
                    </div>
                    
                    <div className="bg-laranja-500/10 border border-laranja-500/20 rounded-xl p-4 text-center group-hover:bg-laranja-500/15 transition-colors">
                      <div className="w-8 h-8 bg-laranja-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-4 h-4 text-laranja-400" />
                      </div>
                      <p className="text-2xl font-bold text-laranja-400 mb-1">{statsData.vipBenefits.prioritySupport ? '24/7' : 'Padrão'}</p>
                      <p className="text-grafite-400 text-sm font-medium">Suporte VIP</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div variants={itemVariants}>
              <div className="bg-grafite-800/30 backdrop-blur-md rounded-2xl p-6 border border-grafite-700/50 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-grafite-400" />
                    <input
                      type="text"
                      placeholder="Buscar projetos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-grafite-700/50 border border-grafite-600/50 rounded-xl text-white placeholder-grafite-400 focus:ring-2 focus:ring-roxo-500/50 focus:border-roxo-500/50 transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                  
                  {/* Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-grafite-400" />
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value as typeof selectedFilter)}
                      className="bg-grafite-700/50 border border-grafite-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-roxo-500/50 focus:border-roxo-500/50 transition-all duration-200"
                    >
                      <option value="all">Todos os Projetos</option>
                      <option value="active">Ativos</option>
                      <option value="completed">Finalizados</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Projects - Design Moderno */}
            <motion.div variants={itemVariants}>
              <div className="bg-grafite-800/30 backdrop-blur-md rounded-2xl border border-grafite-700/50 overflow-hidden">
                <div className="p-6 border-b border-grafite-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Projetos Recentes</h2>
                      <p className="text-grafite-400 text-sm">Acompanhe o desempenho dos seus investimentos</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-grafite-800/50 hover:bg-grafite-700/50 border border-grafite-600/50 rounded-lg transition-all duration-200 text-sm text-grafite-300 hover:text-white">
                        <Filter className="w-4 h-4" />
                        <span>Filtrar</span>
                      </button>
                      <button className="flex items-center gap-2 text-roxo-400 hover:text-roxo-300 transition-colors duration-200">
                        Ver todos
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-grafite-700/50">
                  {recentProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 hover:bg-grafite-700/30 transition-all duration-200 group cursor-pointer relative overflow-hidden"
                    >
                      {/* Background Gradient Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-laranja-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-14 h-14 bg-gradient-to-br from-roxo-500/20 to-laranja-500/20 rounded-xl flex items-center justify-center border border-grafite-600/50 group-hover:border-laranja-500/40 transition-colors">
                                <span className="text-white font-bold text-sm">
                                  {project.symbol.slice(0, 2)}
                                </span>
                              </div>
                              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                                project.trend === 'up' ? 'bg-verde-500' : project.trend === 'down' ? 'bg-red-500' : 'bg-grafite-500'
                              }`}>
                                {project.trend === 'up' ? (
                                  <TrendingUp className="w-2.5 h-2.5 text-white" />
                                ) : project.trend === 'down' ? (
                                  <TrendingDown className="w-2.5 h-2.5 text-white" />
                                ) : (
                                  <Activity className="w-2.5 h-2.5 text-white" />
                                )}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white group-hover:text-roxo-300 transition-colors duration-200 mb-1">
                                {project.name}
                              </h3>
                              <div className="flex items-center space-x-3">
                                <span className="text-grafite-400 text-sm font-medium">{project.symbol}</span>
                                <div className="w-1 h-1 bg-grafite-600 rounded-full" />
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  project.phase === 'sale' ? 'bg-verde-500/20 text-verde-400' :
                                  project.phase === 'whitelist' ? 'bg-roxo-500/20 text-roxo-400' :
                                  'bg-azul-500/20 text-azul-400'
                                }`}>
                                  {project.phase === 'sale' ? 'Em Venda' : project.phase === 'whitelist' ? 'Whitelist' : 'Distribuição'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                              {project.change >= 0 ? (
                                <TrendingUp className="w-4 h-4 text-verde-400" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-400" />
                              )}
                              <p className="text-lg font-bold text-white">
                                {formatCurrency(project.currentValue)}
                              </p>
                            </div>
                            <div className={`flex items-center gap-1 text-sm justify-end ${
                              project.change >= 0 ? 'text-verde-400' : 'text-red-400'
                            }`}>
                              <span className="font-semibold">
                                {formatPercentage(Math.abs(project.change))}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Métricas do Projeto */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="bg-grafite-700/30 rounded-lg p-3 border border-grafite-600/30">
                            <div className="flex items-center space-x-2 mb-1">
                              <Wallet className="w-3 h-3 text-azul-400" />
                              <p className="text-xs text-grafite-400 font-medium">Investido</p>
                            </div>
                            <p className="text-sm font-bold text-white">
                              {formatCurrency(project.investment)}
                            </p>
                          </div>
                          
                          <div className="bg-grafite-700/30 rounded-lg p-3 border border-grafite-600/30">
                            <div className="flex items-center space-x-2 mb-1">
                              <Target className="w-3 h-3 text-roxo-400" />
                              <p className="text-xs text-grafite-400 font-medium">Progresso</p>
                            </div>
                            <p className="text-sm font-bold text-white">
                              {project.progress}%
                            </p>
                          </div>
                          
                          <div className="bg-grafite-700/30 rounded-lg p-3 border border-grafite-600/30">
                            <div className="flex items-center space-x-2 mb-1">
                              <Clock className="w-3 h-3 text-laranja-400" />
                              <p className="text-xs text-grafite-400 font-medium">Restam</p>
                            </div>
                            <p className="text-sm font-bold text-white">
                              {project.daysLeft}d
                            </p>
                          </div>
                          
                          <div className="bg-grafite-700/30 rounded-lg p-3 border border-grafite-600/30">
                            <div className="flex items-center space-x-2 mb-1">
                              <CheckCircle className="w-3 h-3 text-verde-400" />
                              <p className="text-xs text-grafite-400 font-medium">Status</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              project.status === 'active' 
                                ? 'bg-verde-500/20 text-verde-300 border border-verde-500/40'
                                : 'bg-azul-500/20 text-azul-300 border border-azul-500/40'
                            }`}>
                              {project.status === 'active' ? 'Ativo' : 'Concluído'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Barra de Progresso */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-grafite-400 font-medium">Progresso do Projeto</span>
                            <span className="text-white font-semibold">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-grafite-700/50 rounded-full h-2">
                            <motion.div 
                              className={`h-2 rounded-full ${
                                project.status === 'active' 
                                  ? 'bg-gradient-to-r from-verde-500 to-verde-400'
                                  : 'bg-gradient-to-r from-azul-500 to-azul-400'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </div>
                        </div>
                        
                        {/* Footer do Card */}
                        <div className="flex items-center justify-between pt-3 border-t border-grafite-700/50">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-verde-400 rounded-full animate-pulse" />
                            <span className="text-xs text-grafite-400">
                              Atualizado há 2h
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="flex items-center space-x-1 px-3 py-1.5 bg-grafite-700/50 hover:bg-grafite-600/50 rounded-lg transition-all duration-200 text-xs text-grafite-300 hover:text-white">
                              <BarChart3 className="w-3 h-3" />
                              <span>Análise</span>
                            </button>
                            <button className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-laranja-500/20 to-roxo-500/20 hover:from-laranja-500/30 hover:to-roxo-500/30 border border-laranja-500/30 rounded-lg transition-all duration-200 text-xs text-laranja-300 hover:text-laranja-200">
                              <span>Detalhes</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions - Design Moderno */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Ações Rápidas</h2>
                  <p className="text-grafite-400 text-sm">Acesse rapidamente as principais funcionalidades</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-laranja-500/20 to-roxo-500/20 hover:from-laranja-500/30 hover:to-roxo-500/30 border border-laranja-500/30 rounded-lg transition-all duration-200 text-sm text-laranja-300 hover:text-laranja-200">
                  <Settings className="w-4 h-4" />
                  <span>Personalizar</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Explorar Projetos */}
                <motion.div
                  className="relative overflow-hidden bg-gradient-to-br from-laranja-500/10 via-laranja-500/5 to-roxo-500/10 backdrop-blur-xl rounded-2xl p-6 border border-laranja-500/30 hover:border-laranja-400/50 transition-all duration-300 group cursor-pointer"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-laranja-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-laranja-500/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="p-4 bg-gradient-to-r from-laranja-500/20 to-roxo-500/20 rounded-xl border border-laranja-500/30 group-hover:border-laranja-400/50 transition-colors">
                            <Search className="w-7 h-7 text-laranja-400 group-hover:text-laranja-300 transition-colors" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-laranja-500 to-roxo-500 rounded-full flex items-center justify-center">
                            <Plus className="w-2 h-2 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-laranja-300 transition-colors mb-1">
                            Explorar Projetos
                          </h3>
                          <p className="text-grafite-400 text-sm font-medium">Descubra oportunidades</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-laranja-400 bg-laranja-500/20 px-2 py-1 rounded-full border border-laranja-500/30">
                          +50 novos
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-grafite-300 text-sm mb-6 leading-relaxed">
                      Encontre oportunidades de investimento que se alinham com seu perfil de risco e objetivos financeiros. Análise IA integrada.
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-laranja-400 fill-current" />
                          <span className="text-xs text-grafite-400">4.8 rating</span>
                        </div>
                        <div className="w-1 h-1 bg-grafite-600 rounded-full" />
                        <span className="text-xs text-grafite-400">1.2k projetos</span>
                      </div>
                      
                      <button className="flex items-center space-x-2 text-laranja-400 hover:text-laranja-300 text-sm font-semibold group-hover:translate-x-1 transition-all duration-200">
                         <span>Explorar</span>
                         <ArrowUpRight className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </motion.div>
                
                {/* Análise de Portfólio */}
                <motion.div
                  className="relative overflow-hidden bg-gradient-to-br from-roxo-500/10 via-roxo-500/5 to-azul-500/10 backdrop-blur-xl rounded-2xl p-6 border border-roxo-500/30 hover:border-roxo-400/50 transition-all duration-300 group cursor-pointer"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-roxo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-roxo-500/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="p-4 bg-gradient-to-r from-roxo-500/20 to-azul-500/20 rounded-xl border border-roxo-500/30 group-hover:border-roxo-400/50 transition-colors">
                            <BarChart3 className="w-7 h-7 text-roxo-400 group-hover:text-roxo-300 transition-colors" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-roxo-500 to-azul-500 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-2 h-2 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-roxo-300 transition-colors mb-1">
                            Análise IA
                          </h3>
                          <p className="text-grafite-400 text-sm font-medium">Relatórios inteligentes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-roxo-400 bg-roxo-500/20 px-2 py-1 rounded-full border border-roxo-500/30">
                          Atualizado
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-grafite-300 text-sm mb-6 leading-relaxed">
                      Obtenha insights profundos com IA sobre o desempenho do seu portfólio, recomendações personalizadas e análise de risco.
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3 h-3 text-roxo-400" />
                          <span className="text-xs text-grafite-400">IA avançada</span>
                        </div>
                        <div className="w-1 h-1 bg-grafite-600 rounded-full" />
                        <span className="text-xs text-grafite-400">Tempo real</span>
                      </div>
                      
                      <button className="flex items-center space-x-2 text-roxo-400 hover:text-roxo-300 text-sm font-semibold group-hover:translate-x-1 transition-all duration-200">
                         <span>Analisar</span>
                         <ArrowUpRight className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </motion.div>
                
                {/* Benefícios VIP */}
                <motion.div
                  className="relative overflow-hidden bg-gradient-to-br from-verde-500/10 via-verde-500/5 to-azul-500/10 backdrop-blur-xl rounded-2xl p-6 border border-verde-500/30 hover:border-verde-400/50 transition-all duration-300 group cursor-pointer"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-verde-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-verde-500/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="p-4 bg-gradient-to-r from-verde-500/20 to-azul-500/20 rounded-xl border border-verde-500/30 group-hover:border-verde-400/50 transition-colors">
                            <Award className="w-7 h-7 text-verde-400 group-hover:text-verde-300 transition-colors" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-verde-500 to-azul-500 rounded-full flex items-center justify-center">
                            <Star className="w-2 h-2 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-verde-300 transition-colors mb-1">
                            Status VIP
                          </h3>
                          <p className="text-grafite-400 text-sm font-medium">Vantagens exclusivas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-verde-400 bg-verde-500/20 px-2 py-1 rounded-full border border-verde-500/30">
                          Nível 4
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-grafite-300 text-sm mb-6 leading-relaxed">
                      Acesse benefícios exclusivos, cashback aumentado de 2.5%, suporte prioritário 24/7 e análises premium.
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3 text-verde-400" />
                          <span className="text-xs text-grafite-400">Suporte 24/7</span>
                        </div>
                        <div className="w-1 h-1 bg-grafite-600 rounded-full" />
                        <span className="text-xs text-grafite-400">2.5% cashback</span>
                      </div>
                      
                      <button className="flex items-center space-x-2 text-verde-400 hover:text-verde-300 text-sm font-semibold group-hover:translate-x-1 transition-all duration-200">
                         <span>Explorar</span>
                         <ArrowUpRight className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}