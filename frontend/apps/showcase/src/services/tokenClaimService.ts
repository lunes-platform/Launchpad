import type { UserInvestment } from '../types';
import { formatUtils } from '../lib/utils';

// Tipos específicos para o serviço de resgate
interface ClaimTransaction {
  id: string;
  investmentId: string;
  amount: number;
  tokenSymbol: string;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  gasUsed?: number;
  gasFee?: number;
}

interface ClaimValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface ClaimStats {
  totalClaimed: number;
  totalTransactions: number;
  successRate: number;
  averageGasFee: number;
}

/**
 * Serviço responsável pelo resgate de tokens com validações e segurança
 */
export class TokenClaimService {
  /**
   * Valida se o resgate pode ser realizado
   */
  static validateClaim(investment: UserInvestment): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validação básica do investimento
    if (!investment) {
      errors.push('Investimento não encontrado');
      return { isValid: false, errors };
    }

    // Validação do valor disponível para resgate
    const claimableAmount = Number(investment.claimableAmount);
    if (claimableAmount <= 0) {
      errors.push('Não há tokens disponíveis para resgate');
    }

    // Validação do status do investimento
    if (investment.status !== 'confirmed') {
      errors.push('Não é possível resgatar tokens de um investimento não confirmado');
    }

    // Validação do cronograma de vesting
    const hasAvailableVesting = investment.vestingSchedule?.some(
      (vesting: any) => vesting.status === 'pending' && new Date(vesting.date) <= new Date()
    );

    if (!hasAvailableVesting && claimableAmount > 0) {
      // Se há valor disponível mas não há vesting pendente, pode ser um erro de dados
      console.warn('Inconsistência detectada: valor disponível sem vesting correspondente');
    }

    // Validação de segurança: verificar se o investimento tem ID válido
    if (!investment.id) {
      errors.push('ID do investimento não encontrado');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Processa o resgate de tokens
   */
  static async processTokenClaim(investment: UserInvestment): Promise<{
    success: boolean;
    txHash?: string;
    message: string;
    claimedAmount?: number;
  }> {
    // Validação prévia
    const validation = this.validateClaim(investment);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.errors.join(', ')
      };
    }

    const claimableAmount = Number(investment.claimableAmount);

    try {
      // Simulação de confirmação do usuário
      const userConfirmed = await this.requestUserConfirmation(investment, claimableAmount);
      if (!userConfirmed) {
        return {
          success: false,
          message: 'Operação cancelada pelo usuário'
        };
      }

      // Simulação de chamada para API/Blockchain
      const result = await this.executeClaimTransaction(investment, claimableAmount);
      
      if (result.success) {
        // Log da transação para auditoria
        this.logClaimTransaction(investment, result.txHash!, claimableAmount);
        
        return {
          success: true,
          txHash: result.txHash,
          message: `Resgate de ${formatUtils.currency(claimableAmount)} ${investment.tokenSymbol} realizado com sucesso!`,
          claimedAmount: claimableAmount
        };
      } else {
        return {
          success: false,
          message: result.error || 'Erro desconhecido durante o resgate'
        };
      }
    } catch (error) {
      console.error('Erro no processamento do resgate:', error);
      return {
        success: false,
        message: 'Erro interno do sistema. Tente novamente em alguns minutos.'
      };
    }
  }

  /**
   * Solicita confirmação do usuário
   */
  private static async requestUserConfirmation(
    investment: UserInvestment, 
    amount: number
  ): Promise<boolean> {
    const message = `Confirma o resgate de ${formatUtils.currency(amount)} ${investment.tokenSymbol}?\n\n` +
      `Projeto: ${investment.projectName}\n` +
      `Esta operação não pode ser desfeita.`;
    
    return window.confirm(message);
  }

  /**
   * Executa a transação de resgate (simulação)
   */
  private static async executeClaimTransaction(
    investment: UserInvestment, 
    amount: number
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    // Simulação de delay de rede
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    // Simulação de possível falha (5% de chance)
    if (Math.random() < 0.05) {
      return {
        success: false,
        error: 'Falha na comunicação com a blockchain. Tente novamente.'
      };
    }

    // Simulação de transação bem-sucedida
    const txHash = this.generateMockTxHash();
    
    return {
      success: true,
      txHash
    };
  }

  /**
   * Gera um hash de transação simulado
   */
  private static generateMockTxHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  /**
   * Registra a transação para auditoria
   */
  private static logClaimTransaction(
    investment: UserInvestment, 
    txHash: string, 
    amount: number
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      investmentId: investment.id,
      projectName: investment.projectName,
      tokenSymbol: investment.tokenSymbol,
      claimedAmount: amount,
      txHash,
      action: 'TOKEN_CLAIM'
    };

    // Em produção, isso seria enviado para um serviço de logging
    console.log('Token Claim Transaction:', logEntry);
    
    // Salvar no localStorage para demonstração
    const existingLogs = JSON.parse(localStorage.getItem('tokenClaimLogs') || '[]');
    existingLogs.push(logEntry);
    localStorage.setItem('tokenClaimLogs', JSON.stringify(existingLogs));
  }

  /**
   * Obtém o histórico de resgates
   */
  static getClaimHistory(investmentId?: string): any[] {
    const logs = JSON.parse(localStorage.getItem('tokenClaimLogs') || '[]');
    
    if (investmentId) {
      return logs.filter((log: any) => log.investmentId === investmentId);
    }
    
    return logs;
  }

  /**
   * Calcula estatísticas de resgate
   */
  static getClaimStats(investments: UserInvestment[]): {
    totalClaimable: number;
    totalClaimed: number;
    pendingClaims: number;
    nextClaimDate?: Date;
  } {
    let totalClaimable = 0;
    let totalClaimed = 0;
    let pendingClaims = 0;
    let nextClaimDate: Date | undefined;

    investments.forEach(investment => {
      totalClaimable += Number(investment.claimableAmount);
      
      investment.vestingSchedule?.forEach((vesting: any) => {
        if (vesting.status === 'claimed') {
          totalClaimed += Number(vesting.amount);
        } else if (vesting.status === 'pending') {
          pendingClaims += Number(vesting.amount);
          const vestingDate = new Date(vesting.date);
          if (!nextClaimDate || vestingDate < nextClaimDate) {
            nextClaimDate = vestingDate;
          }
        }
      });
    });

    return {
      totalClaimable,
      totalClaimed,
      pendingClaims,
      nextClaimDate
    };
  }
}

export default TokenClaimService;