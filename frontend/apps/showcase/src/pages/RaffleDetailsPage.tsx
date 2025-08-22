import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  Calendar,
  Users,
  Trophy,
  Ticket,
  Clock,
  DollarSign,
  Star,
  Shield,
  AlertCircle,
  CheckCircle,
  Gift,
  Target,
} from 'lucide-react';
import { Card, Button, Input } from '@launchpad/shared-ui';
import { Badge } from '../components/ui/Badge';
import { FadeIn } from '../components/animations/FadeIn';
import { ScaleIn } from '../components/animations/ScaleIn';
import { useRaffleStore } from '../stores/raffleStore';
import type { Raffle, RafflePrize } from '../stores/raffleStore';

/**
 * Página de detalhes de um raffle específico
 * Exibe informações completas, permite compra de tickets e mostra histórico
 */
export function RaffleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    raffles,
    userTickets,
    loading,
    error,
    fetchRaffles,
    fetchUserTickets,
    purchaseTickets,
    canPurchaseTickets,
    calculateWinningChance,
    getUserTicketsForRaffle,
  } = useRaffleStore();

  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Encontrar o raffle específico
  const raffle = raffles.find(r => r.id === id);
  const userRaffleTickets = raffle ? getUserTicketsForRaffle(raffle.id) : [];
  const winningChance = raffle ? calculateWinningChance(raffle.id, ticketQuantity) : 0;
  const canPurchase = raffle ? canPurchaseTickets(raffle.id, ticketQuantity) : false;

  useEffect(() => {
    if (!raffle) {
      fetchRaffles();
    }
    fetchUserTickets();
  }, [id, raffle, fetchRaffles, fetchUserTickets]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })} ${currency}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'upcoming':
        return <Badge variant="info">Em Breve</Badge>;
      case 'completed':
        return <Badge variant="secondary">Finalizado</Badge>;
      case 'drawing':
        return <Badge variant="warning">Sorteando</Badge>;
      case 'cancelled':
        return <Badge variant="error">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const handlePurchaseTickets = async () => {
    if (!raffle || !canPurchase) return;

    try {
      await purchaseTickets(raffle.id, ticketQuantity);
      setShowPurchaseModal(false);
      setTicketQuantity(1);
    } catch (error) {
      console.error('Erro ao comprar tickets:', error);
    }
  };

  const calculateProgress = () => {
    if (!raffle) return 0;
    return (raffle.soldTickets / raffle.maxTickets) * 100;
  };

  const getTimeRemaining = () => {
    if (!raffle) return '';
    
    const now = new Date();
    const endDate = new Date(raffle.endDate);
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Encerrado';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
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

  if (!raffle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-grafite-50 to-white dark:from-grafite-900 dark:to-grafite-800 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-grafite-900 dark:text-white mb-2">
              Raffle Não Encontrado
            </h2>
            <p className="text-grafite-600 dark:text-grafite-300 mb-4">
              O raffle que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => navigate('/raffles')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Raffles
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
            <Button
              variant="ghost"
              onClick={() => navigate('/raffles')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Raffles
            </Button>
            
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-grafite-900 dark:text-white">
                    {raffle.title}
                  </h1>
                  {getStatusBadge(raffle.status)}
                </div>
                <p className="text-grafite-600 dark:text-grafite-300 text-lg">
                  {raffle.description}
                </p>
              </div>
              
              {raffle.status === 'active' && (
                <div className="text-right">
                  <div className="text-sm text-grafite-500 dark:text-grafite-400 mb-1">
                    Tempo Restante
                  </div>
                  <div className="text-2xl font-bold text-roxo">
                    {getTimeRemaining()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações do Raffle */}
            <FadeIn>
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-grafite-900 dark:text-white mb-6">
                  📊 Informações do Sorteio
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-roxo" />
                      <div>
                        <div className="text-sm text-grafite-500 dark:text-grafite-400">
                          Data de Início
                        </div>
                        <div className="font-semibold text-grafite-900 dark:text-white">
                          {formatDate(raffle.startDate)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-roxo" />
                      <div>
                        <div className="text-sm text-grafite-500 dark:text-grafite-400">
                          Data de Encerramento
                        </div>
                        <div className="font-semibold text-grafite-900 dark:text-white">
                          {formatDate(raffle.endDate)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-roxo" />
                      <div>
                        <div className="text-sm text-grafite-500 dark:text-grafite-400">
                          Data do Sorteio
                        </div>
                        <div className="font-semibold text-grafite-900 dark:text-white">
                          {formatDate(raffle.drawDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-verde" />
                      <div>
                        <div className="text-sm text-grafite-500 dark:text-grafite-400">
                          Preço do Ticket
                        </div>
                        <div className="font-semibold text-grafite-900 dark:text-white">
                          {formatCurrency(raffle.ticketPrice, raffle.ticketCurrency)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Ticket className="w-5 h-5 text-laranja" />
                      <div>
                        <div className="text-sm text-grafite-500 dark:text-grafite-400">
                          Tickets Vendidos
                        </div>
                        <div className="font-semibold text-grafite-900 dark:text-white">
                          {raffle.soldTickets} / {raffle.maxTickets}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-dourado" />
                      <div>
                        <div className="text-sm text-grafite-500 dark:text-grafite-400">
                          Pool Total de Prêmios
                        </div>
                        <div className="font-semibold text-grafite-900 dark:text-white">
                          {formatCurrency(raffle.totalPrizePool, raffle.ticketCurrency)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Barra de Progresso */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-grafite-600 dark:text-grafite-300 mb-2">
                    <span>Progresso de Vendas</span>
                    <span>{calculateProgress().toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-grafite-200 dark:bg-grafite-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-roxo to-roxo-escuro h-3 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Badges de Características */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {raffle.vipOnly && (
                    <Badge variant="warning" className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      VIP Apenas
                    </Badge>
                  )}
                  {raffle.requiresKyc && (
                    <Badge variant="info" className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Requer KYC
                    </Badge>
                  )}
                </div>
              </Card>
            </FadeIn>
            
            {/* Prêmios */}
            <ScaleIn>
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-grafite-900 dark:text-white mb-6">
                  🏆 Prêmios
                </h2>
                
                <div className="space-y-4">
                  {raffle.prizes.map((prize: RafflePrize, index: number) => (
                    <div
                      key={prize.id}
                      className="flex items-center justify-between p-4 bg-grafite-50 dark:bg-grafite-800 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-dourado to-laranja rounded-full text-white font-bold">
                          {index + 1}º
                        </div>
                        <div>
                          <div className="font-semibold text-grafite-900 dark:text-white">
                            {prize.name}
                          </div>
                          <div className="text-sm text-grafite-600 dark:text-grafite-300">
                            {prize.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-grafite-900 dark:text-white">
                            {formatCurrency(prize.value, prize.currency)}
                          </div>
                          <div className="text-sm text-grafite-500 dark:text-grafite-400">
                            Token
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </ScaleIn>
            
            {/* Participantes Recentes */}
            <ScaleIn delay={0.1}>
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-grafite-900 dark:text-white mb-6">
                  👥 Participantes Recentes
                </h2>
                
                {raffle.participants.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-grafite-400 mx-auto mb-3" />
                    <p className="text-grafite-600 dark:text-grafite-300">
                      Ainda não há participantes neste raffle
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {raffle.participants.slice(0, 10).map((participant, index) => (
                      <div
                        key={participant.userId}
                        className="flex items-center justify-between p-3 bg-grafite-50 dark:bg-grafite-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-roxo to-roxo-escuro rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {participant.userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-grafite-900 dark:text-white">
                            {participant.userName}
                          </span>
                        </div>
                        <div className="text-sm text-grafite-600 dark:text-grafite-300">
                          {participant.ticketCount} ticket{participant.ticketCount > 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                    
                    {raffle.participants.length > 10 && (
                      <div className="text-center pt-3">
                        <span className="text-sm text-grafite-500 dark:text-grafite-400">
                          +{raffle.participants.length - 10} participantes
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </ScaleIn>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Comprar Tickets */}
            {raffle.status === 'active' && (
              <ScaleIn>
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-grafite-900 dark:text-white mb-4">
                    🎫 Comprar Tickets
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                        Quantidade de Tickets
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={ticketQuantity}
                        onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="bg-grafite-50 dark:bg-grafite-800 p-4 rounded-lg">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-grafite-600 dark:text-grafite-300">Preço por ticket:</span>
                        <span className="font-semibold text-grafite-900 dark:text-white">
                          {formatCurrency(raffle.ticketPrice, raffle.ticketCurrency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-grafite-600 dark:text-grafite-300">Quantidade:</span>
                        <span className="font-semibold text-grafite-900 dark:text-white">
                          {ticketQuantity}
                        </span>
                      </div>
                      <div className="border-t border-grafite-200 dark:border-grafite-600 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-grafite-900 dark:text-white">Total:</span>
                          <span className="font-bold text-lg text-roxo">
                            {formatCurrency(
                              raffle.ticketPrice * ticketQuantity,
                              raffle.ticketCurrency
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-grafite-600 dark:text-grafite-300 mb-2">
                        Chance de Ganhar
                      </div>
                      <div className="text-2xl font-bold text-verde">
                        {winningChance.toFixed(2)}%
                      </div>
                    </div>
                    
                    <Button
                      onClick={handlePurchaseTickets}
                      disabled={!canPurchase || loading.purchase}
                      className="w-full bg-gradient-to-r from-roxo to-roxo-escuro hover:from-roxo-escuro hover:to-roxo text-white"
                    >
                      {loading.purchase ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Comprando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4" />
                          Comprar Tickets
                        </div>
                      )}
                    </Button>
                    
                    {!canPurchase && raffle.status === 'active' && (
                      <div className="text-sm text-red-500 text-center">
                        Não é possível comprar tickets no momento
                      </div>
                    )}
                  </div>
                </Card>
              </ScaleIn>
            )}
            
            {/* Meus Tickets */}
            <ScaleIn delay={0.1}>
              <Card className="p-6">
                <h3 className="text-xl font-bold text-grafite-900 dark:text-white mb-4">
                  🎟️ Meus Tickets
                </h3>
                
                {userRaffleTickets.length === 0 ? (
                  <div className="text-center py-6">
                    <Ticket className="w-12 h-12 text-grafite-400 mx-auto mb-3" />
                    <p className="text-grafite-600 dark:text-grafite-300">
                      Você ainda não possui tickets neste raffle
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-roxo">
                        {userRaffleTickets.length}
                      </div>
                      <div className="text-sm text-grafite-600 dark:text-grafite-300">
                        Ticket{userRaffleTickets.length > 1 ? 's' : ''} Comprado{userRaffleTickets.length > 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="bg-grafite-50 dark:bg-grafite-800 p-4 rounded-lg">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-grafite-600 dark:text-grafite-300">Chance atual:</span>
                        <span className="font-semibold text-verde">
                          {calculateWinningChance(raffle.id, userRaffleTickets.length).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-grafite-600 dark:text-grafite-300">Investimento total:</span>
                        <span className="font-semibold text-grafite-900 dark:text-white">
                          {formatCurrency(
                            raffle.ticketPrice * userRaffleTickets.length,
                            raffle.ticketCurrency
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-grafite-700 dark:text-grafite-300">
                        Números dos Tickets:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userRaffleTickets.slice(0, 10).map((ticket) => (
                          <div
                            key={ticket.id}
                            className="px-2 py-1 bg-roxo text-white text-xs rounded font-mono"
                          >
                            #{ticket.ticketNumber}
                          </div>
                        ))}
                        {userRaffleTickets.length > 10 && (
                          <div className="px-2 py-1 bg-grafite-300 dark:bg-grafite-600 text-grafite-700 dark:text-grafite-300 text-xs rounded">
                            +{userRaffleTickets.length - 10}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </ScaleIn>
            
            {/* Vencedores */}
            {raffle.status === 'completed' && raffle.winners && raffle.winners.length > 0 && (
              <ScaleIn delay={0.2}>
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-grafite-900 dark:text-white mb-4">
                    🏆 Vencedores
                  </h3>
                  
                  <div className="space-y-3">
                    {raffle.winners.map((winner, index) => (
                      <div
                        key={winner.userId}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-dourado/10 to-laranja/10 border border-dourado/20 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-dourado to-laranja rounded-full text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-grafite-900 dark:text-white">
                              {winner.userName}
                            </div>
                            <div className="text-sm text-grafite-600 dark:text-grafite-300">
                              Ticket #{winner.ticketNumber}
                            </div>
                          </div>
                        </div>
                        <Trophy className="w-5 h-5 text-dourado" />
                      </div>
                    ))}
                  </div>
                </Card>
              </ScaleIn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RaffleDetailsPage;