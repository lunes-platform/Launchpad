import React, { useState } from 'react';
import { Calendar, Users, Trophy, Ticket } from 'lucide-react';
import { Card, Button } from '@launchpad/shared-ui';
import { Badge } from './Badge';
import { useRaffleStore } from '../../stores/raffleStore';
import { PurchaseTicketsModal } from '../modals/PurchaseTicketsModal';
import { RaffleDetailsModal } from '../modals/RaffleDetailsModal';
import type { Raffle } from '../../stores/raffleStore';

interface RaffleCardProps {
  raffle: Raffle;
  onViewDetails?: (raffleId: string) => void;
}

/**
 * Componente para exibir um card de raffle individual
 * Mostra informações básicas do sorteio e permite participação
 */
export const RaffleCard: React.FC<RaffleCardProps> = ({ raffle, onViewDetails }) => {
  const { purchaseTickets, canPurchaseTickets, loading } = useRaffleStore();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ended':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'upcoming':
        return 'Em Breve';
      case 'completed':
        return 'Finalizado';
      case 'drawing':
        return 'Sorteando';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusBadge = () => {
    switch (raffle.status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'completed':
        return <Badge variant="secondary">Finalizado</Badge>;
      case 'upcoming':
        return <Badge variant="warning">Em Breve</Badge>;
      case 'drawing':
        return <Badge variant="primary">Sorteando</Badge>;
      case 'cancelled':
         return <Badge variant="error">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };

  // Calcular valores derivados
  const totalPrizeValue = raffle.totalPrizePool;
  const ticketsSold = raffle.soldTickets;
  const progressPercentage = (ticketsSold / raffle.maxTickets) * 100;

  const handlePurchaseTickets = () => {
    setShowPurchaseModal(true);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(raffle.id);
    } else {
      setShowDetailsModal(true);
    }
  };



  const canPurchase = canPurchaseTickets(raffle.id, 1);
  const isActive = raffle.status === 'active';
  const timeRemaining = raffle.endDate ? raffle.endDate.getTime() - Date.now() : 0;
  const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));

  return (
    <Card className="p-6 bg-white/5 dark:bg-grafite-800/50 backdrop-blur-sm border border-grafite-200/20 dark:border-grafite-700/30 hover:border-roxo/30 dark:hover:border-roxo/50 hover:shadow-xl hover:shadow-roxo/10 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-grafite-900 dark:text-white mb-2 group-hover:text-roxo dark:group-hover:text-roxo-claro transition-colors duration-300">
            {raffle.title}
          </h3>
          {getStatusBadge()}
        </div>
        {raffle.vipOnly && (
          <Badge className="bg-gradient-to-r from-roxo/20 to-roxo-escuro/20 text-roxo dark:text-roxo-claro border border-roxo/30">
            <Trophy className="w-3 h-3 mr-1" />
            VIP Only
          </Badge>
        )}
      </div>

      <p className="text-grafite-600 dark:text-grafite-300 mb-6 line-clamp-2 leading-relaxed">
        {raffle.description}
      </p>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center p-3 bg-grafite-50/50 dark:bg-grafite-700/30 rounded-lg border border-grafite-200/30 dark:border-grafite-600/30">
          <span className="text-sm font-medium text-grafite-600 dark:text-grafite-300 flex items-center">
            <Trophy className="w-4 h-4 mr-2 text-dourado" />
            Prêmio Total:
          </span>
          <span className="font-bold text-lg text-dourado dark:text-dourado-claro">
             {formatCurrency(totalPrizeValue.toString())}
           </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-grafite-50/50 dark:bg-grafite-700/30 rounded-lg border border-grafite-200/30 dark:border-grafite-600/30">
          <span className="text-sm font-medium text-grafite-600 dark:text-grafite-300 flex items-center">
            <Ticket className="w-4 h-4 mr-2 text-roxo" />
            Preço do Ticket:
          </span>
          <span className="font-semibold text-grafite-900 dark:text-white">
             {formatCurrency(raffle.ticketPrice.toString())}
           </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-grafite-50/50 dark:bg-grafite-700/30 rounded-lg border border-grafite-200/30 dark:border-grafite-600/30">
          <span className="text-sm font-medium text-grafite-600 dark:text-grafite-300 flex items-center">
            <Users className="w-4 h-4 mr-2 text-azul" />
            Tickets Vendidos:
          </span>
          <span className="font-semibold text-grafite-900 dark:text-white">
            {ticketsSold} / {raffle.maxTickets}
          </span>
        </div>

        {isActive && (
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-laranja/10 to-vermelho/10 dark:from-laranja/20 dark:to-vermelho/20 rounded-lg border border-laranja/30 dark:border-laranja/50">
            <span className="text-sm font-medium text-grafite-600 dark:text-grafite-300 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-laranja" />
              Termina em:
            </span>
            <span className="font-bold text-laranja dark:text-laranja-claro">
              {daysRemaining} dias
            </span>
          </div>
        )}
      </div>

      {/* Barra de progresso */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium text-grafite-600 dark:text-grafite-300 mb-3">
          <span>Progresso de Vendas</span>
          <span className="text-roxo dark:text-roxo-claro font-bold">{Math.round((raffle.soldTickets / raffle.maxTickets) * 100)}%</span>
        </div>
        <div className="w-full bg-grafite-200 dark:bg-grafite-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-roxo via-roxo-escuro to-azul h-3 rounded-full transition-all duration-500 ease-out shadow-lg shadow-roxo/30"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handlePurchaseTickets}
          disabled={loading.purchase || raffle.status !== 'active'}
          className="flex-1 bg-gradient-to-r from-roxo to-roxo-escuro hover:from-roxo-escuro hover:to-azul text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-roxo/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Ticket className="w-4 h-4 mr-2" />
          {loading.purchase ? 'Comprando...' : 'Comprar Tickets'}
        </Button>
        
        <Button
          onClick={handleViewDetails}
          variant="outline"
          className="px-6 py-3 border-2 border-grafite-300 dark:border-grafite-600 text-grafite-700 dark:text-grafite-300 hover:border-roxo dark:hover:border-roxo hover:text-roxo dark:hover:text-roxo-claro hover:bg-roxo/5 dark:hover:bg-roxo/10 rounded-lg transition-all duration-300 font-semibold"
        >
          Detalhes
        </Button>
      </div>

      {/* Informações adicionais para raffles finalizados */}
      {raffle.status === 'completed' && raffle.winners && raffle.winners.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-dourado/10 to-laranja/10 dark:from-dourado/20 dark:to-laranja/20 rounded-lg border border-dourado/30 dark:border-dourado/50">
           <p className="text-sm font-semibold text-dourado dark:text-dourado-claro flex items-center">
             <Trophy className="w-5 h-5 mr-2" />
             🏆 Vencedor: {raffle.winners[0].userName}
           </p>
         </div>
      )}

      {/* Modais */}
      <PurchaseTicketsModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        raffle={raffle}
      />

      <RaffleDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        raffle={raffle}
        onPurchaseTickets={() => {
          setShowDetailsModal(false);
          setShowPurchaseModal(true);
        }}
      />
    </Card>
  );
};

export default RaffleCard;