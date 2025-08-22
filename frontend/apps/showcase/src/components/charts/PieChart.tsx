import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BaseChart, type BaseChartProps } from './BaseChart';
import { formatUtils } from '../../lib/utils';

/**
 * Interface para dados do gráfico de pizza
 */
export interface PieChartDataPoint {
  /** Nome/rótulo do segmento */
  name: string;
  /** Valor do segmento */
  value: number;
  /** Cor customizada (opcional) */
  color?: string;
  /** Dados adicionais */
  [key: string]: any;
}

/**
 * Props específicas do PieChart
 */
export interface PieChartProps extends Omit<BaseChartProps, 'children'> {
  /** Dados do gráfico */
  data: PieChartDataPoint[];
  /** Cores padrão para os segmentos */
  colors?: string[];
  /** Formato do tooltip */
  tooltipFormatter?: (value: number, name: string) => [string, string];
  /** Mostrar legenda */
  showLegenda?: boolean;
  /** Altura mínima do gráfico */
  minHeight?: number;
  /** Raio interno (para donut chart) */
  innerRadius?: number;
  /** Raio externo */
  outerRadius?: number;
  /** Mostrar labels nos segmentos */
  showLabels?: boolean;
  /** Formato dos labels */
  labelFormatter?: (entry: PieChartDataPoint) => string;
  /** Ângulo inicial */
  startAngle?: number;
  /** Ângulo final */
  endAngle?: number;
  /** Mostrar valores em porcentagem */
  showPercentage?: boolean;
}

/**
 * Cores padrão para o gráfico de pizza
 */
const DEFAULT_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
  '#ec4899', // pink-500
  '#6366f1', // indigo-500
];

/**
 * Componente de tooltip customizado
 */
const CustomTooltip = ({ 
  active, 
  payload, 
  formatter,
  showPercentage 
}: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0];
  const total = payload[0].payload.total || 0;
  const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
      <div className="flex items-center gap-2 text-sm">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: data.color }}
        />
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {data.name}
        </span>
      </div>
      <div className="mt-1 text-sm">
        <span className="text-gray-600 dark:text-gray-400">Valor: </span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {formatter ? formatter(data.value, data.name)[0] : data.value}
        </span>
        {showPercentage && (
          <span className="ml-2 text-gray-500 dark:text-gray-400">
            ({percentage}%)
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Componente de label customizado
 */
const CustomLabel = ({ 
  cx, 
  cy, 
  midAngle, 
  innerRadius, 
  outerRadius, 
  percent, 
  name,
  labelFormatter,
  entry
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Só mostra o label se a porcentagem for maior que 5%
  if (percent < 0.05) return null;

  const labelText = labelFormatter ? labelFormatter(entry) : `${(percent * 100).toFixed(0)}%`;

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
    >
      {labelText}
    </text>
  );
};

/**
 * Componente PieChart - Gráfico de pizza interativo
 * 
 * @example
 * ```tsx
 * const data = [
 *   { name: 'Desktop', value: 400 },
 *   { name: 'Mobile', value: 300 },
 *   { name: 'Tablet', value: 200 },
 * ];
 * 
 * <PieChart 
 *   data={data}
 *   title="Dispositivos de Acesso"
 *   showPercentage={true}
 *   tooltipFormatter={(value) => [formatUtils.compactNumber(value), 'Usuários']}
 * />
 * ```
 */
export const PieChart: React.FC<PieChartProps> = ({
  data,
  colors = DEFAULT_COLORS,
  tooltipFormatter,
  showLegenda = true,
  minHeight = 300,
  innerRadius = 0,
  outerRadius = 80,
  showLabels = true,
  labelFormatter,
  startAngle = 90,
  endAngle = -270,
  showPercentage = false,
  ...baseProps
}) => {
  // Calcular total para porcentagens
  const total = React.useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  // Adicionar total aos dados para o tooltip
  const dataWithTotal = React.useMemo(() => {
    return data.map(item => ({ ...item, total }));
  }, [data, total]);

  const chartContent = (
    <ResponsiveContainer width="100%" height={minHeight}>
      <RechartsPieChart>
        <Pie
          data={dataWithTotal}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={showLabels ? (props) => (
            <CustomLabel 
              {...props} 
              labelFormatter={labelFormatter}
              entry={props.payload}
            />
          ) : false}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
          startAngle={startAngle}
          endAngle={endAngle}
        >
          {dataWithTotal.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || colors[index % colors.length]} 
            />
          ))}
        </Pie>
        <Tooltip 
          content={
            <CustomTooltip 
              formatter={tooltipFormatter}
              showPercentage={showPercentage}
            />
          }
        />
        {showLegenda && (
          <Legend 
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px',
            }}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );

  return (
    <BaseChart {...baseProps}>
      {chartContent}
    </BaseChart>
  );
};

/**
 * Hook para usar dados de pizza com formatação automática
 */
export const usePieChartData = (rawData: any[], config: {
  nameKey: string;
  valueKey: string;
  colorKey?: string;
  formatter?: (value: any) => number;
}) => {
  return React.useMemo(() => {
    return rawData.map(item => {
      const formatted: PieChartDataPoint = {
        name: item[config.nameKey],
        value: config.formatter ? config.formatter(item[config.valueKey]) : item[config.valueKey],
      };

      if (config.colorKey && item[config.colorKey]) {
        formatted.color = item[config.colorKey];
      }

      return formatted;
    });
  }, [rawData, config]);
};

/**
 * Componente DonutChart - Variação do PieChart com buraco no meio
 */
export const DonutChart: React.FC<PieChartProps> = (props) => {
  return (
    <PieChart 
      {...props} 
      innerRadius={props.innerRadius || 40}
    />
  );
};

export default PieChart;