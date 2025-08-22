import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '../contexts/WalletContext';
import { usePolkadotApi } from './usePolkadotApi';
import { useAuth } from '../contexts/AuthContext';
import { useRaffleStore } from '../stores/raffleStore';
import type { Raffle } from '../stores/raffleStore';

/**
 * Interface para dados de compra de tickets
 */
interface PurchaseTicketsData {
  raffleId: string;
  quantity: number;
  totalAmount: string;
  currency: 'LUNES' | 'LUSDT';
  userAddress: string;
}

/**
 * Interface para resultado da compra
 */
interface PurchaseResult {
  success: boolean;
  transactionHash?: string;
  ticketNumbers?: number[];
  error?: string;
}

/**
 * Interface para validação de compra
 */
interface PurchaseValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Hook personalizado para gerenciar compras de tickets de raffle
 * Integra o sistema de pagamento multi-chain com validações e transações
 */
export const useRafflePurchase = () => {
  const { user, isVip, isVerified } = useAuth();
  const { selectedAccount, isReady } = useWallet();
  const { transfer, getBalance, isConnected: apiConnected } = usePolkadotApi();
  const { canPurchaseTickets } = useRaffleStore();
  const queryClient = useQueryClient();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  /**
   * Valida se a compra pode ser realizada
   */
  const validatePurchase = useCallback(
    (raffle: Raffle, quantity: number): PurchaseValidation => {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Verificar autenticação
      if (!user) {
        errors.push('Usuário não autenticado');
      }

      // Verificar conexão da carteira
      if (!isReady || !selectedAccount) {
        errors.push('Carteira não conectada');
      }

      // Verificar conexão da API
      if (!apiConnected) {
        errors.push('Conexão com a blockchain não estabelecida');
      }

      // Verificar status do raffle
      if (raffle.status !== 'active') {
        errors.push('Raffle não está ativo para compras');
      }

      // Verificar datas
      const now = new Date();
      if (now < raffle.startDate) {
        errors.push('Raffle ainda não iniciou');
      }
      if (now > raffle.endDate) {
        errors.push('Raffle já encerrou');
      }

      // Verificar elegibilidade VIP
      if (raffle.vipOnly && user && !isVip) {
        errors.push('Este raffle é exclusivo para membros VIP');
      }

      // Verificar KYC
      if (raffle.requiresKyc && user && !isVerified) {
        errors.push('KYC obrigatório para participar deste raffle');
      }

      // Verificar quantidade
      if (quantity <= 0) {
        errors.push('Quantidade deve ser maior que zero');
      }

      if (quantity > raffle.maxTicketsPerUser) {
        errors.push(`Máximo de ${raffle.maxTicketsPerUser} tickets por usuário`);
      }

      // Verificar disponibilidade
      const availableTickets = raffle.maxTickets - raffle.soldTickets;
      if (quantity > availableTickets) {
        errors.push(`Apenas ${availableTickets} tickets disponíveis`);
      }

      // Verificar usando a lógica do store
      if (!canPurchaseTickets(raffle.id, quantity)) {
        errors.push('Não é possível comprar essa quantidade de tickets');
      }

      // Avisos
      if (quantity > 10) {
        warnings.push('Comprando uma grande quantidade de tickets');
      }

      const totalCost = quantity * raffle.ticketPrice;
      if (totalCost > 1000) {
        warnings.push('Valor alto da transação - verifique antes de confirmar');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    },
    [user, isVip, isVerified, isReady, selectedAccount, apiConnected, canPurchaseTickets]
  );

  /**
   * Calcula o valor total da compra
   */
  const calculateTotalAmount = useCallback(
    (raffle: Raffle, quantity: number): string => {
      const totalCost = quantity * raffle.ticketPrice;
      // Converter para unidades da blockchain (assumindo 12 decimais)
      return (totalCost * Math.pow(10, 12)).toString();
    },
    []
  );

  /**
   * Processa a compra de tickets via smart contract
   */
  const processPurchase = useCallback(
    async (purchaseData: PurchaseTicketsData): Promise<PurchaseResult> => {
      if (!selectedAccount || !isReady) {
        throw new Error('Carteira não conectada');
      }

      try {
        setIsProcessing(true);
        setValidationErrors([]);

        // TODO: Implementar chamada para o smart contract
        // Por enquanto, simular a transação
        console.log('🔄 Processando compra de tickets:', purchaseData);
        
        // Simular delay da transação
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Simular sucesso/falha (90% de sucesso)
        const success = Math.random() > 0.1;
        
        if (!success) {
          throw new Error('Falha na transação blockchain');
        }

        // Simular hash da transação
        const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        
        // Simular números dos tickets
        const ticketNumbers = Array.from(
          { length: purchaseData.quantity },
          (_, i) => Math.floor(Math.random() * 10000) + 1
        );

        console.log('✅ Compra processada com sucesso:', {
          transactionHash,
          ticketNumbers,
        });

        return {
          success: true,
          transactionHash,
          ticketNumbers,
        };
      } catch (error) {
        console.error('❌ Erro ao processar compra:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        };
      } finally {
        setIsProcessing(false);
      }
    },
    [selectedAccount, isReady]
  );

  /**
   * Mutation para compra de tickets
   */
  const purchaseTicketsMutation = useMutation({
    mutationFn: processPurchase,
    onSuccess: (result, variables) => {
      if (result.success) {
        // Invalidar queries relacionadas para atualizar a UI
        queryClient.invalidateQueries({
          queryKey: ['raffles'],
        });
        queryClient.invalidateQueries({
          queryKey: ['user-tickets', variables.userAddress],
        });
        queryClient.invalidateQueries({
          queryKey: ['raffle', variables.raffleId],
        });
      }
    },
    onError: (error) => {
      console.error('Erro na mutation de compra:', error);
      setValidationErrors([error instanceof Error ? error.message : 'Erro na compra']);
    },
  });

  /**
   * Função principal para comprar tickets
   */
  const purchaseTickets = useCallback(
    async (raffle: Raffle, quantity: number): Promise<PurchaseResult> => {
      // Validar compra
      const validation = validatePurchase(raffle, quantity);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return {
          success: false,
          error: validation.errors.join(', '),
        };
      }

      // Preparar dados da compra
      const totalAmount = calculateTotalAmount(raffle, quantity);
      const purchaseData: PurchaseTicketsData = {
        raffleId: raffle.id,
        quantity,
        totalAmount,
        currency: raffle.ticketCurrency,
        userAddress: selectedAccount?.address || '',
      };

      // Executar compra
      return await purchaseTicketsMutation.mutateAsync(purchaseData);
    },
    [validatePurchase, calculateTotalAmount, selectedAccount, purchaseTicketsMutation]
  );

  /**
   * Verificar saldo do usuário
   */
  const checkUserBalance = useCallback(
    async (raffle: Raffle, quantity: number): Promise<{ hasBalance: boolean; currentBalance?: string }> => {
      if (!selectedAccount || !isReady) {
        return { hasBalance: false };
      }

      try {
        const balance = await getBalance(selectedAccount.address);
        const requiredAmount = quantity * raffle.ticketPrice;
        
        // TODO: Implementar conversão correta de unidades
        // Por enquanto, assumir que tem saldo suficiente se balance existe
        return {
          hasBalance: !!balance,
          currentBalance: balance || '0',
        };
      } catch (error) {
        console.error('Erro ao verificar saldo:', error);
        return { hasBalance: false };
      }
    },
    [selectedAccount, isReady, getBalance]
  );

  return {
    // Estados
    isProcessing,
    validationErrors,
    isLoading: purchaseTicketsMutation.isPending,
    
    // Funções principais
    purchaseTickets,
    validatePurchase,
    checkUserBalance,
    calculateTotalAmount,
    
    // Utilitários
    clearErrors: () => setValidationErrors([]),
    
    // Estados da mutation
    isSuccess: purchaseTicketsMutation.isSuccess,
    isError: purchaseTicketsMutation.isError,
    error: purchaseTicketsMutation.error,
    data: purchaseTicketsMutation.data,
    reset: purchaseTicketsMutation.reset,
  };
};

export default useRafflePurchase;