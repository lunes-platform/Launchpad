import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity,
  Target
} from 'lucide-react';
import { LineChart, BarChart, PieChart } from '../charts';
import type { LineChartDataPoint, BarChartDataPoint, PieChartDataPoint } from '../charts';
import { formatUtils, cn } from '../../lib/utils';

/**
 * Interface para métricas principais
 */
export interface MetricData {
  id: string;
  title: string;
  value: number;
  previousValue?: number;
  format: 'currency' | 'number' | 'percentage';
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'amber' | 'red' | 'violet';
}

/**
 * Props do componente MetricsOverview
 */
export interface MetricsOverviewProps {
  /** Métricas principais para exibir */
  metrics: MetricData[];
  /** Dados para o gráfico de linha (tendência) */
  trendData: LineChartDataPoint[];
  /** Dados para o gráfico de barras (comparativo) */
  comparisonData: BarChartDataPoint[];
  /** Dados para o gráfico de pizza (distribuição) */
  distributionData: PieChartDataPoint[];
  /** Período selecionado */
  period?: '7d' | '30d' | '90d' | '1y';
  /** Callback para mudança de período */
  onPeriodChange?: (period: '7d' | '30d' | '90d' | '1y') => void;
  /** Estado de carregamento */
  loading?: boolean;
}

/**
 * Cores para as métricas
 */
const METRIC_COLORS = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    icon: 'text-blue-600 dark:text-blue-400',
    trend: 'text-blue-600',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
    trend: 'text-emerald-600',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    icon: 'text-amber-600 dark:text-amber-400',
    trend: 'text-amber-600',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    icon: 'text-red-600 dark:text-red-400',
    trend: 'text-red-600',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/20',
    icon: 'text-violet-600 dark:text-violet-400',
    trend: 'text-violet-600',
  },
};

/**
 * Componente de card de métrica individual
 */
const MetricCard: React.FC<{ metric: MetricData; index: number }> = ({ metric, index }) => {
  const colors = METRIC_COLORS[metric.color];
  const Icon = metric.icon;
  
  // Calcular mudança percentual
  const percentChange = metric.previousValue 
    ? ((metric.value - metric.previousValue) / metric.previousValue) * 100
    : 0;
  
  const isPositive = percentChange >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  // Formatar valor
  const formatValue = (value: number) => {
    switch (metric.format) {
      case 'currency':
        return formatUtils.currency(value);
      case 'percentage':
        return formatUtils.percentage(value);
      default:
        return formatUtils.compactNumber(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('p-3 rounded-lg', colors.bg)}>
            <Icon className={cn('h-6 w-6', colors.icon)} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {metric.title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatValue(metric.value)}
            </p>
          </div>
        </div>
        
        {metric.previousValue && (
          <div className="flex items-center gap-1">
            <TrendIcon className={cn(
              'h-4 w-4',
              isPositive ? 'text-emerald-600' : 'text-red-600'
            )} />
            <span className={cn(
              'text-sm font-medium',
              isPositive ? 'text-emerald-600' : 'text-red-600'
            )}>
              {Math.abs(percentChange).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Componente de seletor de período
 */
const PeriodSelector: React.FC<{
  period: string;
  onPeriodChange: (period: '7d' | '30d' | '90d' | '1y') => void;
}> = ({ period, onPeriodChange }) => {
  const periods = [
    { value: '7d', label: '7 dias' },
    { value: '30d', label: '30 dias' },
    { value: '90d', label: '90 dias' },
    { value: '1y', label: '1 ano' },
  ] as const;

  return (
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
  );
};

/**
 * Componente MetricsOverview - Visão geral das métricas com gráficos
 * 
 * @example
 * ```tsx
 * const metrics = [
 *   {
 *     id: 'revenue',
 *     title: 'Receita Total',
 *     value: 125000,
 *     previousValue: 98000,
 *     format: 'currency',
 *     icon: DollarSign,
 *     color: 'green'
 *   },
 *   // ... mais métricas
 * ];
 * 
 * <MetricsOverview 
 *   metrics={metrics}
 *   trendData={trendData}
 *   comparisonData={comparisonData}
 *   distributionData={distributionData}
 * />
 * ```
 */
export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  metrics,
  trendData,
  comparisonData,
  distributionData,
  period = '30d',
  onPeriodChange,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton para métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Skeleton para gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="animate-pulse">
              <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="animate-pulse">
              <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com seletor de período */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Visão Geral das Métricas
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe o desempenho dos principais indicadores
          </p>
        </div>
        
        {onPeriodChange && (
          <PeriodSelector period={period} onPeriodChange={onPeriodChange} />
        )}
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de tendência */}
        <LineChart
          data={trendData}
          lines={[
            { dataKey: 'value', color: '#3b82f6', name: 'Tendência' }
          ]}
          title="Tendência ao Longo do Tempo"
          showGrid={true}
          showLegend={false}
          tooltipFormatter={(value) => [formatUtils.compactNumber(value), 'Valor']}
          tooltipLabelFormatter={(label) => `Data: ${label}`}
        />

        {/* Gráfico de comparação */}
        <BarChart
          data={comparisonData}
          bars={[
            { dataKey: 'value', color: '#10b981', name: 'Valor' }
          ]}
          title="Comparativo por Categoria"
          showGrid={true}
          showLegenda={false}
          tooltipFormatter={(value) => [formatUtils.compactNumber(value), 'Valor']}
        />
      </div>

      {/* Gráfico de distribuição */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          data={distributionData}
          title="Distribuição por Segmento"
          showPercentage={true}
          tooltipFormatter={(value) => [formatUtils.compactNumber(value), 'Valor']}
        />
        
        {/* Área para gráfico adicional ou insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Insights Principais
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Crescimento Positivo
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Métricas principais mostram tendência de alta
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Metas Atingidas
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  85% das metas mensais foram alcançadas
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <Activity className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Atividade Intensa
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Pico de atividade registrado na última semana
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsOverview;