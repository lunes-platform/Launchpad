import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Settings,
  Eye,
  Edit,
  Share2,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
} from "lucide-react";

/**
 * Dashboard do Projeto/Emissor
 *
 * Funcionalidades principais:
 * - Métricas de captação em tempo real
 * - Gestão de fases do projeto (configuração, ativação, monitoramento)
 * - Lista e análise de investidores
 * - Configurações do projeto (limites, preços, datas)
 * - Relatórios e analytics detalhados
 * - Comunicação com investidores
 * - Controle de distribuição de tokens
 */

interface ProjectMetrics {
  totalRaised: number;
  targetAmount: number;
  investorCount: number;
  averageInvestment: number;
  daysRemaining: number;
  conversionRate: number;
}

interface ProjectPhase {
  id: string;
  name: string;
  status: "pending" | "active" | "completed" | "paused";
  startDate: string;
  endDate: string;
  targetAmount: number;
  raisedAmount: number;
  tokenPrice: number;
  minInvestment: number;
  maxInvestment: number;
  investorCount: number;
}

interface Investor {
  id: string;
  name: string;
  email: string;
  investmentAmount: number;
  investmentDate: string;
  kycStatus: "pending" | "approved" | "rejected";
  vipLevel: "standard" | "verified" | "vip";
  tokensAllocated: number;
  phase: string;
}

