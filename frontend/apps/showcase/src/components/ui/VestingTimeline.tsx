import React, { useMemo } from 'react';
import { Calendar, Clock, CheckCircle, Circle, Lock, Unlock } from 'lucide-react';
import { Card } from '@launchpad/shared-ui';
import { Badge } from './Badge';

/**
 * Interface para um evento de vesting
 */
export interface VestingEvent {
  id: string;
  date: Date;
  percentage: number;
  amount: string;
  tokenSymbol: string;
  status: 'completed' | 'pending' | 'locked';
  description?: string;
  transactionHash?: string;
}

/**
 * Interface para dados do vesting
 */
export interface VestingData {
  totalAmount: string;
  tokenSymbol: string;
  startDate: Date;
  endDate: Date;
  cliffPeriod?: number; // em dias
  vestingPeriod: number; // em dias
  events: VestingEvent[];
  totalReleased: string;
  totalPending: string;
  nextUnlockDate?: Date;
  nextUnlockAmount?: string;
}

/**
 * Props do componente VestingTimeline
 */
interface VestingTimelineProps {
  data: VestingData;
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
  onClaimTokens?: (eventId: string) => void;
}

/**
 * Componente de Timeline Visual de Vesting
 * Exibe o cronograma de liberação de tokens de forma visual e interativa
 */
