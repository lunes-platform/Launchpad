import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { BaseChart, type BaseChartProps } from './BaseChart';
import { formatUtils } from '../../lib/utils';

/**
 * Interface para dados do gráfico de barras
 */
export interface BarChartDataPoint {
  /** Rótulo do eixo X */
  label: string;
  /** Valor principal */
  value: number;
  /** Valores adicionais para múltiplas barras */
  [key: string]: string | number;
}

/**
 * Configuração para uma barra do gráfico
 */
export interface BarConfig {
  /** Chave dos dados para esta barra */
  dataKey: string;
  /** Cor da barra */
  color: string;
  /** Nome para exibição na legenda */
  name?: string;
  /** Raio das bordas */
  radius?: number;
}

/**
 * Props específicas do BarChart
 */
export interface BarChartProps extends Omit<BaseChartProps, 'children'> {
  /** Dados do gráfico */
  data: BarChartDataPoint[];
  /** Configurações das barras */
  bars: BarConfig[];
  /** Chave para o eixo X */
  xAxisKey?: string;
  /** Formato do tooltip */
  tooltipFormatter?: (value: number, name: string) => [string, string];
  /** Formato do label do tooltip */
  tooltipLabelFormatter?: (label: string) => string;
  /** Mostrar grade */
  showGrid?: boolean;
  /** Mostrar legenda */
  showLegenda?: boolean;
  /** Altura mínima do gráfico */
  minHeight?: number;
  /** Layout das barras (vertical ou horizontal) */
  layout?: 'vertical' | 'horizontal';
  /** Empilhar barras */
  stacked?: boolean;
  /** Cores customizadas para cada item */
  customColors?: string[];
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
            className="w-3 h-3 rounded-sm" 
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
 * Componente BarChart - Gráfico de barras interativo
 * 
 * @example
 * ```tsx
 * const data = [
 *   { label: 'Jan', vendas: 1000, leads: 150 },
 *   { label: 'Feb', vendas: 1200, leads: 180 },
 *   { label: 'Mar', vendas: 900, leads: 120 },
 * ];
 * 
 * const bars = [
 *   { dataKey: 'vendas', color: '#3b82f6', name: 'Vendas' },
 *   { dataKey: 'leads', color: '#10b981', name: 'Leads' },
 * ];
 * 
 * <BarChart 
 *   data={data} 
 *   bars={bars}
 *   title="Métricas de Vendas"
 *   tooltipFormatter={(value, name) => [
 *     name === 'vendas' ? formatUtils.currency(value) : value.toString(),
 *     name
 *   ]}
 * />
 * ```
 */
export const BarChart: React.FC<BarChartProps> = ({
  data,
  bars,
  xAxisKey = 'label',
  tooltipFormatter,
  tooltipLabelFormatter,
  showGrid = true,
  showLegenda = true,
  minHeight = 300,
  layout = 'vertical',
  stacked = false,
  customColors,
  ...baseProps
}) => {
  const chartContent = (
    <ResponsiveContainer width="100%" height={minHeight}>
      <RechartsBarChart
        data={data}
        layout={layout}
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
          dataKey={layout === 'vertical' ? xAxisKey : undefined}
          type={layout === 'vertical' ? 'category' : 'number'}
          className="text-xs fill-gray-600 dark:fill-gray-400"
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          dataKey={layout === 'horizontal' ? xAxisKey : undefined}
          type={layout === 'vertical' ? 'number' : 'category'}
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
        {showLegenda && (
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px',
            }}
          />
        )}
        {bars.map((bar, index) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            fill={bar.color}
            name={bar.name || bar.dataKey}
            radius={bar.radius || [4, 4, 0, 0]}
            stackId={stacked ? 'stack' : undefined}
          >
            {customColors && data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={customColors[index % customColors.length]} 
              />
            ))}
          </Bar>
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );

  return (
    <BaseChart {...baseProps}>
      {chartContent}
    </BaseChart>
  );
};

/**
 * Hook para usar dados de barra com formatação automática
 */
export const useBarChartData = (rawData: any[], config: {
  xKey: string;
  yKeys: string[];
  formatters?: Record<string, (value: any) => number>;
}) => {
  return React.useMemo(() => {
    return rawData.map(item => {
      const formatted: BarChartDataPoint = {
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

export default BarChart;