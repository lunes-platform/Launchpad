import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Interface base para configuração de gráficos
 */
export interface BaseChartProps {
  /** Título do gráfico */
  title?: string;
  /** Descrição ou subtítulo */
  description?: string;
  /** Altura do gráfico */
  height?: number;
  /** Classes CSS adicionais */
  className?: string;
  /** Se deve mostrar loading */
  loading?: boolean;
  /** Se deve mostrar animação de entrada */
  animate?: boolean;
  /** Dados para o gráfico */
  data?: any[];
  /** Callback para quando não há dados */
  onNoData?: () => void;
}

/**
 * Componente wrapper base para todos os gráficos
 * Fornece estrutura comum, loading states e animações
 */
export const BaseChart: React.FC<BaseChartProps & { children: React.ReactNode }> = ({
  title,
  description,
  height = 300,
  className,
  loading = false,
  animate = true,
  data = [],
  onNoData,
  children,
}) => {
  const hasData = data && data.length > 0;

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const chartVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm',
        className
      )}
      variants={animate ? containerVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
    >
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Chart Content */}
      <motion.div
        className="relative"
        style={{ height }}
        variants={animate ? chartVariants : undefined}
        initial={animate ? 'hidden' : undefined}
        animate={animate ? 'visible' : undefined}
      >
        {loading ? (
          <ChartSkeleton height={height} />
        ) : !hasData ? (
          <NoDataState height={height} onAction={onNoData} />
        ) : (
          children
        )}
      </motion.div>
    </motion.div>
  );
};

/**
 * Componente de loading skeleton para gráficos
 */
const ChartSkeleton: React.FC<{ height: number }> = ({ height }) => {
  return (
    <div className="flex items-center justify-center" style={{ height }}>
      <div className="animate-pulse flex space-x-4 w-full">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente para estado sem dados
 */
const NoDataState: React.FC<{ height: number; onAction?: () => void }> = ({
  height,
  onAction,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
      style={{ height }}
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium mb-1">Nenhum dado disponível</p>
      <p className="text-xs text-center mb-4">
        Os dados do gráfico não estão disponíveis no momento
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
};

/**
 * Hook para cores de gráficos baseadas no tema
 */
export const useChartColors = () => {
  return {
    primary: '#6366f1', // indigo-500
    secondary: '#8b5cf6', // violet-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    error: '#ef4444', // red-500
    info: '#3b82f6', // blue-500
    gray: '#6b7280', // gray-500
    gradient: {
      primary: ['#6366f1', '#8b5cf6'],
      success: ['#10b981', '#34d399'],
      warning: ['#f59e0b', '#fbbf24'],
      error: ['#ef4444', '#f87171'],
    },
  };
};

/**
 * Utilitários para formatação de dados de gráficos
 */
export const chartUtils = {
  /**
   * Formata valores monetários
   */
  formatCurrency: (value: number, currency = 'USD') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  },

  /**
   * Formata números grandes com sufixos (K, M, B)
   */
  formatLargeNumber: (value: number) => {
    if (value >= 1e9) {
      return (value / 1e9).toFixed(1) + 'B';
    }
    if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + 'M';
    }
    if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + 'K';
    }
    return value.toString();
  },

  /**
   * Formata porcentagens
   */
  formatPercentage: (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  },

  /**
   * Gera dados mock para desenvolvimento
   */
  generateMockData: (count: number, min = 0, max = 100) => {
    return Array.from({ length: count }, (_, i) => ({
      name: `Item ${i + 1}`,
      value: Math.floor(Math.random() * (max - min + 1)) + min,
      date: new Date(Date.now() - (count - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }));
  },
};