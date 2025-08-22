import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, Trophy, Ticket, Calendar } from 'lucide-react';
import { Card, Button, Input } from '@launchpad/shared-ui';
import { Badge } from '../components/ui/Badge';
import { RaffleCard } from '../components/ui/RaffleCard';
import { FadeIn } from '../components/animations/FadeIn';
import { ScaleIn } from '../components/animations/ScaleIn';
import { useRaffleStore } from '../stores/raffleStore';
import type { Raffle } from '../stores/raffleStore';

/**
 * Página principal dos Raffles
 * Exibe lista de sorteios ativos, filtros e estatísticas
 */
export function RafflesPage() {
  const {
    raffles,
    loading,
    error,
    filters,
    pagination,
    fetchRaffles,
    setFilters,
    setPagination,
  } = useRaffleStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Carregar raffles ao montar o componente
  useEffect(() => {
    fetchRaffles();
  }, [fetchRaffles]);

  // Filtrar raffles baseado no termo de busca
  const filteredRaffles = raffles.filter(raffle =>
    raffle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    raffle.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estatísticas dos raffles
  const stats = {
    total: raffles.length,
    active: raffles.filter(r => r.status === 'active').length,
    upcoming: raffles.filter(r => r.status === 'upcoming').length,
    completed: raffles.filter(r => r.status === 'completed').length,
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ [key]: value });
  };

  const handleViewDetails = (raffleId: string) => {
    // Navegar para página de detalhes do raffle
    console.log('Ver detalhes do raffle:', raffleId);
  };

  if (loading.raffles) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-grafite-50 to-white dark:from-grafite-900 dark:to-grafite-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-roxo"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-grafite-50 to-white dark:from-grafite-900 dark:to-grafite-800 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <Trophy className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-grafite-900 dark:text-white mb-2">
              Erro ao Carregar Raffles
            </h2>
            <p className="text-grafite-600 dark:text-grafite-300 mb-4">
              {error}
            </p>
            <Button onClick={() => fetchRaffles()}>
              Tentar Novamente
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-grafite-50 to-white dark:from-grafite-900 dark:to-grafite-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <FadeIn>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-grafite-900 dark:text-white mb-2">
                  🎲 Raffles
                </h1>
                <p className="text-grafite-600 dark:text-grafite-300">
                  Sorteios criados pelos projetos durante a captação de recursos
                </p>
              </div>
              <Button className="bg-gradient-to-r from-roxo to-roxo-escuro hover:from-roxo-escuro hover:to-roxo text-white" disabled>
                <Plus className="w-4 h-4 mr-2" />
                Dashboard do Projeto
              </Button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <ScaleIn delay={0.1}>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-grafite-500 dark:text-grafite-400">Total</p>
                      <p className="text-2xl font-bold text-grafite-900 dark:text-white">
                        {stats.total}
                      </p>
                    </div>
                    <Trophy className="w-8 h-8 text-roxo" />
                  </div>
                </Card>
              </ScaleIn>

              <ScaleIn delay={0.2}>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-grafite-500 dark:text-grafite-400">Ativos</p>
                      <p className="text-2xl font-bold text-verde">
                        {stats.active}
                      </p>
                    </div>
                    <Ticket className="w-8 h-8 text-verde" />
                  </div>
                </Card>
              </ScaleIn>

              <ScaleIn delay={0.3}>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-grafite-500 dark:text-grafite-400">Em Breve</p>
                      <p className="text-2xl font-bold text-laranja">
                        {stats.upcoming}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-laranja" />
                  </div>
                </Card>
              </ScaleIn>

              <ScaleIn delay={0.4}>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-grafite-500 dark:text-grafite-400">Finalizados</p>
                      <p className="text-2xl font-bold text-grafite-600 dark:text-grafite-400">
                        {stats.completed}
                      </p>
                    </div>
                    <Trophy className="w-8 h-8 text-grafite-600 dark:text-grafite-400" />
                  </div>
                </Card>
              </ScaleIn>
            </div>

            {/* Busca e Filtros */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grafite-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Buscar raffles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>

            {/* Painel de Filtros */}
            {showFilters && (
              <FadeIn>
                <Card className="p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                        Status
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full p-2 border border-grafite-300 dark:border-grafite-600 rounded-lg bg-white dark:bg-grafite-800 text-grafite-900 dark:text-white"
                      >
                        <option value="all">Todos</option>
                        <option value="active">Ativos</option>
                        <option value="upcoming">Em Breve</option>
                        <option value="completed">Finalizados</option>
                        <option value="cancelled">Cancelados</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                        Moeda
                      </label>
                      <select
                        value={filters.currency}
                        onChange={(e) => handleFilterChange('currency', e.target.value)}
                        className="w-full p-2 border border-grafite-300 dark:border-grafite-600 rounded-lg bg-white dark:bg-grafite-800 text-grafite-900 dark:text-white"
                      >
                        <option value="all">Todas</option>
                        <option value="LUNES">LUNES</option>
                        <option value="LUSDT">LUSDT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                        Tipo
                      </label>
                      <select
                        value={filters.vipOnly === null ? 'all' : filters.vipOnly ? 'vip' : 'public'}
                        onChange={(e) => {
                          const value = e.target.value === 'all' ? null : e.target.value === 'vip';
                          handleFilterChange('vipOnly', value);
                        }}
                        className="w-full p-2 border border-grafite-300 dark:border-grafite-600 rounded-lg bg-white dark:bg-grafite-800 text-grafite-900 dark:text-white"
                      >
                        <option value="all">Todos</option>
                        <option value="public">Público</option>
                        <option value="vip">VIP Apenas</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFilters({
                            status: 'all',
                            currency: 'all',
                            vipOnly: null,
                            projectId: null,
                          });
                          setSearchTerm('');
                        }}
                        className="w-full"
                      >
                        Limpar Filtros
                      </Button>
                    </div>
                  </div>
                </Card>
              </FadeIn>
            )}
          </div>
        </FadeIn>

        {/* Lista de Raffles */}
        {filteredRaffles.length === 0 ? (
          <FadeIn>
            <Card className="p-12 text-center">
              <Trophy className="w-16 h-16 text-grafite-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-grafite-900 dark:text-white mb-2">
                Nenhum raffle encontrado
              </h3>
              <p className="text-grafite-600 dark:text-grafite-300">
                {searchTerm || filters.status !== 'all' || filters.currency !== 'all' || filters.vipOnly !== null
                  ? 'Tente ajustar os filtros de busca'
                  : 'Não há raffles disponíveis no momento'}
              </p>
            </Card>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRaffles.map((raffle, index) => (
              <ScaleIn key={raffle.id} delay={index * 0.1}>
                <RaffleCard
                  raffle={raffle}
                  onViewDetails={handleViewDetails}
                />
              </ScaleIn>
            ))}
          </div>
        )}

        {/* Paginação */}
        {filteredRaffles.length > 0 && pagination.total > pagination.limit && (
          <FadeIn>
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ page: pagination.page - 1 })}
                >
                  Anterior
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => (
                    <Button
                  key={i + 1}
                  variant={pagination.page === i + 1 ? 'primary' : 'outline'}
                  onClick={() => setPagination({ page: i + 1 })}
                  className="w-10 h-10"
                >
                  {i + 1}
                </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                  onClick={() => setPagination({ page: pagination.page + 1 })}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

export default RafflesPage;