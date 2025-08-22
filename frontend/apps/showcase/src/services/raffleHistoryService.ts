import type { Raffle, RaffleTicket } from '../stores/raffleStore';

/**
 * Tipos de transação de raffle
 */
export type RaffleTransactionType = 
  | 'ticket_purchase'
  | 'ticket_refund'
  | 'prize_claim'
  | 'raffle_entry'
  | 'raffle_win'
  | 'raffle_loss';

/**
 * Status da transação de raffle
 */
export type RaffleTransactionStatus = 
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

/**
 * Item do histórico de transações de raffle
 */
export interface RaffleTransactionItem {
  id: string;
  type: RaffleTransactionType;
  status: RaffleTransactionStatus;
  raffleId: string;
  raffleName: string;
  amount: number;
  currency: 'LUNES' | 'LUSDT';
  ticketCount?: number;
  ticketNumbers?: number[];
  prizeId?: string;
  prizeName?: string;
  transactionHash?: string;
  timestamp: string;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * Estatísticas do histórico de raffles
 */
export interface RaffleStats {
  totalTransactions: number;
  totalTicketsPurchased: number;
  totalAmountSpent: string;
  totalPrizesWon: number;
  totalPrizeValue: string;
  totalPrizesClaimed: number;
  activeRaffles: number;
  successRate: number;
}

/**
 * Serviço para gerenciar histórico de transações de raffle
 */
export class RaffleHistoryService {
  /**
   * Gera histórico de transações de raffle para um usuário
   */
  static generateRaffleHistory(userTickets: RaffleTicket[], raffles: Raffle[]): RaffleTransactionItem[] {
    const transactions: RaffleTransactionItem[] = [];

    // Agrupar tickets por raffle e data de compra
    const ticketsByRaffle = userTickets.reduce((acc, ticket) => {
      const key = `${ticket.raffleId}_${ticket.purchaseDate}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(ticket);
      return acc;
    }, {} as Record<string, RaffleTicket[]>);

    // Criar transações de compra de tickets
    Object.entries(ticketsByRaffle).forEach(([key, tickets]) => {
      const firstTicket = tickets[0];
      const raffle = raffles.find(r => r.id === firstTicket.raffleId);
      
      if (!raffle) return;

      const totalAmount = tickets.length * raffle.ticketPrice;
      const ticketNumbers = tickets.map(t => t.ticketNumber).sort((a, b) => a - b);

      transactions.push({
        id: `purchase_${key}`,
        type: 'ticket_purchase',
        status: 'completed',
        raffleId: raffle.id,
        raffleName: raffle.title,
        ticketCount: tickets.length,
        ticketNumbers,
        amount: totalAmount,
        currency: 'LUNES',
        timestamp: firstTicket.purchaseDate,
        transactionHash: this.generateTxHash(),
        description: `Compra de ${tickets.length} ticket${tickets.length > 1 ? 's' : ''} - ${raffle.title}`
      });
    });

    // Simular algumas transações de prêmios (para demonstração)
    if (Math.random() > 0.8) {
      const randomRaffle = raffles[Math.floor(Math.random() * raffles.length)];
      if (randomRaffle && randomRaffle.prizes.length > 0) {
        const randomPrize = randomRaffle.prizes[Math.floor(Math.random() * randomRaffle.prizes.length)];
        
        transactions.push({
          id: `prize_${randomRaffle.id}_${randomPrize.id}`,
          type: 'prize_claim',
          status: 'completed',
          raffleId: randomRaffle.id,
          raffleName: randomRaffle.title,
          prizeId: randomPrize.id,
          prizeName: randomPrize.name,
          amount: randomPrize.value,
          currency: 'LUNES',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          transactionHash: this.generateTxHash(),
          description: `Prêmio ganho: ${randomPrize.name}`
        });
      }
    }

    // Ordenar por timestamp (mais recente primeiro)
    return transactions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Calcula estatísticas do histórico de raffles
   */
  static calculateRaffleStats(transactions: RaffleTransactionItem[], activeRaffles: Raffle[]): RaffleStats {
    const totalTransactions = transactions.length;
    
    const purchaseTransactions = transactions.filter(tx => tx.type === 'ticket_purchase');
    const totalTicketsPurchased = purchaseTransactions.reduce(
      (sum, tx) => sum + (tx.ticketCount || 0), 0
    );
    
    const totalAmountSpent = purchaseTransactions.reduce(
      (sum, tx) => sum + tx.amount, 0
    ).toString();

    const prizeTransactions = transactions.filter(tx => tx.type === 'prize_claim');
    const totalPrizesWon = prizeTransactions.length;
    
    const totalPrizeValue = prizeTransactions.reduce(
      (sum, tx) => sum + tx.amount, 0
    ).toString();

    const confirmedTransactions = transactions.filter(tx => tx.status === 'completed').length;
    const successRate = totalTransactions > 0 
      ? (confirmedTransactions / totalTransactions) * 100 
      : 0;

    return {
      totalTransactions,
      totalTicketsPurchased,
      totalAmountSpent,
      totalPrizesWon,
      totalPrizeValue,
      totalPrizesClaimed: prizeTransactions.filter(tx => tx.status === 'completed').length,
      activeRaffles: activeRaffles.filter(r => r.status === 'active').length,
      successRate: Math.round(successRate * 100) / 100
    };
  }

  /**
   * Filtra transações por tipo
   */
  static filterByType(transactions: RaffleTransactionItem[], type: RaffleTransactionType): RaffleTransactionItem[] {
    return transactions.filter(tx => tx.type === type);
  }

  /**
   * Filtra transações por status
   */
  static filterByStatus(transactions: RaffleTransactionItem[], status: RaffleTransactionStatus): RaffleTransactionItem[] {
    return transactions.filter(tx => tx.status === status);
  }

  /**
   * Filtra transações por raffle
   */
  static filterByRaffle(transactions: RaffleTransactionItem[], raffleId: string): RaffleTransactionItem[] {
    return transactions.filter(tx => tx.raffleId === raffleId);
  }

  /**
   * Busca transações por período
   */
  static filterByDateRange(
    transactions: RaffleTransactionItem[], 
    startDate: string, 
    endDate: string
  ): RaffleTransactionItem[] {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return transactions.filter(tx => {
      const txDate = new Date(tx.timestamp).getTime();
      return txDate >= start && txDate <= end;
    });
  }

  /**
   * Gera hash de transação simulado
   */
  private static generateTxHash(): string {
    return `0x${Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;
  }

  /**
   * Obtém informações de tipo da transação
   */
  static getTransactionTypeInfo(type: RaffleTransactionType): { label: string; icon: string; color: string } {
    const typeMap = {
      ticket_purchase: { label: 'Compra de Tickets', icon: '🎫', color: 'text-blue-600' },
      ticket_refund: { label: 'Reembolso de Tickets', icon: '↩️', color: 'text-orange-600' },
      prize_claim: { label: 'Prêmio Resgatado', icon: '🏆', color: 'text-green-600' },
      raffle_entry: { label: 'Entrada no Raffle', icon: '🎯', color: 'text-purple-600' },
      raffle_win: { label: 'Vitória no Raffle', icon: '🎉', color: 'text-green-600' },
      raffle_loss: { label: 'Não Contemplado', icon: '😔', color: 'text-gray-600' }
    };

    return typeMap[type] || { label: 'Desconhecido', icon: '❓', color: 'text-gray-600' };
  }

  /**
   * Obtém informações de status da transação
   */
  static getStatusInfo(status: RaffleTransactionStatus): { label: string; color: string } {
    const statusMap = {
      pending: { label: 'Pendente', color: 'text-yellow-600' },
      completed: { label: 'Concluído', color: 'text-green-600' },
      refunded: { label: 'Reembolsado', color: 'text-orange-600' },
      failed: { label: 'Falhou', color: 'text-red-600' },
      cancelled: { label: 'Cancelado', color: 'text-gray-600' }
    };

    return statusMap[status] || { label: 'Desconhecido', color: 'text-gray-600' };
  }

  /**
   * Formata números de tickets para exibição
   */
  static formatTicketNumbers(ticketNumbers: number[]): string {
    if (!ticketNumbers || ticketNumbers.length === 0) return '';
    
    if (ticketNumbers.length === 1) {
      return `#${ticketNumbers[0]}`;
    }
    
    if (ticketNumbers.length <= 3) {
      return ticketNumbers.map(n => `#${n}`).join(', ');
    }
    
    return `#${ticketNumbers[0]}, #${ticketNumbers[1]}, ... (+${ticketNumbers.length - 2} mais)`;
  }

  /**
   * Formata informações para exibição
   */
  static formatDisplayInfo(transaction: RaffleTransactionItem): {
    typeLabel: string;
    statusLabel: string;
    amountDisplay: string;
  } {
    const typeLabels: Record<RaffleTransactionType, string> = {
      ticket_purchase: 'Compra de Ticket',
      ticket_refund: 'Reembolso de Ticket',
      prize_claim: 'Prêmio Resgatado',
      raffle_entry: 'Entrada no Raffle',
      raffle_win: 'Prêmio Ganho',
      raffle_loss: 'Raffle Perdido'
    };

    const statusLabels: Record<RaffleTransactionStatus, string> = {
      pending: 'Pendente',
      completed: 'Concluído',
      failed: 'Falhou',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado'
    };

    return {
      typeLabel: typeLabels[transaction.type],
      statusLabel: statusLabels[transaction.status],
      amountDisplay: `${transaction.amount} ${transaction.currency}`
    };
  }

  /**
   * Exporta transações para CSV
   */
  static exportToCsv(transactions: RaffleTransactionItem[], filename: string = 'raffle-history.csv'): void {
    const headers = [
      'Data',
      'Tipo',
      'Status',
      'Raffle',
      'Quantidade de Tickets',
      'Valor',
      'Moeda',
      'Hash da Transação'
    ];

    const csvContent = [
      headers.join(','),
      ...transactions.map(transaction => [
        new Date(transaction.timestamp).toLocaleDateString('pt-BR'),
        this.formatDisplayInfo(transaction).typeLabel,
        this.formatDisplayInfo(transaction).statusLabel,
        transaction.raffleName,
        (transaction.ticketCount || 0).toString(),
        transaction.amount.toString(),
        transaction.currency,
        transaction.transactionHash || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}