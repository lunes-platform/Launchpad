import React from 'react';
import { Calendar, Clock, Target, DollarSign, Ticket, Trophy, Users, Award } from 'lucide-react';
import { Button, Modal, AnimatedButton } from '@launchpad/shared-ui';
import { Badge } from '../ui/Badge';
import type { Raffle } from '../../stores/raffleStore';

interface RaffleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffle: Raffle;
  onPurchaseTickets?: () => void;
}

/**
 * Modal para exibir detalhes completos do raffle
 * Mostra informações detalhadas, regras, prêmios e histórico
 */
export const RaffleDetailsModal: React.FC<RaffleDetailsModalProps> = ({
  isOpen,
  onClose,
  raffle,
  onPurchaseTickets
}) => {
  // Formatação de data
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatação de moeda
  const formatCurrency = (value: number, currency: string = 'USDT') => {
    return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  };

  // Calcular progresso
  const progressPercentage = (raffle.soldTickets / raffle.maxTickets) * 100;
  const ticketsRemaining = raffle.maxTickets - raffle.soldTickets;

  // Status do raffle
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Ativo' };
      case 'upcoming':
        return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Em Breve' };
      case 'ended':
        return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'Finalizado' };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Cancelado' };
      default:
        return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'Desconhecido' };
    }
  };

  const statusInfo = getStatusInfo(raffle.status);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="lg"
      title={raffle.title}
    >
      {/* Cabeçalho Personalizado */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-roxo to-roxo-escuro rounded-full flex items-center justify-center">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-grafite-900 dark:text-white">
            {raffle.title}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
            {raffle.vipOnly && (
              <Badge className="bg-gradient-to-r from-dourado to-laranja text-white">
                VIP Exclusivo
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Descrição */}
              <div className="bg-grafite-50 dark:bg-grafite-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-grafite-900 dark:text-white mb-3">
                  📋 Descrição
                </h3>
                <p className="text-grafite-700 dark:text-grafite-300 leading-relaxed">
                  {raffle.description || 'Participe deste sorteio exclusivo e concorra a prêmios incríveis! Não perca esta oportunidade única de ganhar.'}
                </p>
              </div>

              {/* Informações Detalhadas */}
              <div className="bg-grafite-50 dark:bg-grafite-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-grafite-900 dark:text-white mb-4">
                  📊 Informações do Sorteio
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
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
                  
                  <div className="space-y-3">
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
                          Tickets Disponíveis
                        </div>
                        <div className="font-semibold text-grafite-900 dark:text-white">
                          {ticketsRemaining.toLocaleString()} de {raffle.maxTickets.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-dourado" />
                      <div>
                        <div className="text-sm text-grafite-500 dark:text-grafite-400">
                          Pool Total de Prêmios
                        </div>
                        <div className="font-semibold text-dourado dark:text-dourado-claro">
                          {formatCurrency(raffle.totalPrizePool, raffle.ticketCurrency)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progresso de Vendas */}
              <div className="bg-grafite-50 dark:bg-grafite-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-grafite-900 dark:text-white">
                    📈 Progresso de Vendas
                  </h3>
                  <span className="text-sm font-medium text-roxo dark:text-roxo-claro">
                    {progressPercentage.toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full bg-grafite-200 dark:bg-grafite-700 rounded-full h-4 mb-3">
                  <div 
                    className="bg-gradient-to-r from-roxo via-roxo-escuro to-azul h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-grafite-600 dark:text-grafite-400">
                  <span>{raffle.soldTickets.toLocaleString()} vendidos</span>
                  <span>{ticketsRemaining.toLocaleString()} restantes</span>
                </div>
              </div>

              {/* Regras */}
              <div className="bg-grafite-50 dark:bg-grafite-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-grafite-900 dark:text-white mb-3">
                  📜 Regras do Sorteio
                </h3>
                <ul className="space-y-2 text-sm text-grafite-700 dark:text-grafite-300">
                  <li className="flex items-start gap-2">
                    <span className="text-roxo mt-1">•</span>
                    <span>Cada ticket representa uma chance de ganhar o prêmio principal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-roxo mt-1">•</span>
                    <span>O sorteio será realizado de forma transparente e verificável</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-roxo mt-1">•</span>
                    <span>Limite máximo de 100 tickets por transação</span>
                  </li>
                  {raffle.vipOnly && (
                    <li className="flex items-start gap-2">
                      <span className="text-dourado mt-1">•</span>
                      <span className="text-dourado dark:text-dourado-claro font-medium">
                        Exclusivo para membros VIP
                      </span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <span className="text-roxo mt-1">•</span>
                    <span>Os vencedores serão notificados automaticamente</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Prêmios */}
              <div className="bg-gradient-to-br from-dourado/10 to-laranja/10 dark:from-dourado/20 dark:to-laranja/20 rounded-lg p-4 border border-dourado/30 dark:border-dourado/50">
                <h3 className="text-lg font-semibold text-grafite-900 dark:text-white mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-dourado" />
                  🏆 Prêmios
                </h3>
                
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-dourado dark:text-dourado-claro">
                      1º Lugar
                    </div>
                    <div className="text-lg font-semibold text-grafite-900 dark:text-white">
                      {formatCurrency(raffle.totalPrizePool * 0.7, raffle.ticketCurrency)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-grafite-600 dark:text-grafite-400">
                      2º Lugar
                    </div>
                    <div className="text-base font-semibold text-grafite-900 dark:text-white">
                      {formatCurrency(raffle.totalPrizePool * 0.2, raffle.ticketCurrency)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-base font-bold text-grafite-600 dark:text-grafite-400">
                      3º Lugar
                    </div>
                    <div className="text-sm font-semibold text-grafite-900 dark:text-white">
                      {formatCurrency(raffle.totalPrizePool * 0.1, raffle.ticketCurrency)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="bg-grafite-50 dark:bg-grafite-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-grafite-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-azul" />
                  📊 Estatísticas
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-grafite-600 dark:text-grafite-400">Participantes:</span>
                    <span className="font-semibold text-grafite-900 dark:text-white">
                      {raffle.participants?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-grafite-600 dark:text-grafite-400">Tickets vendidos:</span>
                    <span className="font-semibold text-grafite-900 dark:text-white">
                      {raffle.soldTickets.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-grafite-600 dark:text-grafite-400">Arrecadado:</span>
                    <span className="font-semibold text-verde dark:text-verde-claro">
                      {formatCurrency(raffle.soldTickets * raffle.ticketPrice, raffle.ticketCurrency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ação */}
              {raffle.status === 'active' && onPurchaseTickets && (
                <AnimatedButton
                  onClick={onPurchaseTickets}
                  className="w-full bg-gradient-to-r from-roxo to-roxo-escuro hover:from-roxo-escuro hover:to-azul text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-roxo/30"
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  Comprar Tickets
                </AnimatedButton>
              )}
            </div>
          </div>
    </Modal>
  );
};

export default RaffleDetailsModal;