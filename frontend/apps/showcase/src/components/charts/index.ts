/**
 * Componentes de Gráficos Interativos
 * 
 * Esta biblioteca fornece uma suite completa de componentes de gráficos
 * construídos sobre Recharts com design system consistente e funcionalidades avançadas.
 */

// Componente base
export { BaseChart } from './BaseChart';
export type { BaseChartProps } from './BaseChart';

// Gráfico de Linha
export { LineChart, useLineChartData } from './LineChart';
export type { 
  LineChartProps, 
  LineChartDataPoint, 
  LineConfig 
} from './LineChart';

// Gráfico de Barras
export { BarChart, useBarChartData } from './BarChart';
export type { 
  BarChartProps, 
  BarChartDataPoint, 
  BarConfig 
} from './BarChart';

// Gráfico de Pizza
export { PieChart, DonutChart, usePieChartData } from './PieChart';
export type { 
  PieChartProps, 
  PieChartDataPoint 
} from './PieChart';

/**
 * Utilitários e constantes
 */
export const CHART_COLORS = {
  primary: {
    blue: '#3b82f6',
    emerald: '#10b981',
    amber: '#f59e0b',
    red: '#ef4444',
    violet: '#8b5cf6',
  },
  secondary: {
    cyan: '#06b6d4',
    lime: '#84cc16',
    orange: '#f97316',
    pink: '#ec4899',
    indigo: '#6366f1',
  },
  gradients: {
    blueToViolet: ['#3b82f6', '#8b5cf6'],
    emeraldToCyan: ['#10b981', '#06b6d4'],
    amberToOrange: ['#f59e0b', '#f97316'],
    redToPink: ['#ef4444', '#ec4899'],
  },
};

export const CHART_THEMES = {
  default: {
    background: 'transparent',
    grid: '#e5e7eb',
    text: '#6b7280',
    tooltip: {
      background: '#ffffff',
      border: '#e5e7eb',
      text: '#111827',
    },
  },
  dark: {
    background: 'transparent',
    grid: '#374151',
    text: '#9ca3af',
    tooltip: {
      background: '#1f2937',
      border: '#374151',
      text: '#f9fafb',
    },
  },
};

/**
 * Configurações padrão para diferentes tipos de gráficos
 */
export const DEFAULT_CHART_CONFIG = {
  line: {
    smooth: true,
    showDots: false,
    showGrid: true,
    showLegend: true,
    minHeight: 300,
  },
  bar: {
    layout: 'vertical' as const,
    stacked: false,
    showGrid: true,
    showLegenda: true,
    minHeight: 300,
  },
  pie: {
    innerRadius: 0,
    outerRadius: 80,
    showLabels: true,
    showLegenda: true,
    showPercentage: false,
    minHeight: 300,
  },
  donut: {
    innerRadius: 40,
    outerRadius: 80,
    showLabels: true,
    showLegenda: true,
    showPercentage: true,
    minHeight: 300,
  },
};

/**
 * Tipos de dados comuns para gráficos
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: any;
}

export interface TimeSeriesDataPoint {
  date: string | Date;
  value: number;
  [key: string]: any;
}

export interface CategoryDataPoint {
  category: string;
  value: number;
  color?: string;
  [key: string]: any;
}

/**
 * Hooks utilitários para processamento de dados
 */
export { useChartColors } from './BaseChart';