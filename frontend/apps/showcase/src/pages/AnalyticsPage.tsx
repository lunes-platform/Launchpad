import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Users,
  Target,
  Calendar,
  Filter,
  Download,
} from "lucide-react";

// Tipos para analytics
interface ProjectAnalytics {
  id: string;
  name: string;
  symbol: string;
  totalRaised: number;
  targetAmount: number;
  investorCount: number;
  averageInvestment: number;
  completionRate: number;
  daysRemaining: number;
  dailyVolume: number[];
  investorGrowth: number[];
  category: string;
  phase: "upcoming" | "active" | "completed";
}

interface PlatformMetrics {
  totalProjects: number;
  totalRaised: number;
  totalInvestors: number;
  averageSuccess: number;
  monthlyGrowth: number;
  activeProjects: number;
}

/**
 * Página de Analytics com métricas de performance e tendências dos projetos
 * Exibe dashboards interativos com dados de investimentos e estatísticas
 */
export default function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "7d" | "30d" | "90d" | "1y"
  >("30d");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Mock data para analytics
  const mockAnalytics: ProjectAnalytics[] = [
    {
      id: "1",
      name: "DeFi Protocol X",
      symbol: "DPX",
      totalRaised: 850000,
      targetAmount: 1000000,
      investorCount: 245,
      averageInvestment: 3469,
      completionRate: 85,
      daysRemaining: 12,
      dailyVolume: [12000, 15000, 18000, 22000, 19000, 25000, 28000],
      investorGrowth: [180, 195, 210, 225, 235, 240, 245],
      category: "DeFi",
      phase: "active",
    },
    {
      id: "2",
      name: "GameFi Universe",
      symbol: "GFU",
      totalRaised: 1200000,
      targetAmount: 1200000,
      investorCount: 389,
      averageInvestment: 3084,
      completionRate: 100,
      daysRemaining: 0,
      dailyVolume: [8000, 12000, 16000, 20000, 24000, 18000, 15000],
      investorGrowth: [320, 340, 355, 370, 380, 385, 389],
      category: "Gaming",
      phase: "completed",
    },
    {
      id: "3",
      name: "AI Trading Bot",
      symbol: "ATB",
      totalRaised: 450000,
      targetAmount: 800000,
      investorCount: 156,
      averageInvestment: 2885,
      completionRate: 56,
      daysRemaining: 25,
      dailyVolume: [5000, 7000, 9000, 11000, 13000, 15000, 17000],
      investorGrowth: [120, 130, 140, 145, 150, 153, 156],
      category: "AI",
      phase: "active",
    },
  ];

  const platformMetrics: PlatformMetrics = {
    totalProjects: 24,
    totalRaised: 12500000,
    totalInvestors: 1847,
    averageSuccess: 78.5,
    monthlyGrowth: 23.4,
    activeProjects: 8,
  };

  // Filtrar dados por categoria
  const filteredAnalytics = useMemo(() => {
    if (selectedCategory === "all") return mockAnalytics;
    return mockAnalytics.filter(
      (project) => project.category === selectedCategory,
    );
  }, [selectedCategory, mockAnalytics]);

  // Calcular métricas agregadas
  const aggregatedMetrics = useMemo(() => {
    const totalRaised = filteredAnalytics.reduce(
      (sum, project) => sum + project.totalRaised,
      0,
    );
    const totalInvestors = filteredAnalytics.reduce(
      (sum, project) => sum + project.investorCount,
      0,
    );
    const avgCompletion =
      filteredAnalytics.reduce(
        (sum, project) => sum + project.completionRate,
        0,
      ) / filteredAnalytics.length;

    return {
      totalRaised,
      totalInvestors,
      avgCompletion: avgCompletion || 0,
      projectCount: filteredAnalytics.length,
    };
  }, [filteredAnalytics]);

  const categories = ["all", "DeFi", "Gaming", "AI", "NFT", "Infrastructure"];
  const timeframes = [
    { value: "7d", label: "7 dias" },
    { value: "30d", label: "30 dias" },
    { value: "90d", label: "90 dias" },
    { value: "1y", label: "1 ano" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Métricas de performance e tendências dos projetos
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Filtro de Categoria */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "Todas as Categorias" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro de Período */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                >
                  {timeframes.map((timeframe) => (
                    <option key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botão de Export */}
            <button className="flex items-center gap-2 px-4 py-2 bg-roxo-600 text-white rounded-lg hover:bg-roxo-700 transition-colors">
              <Download className="w-4 h-4" />
              Exportar Dados
            </button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Arrecadado
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${aggregatedMetrics.totalRaised.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-verde-100 rounded-full">
                <DollarSign className="w-6 h-6 text-verde-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-verde-500 mr-1" />
              <span className="text-sm text-verde-600">
                +{platformMetrics.monthlyGrowth}% este mês
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total de Investidores
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {aggregatedMetrics.totalInvestors.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-roxo-100 rounded-full">
                <Users className="w-6 h-6 text-roxo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-verde-500 mr-1" />
              <span className="text-sm text-verde-600">
                +156 novos investidores
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Taxa de Sucesso
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {aggregatedMetrics.avgCompletion.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-laranja-100 rounded-full">
                <Target className="w-6 h-6 text-laranja-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-verde-500 mr-1" />
              <span className="text-sm text-verde-600">
                +2.3% vs mês anterior
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Projetos Ativos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {aggregatedMetrics.projectCount}
                </p>
              </div>
              <div className="p-3 bg-grafite-100 rounded-full">
                <Activity className="w-6 h-6 text-grafite-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600">
                {platformMetrics.activeProjects} em andamento
              </span>
            </div>
          </motion.div>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Performance dos Projetos
              </h3>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>

            <div className="space-y-4">
              {filteredAnalytics.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {project.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {project.completionRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-roxo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.completionRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>
                        ${project.totalRaised.toLocaleString()} arrecadado
                      </span>
                      <span>{project.investorCount} investidores</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Projetos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Projetos por Volume
              </h3>
              <PieChart className="w-5 h-5 text-gray-500" />
            </div>

            <div className="space-y-4">
              {filteredAnalytics
                .sort((a, b) => b.totalRaised - a.totalRaised)
                .map((project, index) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-roxo-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-roxo-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {project.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {project.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${project.totalRaised.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {project.investorCount} investidores
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* Tabela Detalhada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Análise Detalhada dos Projetos
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projeto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arrecadado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progresso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Investidores
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Médio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAnalytics.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.symbol}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-roxo-100 text-roxo-800">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${project.totalRaised.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-roxo-600 h-2 rounded-full"
                            style={{ width: `${project.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">
                          {project.completionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.investorCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${project.averageInvestment.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.phase === "completed"
                            ? "bg-verde-100 text-verde-800"
                            : project.phase === "active"
                              ? "bg-laranja-100 text-laranja-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.phase === "completed"
                          ? "Concluído"
                          : project.phase === "active"
                            ? "Ativo"
                            : "Em breve"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
