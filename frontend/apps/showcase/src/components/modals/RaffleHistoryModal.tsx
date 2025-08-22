import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Download, Search } from 'lucide-react';
import { RaffleHistoryService, type RaffleTransactionItem, type RaffleTransactionType, type RaffleTransactionStatus } from '../../services/raffleHistoryService';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Select, Modal, AnimatedButton } from '@launchpad/shared-ui';

interface RaffleHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffleId?: string; // Se fornecido, mostra apenas transações deste raffle
}

/**
 * Modal para exibir o histórico de transações de raffles do usuário
 */
export const RaffleHistoryModal: React.FC<RaffleHistoryModalProps> = ({
  isOpen,
  onClose,
  raffleId
}) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<RaffleTransactionItem[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<RaffleTransactionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [filters, setFilters] = useState({
    type: 'all' as RaffleTransactionType | 'all',
    status: 'all' as RaffleTransactionStatus | 'all',
    dateRange: 'all' as 'all' | '7d' | '30d' | '90d',
    search: ''
  });
  
  // Estatísticas
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalTicketsPurchased: 0,
    totalAmountSpent: '0',
    totalPrizesClaimed: 0,
    totalPrizeValue: '0',
    successRate: 0
  });

  /**
   * Carrega o histórico de transações
   */
  const loadHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Gerar dados mock para demonstração
      const mockTickets: any[] = [];
      const mockRaffles: any[] = [];
      const history = RaffleHistoryService.generateRaffleHistory(mockTickets, mockRaffles);
      setTransactions(history);
      
      const calculatedStats = RaffleHistoryService.calculateRaffleStats(history, mockRaffles);
      setStats(calculatedStats);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError('Erro ao carregar histórico de transações');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aplica filtros às transações
   */
  const applyFilters = () => {
    let filtered = [...transactions];
    
    // Filtro por tipo
    if (filters.type !== 'all') {
      filtered = RaffleHistoryService.filterByType(filtered, filters.type);
    }
    
    // Filtro por status
    if (filters.status !== 'all') {
      filtered = RaffleHistoryService.filterByStatus(filtered, filters.status);
    }
    
    // Filtro por período
    if (filters.dateRange !== 'all') {
      const days = {
        '7d': 7,
        '30d': 30,
        '90d': 90
      }[filters.dateRange];
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const endDate = new Date();
      
      filtered = RaffleHistoryService.filterByDateRange(filtered, startDate.toISOString(), endDate.toISOString());
    }
    
    // Filtro por busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.raffleName.toLowerCase().includes(searchLower) ||
        tx.description.toLowerCase().includes(searchLower) ||
        tx.id.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredTransactions(filtered);
  };

  /**
   * Exporta o histórico para CSV
   */
  const exportToCsv = () => {
    RaffleHistoryService.exportToCsv(filteredTransactions, 'raffle-history.csv');
  };

  /**
   * Formata valor monetário
   */
  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${currency}`;
  };

  /**
   * Formata data
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // Carrega dados quando o modal abre
  useEffect(() => {
    if (isOpen && user) {
      loadHistory();
    }
  }, [isOpen, user, raffleId]);

  // Aplica filtros quando mudam
  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl"
      title={raffleId ? 'Histórico do Raffle' : 'Histórico de Raffles'}
    >
      {/* Cabeçalho com descrição */}
      <div className="mb-6">
        <p className="text-grafite-600 dark:text-grafite-400">
          Visualize todas as suas transações e atividades
        </p>
      </div>

        {/* Estatísticas */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalTransactions}</div>
              <div className="text-sm text-gray-600">Transações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalTicketsPurchased}</div>
              <div className="text-sm text-gray-600">Tickets Comprados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalAmountSpent}</div>
              <div className="text-sm text-gray-600">Total Gasto</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.totalPrizesClaimed}</div>
              <div className="text-sm text-gray-600">Prêmios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalPrizeValue}</div>
              <div className="text-sm text-gray-600">Valor Prêmios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.successRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Taxa Sucesso</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar transações..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filters.type}
              onChange={(value) => setFilters(prev => ({ ...prev, type: value as any }))}
              options={[
                { value: 'all', label: 'Todos os tipos' },
                { value: 'ticket_purchase', label: 'Compra de Tickets' },
                { value: 'ticket_refund', label: 'Reembolso' },
                { value: 'prize_claim', label: 'Resgate de Prêmio' },
                { value: 'raffle_win', label: 'Vitórias' }
              ]}
            />
            
            <Select
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}
              options={[
                { value: 'all', label: 'Todos os status' },
                { value: 'pending', label: 'Pendente' },
                { value: 'completed', label: 'Concluído' },
                { value: 'failed', label: 'Falhou' },
                { value: 'cancelled', label: 'Cancelado' }
              ]}
            />
            
            <Select
              value={filters.dateRange}
              onChange={(value) => setFilters(prev => ({ ...prev, dateRange: value as any }))}
              options={[
                { value: 'all', label: 'Todo período' },
                { value: '7d', label: 'Últimos 7 dias' },
                { value: '30d', label: 'Últimos 30 dias' },
                { value: '90d', label: 'Últimos 90 dias' }
              ]}
            />
            
            <AnimatedButton
              onClick={exportToCsv}
              variant="outline"
              className="flex items-center gap-2"
              disabled={filteredTransactions.length === 0}
            >
              <Download className="w-4 h-4" />
              Exportar
            </AnimatedButton>
          </div>
        </div>

        {/* Lista de Transações */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Carregando histórico...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-600 mb-2">❌</div>
                <div className="text-gray-600">{error}</div>
                <Button onClick={loadHistory} className="mt-4">
                  Tentar Novamente
                </Button>
              </div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-gray-400 mb-2">📋</div>
                <div className="text-gray-600">Nenhuma transação encontrada</div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const typeInfo = RaffleHistoryService.getTransactionTypeInfo(transaction.type);
                const statusInfo = RaffleHistoryService.getStatusInfo(transaction.status);
                
                return (
                  <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">{typeInfo.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{typeInfo.label}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} bg-opacity-10`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{transaction.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(transaction.timestamp)}
                            </span>
                            <span>Raffle: {transaction.raffleName}</span>
                            {transaction.ticketCount && (
                              <span>{transaction.ticketCount} ticket(s)</span>
                            )}
                            {transaction.transactionHash && (
                              <span className="font-mono text-xs">
                                {transaction.transactionHash.slice(0, 10)}...
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </div>
                        {transaction.ticketNumbers && transaction.ticketNumbers.length > 0 && (
                          <div className="text-sm text-gray-500 mt-1">
                            Tickets: {transaction.ticketNumbers.slice(0, 3).join(', ')}
                            {transaction.ticketNumbers.length > 3 && ` +${transaction.ticketNumbers.length - 3}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredTransactions.length} de {transactions.length} transações
            </div>
            <AnimatedButton onClick={onClose} variant="outline">
              Fechar
            </AnimatedButton>
          </div>
        </div>
    </Modal>
  );
};

export default RaffleHistoryModal;