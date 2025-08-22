import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { LineChart, BarChart, PieChart, DonutChart } from '../charts';
import type { 
  LineChartDataPoint, 
  BarChartDataPoint, 
  PieChartDataPoint
} from '../charts';
import { formatUtils, cn } from '../../lib/utils';

/**
 * Interface para dados de performance
 */
export interface PerformanceData {
  /** Dados de performance ao longo do tempo */
  timeSeriesData: LineChartDataPoint[];
  /** Dados de comparação por categoria */
  categoryData: BarChartDataPoint[];
  /** Dados de distribuição */
  distributionData: PieChartDataPoint[];
  /** Métricas de resumo */
  summary: {
    totalTransactions: number;
    averageResponseTime: number;
    successRate: number;
    errorRate: number;
    peakThroughput: number;
    uptimePercentage: number;
  };
}

/**
 * Props do componente PerformanceAnalytics
 */
export interface PerformanceAnalyticsProps {
  /** Dados de performance */
  data: PerformanceData;
  /** Período selecionado */
  period?: '1h' | '24h' | '7d' | '30d';
  /** Callback para mudança de período */
  onPeriodChange?: (period: '1h' | '24h' | '7d' | '30d') => void;
  /** Callback para atualizar dados */
  onRefresh?: () => void;
  /** Callback para exportar dados */
  onExport?: () => void;
  /** Estado de carregamento */
  loading?: boolean;
  /** Mostrar controles avançados */
  showAdvancedControls?: boolean;
}

/**
 * Tipos de visualização disponíveis
 */
type ViewType = 'overview' | 'detailed' | 'comparison';

/**
 * Componente de métrica de performance
 */
