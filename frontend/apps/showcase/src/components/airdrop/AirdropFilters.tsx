import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { AirdropRecord } from '../../hooks/useAirdrops';

/**
 * Tipos de filtro disponíveis
 */
export type AirdropStatus = 'all' | 'available' | 'pending' | 'claimed' | 'expired';

/**
 * Interface para os filtros de airdrop
 */
export interface AirdropFilters {
  status: AirdropStatus;
  projectName: string;
  searchTerm: string;
  sortBy: 'name' | 'endDate' | 'tokenAmount';
  sortOrder: 'asc' | 'desc';
}

/**
 * Props do componente de filtros
 */
interface AirdropFiltersProps {
  filters: AirdropFilters;
  onFiltersChange: (filters: AirdropFilters) => void;
  airdrops: AirdropRecord[];
  className?: string;
}

/**
 * Opções de status para o filtro
 */
const STATUS_OPTIONS: Array<{ value: AirdropStatus; label: string; color: string }> = [
  { value: 'all', label: 'Todos', color: 'text-gray-600' },
  { value: 'available', label: 'Disponível', color: 'text-green-600' },
  { value: 'pending', label: 'Pendente', color: 'text-yellow-600' },
  { value: 'claimed', label: 'Reclamado', color: 'text-blue-600' },
  { value: 'expired', label: 'Expirado', color: 'text-red-600' },
];

/**
 * Opções de ordenação
 */
const SORT_OPTIONS = [
  { value: 'name', label: 'Nome do Projeto' },
  { value: 'endDate', label: 'Data de Término' },
  { value: 'tokenAmount', label: 'Quantidade de Tokens' },
];

/**
 * Componente de filtros para airdrops
 * Permite filtrar por status, projeto, busca textual e ordenação
 */
export function AirdropFilters({
  filters,
  onFiltersChange,
  airdrops,
  className = '',
}: AirdropFiltersProps) {
  // Extrai projetos únicos dos airdrops
  const uniqueProjects = React.useMemo(() => {
    const projects = airdrops.map(airdrop => airdrop.projectName);
    return Array.from(new Set(projects)).sort();
  }, [airdrops]);

  /**
   * Atualiza um filtro específico
   */
  const updateFilter = <K extends keyof AirdropFilters>(
    key: K,
    value: AirdropFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  /**
   * Limpa todos os filtros
   */
  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      projectName: '',
      searchTerm: '',
      sortBy: 'endDate',
      sortOrder: 'asc',
    });
  };

  /**
   * Verifica se há filtros ativos
   */
  const hasActiveFilters = React.useMemo(() => {
    return (
      filters.status !== 'all' ||
      filters.projectName !== '' ||
      filters.searchTerm !== ''
    );
  }, [filters]);

  return (
    <div className={`bg-white dark:bg-grafite-800 rounded-lg border border-gray-200 dark:border-grafite-700 p-6 ${className}`}>
      {/* Cabeçalho dos filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-grafite dark:text-grafite-50">
            Filtros
          </h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 dark:text-grafite-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <X className="h-4 w-4" />
            Limpar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Busca textual */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-grafite dark:text-grafite-200">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              placeholder="Nome do projeto ou token..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg bg-white dark:bg-grafite-700 text-grafite dark:text-grafite-100 placeholder-gray-500 dark:placeholder-grafite-400 focus:ring-2 focus:ring-lunes-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtro por status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-grafite dark:text-grafite-200">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value as AirdropStatus)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg bg-white dark:bg-grafite-700 text-grafite dark:text-grafite-100 focus:ring-2 focus:ring-lunes-primary focus:border-transparent"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por projeto */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-grafite dark:text-grafite-200">
            Projeto
          </label>
          <select
            value={filters.projectName}
            onChange={(e) => updateFilter('projectName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg bg-white dark:bg-grafite-700 text-grafite dark:text-grafite-100 focus:ring-2 focus:ring-lunes-primary focus:border-transparent"
          >
            <option value="">Todos os projetos</option>
            {uniqueProjects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenação */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-grafite dark:text-grafite-200">
            Ordenar por
          </label>
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as AirdropFilters['sortBy'])}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg bg-white dark:bg-grafite-700 text-grafite dark:text-grafite-100 focus:ring-2 focus:ring-lunes-primary focus:border-transparent"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg bg-white dark:bg-grafite-700 text-grafite dark:text-grafite-100 hover:bg-gray-50 dark:hover:bg-grafite-600 transition-colors"
              title={`Ordenação ${filters.sortOrder === 'asc' ? 'crescente' : 'decrescente'}`}
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Indicadores de filtros ativos */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-grafite-700">
          <div className="flex flex-wrap gap-2">
            {filters.status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                Status: {STATUS_OPTIONS.find(opt => opt.value === filters.status)?.label}
                <button
                  onClick={() => updateFilter('status', 'all')}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.projectName && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                Projeto: {filters.projectName}
                <button
                  onClick={() => updateFilter('projectName', '')}
                  className="ml-1 hover:text-green-600 dark:hover:text-green-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                Busca: "{filters.searchTerm}"
                <button
                  onClick={() => updateFilter('searchTerm', '')}
                  className="ml-1 hover:text-purple-600 dark:hover:text-purple-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook para gerenciar os filtros de airdrop
 */
export function useAirdropFilters(initialFilters?: Partial<AirdropFilters>) {
  const [filters, setFilters] = React.useState<AirdropFilters>({
    status: 'all',
    projectName: '',
    searchTerm: '',
    sortBy: 'endDate',
    sortOrder: 'asc',
    ...initialFilters,
  });

  /**
   * Aplica os filtros aos airdrops
   */
  const applyFilters = React.useCallback(
    (airdrops: AirdropRecord[]): AirdropRecord[] => {
      let filtered = [...airdrops];

      // Filtro por status
      if (filters.status !== 'all') {
        filtered = filtered.filter(airdrop => airdrop.status === filters.status);
      }

      // Filtro por projeto
      if (filters.projectName) {
        filtered = filtered.filter(airdrop => 
          airdrop.projectName === filters.projectName
        );
      }

      // Filtro por busca textual
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(airdrop => 
          airdrop.projectName.toLowerCase().includes(searchLower) ||
          airdrop.tokenSymbol.toLowerCase().includes(searchLower)
        );
      }

      // Ordenação
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'name':
            comparison = a.projectName.localeCompare(b.projectName);
            break;
          case 'endDate':
            comparison = new Date(a.claimDeadline).getTime() - new Date(b.claimDeadline).getTime();
            break;
          case 'tokenAmount':
            comparison = a.tokenAmount - b.tokenAmount;
            break;
        }
        
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });

      return filtered;
    },
    [filters]
  );

  return {
    filters,
    setFilters,
    applyFilters,
  };
}

export default AirdropFilters;