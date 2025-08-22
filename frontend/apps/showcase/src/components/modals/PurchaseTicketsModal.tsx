import React, { useState, useEffect } from 'react';
import { Ticket, DollarSign, AlertCircle, CheckCircle, Minus, Plus, Crown, History } from 'lucide-react';
import { Button, AnimatedButton, Input, Modal } from '@launchpad/shared-ui';
import { useRaffleStore } from '../../stores/raffleStore';
import { useRafflePurchase } from '../../hooks/useRafflePurchase';
import type { Raffle } from '../../stores/raffleStore';
import { useAuth } from '../../contexts/AuthContext';
import { isVipUser } from '../../types/auth';
import { RaffleHistoryModal } from '../RaffleHistoryModal';

interface PurchaseTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffle: Raffle;
}

interface VipEligibilityError {
  type: 'vip_required' | 'not_authenticated';
  message: string;
  actionText: string;
  actionHref: string;
}

/**
 * Modal para compra de tickets de raffle
 * Inclui validações de elegibilidade VIP e controle de quantidade
 */
export const PurchaseTicketsModal: React.FC<PurchaseTicketsModalProps> = ({
  isOpen,
  onClose,
  raffle
}) => {
  const { user } = useAuth();
  const { purchaseTickets } = useRaffleStore();
  const { purchaseTickets: purchaseHook, isLoading, error: purchaseError } = useRafflePurchase();
  
  const [quantity, setQuantity] = useState(1);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [vipError, setVipError] = useState<VipEligibilityError | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Validação de elegibilidade VIP
  useEffect(() => {
    if (!isOpen) return;

    if (raffle.vipOnly) {
      if (!user) {
        setVipError({
          type: 'not_authenticated',
          message: 'Você precisa estar conectado para participar de raffles VIP.',
          actionText: 'Conectar Carteira',
          actionHref: '/connect'
        });
        return;
      }

      if (!isVipUser(user)) {
        setVipError({
          type: 'vip_required',
          message: 'Este raffle é exclusivo para membros VIP. Faça staking de LUNES para se tornar VIP.',
          actionText: 'Fazer Staking',
          actionHref: '/staking'
        });
        return;
      }
    }

    setVipError(null);
  }, [isOpen, raffle.vipOnly, user]);

  // Reset do estado quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setLocalError(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  // Cálculos
  const maxTicketsAvailable = raffle.maxTickets - raffle.soldTickets;
  const maxTicketsPerUser = Math.min(100, maxTicketsAvailable); // Limite de 100 tickets por transação
  const totalCost = quantity * raffle.ticketPrice;
  const winChance = (quantity / raffle.maxTickets) * 100;

  // Formatação de moeda
  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  // Handlers
  const handleQuantityChange = (newQuantity: number) => {
    const clampedQuantity = Math.max(1, Math.min(newQuantity, maxTicketsPerUser));
    setQuantity(clampedQuantity);
    setLocalError(null);
  };

  const handleQuickSelect = (amount: number) => {
    handleQuantityChange(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    handleQuantityChange(value);
  };

  const handlePurchase = async () => {
    if (!user) {
      setLocalError('Você precisa conectar sua carteira para comprar tickets.');
      return;
    }

    if (vipError) {
      return; // Não permite compra se há erro de elegibilidade VIP
    }

    if (quantity > maxTicketsAvailable) {
      setLocalError(`Apenas ${maxTicketsAvailable} tickets disponíveis.`);
      return;
    }

    try {
      setLocalError(null);
      setSuccessMessage(null);
      
      await purchaseHook(raffle, quantity);

      // Atualizar o store local
      purchaseTickets(raffle.id, quantity);
      
      setSuccessMessage(`Parabéns! Você comprou ${quantity} ticket${quantity > 1 ? 's' : ''} com sucesso!`);
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Erro ao comprar tickets:', err);
      setLocalError(err instanceof Error ? err.message : 'Erro inesperado. Verifique sua conexão e tente novamente.');
    }
  };

  const modalTitle = (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        raffle.vipOnly 
          ? 'bg-gradient-to-r from-roxo to-dourado' 
          : 'bg-gradient-to-r from-roxo to-roxo-escuro'
      }`}>
        {raffle.vipOnly ? (
          <Crown className="w-5 h-5 text-white" />
        ) : (
          <Ticket className="w-5 h-5 text-white" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">
            Comprar Tickets
          </span>
          {raffle.vipOnly && (
            <span className="px-2 py-1 bg-gradient-to-r from-roxo to-dourado text-white text-xs font-semibold rounded-full">
              VIP
            </span>
          )}
        </div>
        <p className="text-sm text-grafite-400">
          {raffle.title}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Modal 
         isOpen={isOpen} 
         onClose={onClose} 
         size="md"
         title="Comprar Tickets"
       >
        <div className="space-y-6">
          {/* Informações do Raffle */}
          <div className="bg-grafite-50 dark:bg-grafite-700/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-grafite-600 dark:text-grafite-400">Preço por ticket:</span>
              <span className="font-semibold text-grafite-900 dark:text-white">
                {formatCurrency(raffle.ticketPrice, raffle.ticketCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-grafite-600 dark:text-grafite-400">Tickets disponíveis:</span>
              <span className="font-semibold text-grafite-900 dark:text-white">
                {maxTicketsAvailable.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-grafite-600 dark:text-grafite-400">Prêmio total:</span>
              <span className="font-semibold text-dourado dark:text-dourado-claro">
                {formatCurrency(raffle.totalPrizePool, raffle.ticketCurrency)}
              </span>
            </div>
          </div>

          {/* Aviso de Elegibilidade VIP */}
          {vipError && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                    {vipError.message}
                  </p>
                  <Button
                    onClick={() => window.location.href = vipError.actionHref}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
          {/* Cabeçalho Personalizado */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              raffle.vipOnly 
                ? 'bg-gradient-to-r from-roxo to-dourado' 
                : 'bg-gradient-to-r from-roxo to-roxo-escuro'
            }`}>
              {raffle.vipOnly ? (
                <Crown className="w-5 h-5 text-white" />
              ) : (
                <Ticket className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">
                  Comprar Tickets
                </span>
                {raffle.vipOnly && (
                  <span className="px-2 py-1 bg-gradient-to-r from-roxo to-dourado text-white text-xs font-semibold rounded-full">
                    VIP
                  </span>
                )}
              </div>
              <p className="text-sm text-grafite-400">
                {raffle.title}
              </p>
            </div>
          </div>
                    {vipError.actionText}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Seleção de Quantidade */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300">
              Quantidade de Tickets
            </label>
            
            <div className="flex items-center gap-3">
              <AnimatedButton
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isLoading}
                variant="outline"
                size="sm"
                className="p-2"
              >
                <Minus className="w-4 h-4" />
              </AnimatedButton>
              
              <Input
                type="number"
                min="1"
                max={maxTicketsPerUser}
                value={quantity}
                onChange={handleInputChange}
                disabled={isLoading}
                className="text-center w-20"
              />
              
              <AnimatedButton
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= maxTicketsPerUser || isLoading}
                variant="outline"
                size="sm"
                className="p-2"
              >
                <Plus className="w-4 h-4" />
              </AnimatedButton>
            </div>

            {/* Seleção Rápida */}
            <div className="flex gap-2">
              {[1, 5, 10, 25].map((amount) => (
                <AnimatedButton
                  key={amount}
                  onClick={() => handleQuickSelect(amount)}
                  disabled={amount > maxTicketsPerUser || isLoading}
                  variant={quantity === amount ? "primary" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  {amount}
                </AnimatedButton>
              ))}
            </div>
          </div>

          {/* Resumo da Compra */}
          <div className="bg-roxo-50 dark:bg-roxo-900/20 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-grafite-600 dark:text-grafite-400">Quantidade:</span>
              <span className="font-semibold text-grafite-900 dark:text-white">
                {quantity} ticket{quantity > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-grafite-600 dark:text-grafite-400">Subtotal:</span>
              <span className="font-semibold text-grafite-900 dark:text-white">
                {formatCurrency(totalCost, raffle.ticketCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-grafite-200 dark:border-grafite-600">
              <span className="font-semibold text-grafite-900 dark:text-white">Total:</span>
              <span className="text-xl font-bold text-roxo dark:text-roxo-claro">
                {formatCurrency(totalCost, raffle.ticketCurrency)}
              </span>
            </div>
            <div className="text-center pt-2">
              <span className="text-xs text-grafite-500 dark:text-grafite-400">
                Chance de ganhar: {winChance.toFixed(3)}%
              </span>
            </div>
          </div>

          {/* Mensagens de Erro e Sucesso */}
          {(localError || purchaseError) && (
             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
               <div className="flex items-center gap-2">
                 <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                 <p className="text-sm text-red-800 dark:text-red-200">
                   {localError || (purchaseError instanceof Error ? purchaseError.message : purchaseError)}
                 </p>
               </div>
             </div>
           )}

          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-800 dark:text-green-200">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          {/* Saldo Atual */}
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Saldo atual: <span className="font-semibold">0 {raffle.ticketCurrency}</span>
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3">
            <AnimatedButton
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </AnimatedButton>
            
            <AnimatedButton
              onClick={handlePurchase}
              disabled={isLoading || !!vipError || maxTicketsAvailable === 0}
              loading={isLoading}
              variant="primary"
              className="flex-1 bg-gradient-to-r from-roxo to-roxo-escuro hover:from-roxo-escuro hover:to-roxo text-white"
            >
              <DollarSign className="w-4 h-4" />
              Comprar Tickets
            </AnimatedButton>
          </div>

          {/* Link para Histórico */}
          <div className="text-center pt-2">
            <AnimatedButton
              onClick={() => setShowHistory(true)}
              variant="ghost"
              size="sm"
              className="text-grafite-600 dark:text-grafite-400 hover:text-grafite-800 dark:hover:text-grafite-200"
            >
              <History className="w-4 h-4 mr-2" />
              Ver Histórico de Compras
            </AnimatedButton>
          </div>

          <div className="text-xs text-grafite-500 dark:text-grafite-400 text-center">
            Limite máximo: {maxTicketsPerUser.toLocaleString()} tickets por transação
          </div>
        </div>
      </Modal>

      {/* Modal de Histórico */}
      {user && (
        <RaffleHistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          userId={user.id}
        />
      )}
    </>
  );
};

export default PurchaseTicketsModal;