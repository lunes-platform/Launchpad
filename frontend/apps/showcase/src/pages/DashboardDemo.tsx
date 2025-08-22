import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Download
} from 'lucide-react';
import {
  MetricsOverview,
  PerformanceAnalytics,
  type MetricData,
  type PerformanceData
} from '../components/dashboard';
import { formatUtils } from '../lib/utils';

/**
 * Página de demonstração dos novos componentes de dashboard
 * com gráficos interativos e métricas avançadas
 */
export const DashboardDemo: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [performancePeriod, setPerformancePeriod] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Dados de exemplo para métricas
  const metricsData: MetricData[] = [
    {
      id: 'revenue',
      title: 'Receita Total',
      value: 2847500,
      previousValue: 2156000,
      format: 'currency',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'users',
      title: 'Usuários Ativos',
      value: 12847,
      previousValue: 11230,
      format: 'number',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'conversion',
      title: 'Taxa de Conversão',
      value: 3.24,
      previousValue: 2.89,
      format: 'percentage',
      icon: TrendingUp,
      color: 'violet'
    },
    {
      id: 'engagement',
      title: 'Engajamento',
      value: 68.5,
      previousValue: 71.2,
      format: 'percentage',
      icon: Activity,
      color: 'amber'
    }
  ];

  // Dados de tendência para gráfico de linha
  const trendData = [
    { name: '01/01', label: '01 Jan', value: 2400, date: '2024-01-01' },
    { name: '02/01', label: '02 Jan', value: 1398, date: '2024-01-02' },
    { name: '03/01', label: '03 Jan', value: 9800, date: '2024-01-03' },
    { name: '04/01', label: '04 Jan', value: 3908, date: '2024-01-04' },
    { name: '05/01', label: '05 Jan', value: 4800, date: '2024-01-05' },
    { name: '06/01', label: '06 Jan', value: 3800, date: '2024-01-06' },
    { name: '07/01', label: '07 Jan', value: 4300, date: '2024-01-07' },
    { name: '08/01', label: '08 Jan', value: 5200, date: '2024-01-08' },
    { name: '09/01', label: '09 Jan', value: 4100, date: '2024-01-09' },
    { name: '10/01', label: '10 Jan', value: 6200, date: '2024-01-10' },
    { name: '11/01', label: '11 Jan', value: 5800, date: '2024-01-11' },
    { name: '12/01', label: '12 Jan', value: 7200, date: '2024-01-12' }
  ];

  // Dados de comparação para gráfico de barras
  const comparisonData = [
    { name: 'Mobile', label: 'Mobile', value: 4000, category: 'mobile' },
    { name: 'Desktop', label: 'Desktop', value: 3000, category: 'desktop' },
    { name: 'Tablet', label: 'Tablet', value: 2000, category: 'tablet' },
    { name: 'Smart TV', label: 'Smart TV', value: 1500, category: 'tv' },
    { name: 'Outros', label: 'Outros', value: 800, category: 'others' }
  ];

  // Dados de distribuição para gráfico de pizza
  const distributionData = [
    { name: 'Orgânico', value: 45, color: '#3b82f6' },
    { name: 'Pago', value: 30, color: '#10b981' },
    { name: 'Social', value: 15, color: '#f59e0b' },
    { name: 'Email', value: 7, color: '#8b5cf6' },
    { name: 'Direto', value: 3, color: '#ef4444' }
  ];

  // Dados de performance para análise avançada
  const performanceData: PerformanceData = {
    timeSeriesData: [
      { name: '00:00', label: '00:00', value: 245, throughput: 1200, errors: 2, date: '2024-01-12T00:00:00Z' },
      { name: '01:00', label: '01:00', value: 189, throughput: 1350, errors: 1, date: '2024-01-12T01:00:00Z' },
      { name: '02:00', label: '02:00', value: 167, throughput: 980, errors: 0, date: '2024-01-12T02:00:00Z' },
      { name: '03:00', label: '03:00', value: 234, throughput: 1100, errors: 3, date: '2024-01-12T03:00:00Z' },
      { name: '04:00', label: '04:00', value: 298, throughput: 1450, errors: 5, date: '2024-01-12T04:00:00Z' },
      { name: '05:00', label: '05:00', value: 201, throughput: 1280, errors: 1, date: '2024-01-12T05:00:00Z' },
      { name: '06:00', label: '06:00', value: 178, throughput: 1150, errors: 2, date: '2024-01-12T06:00:00Z' },
      { name: '07:00', label: '07:00', value: 156, throughput: 1320, errors: 0, date: '2024-01-12T07:00:00Z' },
      { name: '08:00', label: '08:00', value: 189, throughput: 1500, errors: 1, date: '2024-01-12T08:00:00Z' },
      { name: '09:00', label: '09:00', value: 234, throughput: 1680, errors: 4, date: '2024-01-12T09:00:00Z' },
      { name: '10:00', label: '10:00', value: 267, throughput: 1750, errors: 2, date: '2024-01-12T10:00:00Z' },
      { name: '11:00', label: '11:00', value: 298, throughput: 1820, errors: 6, date: '2024-01-12T11:00:00Z' }
    ],
    categoryData: [
      { name: '/api/users', label: 'API Users', value: 15420, errors: 23, previous: 14200, category: 'users' },
      { name: '/api/projects', label: 'API Projects', value: 8930, errors: 12, previous: 8100, category: 'projects' },
      { name: '/api/auth', label: 'API Auth', value: 12340, errors: 45, previous: 11800, category: 'auth' },
      { name: '/api/payments', label: 'API Payments', value: 5670, errors: 8, previous: 5200, category: 'payments' },
      { name: '/api/analytics', label: 'API Analytics', value: 3450, errors: 15, previous: 3100, category: 'analytics' }
    ],
    distributionData: [
      { name: '2xx Success', value: 89.5, color: '#10b981' },
      { name: '3xx Redirect', value: 6.2, color: '#3b82f6' },
      { name: '4xx Client Error', value: 3.8, color: '#f59e0b' },
      { name: '5xx Server Error', value: 0.5, color: '#ef4444' }
    ],
    summary: {
      totalTransactions: 125847,
      averageResponseTime: 234,
      successRate: 99.2,
      errorRate: 0.8,
      peakThroughput: 1820,
      uptimePercentage: 99.94
    }
  };

  const handleExportMetrics = () => {
    console.log('Exportando métricas...');
    // Implementar lógica de exportação
  };

  const handleExportPerformance = () => {
    console.log('Exportando dados de performance...');
    // Implementar lógica de exportação
  };

  const handleRefreshPerformance = () => {
    console.log('Atualizando dados de performance...');
    // Implementar lógica de atualização
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header da página */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Dashboard Analytics
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Demonstração dos novos componentes de dashboard com gráficos interativos
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportMetrics}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Exportar Dados
              </button>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Seção de Métricas Gerais */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MetricsOverview
              metrics={metricsData}
              trendData={trendData}
              comparisonData={comparisonData}
              distributionData={distributionData}
              period={period}
              onPeriodChange={setPeriod}
              loading={loading}
            />
          </motion.section>

          {/* Divisor visual */}
          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* Seção de Análise de Performance */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PerformanceAnalytics
              data={performanceData}
              period={performancePeriod}
              onPeriodChange={setPerformancePeriod}
              onRefresh={handleRefreshPerformance}
              onExport={handleExportPerformance}
              loading={loading}
              showAdvancedControls={true}
            />
          </motion.section>

          {/* Seção de Insights e Recomendações */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-roxo-claro dark:bg-roxo-950/20 rounded-lg">
                <BarChart3 className="h-6 w-6 text-roxo" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Insights Automatizados
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Análises e recomendações baseadas nos dados atuais
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium text-emerald-900 dark:text-emerald-100">
                    Crescimento Positivo
                  </span>
                </div>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Receita cresceu 32% comparado ao período anterior. Tendência de alta sustentável.
                </p>
              </div>

              <div className="p-4 bg-roxo-claro dark:bg-roxo-950/20 rounded-lg border border-roxo-200 dark:border-roxo-800">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-roxo" />
                  <span className="font-medium text-roxo-900 dark:text-roxo-100">
                    Engajamento Alto
                  </span>
                </div>
                <p className="text-sm text-roxo-700 dark:text-roxo-300">
                  Usuários ativos aumentaram 14%. Foco em retenção pode maximizar resultados.
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-amber-900 dark:text-amber-100">
                    Otimização Necessária
                  </span>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Taxa de conversão pode melhorar. Considere A/B testing em CTAs principais.
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default DashboardDemo;