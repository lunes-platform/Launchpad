import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitário para combinar classes CSS de forma inteligente
 * Combina clsx para lógica condicional e tailwind-merge para resolver conflitos do Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utilitários para formatação de valores
 */
export const formatUtils = {
  /**
   * Formata números como moeda
   */
  currency: (value: number, currency = 'USD') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  },

  /**
   * Formata números grandes com sufixos
   */
  compactNumber: (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  },

  /**
   * Formata porcentagens
   */
  percentage: (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  },

  /**
   * Formata datas
   */
  date: (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR').format(d);
  },

  /**
   * Formata data e hora
   */
  datetime: (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  },
};

/**
 * Utilitários para manipulação de arrays
 */
export const arrayUtils = {
  /**
   * Remove duplicatas de um array
   */
  unique: <T>(array: T[]): T[] => {
    return Array.from(new Set(array));
  },

  /**
   * Agrupa elementos de um array por uma chave
   */
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  /**
   * Ordena array por uma propriedade
   */
  sortBy: <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },
};

/**
 * Utilitários para validação
 */
export const validationUtils = {
  /**
   * Verifica se é um email válido
   */
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Verifica se é uma URL válida
   */
  isUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Verifica se é um endereço de carteira válido (formato básico)
   */
  isWalletAddress: (address: string): boolean => {
    // Validação básica para endereços Substrate/Polkadot
    return /^[1-9A-HJ-NP-Za-km-z]{47,48}$/.test(address);
  },
};

/**
 * Utilitários para debounce e throttle
 */
export const performanceUtils = {
  /**
   * Debounce function
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * Throttle function
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};