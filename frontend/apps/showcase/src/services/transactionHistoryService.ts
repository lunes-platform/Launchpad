import type { UserInvestment } from '../types';

/**
 * Tipos de transações disponíveis no sistema
 */
export type TransactionType = 
  | 'investment' 
  | 'claim' 
  | 'vesting_unlock' 
  | 'transfer' 
  | 'refund' 
  | 'penalty';

/**
 * Status das transações
 */
export type TransactionStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'failed' 
  | 'cancelled';

/**
 * Interface para uma transação no histórico
 */
export interface TransactionHistoryItem {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  tokenSymbol: string;
  timestamp: string;
  txHash?: string;
  description: string;
  fee?: string;
  blockNumber?: number;
  confirmations?: number;
}

/**
 * Estatísticas do histórico de transações
 */
export interface TransactionStats {
  totalTransactions: number;
  totalInvested: string;
  totalClaimed: string;
  pendingClaims: number;
  successRate: number;
}

/**
 * Serviço para gerenciar histórico de transações
 */
export class TransactionHistoryService {
  /**
   * Gera histórico completo de transações para um investimento
   */
  static generateTransactionHistory(investment: UserInvestment): TransactionHistoryItem[] {
    const transactions: TransactionHistoryItem[] = [];

    // Transação inicial de investimento
    transactions.push({
      id: `inv_${investment.id}`,
      type: 'investment',
      status: 'confirmed',
      amount: investment.amount,
      tokenSymbol: investment.token,
      timestamp: investment.timestamp,
      txHash: investment.txHash,
      description: `Investimento inicial em ${investment.projectName}`,
      fee: '0.001',
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      confirmations: 50
    });

    // Transações de vesting (claims realizados)
    if (investment.vestingSchedule) {
      investment.vestingSchedule
        .filter(item => item.claimed)
        .forEach((item, index) => {
          transactions.push({
            id: `claim_${investment.id}_${index}`,
            type: 'claim',
            status: 'confirmed',
            amount: item.amount,
            tokenSymbol: investment.tokenSymbol,
            timestamp: typeof item.date === 'string' ? item.date : item.date.toISOString(),
            txHash: this.generateTxHash(),
            description: `Resgate de tokens do vesting - Período ${index + 1}`,
            fee: '0.0005',
            blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
            confirmations: 25
          });
        });
    }

    // Transações de vesting desbloqueado (mas não resgatado)
    if (investment.vestingSchedule) {
      investment.vestingSchedule
        .filter(item => !item.claimed && new Date(item.date) <= new Date())
        .forEach((item, index) => {
          transactions.push({
            id: `unlock_${investment.id}_${index}`,
            type: 'vesting_unlock',
            status: 'pending',
            amount: item.amount,
            tokenSymbol: investment.tokenSymbol,
            timestamp: typeof item.date === 'string' ? item.date : item.date.toISOString(),
            description: `Tokens desbloqueados - Disponível para resgate`,
            confirmations: 0
          });
        });
    }

    // Simular algumas transações adicionais para demonstração
    if (Math.random() > 0.7) {
      transactions.push({
        id: `transfer_${investment.id}`,
        type: 'transfer',
        status: 'confirmed',
        amount: (parseFloat(investment.amount) * 0.1).toString(),
        tokenSymbol: investment.tokenSymbol,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        txHash: this.generateTxHash(),
        description: 'Transferência parcial de tokens',
        fee: '0.0003',
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        confirmations: 15
      });
    }

    // Ordenar por timestamp (mais recente primeiro)
    return transactions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Calcula estatísticas do histórico de transações
   */
  static calculateTransactionStats(transactions: TransactionHistoryItem[]): TransactionStats {
    const totalTransactions = transactions.length;
    
    const totalInvested = transactions
      .filter(tx => tx.type === 'investment')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
      .toString();

    const totalClaimed = transactions
      .filter(tx => tx.type === 'claim' && tx.status === 'confirmed')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
      .toString();

    const pendingClaims = transactions
      .filter(tx => tx.type === 'vesting_unlock' && tx.status === 'pending')
      .length;

    const confirmedTransactions = transactions
      .filter(tx => tx.status === 'confirmed').length;
    
    const successRate = totalTransactions > 0 
      ? (confirmedTransactions / totalTransactions) * 100 
      : 0;

    return {
      totalTransactions,
      totalInvested,
      totalClaimed,
      pendingClaims,
      successRate: Math.round(successRate * 100) / 100
    };
  }

  /**
   * Filtra transações por tipo
   */
  static filterByType(transactions: TransactionHistoryItem[], type: TransactionType): TransactionHistoryItem[] {
    return transactions.filter(tx => tx.type === type);
  }

  /**
   * Filtra transações por status
   */
  static filterByStatus(transactions: TransactionHistoryItem[], status: TransactionStatus): TransactionHistoryItem[] {
    return transactions.filter(tx => tx.status === status);
  }

  /**
   * Busca transações por período
   */
  static filterByDateRange(
    transactions: TransactionHistoryItem[], 
    startDate: string, 
    endDate: string
  ): TransactionHistoryItem[] {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return transactions.filter(tx => {
      const txDate = new Date(tx.timestamp).getTime();
      return txDate >= start && txDate <= end;
    });
  }

  /**
   * Gera um hash de transação simulado
   */
  private static generateTxHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  /**
   * Obtém ícone e cor para cada tipo de transação
   */
  static getTransactionTypeInfo(type: TransactionType): { icon: string; color: string; bgColor: string } {
    const typeMap = {
      investment: { icon: '💰', color: 'text-blue-600', bgColor: 'bg-blue-100' },
      claim: { icon: '✅', color: 'text-green-600', bgColor: 'bg-green-100' },
      vesting_unlock: { icon: '🔓', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      transfer: { icon: '↗️', color: 'text-purple-600', bgColor: 'bg-purple-100' },
      refund: { icon: '↩️', color: 'text-orange-600', bgColor: 'bg-orange-100' },
      penalty: { icon: '⚠️', color: 'text-red-600', bgColor: 'bg-red-100' }
    };

    return typeMap[type] || { icon: '📄', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  }

  /**
   * Obtém informações de status da transação
   */
  static getStatusInfo(status: TransactionStatus): { label: string; color: string } {
    const statusMap = {
      pending: { label: 'Pendente', color: 'text-yellow-600' },
      confirmed: { label: 'Confirmado', color: 'text-green-600' },
      failed: { label: 'Falhou', color: 'text-red-600' },
      cancelled: { label: 'Cancelado', color: 'text-gray-600' }
    };

    return statusMap[status] || { label: 'Desconhecido', color: 'text-gray-600' };
  }
}