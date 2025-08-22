import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BaseChart, type BaseChartProps } from './BaseChart';
import { formatUtils } from '../../lib/utils';

/**
 * Interface para dados do gráfico de linha
 */
export interface LineChartDataPoint {
  /** Rótulo do eixo X (geralmente data ou categoria) */
  label: string;
  /** Valor principal */
  value: number;
  /** Valores adicionais para múltiplas linhas */
  [key: string]: string | number;
}

/**
 * Configuração para uma linha do gráfico
 */
export interface LineConfig {
  /** Chave dos dados para esta linha */
  dataKey: string;
  /** Cor da linha */
  color: string;
  /** Nome para exibição na legenda */
  name?: string;
  /** Tipo de linha */
  strokeDasharray?: string;
  /** Espessura da linha */
  strokeWidth?: number;
}

/**
 * Props específicas do LineChart
 */
export interface LineChartProps extends Omit<BaseChartProps, 'children'> {
  /** Dados do gráfico */
  data: LineChartDataPoint[];
  /** Configurações das linhas */
  lines: LineConfig[];
  /** Chave para o eixo X */
  xAxisKey?: string;
  /** Formato do tooltip */
  tooltipFormatter?: (value: number, name: string) => [string, string];
  /** Formato do label do tooltip */
  tooltipLabelFormatter?: (label: string) => string;
  /** Mostrar grade */
  showGrid?: boolean;
  /** Mostrar legenda */
  showLegend?: boolean;
  /** Altura mínima do gráfico */
  minHeight?: number;
  /** Suavizar as linhas */
  smooth?: boolean;
  /** Mostrar pontos nas linhas */
  showDots?: boolean;
}

/**
 * Componente de tooltip customizado
 */
const CustomTooltip = ({ 
  active, 
  payload, 
  label, 
  formatter, 
  labelFormatter 
}: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
        {labelFormatter ? labelFormatter(label) : label}
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600 dark:text-gray-400">
            {entry.name}:
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {formatter ? formatter(entry.value, entry.name)[0] : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Componente LineChart - Gráfico de linha interativo
 * 
 * @example
 * ```tsx
 * const data = [
 *   { label: 'Jan', revenue: 1000, users: 150 },
 *   { label: 'Feb', revenue: 1200, users: 180 },
 *   { label: 'Mar', revenue: 900, users: 120 },
 * ];
 * 
 * const lines = [
 *   { dataKey: 'revenue', color: '#3b82f6', name: 'Receita' },
 *   { dataKey: 'users', color: '#10b981', name: 'Usuários' },
 * ];
 * 
 * <LineChart 
 *   data={data} 
 *   lines={lines}
 *   title="Métricas Mensais"
 *   tooltipFormatter={(value, name) => [
 *     name === 'revenue' ? formatUtils.currency(value) : value.toString(),
 *     name
 *   ]}
 * />
 * ```
 */
export const LineChart: React.FC<LineChartProps> = ({
  data,
  lines,
  xAxisKey = 'label',
  tooltipFormatter,
  tooltipLabelFormatter,
  showGrid = true,
  showLegend = true,
  minHeight = 300,
  smooth = true,
  showDots = false,
  ...baseProps
}) => {
  const chartContent = (
    <ResponsiveContainer width="100%" height={minHeight}>
      <RechartsLineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-gray-200 dark:stroke-gray-700"
          />
        )}
        <XAxis 
          dataKey={xAxisKey}
          className="text-xs fill-gray-600 dark:fill-gray-400"
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          className="text-xs fill-gray-600 dark:fill-gray-400"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          content={
            <CustomTooltip 
              formatter={tooltipFormatter}
              labelFormatter={tooltipLabelFormatter}
            />
          }
        />
        {showLegend && (
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px',
            }}
          />
        )}
        {lines.map((line, index) => (
          <Line
            key={line.dataKey}
            type={smooth ? 'monotone' : 'linear'}
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={line.strokeWidth || 2}
            strokeDasharray={line.strokeDasharray}
            name={line.name || line.dataKey}
            dot={showDots ? { fill: line.color, strokeWidth: 2, r: 4 } : false}
            activeDot={{ r: 6, fill: line.color }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );

  return (
    <BaseChart {...baseProps}>
      {chartContent}
    </BaseChart>
  );
};

/**
 * Hook para usar dados de linha com formatação automática
 */
export const useLineChartData = (rawData: any[], config: {
  xKey: string;
  yKeys: string[];
  formatters?: Record<string, (value: any) => number>;
}) => {
  return React.useMemo(() => {
    return rawData.map(item => {
      const formatted: LineChartDataPoint = {
        label: item[config.xKey],
        value: 0, // valor padrão
      };

      config.yKeys.forEach(key => {
        const formatter = config.formatters?.[key];
        formatted[key] = formatter ? formatter(item[key]) : item[key];
      });

      return formatted;
    });
  }, [rawData, config]);
};

export default LineChart;