const PerformanceMetric: React.FC<{
  title: string;
  value: number;
  format: 'number' | 'percentage' | 'time' | 'rate';
  trend?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'amber' | 'red';
  target?: number;
}> = ({ title, value, format, trend, icon: Icon, color, target }) => {
  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return formatUtils.percentage(val / 100);
      case 'time':
        return `${val.toFixed(0)}ms`;
      case 'rate':
        return `${formatUtils.compactNumber(val)}/s`;
      default:
        return formatUtils.compactNumber(val);
    }
  };

  const getStatusColor = () => {
    if (!target) return color;
    
    const performance = value / target;
    if (performance >= 0.9) return 'green';
    if (performance >= 0.7) return 'amber';
    return 'red';
  };

  const statusColor = getStatusColor();
  const colors = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20',
    green: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20',
    red: 'text-red-600 bg-red-50 dark:bg-red-950/20',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className={cn('p-2 rounded-lg', colors[statusColor])}>
          <Icon className={cn('h-4 w-4', colors[statusColor].split(' ')[0])} />
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            {trend >= 0 ? (
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={cn(
              'text-xs font-medium',
              trend >= 0 ? 'text-emerald-600' : 'text-red-600'
            )}>
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {formatValue(value)}
        </p>
        {target && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Meta: {formatValue(target)}</span>
              <span>{((value / target) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  statusColor === 'green' ? 'bg-emerald-500' :
                  statusColor === 'amber' ? 'bg-amber-500' : 'bg-red-500'
                )}
                style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Componente de controles de visualização
 */
const ViewControls: React.FC<{
  viewType: ViewType;
  onViewChange: (view: ViewType) => void;
  period: string;
  onPeriodChange: (period: '1h' | '24h' | '7d' | '30d') => void;
  onRefresh: () => void;
  onExport: () => void;
  showAdvanced: boolean;
}> = ({ viewType, onViewChange, period, onPeriodChange, onRefresh, onExport, showAdvanced }) => {
  const views = [
    { value: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { value: 'detailed', label: 'Detalhado', icon: LineChartIcon },
    { value: 'comparison', label: 'Comparação', icon: PieChartIcon },
  ] as const;

  const periods = [
    { value: '1h', label: '1 Hora' },
    { value: '24h', label: '24 Horas' },
    { value: '7d', label: '7 Dias' },
    { value: '30d', label: '30 Dias' },
  ] as const;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {/* Seletor de visualização */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.value}
                onClick={() => onViewChange(view.value)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  viewType === view.value
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{view.label}</span>
              </button>
            );
          })}
        </div>

        {/* Seletor de período */}
        {showAdvanced && (
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => onPeriodChange(p.value)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  period === p.value
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex gap-2">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Atualizar</span>
        </button>
        
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Componente PerformanceAnalytics - Análise avançada de performance
 * 
 * @example
 * ```tsx
 * const performanceData = {
 *   timeSeriesData: [...],
 *   categoryData: [...],
 *   distributionData: [...],
 *   summary: {
 *     totalTransactions: 125000,
 *     averageResponseTime: 245,
 *     successRate: 99.2,
 *     errorRate: 0.8,
 *     peakThroughput: 1500,
 *     uptimePercentage: 99.9
 *   }
 * };
 * 
 * <PerformanceAnalytics 
 *   data={performanceData}
 *   showAdvancedControls={true}
 * />
 * ```
 */
export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  data,
  period = '24h',
  onPeriodChange = () => {},
  onRefresh = () => {},
  onExport = () => {},
  loading = false,
  showAdvancedControls = true,
}) => {
  const [viewType, setViewType] = useState<ViewType>('overview');

  // Cores para os gráficos
  const chartColors = {
    performance: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    comparison: ['#8b5cf6', '#06b6d4', '#84cc16', '#f97316'],
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const renderOverviewView = () => (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <PerformanceMetric
          title="Transações Totais"
          value={data.summary.totalTransactions}
          format="number"
          icon={BarChart3}
          color="blue"
          target={100000}
        />
        <PerformanceMetric
          title="Tempo de Resposta"
          value={data.summary.averageResponseTime}
          format="time"
          icon={Clock}
          color="amber"
          target={200}
        />
        <PerformanceMetric
          title="Taxa de Sucesso"
          value={data.summary.successRate}
          format="percentage"
          icon={CheckCircle}
          color="green"
          target={99}
        />
        <PerformanceMetric
          title="Taxa de Erro"
          value={data.summary.errorRate}
          format="percentage"
          icon={AlertTriangle}
          color="red"
          target={1}
        />
        <PerformanceMetric
          title="Pico de Throughput"
          value={data.summary.peakThroughput}
          format="rate"
          icon={Zap}
          color="blue"
          target={2000}
        />
        <PerformanceMetric
          title="Uptime"
          value={data.summary.uptimePercentage}
          format="percentage"
          icon={TrendingUp}
          color="green"
          target={99.9}
        />
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={data.timeSeriesData}
          lines={[
            { dataKey: 'value', color: '#3b82f6', name: 'Performance' },
            { dataKey: 'target', color: '#10b981', name: 'Meta' }
          ]}
          title="Performance ao Longo do Tempo"
          showGrid={true}
          showLegend={true}
          tooltipFormatter={(value, name) => [
            name === 'Performance' ? `${value}ms` : `${value}ms (meta)`,
            name
          ]}
        />

        <BarChart
          data={data.categoryData}
          bars={[
            { dataKey: 'value', color: '#8b5cf6', name: 'Requests' },
            { dataKey: 'errors', color: '#ef4444', name: 'Erros' }
          ]}
          title="Distribuição por Endpoint"
          showGrid={true}
          showLegenda={true}
          tooltipFormatter={(value, name) => [
            formatUtils.compactNumber(value),
            name
          ]}
        />
      </div>
    </div>
  );

  const renderDetailedView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <LineChart
          data={data.timeSeriesData}
          lines={[
            { dataKey: 'value', color: '#3b82f6', name: 'Tempo de Resposta' },
            { dataKey: 'throughput', color: '#10b981', name: 'Throughput' },
            { dataKey: 'errors', color: '#ef4444', name: 'Erros' }
          ]}
          title="Análise Detalhada de Performance"
          showGrid={true}
          showLegend={true}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChart
          data={data.distributionData}
          title="Distribuição de Status HTTP"
          showPercentage={true}
          innerRadius={60}
        />
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Alertas e Recomendações
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Tempo de resposta elevado
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Considere otimizar queries do banco de dados
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                  Taxa de sucesso excelente
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Sistema operando dentro dos parâmetros ideais
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComparisonView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          data={data.distributionData}
          title="Distribuição de Tráfego"
          showPercentage={true}
        />
        
        <BarChart
          data={data.categoryData}
          bars={[
            { dataKey: 'value', color: '#3b82f6', name: 'Atual' },
            { dataKey: 'previous', color: '#94a3b8', name: 'Anterior' }
          ]}
          title="Comparação com Período Anterior"
          showGrid={true}
          showLegenda={true}
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (viewType) {
      case 'detailed':
        return renderDetailedView();
      case 'comparison':
        return renderComparisonView();
      default:
        return renderOverviewView();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Análise de Performance
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitoramento detalhado do desempenho do sistema
          </p>
        </div>
        
        <ViewControls
          viewType={viewType}
          onViewChange={setViewType}
          period={period}
          onPeriodChange={onPeriodChange}
          onRefresh={onRefresh}
          onExport={onExport}
          showAdvanced={showAdvancedControls}
        />
      </div>

      {/* Conteúdo */}
      {renderContent()}
    </motion.div>
  );
};

export default PerformanceAnalytics;