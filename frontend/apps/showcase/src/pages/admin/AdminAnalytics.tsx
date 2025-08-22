import { useState } from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Rocket,
  DollarSign,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, Button } from "@launchpad/shared-ui";

/**
 * Página de Analytics para Administradores
 *
 * Funcionalidades:
 * - Relatórios detalhados de performance da plataforma
 * - Métricas de usuários, projetos e transações
 * - Dashboards interativos com filtros temporais
 * - Exportação de relatórios
 * - Análise de tendências e crescimento
 * - Métricas de engajamento e conversão
 */
export function AdminAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // Dados mockados - em produção viriam de APIs e smart contracts
  const analyticsData = {
    overview: {
      totalUsers: 25847,
      activeUsers: 18234,
      newUsersThisMonth: 3421,
      userGrowthRate: 15.2,
      totalProjects: 156,
      activeProjects: 89,
      completedProjects: 67,
      projectSuccessRate: 78.5,
      totalVolume: 4300000,
      volumeGrowth: 23.7,
      avgTransactionValue: 8500,
    },
    userMetrics: {
      byRole: {
        investors: 22341,
        projects: 156,
        vips: 1234,
        verified: 15678,
      },
      engagement: {
        dailyActiveUsers: 5234,
        weeklyActiveUsers: 12456,
        monthlyActiveUsers: 18234,
        avgSessionDuration: "12m 34s",
        bounceRate: 23.4,
        retentionRate: 76.8,
      },
      conversion: {
        signupToVerified: 68.5,
        verifiedToInvestor: 84.2,
        investorToVip: 12.3,
        funnelDropoff: [
          { stage: "Signup", users: 100, percentage: 100 },
          { stage: "Email Verified", users: 85, percentage: 85 },
          { stage: "KYC Started", users: 72, percentage: 72 },
          { stage: "KYC Completed", users: 68, percentage: 68 },
          { stage: "First Investment", users: 57, percentage: 57 },
          { stage: "VIP Upgrade", users: 7, percentage: 7 },
        ],
      },
    },
    projectMetrics: {
      performance: {
        avgFundingTime: "18 dias",
        avgFundingAmount: 275000,
        successRate: 78.5,
        avgInvestorCount: 234,
        topCategories: [
          { name: "DeFi", count: 45, percentage: 28.8 },
          { name: "Gaming", count: 32, percentage: 20.5 },
          { name: "NFT", count: 28, percentage: 17.9 },
          { name: "Infrastructure", count: 25, percentage: 16.0 },
          { name: "Others", count: 26, percentage: 16.8 },
        ],
      },
      timeline: [
        { month: "Jan", projects: 12, funded: 9, volume: 2100000 },
        { month: "Fev", projects: 15, funded: 11, volume: 2800000 },
        { month: "Mar", projects: 18, funded: 14, volume: 3200000 },
        { month: "Abr", projects: 22, funded: 17, volume: 3900000 },
        { month: "Mai", projects: 19, funded: 15, volume: 3500000 },
        { month: "Jun", projects: 25, funded: 20, volume: 4300000 },
      ],
    },
    financialMetrics: {
      revenue: {
        totalFees: 215000,
        monthlyRecurring: 45000,
        transactionFees: 125000,
        stakingFees: 35000,
        vipSubscriptions: 55000,
      },
      transactions: {
        totalCount: 45678,
        totalVolume: 4300000,
        avgValue: 8500,
        peakHour: "14:00-15:00",
        peakDay: "Terça-feira",
      },
    },
  };

  const periods = [
    { value: "7d", label: "7 dias" },
    { value: "30d", label: "30 dias" },
    { value: "90d", label: "90 dias" },
    { value: "1y", label: "1 ano" },
  ];

  const metrics = [
    { value: "overview", label: "Visão Geral", icon: BarChart3 },
    { value: "users", label: "Usuários", icon: Users },
    { value: "projects", label: "Projetos", icon: Rocket },
    { value: "financial", label: "Financeiro", icon: DollarSign },
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simular carregamento
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handleExport = (format: "pdf" | "excel") => {
    // Implementar exportação
    console.log(`Exportando relatório em ${format}`);
  };

  const renderOverviewMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Usuários Totais</p>
              <p className="text-2xl font-bold text-grafite">
                {analyticsData.overview.totalUsers.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-verde mr-1" />
                <span className="text-sm text-verde">
                  +{analyticsData.overview.userGrowthRate}%
                </span>
              </div>
            </div>
            <Users className="w-8 h-8 text-azul-400" />
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Projetos Ativos</p>
              <p className="text-2xl font-bold text-grafite">
                {analyticsData.overview.activeProjects}
              </p>
              <div className="flex items-center mt-2">
                <Target className="w-4 h-4 text-roxo-400 mr-1" />
                <span className="text-sm text-gray-600">
                  {analyticsData.overview.projectSuccessRate}% sucesso
                </span>
              </div>
            </div>
            <Rocket className="w-8 h-8 text-roxo-400" />
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Volume Total</p>
              <p className="text-2xl font-bold text-grafite">
                ${analyticsData.overview.totalVolume.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-verde mr-1" />
                <span className="text-sm text-verde">
                  +{analyticsData.overview.volumeGrowth}%
                </span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-azul-400" />
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Usuários Ativos</p>
              <p className="text-2xl font-bold text-grafite">
                {analyticsData.overview.activeUsers.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <Activity className="w-4 h-4 text-azul-400 mr-1" />
                <span className="text-sm text-gray-600">
                  {(
                    (analyticsData.overview.activeUsers /
                      analyticsData.overview.totalUsers) *
                    100
                  ).toFixed(1)}
                  % do total
                </span>
              </div>
            </div>
            <Activity className="w-8 h-8 text-azul-400" />
          </div>
        </Card>
      </motion.div>
    </div>
  );

  const renderUserMetrics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-grafite mb-4">
            Distribuição por Papel
          </h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.userMetrics.byRole).map(
              ([role, count]) => {
                const percentage =
                  (count / analyticsData.overview.totalUsers) * 100;
                return (
                  <div key={role} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {role}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-azul-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-grafite w-16 text-right">
                        {count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-grafite mb-4">
            Funil de Conversão
          </h3>
          <div className="space-y-3">
            {analyticsData.userMetrics.conversion.funnelDropoff.map(
              (stage, index) => (
                <div
                  key={stage.stage}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600">{stage.stage}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          stage.percentage > 70
                            ? "bg-verde"
                            : stage.percentage > 40
                              ? "bg-laranja"
                              : "bg-vermelho"
                        }`}
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-grafite w-12 text-right">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );

  const renderProjectMetrics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-grafite mb-4">
            Categorias Populares
          </h3>
          <div className="space-y-4">
            {analyticsData.projectMetrics.performance.topCategories.map(
              (category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600">{category.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-azul-400 h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-grafite w-8 text-right">
                      {category.count}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-grafite mb-4">
            Timeline de Projetos
          </h3>
          <div className="space-y-3">
            {analyticsData.projectMetrics.timeline.slice(-6).map((month) => (
              <div
                key={month.month}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">{month.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-grafite">
                      {month.funded}/{month.projects}
                    </div>
                    <div className="text-xs text-gray-500">financiados</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-grafite">
                      ${(month.volume / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-gray-500">volume</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );

  const renderFinancialMetrics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-grafite mb-4">
            Receitas por Fonte
          </h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.financialMetrics.revenue).map(
              ([source, amount]) => {
                const percentage =
                  (amount / analyticsData.financialMetrics.revenue.totalFees) *
                  100;
                return (
                  <div
                    key={source}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600 capitalize">
                      {source.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-verde h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-grafite w-16 text-right">
                        ${amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-grafite mb-4">
            Métricas de Transação
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total de Transações</span>
              <span className="text-lg font-semibold text-grafite">
                {analyticsData.financialMetrics.transactions.totalCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Volume Total</span>
              <span className="text-lg font-semibold text-grafite">
                $
                {analyticsData.financialMetrics.transactions.totalVolume.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Valor Médio</span>
              <span className="text-lg font-semibold text-grafite">
                $
                {analyticsData.financialMetrics.transactions.avgValue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pico de Atividade</span>
              <span className="text-sm font-medium text-grafite">
                {analyticsData.financialMetrics.transactions.peakHour}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Dia Mais Ativo</span>
              <span className="text-sm font-medium text-grafite">
                {analyticsData.financialMetrics.transactions.peakDay}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );

  const renderContent = () => {
    switch (selectedMetric) {
      case "users":
        return renderUserMetrics();
      case "projects":
        return renderProjectMetrics();
      case "financial":
        return renderFinancialMetrics();
      default:
        return renderOverviewMetrics();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-grafite mb-2">
                Analytics
              </h1>
              <p className="text-gray-600">
                Relatórios detalhados e métricas de performance da plataforma
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Atualizar</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport("excel")}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-grafite">
                  Filtros:
                </span>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-azul-400"
                >
                  {periods.map((period) => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <button
                      key={metric.value}
                      onClick={() => setSelectedMetric(metric.value)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedMetric === metric.value
                          ? "bg-azul-400 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{metric.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Content */}
        {renderContent()}

        {/* Real-time Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-grafite">
                Atividade em Tempo Real
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-verde rounded-full animate-pulse" />
                <span className="text-sm text-gray-600">Ao vivo</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-azul-400 mb-1">234</div>
                <div className="text-sm text-gray-600">Usuários Online</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-verde mb-1">12</div>
                <div className="text-sm text-gray-600">Transações/min</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-laranja mb-1">5</div>
                <div className="text-sm text-gray-600">Novos Projetos Hoje</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