export function ProjectDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "phases" | "investors" | "settings" | "reports"
  >("overview");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [investorFilter, setInvestorFilter] = useState<string>("all");

  // Dados mockados - em produção viriam da API
  const projectMetrics: ProjectMetrics = {
    totalRaised: 2450000,
    targetAmount: 5000000,
    investorCount: 1247,
    averageInvestment: 1965,
    daysRemaining: 23,
    conversionRate: 12.5,
  };

  const projectPhases: ProjectPhase[] = [
    {
      id: "1",
      name: "Seed Round",
      status: "completed",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      targetAmount: 1000000,
      raisedAmount: 1200000,
      tokenPrice: 0.05,
      minInvestment: 100,
      maxInvestment: 10000,
      investorCount: 234,
    },
    {
      id: "2",
      name: "Private Sale",
      status: "active",
      startDate: "2024-02-16",
      endDate: "2024-03-30",
      targetAmount: 2500000,
      raisedAmount: 1250000,
      tokenPrice: 0.08,
      minInvestment: 500,
      maxInvestment: 50000,
      investorCount: 567,
    },
    {
      id: "3",
      name: "Public Sale",
      status: "pending",
      startDate: "2024-04-01",
      endDate: "2024-04-30",
      targetAmount: 1500000,
      raisedAmount: 0,
      tokenPrice: 0.12,
      minInvestment: 50,
      maxInvestment: 5000,
      investorCount: 0,
    },
  ];

  const investors: Investor[] = [
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      investmentAmount: 5000,
      investmentDate: "2024-01-20",
      kycStatus: "approved",
      vipLevel: "vip",
      tokensAllocated: 100000,
      phase: "Seed Round",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@email.com",
      investmentAmount: 2500,
      investmentDate: "2024-02-18",
      kycStatus: "approved",
      vipLevel: "verified",
      tokensAllocated: 31250,
      phase: "Private Sale",
    },
    {
      id: "3",
      name: "Pedro Costa",
      email: "pedro@email.com",
      investmentAmount: 1000,
      investmentDate: "2024-02-20",
      kycStatus: "pending",
      vipLevel: "standard",
      tokensAllocated: 12500,
      phase: "Private Sale",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "active":
        return "text-roxo bg-roxo-claro";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "paused":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getVipBadgeColor = (level: string) => {
    switch (level) {
      case "vip":
        return "text-purple-600 bg-purple-100";
      case "verified":
        return "text-verde bg-verde-claro";
      case "standard":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-grafite-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                Total Captado
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-grafite-50">
                {formatCurrency(projectMetrics.totalRaised)}
              </p>
              <p className="text-sm text-gray-500 dark:text-grafite-400">
                {(
                  (projectMetrics.totalRaised / projectMetrics.targetAmount) *
                  100
                ).toFixed(1)}
                % da meta
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-grafite-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                Investidores
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-grafite-50">
                {projectMetrics.investorCount}
              </p>
              <p className="text-sm text-gray-500 dark:text-grafite-400">
                Média: {formatCurrency(projectMetrics.averageInvestment)}
              </p>
            </div>
            <div className="p-3 bg-roxo-claro dark:bg-roxo-900/30 rounded-lg">
              <Users className="h-6 w-6 text-roxo dark:text-roxo-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-grafite-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                Meta Total
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-grafite-50">
                {formatCurrency(projectMetrics.targetAmount)}
              </p>
              <p className="text-sm text-gray-500 dark:text-grafite-400">
                Restam{" "}
                {formatCurrency(
                  projectMetrics.targetAmount - projectMetrics.totalRaised,
                )}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-grafite-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                Tempo Restante
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-grafite-50">
                {projectMetrics.daysRemaining} dias
              </p>
              <p className="text-sm text-gray-500 dark:text-grafite-400">
                Taxa conversão: {projectMetrics.conversionRate}%
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progresso das Fases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Progresso das Fases
        </h3>
        <div className="space-y-4">
          {projectPhases.map((phase, index) => (
            <div
              key={phase.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}
                >
                  {phase.status === "completed" && (
                    <CheckCircle className="inline h-3 w-3 mr-1" />
                  )}
                  {phase.status === "active" && (
                    <Clock className="inline h-3 w-3 mr-1" />
                  )}
                  {phase.status === "pending" && (
                    <AlertCircle className="inline h-3 w-3 mr-1" />
                  )}
                  {phase.name}
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(phase.raisedAmount)} /{" "}
                    {formatCurrency(phase.targetAmount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {phase.investorCount} investidores
                  </p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-roxo h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((phase.raisedAmount / phase.targetAmount) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderPhases = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestão de Fases</h3>
        <button className="flex items-center px-4 py-2 bg-roxo text-white rounded-lg hover:bg-roxo-700 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Nova Fase
        </button>
      </div>

      <div className="grid gap-6">
        {projectPhases.map((phase) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {phase.name}
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}
                >
                  {phase.status}
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Período</p>
                <p className="font-medium">
                  {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Preço do Token</p>
                <p className="font-medium">${phase.tokenPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Limites de Investimento</p>
                <p className="font-medium">
                  {formatCurrency(phase.minInvestment)} -{" "}
                  {formatCurrency(phase.maxInvestment)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso</span>
                  <span>
                    {((phase.raisedAmount / phase.targetAmount) * 100).toFixed(
                      1,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-roxo h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((phase.raisedAmount / phase.targetAmount) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="ml-6 text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(phase.raisedAmount)}
                </p>
                <p className="text-sm text-gray-500">
                  de {formatCurrency(phase.targetAmount)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderInvestors = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Gestão de Investidores
        </h3>
        <div className="flex space-x-3">
          <select
            value={investorFilter}
            onChange={(e) => setInvestorFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
          >
            <option value="all">Todos os Investidores</option>
            <option value="vip">VIP</option>
            <option value="verified">Verificados</option>
            <option value="pending">KYC Pendente</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investidor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tokens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KYC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nível
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investors.map((investor) => (
                <tr key={investor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {investor.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {investor.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(investor.investmentAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {investor.tokensAllocated.toLocaleString()} tokens
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {investor.phase}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getKycStatusColor(investor.kycStatus)}`}
                    >
                      {investor.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getVipBadgeColor(investor.vipLevel)}`}
                    >
                      {investor.vipLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(investor.investmentDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-roxo hover:text-roxo-700">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Configurações do Projeto
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Informações Gerais
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Projeto
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                defaultValue="DeFi Protocol Token"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Símbolo do Token
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                defaultValue="DPT"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supply Total
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                defaultValue="100000000"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Configurações de Venda
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta de Captação
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                defaultValue="5000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Soft Cap
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                defaultValue="1000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hard Cap
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                defaultValue="5000000"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-end space-x-3">
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button className="px-6 py-2 bg-roxo text-white rounded-lg hover:bg-roxo-700 transition-colors">
          Salvar Alterações
        </button>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Relatórios e Analytics
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-900">
              Captação por Fase
            </h4>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {projectPhases.map((phase) => (
              <div key={phase.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{phase.name}</span>
                <span className="text-sm font-medium">
                  {formatCurrency(phase.raisedAmount)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-900">
              Distribuição de Investidores
            </h4>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">VIP</span>
              <span className="text-sm font-medium">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Verificados</span>
              <span className="text-sm font-medium">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Padrão</span>
              <span className="text-sm font-medium">40%</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Métricas de Performance
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">12.5%</p>
            <p className="text-sm text-gray-600">Taxa de Conversão</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ArrowUpRight className="h-8 w-8 text-roxo" />
            </div>
            <p className="text-2xl font-bold text-gray-900">$1,965</p>
            <p className="text-sm text-gray-600">Ticket Médio</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">1,247</p>
            <p className="text-sm text-gray-600">Total de Investidores</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-grafite-50 mb-2">
            Dashboard do Projeto
          </h1>
          <p className="text-gray-600 dark:text-grafite-300">
            Gerencie sua captação, investidores e configurações
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: "overview", label: "Visão Geral", icon: BarChart3 },
              { id: "phases", label: "Fases", icon: Calendar },
              { id: "investors", label: "Investidores", icon: Users },
              { id: "settings", label: "Configurações", icon: Settings },
              { id: "reports", label: "Relatórios", icon: PieChart },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-roxo text-roxo"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && renderOverview()}
          {activeTab === "phases" && renderPhases()}
          {activeTab === "investors" && renderInvestors()}
          {activeTab === "settings" && renderSettings()}
          {activeTab === "reports" && renderReports()}
        </motion.div>
      </div>
    </div>
  );
}

export default ProjectDashboard;