export const VestingTimeline: React.FC<VestingTimelineProps> = ({
  data,
  className = '',
  showDetails = true,
  compact = false,
  onClaimTokens
}) => {
  /**
   * Calcula estatísticas do vesting
   */
  const stats = useMemo(() => {
    const now = new Date();
    const totalEvents = data.events.length;
    const completedEvents = data.events.filter(e => e.status === 'completed').length;
    const pendingEvents = data.events.filter(e => e.status === 'pending').length;
    
    const progressPercentage = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;
    
    const nextEvent = data.events
      .filter(e => e.status === 'pending' && e.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
    
    const claimableEvents = data.events.filter(e => 
      e.status === 'pending' && e.date <= now
    );
    
    const claimableAmount = claimableEvents.reduce((sum, event) => 
      sum + parseFloat(event.amount), 0
    ).toString();
    
    return {
      totalEvents,
      completedEvents,
      pendingEvents,
      progressPercentage,
      nextEvent,
      claimableEvents,
      claimableAmount: parseFloat(claimableAmount) > 0 ? claimableAmount : '0'
    };
  }, [data.events]);
  
  /**
   * Formata data para exibição
   */
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  /**
   * Formata números para exibição
   */
  const formatNumber = (num: string | number, decimals: number = 2) => {
    const value = typeof num === 'string' ? parseFloat(num) : num;
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };
  
  /**
   * Retorna ícone baseado no status do evento
   */
  const getEventIcon = (event: VestingEvent) => {
    switch (event.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return event.date <= new Date() 
          ? <Unlock className="w-4 h-4 text-blue-600" />
          : <Clock className="w-4 h-4 text-yellow-600" />;
      case 'locked':
        return <Lock className="w-4 h-4 text-gray-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };
  
  /**
   * Retorna cor baseada no status do evento
   */
  const getEventColor = (event: VestingEvent) => {
    switch (event.status) {
      case 'completed':
        return 'bg-green-100 border-green-300';
      case 'pending':
        return event.date <= new Date()
          ? 'bg-blue-100 border-blue-300'
          : 'bg-yellow-100 border-yellow-300';
      case 'locked':
        return 'bg-gray-100 border-gray-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  
  /**
   * Retorna badge do status
   */
  const getStatusBadge = (event: VestingEvent) => {
    const now = new Date();
    
    if (event.status === 'completed') {
      return <Badge variant="success">Liberado</Badge>;
    }
    
    if (event.status === 'pending') {
      if (event.date <= now) {
        return <Badge variant="primary">Disponível</Badge>;
      }
      return <Badge variant="warning">Aguardando</Badge>;
    }
    
    return <Badge variant="secondary">Bloqueado</Badge>;
  };
  
  if (compact) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="space-y-4">
          {/* Cabeçalho compacto */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Cronograma de Vesting</h4>
              <p className="text-sm text-gray-600">
                {formatNumber(data.totalReleased)} / {formatNumber(data.totalAmount)} {data.tokenSymbol}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {stats.progressPercentage.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Liberado</div>
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.progressPercentage}%` }}
            />
          </div>
          
          {/* Próximo evento */}
          {stats.nextEvent && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} />
              <span>
                Próxima liberação: {formatDate(stats.nextEvent.date)} 
                ({formatNumber(stats.nextEvent.amount)} {data.tokenSymbol})
              </span>
            </div>
          )}
        </div>
      </Card>
    );
  }
  
  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Cronograma de Vesting
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Acompanhe a liberação gradual dos seus tokens
            </p>
          </div>
          
          {parseFloat(stats.claimableAmount) > 0 && onClaimTokens && (
            <button
              onClick={() => stats.claimableEvents.forEach(e => onClaimTokens(e.id))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Resgatar Disponível
            </button>
          )}
        </div>
        
        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(data.totalAmount)}
            </div>
            <div className="text-sm text-gray-600">Total {data.tokenSymbol}</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(data.totalReleased)}
            </div>
            <div className="text-sm text-gray-600">Liberado</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(stats.claimableAmount)}
            </div>
            <div className="text-sm text-gray-600">Disponível</div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {formatNumber(data.totalPending)}
            </div>
            <div className="text-sm text-gray-600">Pendente</div>
          </div>
        </div>
        
        {/* Barra de progresso geral */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progresso do Vesting</span>
            <span className="font-medium">{stats.progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.progressPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Timeline de eventos */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Cronograma de Liberações</h4>
          
          <div className="space-y-3">
            {data.events.map((event, index) => {
              const isLast = index === data.events.length - 1;
              const canClaim = event.status === 'pending' && event.date <= new Date();
              
              return (
                <div key={event.id} className="relative">
                  {/* Linha conectora */}
                  {!isLast && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200" />
                  )}
                  
                  <div className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                    getEventColor(event)
                  } ${canClaim ? 'ring-2 ring-blue-300' : ''}`}>
                    {/* Ícone do status */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center">
                      {getEventIcon(event)}
                    </div>
                    
                    {/* Conteúdo do evento */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {formatDate(event.date)}
                            </span>
                            {getStatusBadge(event)}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">
                              {formatNumber(event.amount)} {event.tokenSymbol}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{event.percentage}% do total</span>
                          </div>
                          
                          {event.description && (
                            <p className="text-sm text-gray-500">{event.description}</p>
                          )}
                          
                          {event.transactionHash && (
                            <div className="mt-2">
                              <a
                                href={`#/tx/${event.transactionHash}`}
                                className="text-xs text-blue-600 hover:text-blue-800 font-mono"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {event.transactionHash.slice(0, 10)}...{event.transactionHash.slice(-8)}
                              </a>
                            </div>
                          )}
                        </div>
                        
                        {/* Ação de resgate */}
                        {canClaim && onClaimTokens && (
                          <button
                            onClick={() => onClaimTokens(event.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Resgatar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Informações adicionais */}
        {showDetails && (
          <div className="border-t pt-4 space-y-3">
            <h5 className="font-medium text-gray-900">Detalhes do Vesting</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Data de início:</span>
                <div className="font-medium">{formatDate(data.startDate)}</div>
              </div>
              
              <div>
                <span className="text-gray-600">Data de término:</span>
                <div className="font-medium">{formatDate(data.endDate)}</div>
              </div>
              
              {data.cliffPeriod && (
                <div>
                  <span className="text-gray-600">Período de cliff:</span>
                  <div className="font-medium">{data.cliffPeriod} dias</div>
                </div>
              )}
              
              <div>
                <span className="text-gray-600">Período total:</span>
                <div className="font-medium">{data.vestingPeriod} dias</div>
              </div>
            </div>
            
            {stats.nextEvent && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <Clock size={16} />
                  <span className="font-medium">Próxima Liberação</span>
                </div>
                <div className="mt-1 text-sm text-blue-700">
                  {formatDate(stats.nextEvent.date)} - {formatNumber(stats.nextEvent.amount)} {data.tokenSymbol}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default VestingTimeline;