import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Input, Select, Card } from '@launchpad/shared-ui';
import { RaffleHistoryService } from '../services/raffleHistoryService';
import type { 
  RaffleTransactionItem, 
  RaffleTransactionType, 
  RaffleTransactionStatus,
  RaffleStats 
} from '../services/raffleHistoryService';
import { Download, Filter, Search, Calendar, TrendingUp, Trophy, Ticket, DollarSign } from 'lucide-react';

interface RaffleHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface FilterState {
  type: RaffleTransactionType | 'all';
  status: RaffleTransactionStatus | 'all';
  dateRange: {
    start: string;
    end: string;
  };
  search: string;
}

export const RaffleHistoryModal: React.FC<RaffleHistoryModalProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const [transactions, setTransactions] = useState<RaffleTransactionItem[]>([]);
  const [stats, setStats] = useState<RaffleStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    status: 'all',
    dateRange: {
      start: '',
      end: ''
    },
    search: ''
  });

  // Opções para os selects
  const typeOptions = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'ticket_purchase', label: 'Compra de Ticket' },
    { value: 'ticket_refund', label: 'Reembolso' },
    { value: 'prize_claim', label: 'Resgate de Prêmio' },
    { value: 'raffle_entry', label: 'Entrada no Raffle' },
    { value: 'raffle_win', label: 'Prêmio Ganho' },
    { value: 'raffle_loss', label: 'Raffle Perdido' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'completed', label: 'Concluído' },
    { value: 'failed', label: 'Falhou' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'refunded', label: 'Reembolsado' }
  ];

  // Carregar dados do histórico
  useEffect(() => {
    if (isOpen && userId) {
      loadHistory();
    }
  }, [isOpen, userId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular dados de tickets e raffles para o usuário
      const mockTickets: any[] = []; // Aqui viriam os tickets reais do usuário
      const mockRaffles: any[] = []; // Aqui viriam os raffles ativos
      
      const historyData = RaffleHistoryService.generateRaffleHistory(mockTickets, mockRaffles);
      const statsData = RaffleHistoryService.calculateRaffleStats(historyData, mockRaffles);
      
      setTransactions(historyData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar transações
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filtro por tipo
    if (filters.type !== 'all') {
      filtered = RaffleHistoryService.filterByType(filtered, filters.type);
    }

    // Filtro por status
    if (filters.status !== 'all') {
      filtered = RaffleHistoryService.filterByStatus(filtered, filters.status);
    }

    // Filtro por período
    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.timestamp);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    // Filtro por busca
    if (filters.search) {
      filtered = filtered.filter(transaction => 
        transaction.raffleName.toLowerCase().includes(filters.search.toLowerCase()) ||
        transaction.transactionHash?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return filtered;
  }, [transactions, filters]);

  // Exportar para CSV
  const handleExport = () => {
    RaffleHistoryService.exportToCsv(filteredTransactions, `raffle-history-${userId}.csv`);
  };

  // Resetar filtros
  const resetFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      dateRange: { start: '', end: '' },
      search: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Histórico de Transações
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={filteredTransactions.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Gasto</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.totalAmountSpent} LUNES
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Ticket className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tickets Comprados</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.totalTicketsPurchased}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Prêmios Ganhos</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.totalPrizesWon}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Valor dos Prêmios</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.totalPrizeValue} LUNES
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filtros */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtros
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select
              options={typeOptions}
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
              placeholder="Tipo de transação"
            />
            
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              placeholder="Status"
            />
            
            <Input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, start: e.target.value }
              }))}
              placeholder="Data inicial"
            />
            
            <Input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, end: e.target.value }
              }))}
              placeholder="Data final"
            />
            
            <div className="flex gap-2">
              <Input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Buscar..."
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
              >
                Limpar
              </Button>
            </div>
          </div>
        </Card>

        {/* Lista de Transações */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-roxo-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Carregando histórico...</span>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Nenhuma transação encontrada com os filtros aplicados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-grafite-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Raffle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tickets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-grafite-900 divide-y divide-gray-200 dark:divide-grafite-700">
                  {filteredTransactions.map((transaction) => {
                    const displayInfo = RaffleHistoryService.formatDisplayInfo(transaction);
                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-grafite-800">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(transaction.timestamp).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {displayInfo.typeLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {transaction.raffleName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {transaction.ticketCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {displayInfo.amountDisplay}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            transaction.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}>
                            {displayInfo.statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {filteredTransactions.length} de {transactions.length} transações
          </p>
          <Button onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
};