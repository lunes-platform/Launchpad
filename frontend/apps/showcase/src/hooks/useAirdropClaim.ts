import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import type { AirdropRecord } from './useAirdrops';

/**
 * Interface para resultado do claim
 */
export interface ClaimResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  claimedAmount?: number;
}

/**
 * Interface para dados do claim
 */
export interface ClaimData {
  airdropId: string;
  projectId: string;
  userAddress: string;
  tokenAmount: number;
}

/**
 * Serviço para interagir com smart contracts de airdrop
 * Em produção, este serviço faria chamadas reais para os contratos
 */
class AirdropClaimService {
  /**
   * Simula o claim de tokens de airdrop
   * Em produção, interagiria com o smart contract real
   */
  async claimAirdrop(claimData: ClaimData): Promise<ClaimResult> {
    try {
      // Simula delay de transação blockchain
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simula validações do smart contract
      if (!claimData.userAddress) {
        throw new Error('Endereço da carteira não encontrado');
      }
      
      if (claimData.tokenAmount <= 0) {
        throw new Error('Quantidade de tokens inválida');
      }
      
      // Simula chance de falha (10%)
      if (Math.random() < 0.1) {
        throw new Error('Falha na transação blockchain. Tente novamente.');
      }
      
      // Simula hash de transação
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      return {
        success: true,
        transactionHash,
        claimedAmount: claimData.tokenAmount,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido no claim',
      };
    }
  }
  
  /**
   * Verifica se o usuário já fez claim de um airdrop específico
   * Em produção, consultaria o smart contract
   */
  async hasUserClaimed(airdropId: string, userAddress: string): Promise<boolean> {
    // Simula consulta ao blockchain
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Por enquanto, retorna false (usuário nunca fez claim)
    // Em produção, consultaria o estado do contrato
    return false;
  }
  
  /**
   * Obtém o saldo de tokens do airdrop que o usuário pode clamar
   * Em produção, consultaria o smart contract
   */
  async getClaimableBalance(airdropId: string, userAddress: string): Promise<number> {
    // Simula consulta ao blockchain
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Por enquanto, retorna um valor mockado
    // Em produção, consultaria o contrato para obter o saldo real
    return Math.floor(Math.random() * 1000) + 100;
  }
}

// Instância singleton do serviço
const airdropClaimService = new AirdropClaimService();

/**
 * Hook para gerenciar o claim de airdrops
 */
export function useAirdropClaim() {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const queryClient = useQueryClient();
  
  /**
   * Mutation para fazer claim de airdrop
   */
  const claimMutation = useMutation({
    mutationFn: async (airdrop: AirdropRecord): Promise<ClaimResult> => {
      if (!isAuthenticated || !user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Verifica se o airdrop pode ser reivindicado
      if (airdrop.status !== 'available') {
        throw new Error('Airdrop não está disponível para claim');
      }
      
      const now = new Date();
      if (airdrop.eligibilityDate && now < airdrop.eligibilityDate) {
        throw new Error('Período de elegibilidade ainda não iniciou');
      }
      
      if (now > airdrop.claimDeadline) {
        throw new Error('Prazo para claim expirado');
      }
      
      // Verifica se o usuário já fez claim
      const hasClaimed = await airdropClaimService.hasUserClaimed(airdrop.id, user.walletAddress);
      if (hasClaimed) {
        throw new Error('Você já reivindicou este airdrop');
      }
      
      // Executa o claim
      const claimData: ClaimData = {
        airdropId: airdrop.id,
        projectId: airdrop.id,
        userAddress: user.walletAddress,
        tokenAmount: airdrop.tokenAmount,
      };
      
      return await airdropClaimService.claimAirdrop(claimData);
    },
    onSuccess: (result, airdrop) => {
      if (result.success) {
        showSuccess(
          'Claim realizado com sucesso!',
          `${result.claimedAmount} ${airdrop.tokenSymbol} reivindicados.`
        );
        
        // Invalida cache para atualizar a lista de airdrops
        queryClient.invalidateQueries({ queryKey: ['airdrops'] });
        queryClient.invalidateQueries({ queryKey: ['airdrop-configs'] });
        queryClient.invalidateQueries({ queryKey: ['user-investments'] });
      } else {
        showError('Erro no claim', result.error || 'Erro no claim do airdrop');
      }
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      showError('Erro no claim', errorMessage);
    },
  });
  
  /**
   * Função para iniciar o processo de claim
   */
  const claimAirdrop = (airdrop: AirdropRecord) => {
    if (!isAuthenticated || !user) {
      showError('Usuário não autenticado', 'Faça login para reivindicar o airdrop');
      return;
    }
    
    claimMutation.mutate(airdrop);
  };
  
  /**
   * Verifica se um airdrop pode ser reivindicado
   */
  const canClaim = (airdrop: AirdropRecord): boolean => {
    if (!isAuthenticated || !user) return false;
    if (airdrop.status !== 'available') return false;
    
    const now = new Date();
    if (airdrop.eligibilityDate && now < airdrop.eligibilityDate) return false;
    if (now > airdrop.claimDeadline) return false;
    
    return true;
  };
  
  /**
   * Obtém a mensagem de status para um airdrop
   */
  const getClaimStatusMessage = (airdrop: AirdropRecord): string => {
    if (!isAuthenticated || !user) {
      return 'Faça login para continuar';
    }
    
    const now = new Date();
    
    switch (airdrop.status) {
      case 'not_eligible':
        return 'Não elegível';
      case 'upcoming':
        return `Disponível em ${airdrop.daysUntilEligible} dias`;
      case 'expired':
        return 'Prazo expirado';
      case 'claimed':
        return 'Já reivindicado';
      case 'available':
        if (airdrop.eligibilityDate && now < airdrop.eligibilityDate) {
          return `Disponível em ${airdrop.daysUntilEligible} dias`;
        }
        return 'Disponível para claim';
      default:
        return 'Status desconhecido';
    }
  };
  
  return {
    claimAirdrop,
    canClaim,
    getClaimStatusMessage,
    isLoading: claimMutation.isPending,
    error: claimMutation.error,
    lastResult: claimMutation.data,
  };
}

/**
 * Hook para verificar status de claim de múltiplos airdrops
 */
export function useAirdropClaimStatus(airdrops: AirdropRecord[]) {
  const { user, isAuthenticated } = useAuth();
  
  // Em produção, faria consultas em batch para otimizar
  const checkClaimStatus = async () => {
    if (!isAuthenticated || !user) return {};
    
    const statusMap: Record<string, boolean> = {};
    
    for (const airdrop of airdrops) {
      try {
        const hasClaimed = await airdropClaimService.hasUserClaimed(airdrop.id, user.walletAddress);
        statusMap[airdrop.id] = hasClaimed;
      } catch (error) {
        console.error(`Erro ao verificar status do airdrop ${airdrop.id}:`, error);
        statusMap[airdrop.id] = false;
      }
    }
    
    return statusMap;
  };
  
  return {
    checkClaimStatus,
  };
}

export { airdropClaimService };