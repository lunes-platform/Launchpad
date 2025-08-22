import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  Settings,
  Download,
  Search,
  ArrowUpRight,
  Coins,
  Wallet,
  Target,
  BarChart3,
  Activity,
} from "lucide-react";

/**
 * Tipos para o sistema de recompensas
 */
interface RewardPool {
  id: string;
  name: string;
  type: "staking" | "project_buy" | "participation" | "referral";
  totalAmount: number;
  distributedAmount: number;
  remainingAmount: number;
  participants: number;
  apy: number;
  status: "active" | "paused" | "completed";
  nextDistribution: string;
  autoDistribution: boolean;
}

interface RewardTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  poolId: string;
  poolName: string;
  amount: number;
  type: "distribution" | "claim" | "penalty";
  status: "pending" | "completed" | "failed";
  timestamp: string;
  txHash?: string;
}

/**
 * Página de Gestão de Recompensas para Administradores
 *
 * Funcionalidades:
 * - Visualização e gestão de pools de recompensas
 * - Configuração de distribuição automática
 * - Histórico detalhado de transações
 * - Métricas e analytics de recompensas
 * - Controle de regras de distribuição
 * - Monitoramento de performance dos pools
 */
export function AdminRewards() {
  const [activeTab, setActiveTab] = useState("overview");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("7d");

  // Mock data - em produção viria da API
  const [rewardPools] = useState<RewardPool[]>([
    {
      id: "staking-pool",
      name: "Staking Pool",
      type: "staking",
      totalAmount: 1000000,
      distributedAmount: 650000,
      remainingAmount: 350000,
      participants: 1247,
      apy: 12.5,
      status: "active",
      nextDistribution: "2024-01-21T00:00:00Z",
      autoDistribution: true,
    },
    {
      id: "project-buy-pool",
      name: "Project Buy Pool",
      type: "project_buy",
      totalAmount: 500000,
      distributedAmount: 320000,
      remainingAmount: 180000,
      participants: 892,
      apy: 8.2,
      status: "active",
      nextDistribution: "2024-01-22T12:00:00Z",
      autoDistribution: true,
    },
    {
      id: "participation-pool",
      name: "Participation Pool",
      type: "participation",
      totalAmount: 250000,
      distributedAmount: 180000,
      remainingAmount: 70000,
      participants: 2156,
      apy: 15.8,
      status: "active",
      nextDistribution: "2024-01-20T18:00:00Z",
      autoDistribution: false,
    },
    {
      id: "referral-pool",
      name: "Referral Pool",
      type: "referral",
      totalAmount: 100000,
      distributedAmount: 45000,
      remainingAmount: 55000,
      participants: 456,
      apy: 0,
      status: "paused",
      nextDistribution: "2024-01-25T00:00:00Z",
      autoDistribution: false,
    },
  ]);

  const [recentTransactions] = useState<RewardTransaction[]>([
    {
      id: "tx-001",
      userId: "user-123",
      userName: "João Silva",
      userEmail: "joao@email.com",
      poolId: "staking-pool",
      poolName: "Staking Pool",
      amount: 125.5,
      type: "distribution",
      status: "completed",
      timestamp: "2024-01-20T10:30:00Z",
      txHash: "0x1234...abcd",
    },
    {
      id: "tx-002",
      userId: "user-456",
      userName: "Maria Santos",
      userEmail: "maria@email.com",
      poolId: "project-buy-pool",
      poolName: "Project Buy Pool",
      amount: 89.25,
      type: "claim",
      status: "pending",
      timestamp: "2024-01-20T09:15:00Z",
    },
    {
      id: "tx-003",
      userId: "user-789",
      userName: "Pedro Costa",
      userEmail: "pedro@email.com",
      poolId: "participation-pool",
      poolName: "Participation Pool",
      amount: 45.75,
      type: "distribution",
      status: "failed",
      timestamp: "2024-01-20T08:45:00Z",
    },
  ]);

  const distributionMetrics = {
    totalDistributed: 1195000,
    totalParticipants: 4751,
    averageReward: 251.52,
    successRate: 98.7,
    pendingDistributions: 12,
    failedDistributions: 3,
  };

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: BarChart3 },
    { id: "pools", label: "Pools", icon: Coins },
    { id: "transactions", label: "Transações", icon: Activity },
    { id: "rules", label: "Regras", icon: Settings },
  ];

  const getPoolTypeLabel = (type: RewardPool["type"]) => {
    switch (type) {
      case "staking":
        return "Staking";
      case "project_buy":
        return "Compra de Projeto";
      case "participation":
        return "Participação";
      case "referral":
        return "Indicação";
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return "text-green-600 bg-green-100";
      case "paused":
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return CheckCircle;
      case "paused":
      case "pending":
        return Clock;
      case "failed":
        return XCircle;
      default:
        return AlertTriangle;
    }
  };

  const handlePoolAction = (
    poolId: string,
    action: "pause" | "resume" | "distribute",
  ) => {
    console.log(`Ação ${action} no pool ${poolId}`);
    // Implementar lógica de ação
  };

  const handleExportTransactions = () => {
    console.log("Exportando transações...");
    // Implementar lógica de exportação
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite">
            Gestão de Recompensas
          </h1>
          <p className="text-gray-600">
            Gerencie pools, distribuições e histórico de recompensas
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportTransactions}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Distribuído
              </p>
              <p className="text-2xl font-bold text-grafite">
                {formatCurrency(distributionMetrics.totalDistributed)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-gray-600 ml-1">vs mês anterior</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Participantes</p>
              <p className="text-2xl font-bold text-grafite">
                {distributionMetrics.totalParticipants.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+8.3%</span>
            <span className="text-gray-600 ml-1">novos participantes</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Recompensa Média
              </p>
              <p className="text-2xl font-bold text-grafite">
                {formatCurrency(distributionMetrics.averageReward)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+5.2%</span>
            <span className="text-gray-600 ml-1">vs período anterior</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Taxa de Sucesso
              </p>
              <p className="text-2xl font-bold text-grafite">
                {distributionMetrics.successRate}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">
              {distributionMetrics.failedDistributions} falhas pendentes
            </span>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-roxo text-roxo"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-grafite">
                    Distribuições Pendentes
                  </h3>
                  <div className="space-y-3">
                    {rewardPools
                      .filter((pool) => pool.status === "active")
                      .map((pool) => (
                        <div
                          key={pool.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-grafite">
                              {pool.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Próxima: {formatDate(pool.nextDistribution)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-grafite">
                              {formatCurrency(pool.remainingAmount)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {pool.participants} participantes
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-grafite">
                    Performance dos Pools
                  </h3>
                  <div className="space-y-3">
                    {rewardPools.map((pool) => {
                      const distributionPercentage =
                        (pool.distributedAmount / pool.totalAmount) * 100;
                      return (
                        <div
                          key={pool.id}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-grafite">
                              {pool.name}
                            </h4>
                            <span className="text-sm font-medium text-gray-600">
                              {distributionPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-roxo h-2 rounded-full transition-all duration-300"
                              style={{ width: `${distributionPercentage}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                              {formatCurrency(pool.distributedAmount)}{" "}
                              distribuído
                            </span>
                            <span>APY: {pool.apy}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pools */}
          {activeTab === "pools" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewardPools.map((pool) => {
                  const StatusIcon = getStatusIcon(pool.status);
                  return (
                    <div
                      key={pool.id}
                      className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Wallet className="w-5 h-5 text-roxo" />
                          <h3 className="font-semibold text-grafite">
                            {pool.name}
                          </h3>
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            pool.status,
                          )}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {pool.status === "active"
                            ? "Ativo"
                            : pool.status === "paused"
                              ? "Pausado"
                              : "Concluído"}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Tipo</p>
                          <p className="font-medium text-grafite">
                            {getPoolTypeLabel(pool.type)}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Total do Pool</p>
                          <p className="font-semibold text-grafite">
                            {formatCurrency(pool.totalAmount)}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Distribuído</p>
                          <p className="font-medium text-grafite">
                            {formatCurrency(pool.distributedAmount)}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Participantes</p>
                          <p className="font-medium text-grafite">
                            {pool.participants.toLocaleString("pt-BR")}
                          </p>
                        </div>

                        {pool.apy > 0 && (
                          <div>
                            <p className="text-sm text-gray-600">APY</p>
                            <p className="font-medium text-green-600">
                              {pool.apy}%
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-gray-600">
                            Próxima Distribuição
                          </p>
                          <p className="font-medium text-grafite">
                            {formatDate(pool.nextDistribution)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Auto: {pool.autoDistribution ? "Sim" : "Não"}
                          </span>
                          <div className="flex items-center space-x-2">
                            {pool.status === "active" ? (
                              <button
                                onClick={() =>
                                  handlePoolAction(pool.id, "pause")
                                }
                                className="p-1 text-yellow-600 hover:bg-yellow-100 rounded transition-colors"
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handlePoolAction(pool.id, "resume")
                                }
                                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handlePoolAction(pool.id, "distribute")
                              }
                              className="p-1 text-roxo hover:bg-purple-100 rounded transition-colors"
                            >
                              <Gift className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Transactions */}
          {activeTab === "transactions" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar transações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
                    />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="completed">Concluído</option>
                    <option value="pending">Pendente</option>
                    <option value="failed">Falhou</option>
                  </select>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pool
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentTransactions.map((transaction) => {
                        const StatusIcon = getStatusIcon(transaction.status);
                        return (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {transaction.userName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {transaction.userEmail}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.poolName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(transaction.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {transaction.type === "distribution"
                                  ? "Distribuição"
                                  : transaction.type === "claim"
                                    ? "Resgate"
                                    : "Penalidade"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  transaction.status,
                                )}`}
                              >
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {transaction.status === "completed"
                                  ? "Concluído"
                                  : transaction.status === "pending"
                                    ? "Pendente"
                                    : "Falhou"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(transaction.timestamp)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rules */}
          {activeTab === "rules" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Regras de Distribuição
                </h3>
                <p className="text-gray-600 mb-6">
                  Configure regras automáticas para distribuição de recompensas
                </p>
                <button className="px-4 py-2 bg-roxo text-white rounded-lg hover:bg-roxo-600 transition-colors">
                  Criar Nova Regra
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
