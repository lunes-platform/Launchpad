import React, { useState } from "react";
import {
  Calendar,
  Clock,
  TrendingUp,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, Modal, AnimatedButton } from '@launchpad/shared-ui';
import { Badge } from '../ui/Badge';
import { formatUtils } from '../../utils/format';
import type { UserInvestment } from '../../types';

/**
 * Interface para as propriedades do modal de detalhes do investimento
 */
interface InvestmentDetailsModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Função para fechar o modal */
  onClose: () => void;
  /** Dados do investimento */
  investment: UserInvestment | null;
  /** Função para processar resgate de tokens */
  onClaimTokens?: (investment: UserInvestment) => Promise<void>;
}

/**
 * Modal com detalhes completos do investimento
 * 
 * Funcionalidades:
 * - Visualização detalhada do investimento
 * - Cronograma de vesting interativo
 * - Histórico de transações
 * - Ações de resgate de tokens
 * - Exportação de dados
 */
export const InvestmentDetailsModal: React.FC<InvestmentDetailsModalProps> = ({
  isOpen,
  onClose,
  investment,
  onClaimTokens
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vesting' | 'history'>('overview');
  const [isProcessingClaim, setIsProcessingClaim] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!investment) return null;

  /**
   * Copia texto para a área de transferência
   */
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  /**
   * Processa o resgate de tokens
   */
  const handleClaimTokens = async () => {
    if (!onClaimTokens || parseFloat(investment.claimableAmount) <= 0) return;

    setIsProcessingClaim(true);
    try {
      await onClaimTokens(investment);
    } catch (error) {
      console.error('Erro no resgate:', error);
    } finally {
      setIsProcessingClaim(false);
    }
  };

  /**
   * Calculates estatísticas do vesting
   */
  const vestingStats = {
    totalEvents: investment.vestingSchedule?.length || 0,
    completedEvents: investment.vestingSchedule?.filter(v => v.claimed).length || 0,
    pendingEvents: investment.vestingSchedule?.filter(v => !v.claimed && v.claimable).length || 0,
    nextEvent: investment.vestingSchedule?.find(v => !v.claimed && v.claimable)
  };

  // Calcular estatísticas do vesting
  const now = new Date();
  const vestingSchedule = investment.vestingSchedule || [];
  const totalVested = vestingSchedule.filter(item => new Date(item.date) <= now && item.claimed).reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const totalPending = vestingSchedule.filter(item => new Date(item.date) <= now && item.claimable && !item.claimed).reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const totalLocked = vestingSchedule.filter(item => new Date(item.date) > now).reduce((sum, item) => sum + parseFloat(item.amount), 0);

  /**
   * Renderiza o badge de status do vesting
   */
  const getVestingStatusBadge = (vesting: any) => {
    if (vesting.claimed) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Resgatado
        </Badge>
      );
    } else if (vesting.claimable) {
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Disponível
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Bloqueado
        </Badge>
      );
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="lg"
      title={investment?.projectName || 'Detalhes do Investimento'}
    >
      {/* Cabeçalho Personalizado */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-roxo-500 to-azul-500 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-grafite-900 dark:text-white">
            {investment?.projectName}
          </h2>
          <p className="text-sm text-grafite-600 dark:text-grafite-400">
            Investimento #{investment?.id}
          </p>
        </div>
      </div>

              {/* Tabs */}
              <div className="flex border-b border-grafite-700">
                {[
                  { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
                  { id: 'vesting', label: 'Cronograma', icon: Calendar },
                  { id: 'history', label: 'Histórico', icon: Clock }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'text-roxo-400 border-b-2 border-roxo-400'
                          : 'text-grafite-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Estatísticas Principais */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4 bg-grafite-700/50">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-8 h-8 text-verde-400" />
                          <div>
                            <p className="text-xs text-grafite-400">Valor Investido</p>
                            <p className="text-lg font-bold text-white">
                              {formatUtils.currency(investment.amount)} {investment.token}
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 bg-grafite-700/50">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-8 h-8 text-azul-400" />
                          <div>
                            <p className="text-xs text-grafite-400">Tokens Totais</p>
                            <p className="text-lg font-bold text-white">
                              {formatUtils.currency(investment.totalTokens)} {investment.tokenSymbol}
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 bg-grafite-700/50">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-8 h-8 text-roxo-400" />
                          <div>
                            <p className="text-xs text-grafite-400">Disponível</p>
                            <p className="text-lg font-bold text-white">
                              {formatUtils.currency(investment.claimableAmount)} {investment.tokenSymbol}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Informações Detalhadas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-4 bg-grafite-700/30">
                        <h3 className="text-lg font-semibold text-white mb-4">Detalhes do Investimento</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-grafite-400">Data do Investimento:</span>
                            <span className="text-white">
                              {new Date(investment.timestamp).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-grafite-400">Status:</span>
                            <Badge variant="success">Confirmado</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-grafite-400">TX Hash:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-mono text-xs">
                                {investment.txHash ? `${investment.txHash.slice(0, 8)}...${investment.txHash.slice(-8)}` : 'N/A'}
                              </span>
                              <button
                                onClick={() => investment.txHash && copyToClipboard(investment.txHash, 'txHash')}
                                className="p-1 text-grafite-400 hover:text-white transition-colors"
                                disabled={!investment.txHash}
                              >
                                {copiedField === 'txHash' ? (
                                  <CheckCircle className="w-4 h-4 text-verde-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 bg-grafite-700/30">
                        <h3 className="text-lg font-semibold text-white mb-4">Estatísticas de Vesting</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-grafite-400">Total de Eventos:</span>
                            <span className="text-white">{vestingStats.totalEvents}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-grafite-400">Completados:</span>
                            <span className="text-verde-400">{vestingStats.completedEvents}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-grafite-400">Pendentes:</span>
                            <span className="text-amarelo-400">{vestingStats.pendingEvents}</span>
                          </div>
                          {vestingStats.nextEvent && (
                            <div className="flex justify-between">
                              <span className="text-grafite-400">Próximo Evento:</span>
                              <span className="text-white">
                                {new Date(vestingStats.nextEvent.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Vesting Tab */}
                {activeTab === 'vesting' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Cronograma de Vesting</h3>
                      <Badge variant="secondary">
                        {vestingStats.completedEvents}/{vestingStats.totalEvents} Completados
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {vestingSchedule.map((vesting, index) => {
                        const vestingDate = new Date(vesting.date);
                        const isNext = vesting.claimable && !vesting.claimed && 
                          vestingSchedule.filter(v => v.claimable && !v.claimed)[0] === vesting;

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border transition-colors ${
                              vesting.claimed
                                ? 'bg-verde-500/10 border-verde-500/30'
                                : vesting.claimable
                                ? 'bg-amarelo-500/10 border-amarelo-500/30'
                                : 'bg-grafite-700/30 border-grafite-600'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  vesting.claimed
                                    ? 'bg-verde-400'
                                    : vesting.claimable
                                    ? 'bg-amarelo-400'
                                    : 'bg-grafite-500'
                                }`} />
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    {vestingDate.toLocaleDateString('pt-BR')}
                                  </p>
                                  <p className="text-xs text-grafite-400">
                                    {vesting.percentage}% do total
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-white">
                                    {formatUtils.currency(vesting.amount)} {investment.tokenSymbol}
                                  </p>
                                  {isNext && (
                                    <p className="text-xs text-roxo-400">
                                      Próximo resgate
                                    </p>
                                  )}
                                </div>
                                {getVestingStatusBadge(vesting)}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Histórico de Transações</h3>
                    
                    <div className="space-y-3">
                      {/* Transação de Investimento */}
                      <div className="flex items-center justify-between p-3 bg-grafite-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-azul-400 rounded-full" />
                          <div>
                            <p className="text-sm font-medium text-white">Investimento Realizado</p>
                            <p className="text-xs text-grafite-400">
                              {new Date(investment.timestamp).toLocaleDateString('pt-BR')} às 14:30
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-vermelho-400">
                          -{formatUtils.currency(investment.amount)} {investment.token}
                        </p>
                      </div>

                      {/* Resgates Realizados */}
                      {vestingSchedule.filter(v => v.claimed).map((vesting, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-grafite-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-verde-400 rounded-full" />
                            <div>
                              <p className="text-sm font-medium text-white">Tokens Resgatados</p>
                              <p className="text-xs text-grafite-400">
                                {new Date(vesting.date).toLocaleDateString('pt-BR')} às 09:15
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-verde-400">
                            +{formatUtils.currency(vesting.amount)} {investment.tokenSymbol}
                          </p>
                        </div>
                      ))}
                      
                      {vestingSchedule.filter(v => v.claimed).length === 0 && (
                        <div className="text-center py-8">
                          <Clock className="w-12 h-12 text-grafite-500 mx-auto mb-3" />
                          <p className="text-sm text-grafite-400">Nenhum resgate realizado ainda</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-grafite-700">
                <div className="flex items-center gap-3">
                  <AnimatedButton
                    onClick={() => copyToClipboard(JSON.stringify(investment, null, 2), 'data')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-grafite-400 hover:text-white border-grafite-600 hover:border-grafite-500"
                  >
                    {copiedField === 'data' ? (
                      <CheckCircle className="w-4 h-4 text-verde-400" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Exportar Dados
                  </AnimatedButton>
                  
                  <a
                    href={`https://explorer.lunes.io/tx/${investment.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-grafite-400 hover:text-white border border-grafite-600 hover:border-grafite-500 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver no Explorer
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <AnimatedButton
                    onClick={onClose}
                    variant="outline"
                    size="sm"
                    className="text-grafite-400 hover:text-white border-grafite-600 hover:border-grafite-500"
                  >
                    Fechar
                  </AnimatedButton>
                  
                  {parseFloat(investment.claimableAmount) > 0 && (
                    <AnimatedButton
                      onClick={handleClaimTokens}
                      disabled={isProcessingClaim}
                      loading={isProcessingClaim}
                      variant="primary"
                      size="sm"
                      className="bg-gradient-to-r from-roxo-500 to-azul-500 hover:from-roxo-600 hover:to-azul-600 text-white"
                    >
                      <DollarSign className="w-4 h-4" />
                      Resgatar {formatUtils.currency(investment.claimableAmount)} {investment.tokenSymbol}
                    </AnimatedButton>
                  )}
                </div>
              </div>
    </Modal>
  );
};

export default InvestmentDetailsModal;